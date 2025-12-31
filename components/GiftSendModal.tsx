'use client';

import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { 
  Sparkles, Gift, TreePine, Snowflake, Star, Zap, Users, 
  Trophy, Coins, Package, Heart, Share2, X, Check 
} from 'lucide-react';

// ===== TYPE DEFINITIONS =====

interface WalletState {
  isConnected: boolean;
  walletType: string | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  balance: string;
}

interface TransactionState {
  status: 'idle' | 'submitting' | 'submitted' | 'confirmed' | 'failed';
  hash: string | null;
  error: string | null;
}

interface GiftOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  type: string;
  price: string;
  chain: string;
  testMode: boolean;
  tier: string;
  points: number;
}

interface Friend {
  id: number;
  name: string;
  address: string;
  level: number;
  gifts: number;
  avatar: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  gifts: number;
  level: number;
  address: string;
}

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface SuccessData {
  recipient: string;
  message: string;
  giftType: string;
  giftName: string;
  amount: string;
  points: number;
  chain: string;
  timestamp: string;
  sender: string | null;
  level: number;
  txHash: string | null;
  tokenId: string | null;
  status: string;
  isVirtual: boolean;
  isTestMode: boolean;
}

interface BaseSantaGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (data: SuccessData) => void;
  currentLevel?: number;
  totalGiftsSent?: number;
}

// ===== CONTRACT CONFIGURATION =====
const REAL_CONTRACT_ADDRESS = "0xE33730983Fe27d08F70e6Dc5F32330622407C9d2";
const REAL_CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "string", "name": "tokenURI", "type": "string"}
    ],
    "name": "mintNFT",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "string", "name": "message", "type": "string"}
    ],
    "name": "sendETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "sender", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "giftType", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "message", "type": "string"}
    ],
    "name": "GiftSent",
    "type": "event"
  }
] as const;

// ===== BASE SANTA GIFT MODAL COMPONENT =====
export default function BaseSantaGiftModal({
  isOpen,
  onClose,
  onSendGift,
  currentLevel = 1,
  totalGiftsSent = 0
}: BaseSantaGiftModalProps) {
  // State for form inputs
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [selectedGift, setSelectedGift] = useState<string>('virtual');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [txStatus, setTxStatus] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [walletProvider, setWalletProvider] = useState<ethers.BrowserProvider | null>(null);
  const [showWalletOptions, setShowWalletOptions] = useState<boolean>(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [useTestMode, setUseTestMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'gifts' | 'friends' | 'leaderboard'>('gifts');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [referralCode, setReferralCode] = useState<string>(`SANTA${currentLevel}`);

  // Animated snowflakes
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const snowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Wallet state
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    walletType: null,
    address: null,
    isLoading: false,
    error: null,
    balance: '0'
  });

  // Transaction state
  const [transactionState, setTransactionState] = useState<TransactionState>({
    status: 'idle',
    hash: null,
    error: null
  });

  // Gift options with tiers
  const giftOptions: GiftOption[] = [
    {
      id: 'virtual',
      name: '🎁 Virtual Gift',
      description: 'Digital surprise package',
      icon: <Gift size={24} />,
      color: 'from-green-500 to-emerald-600',
      type: 'virtual',
      price: 'FREE',
      chain: 'Virtual',
      testMode: true,
      tier: 'common',
      points: 10
    },
    {
      id: 'hints',
      name: '💡 Hint Bundle',
      description: 'Extra hints for the game',
      icon: <Zap size={24} />,
      color: 'from-indigo-500 to-purple-600',
      type: 'virtual',
      price: 'FREE',
      chain: 'Virtual',
      testMode: true,
      tier: 'uncommon',
      points: 15
    },
    {
      id: 'base',
      name: '⚡ Base Gift',
      description: 'Special Base gift card',
      icon: <Sparkles size={24} />,
      color: 'from-yellow-500 to-orange-600',
      type: 'giftcard',
      price: 'FREE',
      chain: 'Virtual',
      testMode: true,
      tier: 'rare',
      points: 20
    },
    {
      id: 'nft',
      name: '🎨 Santa NFT',
      description: 'Exclusive Santa NFT on Base',
      icon: <TreePine size={24} />,
      color: 'from-purple-500 to-pink-600',
      type: 'nft',
      price: '0.001 ETH',
      chain: 'Base',
      testMode: false,
      tier: 'epic',
      points: 50
    },
    {
      id: 'eth',
      name: '💰 ETH Gift',
      description: 'Send real ETH on Base',
      icon: <Coins size={24} />,
      color: 'from-blue-500 to-cyan-600',
      type: 'crypto',
      price: '0.01 ETH',
      chain: 'Base',
      testMode: false,
      tier: 'legendary',
      points: 100
    },
    {
      id: 'badge',
      name: '🏆 Santa Badge',
      description: 'Level achievement badge',
      icon: <Trophy size={24} />,
      color: 'from-amber-500 to-red-600',
      type: 'nft',
      price: '0.0005 ETH',
      chain: 'Base',
      testMode: false,
      tier: 'mythic',
      points: 75
    }
  ];

  // Friends list (mock data)
  const friendsList: Friend[] = [
    { id: 1, name: 'Santa Claus', address: '0x742d35Cc6634C0532925a3b844Bc9e...', level: 10, gifts: 25, avatar: '🎅' },
    { id: 2, name: 'Elf Buddy', address: '0x8ba1f109551bD432803012645Ac136...', level: 7, gifts: 18, avatar: '🧝' },
    { id: 3, name: 'Snowflake', address: '0xAb5801a7D398351b8bE11C439e05C5...', level: 5, gifts: 12, avatar: '❄️' },
    { id: 4, name: 'Reindeer', address: '0x6f46cf5569aefa1acc60...', level: 8, gifts: 22, avatar: '🦌' },
    { id: 5, name: 'Grinch', address: '0xEA674fdDe714fd979de3EdF0F56AA...', level: 3, gifts: 5, avatar: '👺' }
  ];

  // Leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, name: 'Santa Claus', gifts: 142, level: 10, address: '0x742d...' },
    { rank: 2, name: 'Elf Master', gifts: 128, level: 10, address: '0x8ba1...' },
    { rank: 3, name: 'Snow Queen', gifts: 112, level: 9, address: '0xAb58...' },
    { rank: 4, name: 'Gift Master', gifts: 98, level: 8, address: '0x6f46...' },
    { rank: 5, name: 'Base King', gifts: 87, level: 7, address: '0xEA67...' }
  ];

  // Wallet options
  const walletOptions: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      color: 'from-orange-500 to-red-600',
      description: 'Popular Web3 wallet'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '💰',
      color: 'from-blue-500 to-cyan-600',
      description: 'Easy to use wallet'
    },
    {
      id: 'rabby',
      name: 'Rabby Wallet',
      icon: '🐰',
      color: 'from-purple-500 to-pink-600',
      description: 'Multi-chain wallet'
    }
  ];

  // Initialize snowflakes
  useEffect(() => {
    const flakes: Snowflake[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setSnowflakes(flakes);
  }, []);

  // Animate snowflakes
  useEffect(() => {
    snowIntervalRef.current = setInterval(() => {
      setSnowflakes(prev => 
        prev.map(flake => ({
          ...flake,
          y: flake.y > 100 ? -10 : flake.y + flake.speed * 0.5
        }))
      );
    }, 50);

    return () => {
      if (snowIntervalRef.current) {
        clearInterval(snowIntervalRef.current);
      }
    };
  }, []);

  // Detect wallet on modal open
  useEffect(() => {
    if (isOpen) {
      checkExistingWallet();
    }
  }, [isOpen]);

  const checkExistingWallet = async (): Promise<void> => {
    try {
      // 1. Check if window and ethereum exist
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // listAccounts returns an array of Signers in v6
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          // FIXED: Use the first account/signer
          const signer = accounts[0];
          const address = signer.address; // v6 mein direct .address mil jata hai
          
          const walletType = detectWalletType(window.ethereum);
          
          // Fetch balance using provider
          const balance = await provider.getBalance(address);
          const balanceInEth = ethers.formatEther(balance);
          
          // Update state
          setWalletState({
            isConnected: true,
            walletType: walletType,
            address: address,
            isLoading: false,
            error: null,
            balance: parseFloat(balanceInEth).toFixed(4)
          });
          
          setWalletProvider(provider);
        } else {
          // Agar koi account connected nahi hai toh loading khatam karein
          setWalletState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setWalletState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      console.log('Wallet check error:', err);
      setWalletState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const detectWalletType = (provider: any): string => {
    if (provider.isMetaMask) return 'metamask';
    if (provider.isCoinbaseWallet) return 'coinbase';
    if (provider.isRabby) return 'rabby';
    return 'injected';
  };

  const connectWallet = async (walletType: string): Promise<void> => {
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
      setShowWalletOptions(false);

      let provider: any;
      
      switch (walletType) {
        case 'metamask':
          if (!window.ethereum) {
            window.open('https://metamask.io/download/', '_blank');
            throw new Error('Please install MetaMask first');
          }
          provider = window.ethereum;
          break;
          
        case 'coinbase':
          if ((window as any).coinbaseWalletExtension) {
            provider = (window as any).coinbaseWalletExtension;
          } else if (window.ethereum?.isCoinbaseWallet) {
            provider = window.ethereum;
          } else {
            window.open('https://www.coinbase.com/wallet', '_blank');
            throw new Error('Please install Coinbase Wallet first');
          }
          break;
          
        default:
          if (!window.ethereum) {
            throw new Error('Please install a Web3 wallet first');
          }
          provider = window.ethereum;
      }

      await provider.request({ method: 'eth_requestAccounts' });
      const ethersProvider = new ethers.BrowserProvider(provider);
      const accounts = await ethersProvider.listAccounts();
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0].address;
      const balance = await ethersProvider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      const detectedType = detectWalletType(provider);

      setWalletState({
        isConnected: true,
        walletType: detectedType,
        address: address,
        isLoading: false,
        error: null,
        balance: parseFloat(balanceInEth).toFixed(4)
      });

      setWalletProvider(ethersProvider);
      setError('');

    } catch (err: any) {
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to connect wallet'
      }));
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const sendTestTransaction = async (): Promise<void> => {
    try {
      if (!recipientAddress || !recipientAddress.startsWith('0x')) {
        throw new Error('Invalid recipient address');
      }

      setTxStatus('Preparing virtual gift...');
      setIsSending(true);

      const selectedGiftData = giftOptions.find(g => g.id === selectedGift);
      if (!selectedGiftData) {
        throw new Error('Selected gift not found');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fakeTxHash = '0x' + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setTransactionState({
        status: 'submitted',
        hash: fakeTxHash,
        error: null
      });

      setTxStatus('Virtual gift sent successfully!');
      
      const giftData: SuccessData = {
        recipient: recipientAddress,
        message: giftMessage,
        giftType: selectedGift,
        giftName: selectedGiftData.name,
        amount: selectedGiftData.price,
        points: selectedGiftData.points,
        chain: 'Test Mode',
        timestamp: new Date().toISOString(),
        sender: walletState.address || 'Test Sender',
        level: currentLevel,
        txHash: fakeTxHash,
        tokenId: null,
        status: 'confirmed',
        isVirtual: true,
        isTestMode: true
      };

      setSuccessData(giftData);
      setShowSuccess(true);
      
      if (onSendGift) {
        onSendGift(giftData);
      }

    } catch (error: any) {
      setTransactionState({
        status: 'failed',
        hash: null,
        error: error.message
      });
      
      setError(error.message);
      setTxStatus('');
    } finally {
      setIsSending(false);
    }
  };

  const sendRealTransaction = async (): Promise<void> => {
    try {
      if (!walletProvider || !walletState.isConnected || !walletState.address) {
        throw new Error('Please connect wallet first');
      }

      const selectedGiftData = giftOptions.find(g => g.id === selectedGift);
      if (!selectedGiftData) {
        throw new Error('Selected gift not found');
      }
      
      setTxStatus('Starting transaction on Base...');
      setIsSending(true);

      const signer = await walletProvider.getSigner();
      const contract = new ethers.Contract(
        REAL_CONTRACT_ADDRESS,
        REAL_CONTRACT_ABI,
        signer
      );

      if (selectedGift === 'nft' || selectedGift === 'badge') {
        setTxStatus('Minting NFT on Base Sepolia...');
        
        const tokenURI = `ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi`;
        const priceInEth = selectedGift === 'nft' ? "0.001" : "0.0005";
        const txValue = ethers.parseEther(priceInEth);
        
        const tx = await contract.mintNFT(recipientAddress, tokenURI, {
          value: txValue
        });
        
        setTxStatus('Transaction submitted to blockchain...');
        setTransactionState({
          status: 'submitted',
          hash: tx.hash,
          error: null
        });
        
        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
          const giftData: SuccessData = {
            recipient: recipientAddress,
            message: giftMessage,
            giftType: selectedGift,
            giftName: selectedGiftData.name,
            amount: selectedGiftData.price,
            points: selectedGiftData.points,
            chain: 'Base Sepolia',
            timestamp: new Date().toISOString(),
            sender: walletState.address,
            level: currentLevel,
            txHash: tx.hash,
            tokenId: "1",
            status: 'confirmed',
            isVirtual: false,
            isTestMode: false
          };
          
          setSuccessData(giftData);
          setShowSuccess(true);
          setTxStatus('NFT minted successfully!');
          
          if (onSendGift) {
            onSendGift(giftData);
          }
        }
        
      } else if (selectedGift === 'eth') {
        setTxStatus('Sending ETH on Base Sepolia...');
        
        const txValue = ethers.parseEther("0.01");
        
        const tx = await contract.sendETH(recipientAddress, giftMessage, {
          value: txValue
        });
        
        setTxStatus('Transaction submitted to blockchain...');
        setTransactionState({
          status: 'submitted',
          hash: tx.hash,
          error: null
        });
        
        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
          const giftData: SuccessData = {
            recipient: recipientAddress,
            message: giftMessage,
            giftType: selectedGift,
            giftName: selectedGiftData.name,
            amount: selectedGiftData.price,
            points: selectedGiftData.points,
            chain: 'Base Sepolia',
            timestamp: new Date().toISOString(),
            sender: walletState.address,
            level: currentLevel,
            txHash: tx.hash,
            tokenId: null,
            status: 'confirmed',
            isVirtual: false,
            isTestMode: false
          };
          
          setSuccessData(giftData);
          setShowSuccess(true);
          setTxStatus('ETH sent successfully!');
          
          if (onSendGift) {
            onSendGift(giftData);
          }
        }
      }
      
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient ETH balance. Get test ETH from faucet.';
      } else if (error.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      }
      
      setTransactionState({
        status: 'failed',
        hash: null,
        error: errorMessage
      });
      
      setError(errorMessage);
      setTxStatus('');
    } finally {
      setIsSending(false);
    }
  };

  const disconnectWallet = (): void => {
    setWalletState({
      isConnected: false,
      walletType: null,
      address: null,
      isLoading: false,
      error: null,
      balance: '0'
    });
    setWalletProvider(null);
    setError('');
  };

  const handleSendGift = async (): Promise<void> => {
    setError('');
    
    if (!recipientAddress.trim()) {
      setError('Please enter recipient address');
      return;
    }

    if (!ethers.isAddress(recipientAddress)) {
      setError('Invalid Ethereum address');
      return;
    }

    const selectedGiftData = giftOptions.find(g => g.id === selectedGift);
    if (!selectedGiftData) {
      setError('Selected gift not found');
      return;
    }
    
    if (selectedGiftData.testMode) {
      await sendTestTransaction();
    } else {
      if (!walletState.isConnected) {
        setShowWalletOptions(true);
        return;
      }
      
      try {
        if (!window.ethereum) {
          setError('Please install MetaMask wallet');
          return;
        }
        
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const baseSepoliaChainId = '0x14a34';
        
        if (chainId !== baseSepoliaChainId) {
          setError('Please switch to Base Sepolia network');
          
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: baseSepoliaChainId }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: baseSepoliaChainId,
                  chainName: 'Base Sepolia',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.base.org'],
                  blockExplorerUrls: ['https://sepolia.basescan.org']
                }]
              });
            } else {
              throw switchError;
            }
          }
          return;
        }
        
        await sendRealTransaction();
        
      } catch (error: any) {
        setError(`Network error: ${error.message}`);
      }
    }
  };

  const resetForm = (): void => {
    setRecipientAddress('');
    setGiftMessage('');
    setError('');
    setTxStatus('');
    setShowSuccess(false);
    setSuccessData(null);
    setIsSending(false);
    setTransactionState({
      status: 'idle',
      hash: null,
      error: null
    });
    onClose();
  };

  const shareToTwitter = (): void => {
    if (!successData) return;
    
    const text = `🎅 I just sent a ${successData.giftName} on Base Santa Game! 
Level ${currentLevel} completed! 
${successData.txHash ? `Tx: ${successData.txHash.slice(0, 10)}...` : ''}
#BaseSanta #BaseBlockchain #Web3Gaming`;
    
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shortenAddress = (address: string | null): string => {
    if (!address) return '';
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const selectFriend = (friend: Friend): void => {
    setRecipientAddress(friend.address);
    setSelectedFriend(friend);
    setGiftMessage(`Hey ${friend.name}! Merry Christmas from Base Santa! 🎄`);
  };

  // Get selected gift data
  const selectedGiftData = giftOptions.find(g => g.id === selectedGift);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Animated Snow Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[998] bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden"
      >
        {snowflakes.map(flake => (
          <div
            key={flake.id}
            className="absolute text-white pointer-events-none"
            style={{
              left: `${flake.x}%`,
              top: `${flake.y}%`,
              fontSize: `${flake.size * 10}px`,
              opacity: flake.opacity,
              filter: 'blur(0.5px)'
            }}
          >
            ❄️
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center p-4 z-[999]">
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border-2 border-white/10 shadow-2xl shadow-blue-500/30 relative z-[1000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-green-500 to-red-500" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-red-500/20 to-green-500/20 rounded-full blur-3xl" />

            {/* Header */}
            <div className="sticky top-0 z-50 p-6 border-b border-white/10 bg-gradient-to-r from-red-900/30 via-green-900/30 to-red-900/30 backdrop-blur-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 shadow-lg">
                    <TreePine className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-red-300 via-white to-green-300 bg-clip-text text-transparent">
                      Base Secret Santa 🎅
                    </h2>
                    <p className="text-gray-300">Send Gifts • Earn Points • Join Leaderboard</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 hover:border-red-500/50 transition-all"
                  disabled={isSending}
                  aria-label="Close gift modal"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-bold text-white">{currentLevel}</div>
                  <div className="text-xs text-gray-400">Current Level</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-bold text-white">{totalGiftsSent}</div>
                  <div className="text-xs text-gray-400">Gifts Sent</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-bold text-white">
                    {walletState.isConnected ? shortenAddress(walletState.address) : 'Not Connected'}
                  </div>
                  <div className="text-xs text-gray-400">Wallet</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-bold text-white">
                    {walletState.isConnected ? `${walletState.balance} ETH` : '0 ETH'}
                  </div>
                  <div className="text-xs text-gray-400">Balance</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="p-6">
                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 border-b border-white/10">
                  {(['gifts', 'friends', 'leaderboard'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 rounded-t-xl font-medium transition-all ${
                        activeTab === tab 
                          ? 'bg-white/10 border-t border-x border-white/10 text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab === 'gifts' && '🎁 Gifts'}
                      {tab === 'friends' && '👥 Friends'}
                      {tab === 'leaderboard' && '🏆 Leaderboard'}
                    </button>
                  ))}
                </div>

                {/* Gift Selection */}
                {activeTab === 'gifts' && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">Select Gift Type</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {giftOptions.map((gift) => (
                        <motion.button
                          key={gift.id}
                          onClick={() => setSelectedGift(gift.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-2xl border-2 transition-all text-left ${
                            selectedGift === gift.id 
                              ? `border-white bg-gradient-to-r ${gift.color} shadow-xl` 
                              : 'border-white/10 bg-white/5 hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-white/10">
                              {gift.icon}
                            </div>
                            <div>
                              <div className="font-bold text-white">{gift.name}</div>
                              <div className="text-sm text-gray-300">{gift.description}</div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  gift.tier === 'common' ? 'bg-gray-500/30' :
                                  gift.tier === 'uncommon' ? 'bg-green-500/30' :
                                  gift.tier === 'rare' ? 'bg-blue-500/30' :
                                  gift.tier === 'epic' ? 'bg-purple-500/30' :
                                  gift.tier === 'legendary' ? 'bg-yellow-500/30' :
                                  'bg-red-500/30'
                                }`}>
                                  {gift.tier}
                                </span>
                                <span className="text-xs text-gray-400">{gift.price}</span>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Friends List */}
                {activeTab === 'friends' && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">Send to Friends</h3>
                    <div className="space-y-3">
                      {friendsList.map((friend) => (
                        <motion.div
                          key={friend.id}
                          onClick={() => selectFriend(friend)}
                          whileHover={{ scale: 1.01 }}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedFriend?.id === friend.id 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-white/10 bg-white/5 hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{friend.avatar}</div>
                            <div className="flex-1">
                              <div className="font-bold text-white">{friend.name}</div>
                              <div className="text-sm text-gray-400">{shortenAddress(friend.address)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-white">Level {friend.level}</div>
                              <div className="text-xs text-gray-400">{friend.gifts} gifts</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leaderboard */}
                {activeTab === 'leaderboard' && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">Top Gifters</h3>
                    <div className="space-y-3">
                      {leaderboardData.map((entry) => (
                        <div key={entry.rank} className="p-4 rounded-2xl border border-white/10 bg-white/5">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              entry.rank === 1 ? 'bg-yellow-500/30 text-yellow-300' :
                              entry.rank === 2 ? 'bg-gray-500/30 text-gray-300' :
                              entry.rank === 3 ? 'bg-amber-700/30 text-amber-300' :
                              'bg-white/5 text-gray-400'
                            }`}>
                              {entry.rank}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-white">{entry.name}</div>
                              <div className="text-sm text-gray-400">{shortenAddress(entry.address)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">{entry.gifts} gifts</div>
                              <div className="text-sm text-gray-400">Level {entry.level}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Inputs */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gift Message (Optional)
                    </label>
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Add a holiday message..."
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Transaction Status */}
                {txStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-300"
                  >
                    {txStatus}
                  </motion.div>
                )}

                {/* Send Button */}
                <div className="mb-8">
                  <button
                    onClick={handleSendGift}
                    disabled={isSending || !recipientAddress}
                    className={`w-full py-4 rounded-2xl font-bold text-white text-xl transition-all ${
                      isSending 
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700' 
                        : 'bg-gradient-to-r from-red-600 via-red-500 to-green-600 hover:shadow-2xl hover:shadow-red-500/40'
                    }`}
                  >
                    {isSending ? (
                      <span className="flex items-center justify-center gap-3">
                        <span className="animate-spin">🎄</span>
                        Sending Gift...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <Gift size={24} />
                        Send Christmas Gift
                      </span>
                    )}
                  </button>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400">
                      {selectedGiftData?.testMode 
                        ? '🎁 Virtual Gift (Test Mode)' 
                        : '🔗 Real Transaction on Base'}
                    </p>
                  </div>
                </div>

                {/* Wallet Connection */}
                {!walletState.isConnected && (
                  <div className="mb-6 p-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10">
                    <p className="text-yellow-300 text-sm text-center">
                      Connect wallet to send real gifts on Base blockchain
                    </p>
                    <button
                      onClick={() => setShowWalletOptions(true)}
                      className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}

                {/* Success Message */}
                {showSuccess && successData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-6 rounded-2xl border border-green-500/30 bg-green-500/10"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-green-500">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">Gift Sent Successfully!</h4>
                        <p className="text-green-300">Your {successData.giftName} has been sent</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">To:</span>
                        <span className="text-white">{shortenAddress(successData.recipient)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Points Earned:</span>
                        <span className="text-yellow-400 font-bold">+{successData.points}</span>
                      </div>
                      {successData.txHash && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Transaction:</span>
                          <span className="text-blue-400">
                            <a 
                              href={`https://sepolia.basescan.org/tx/${successData.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {shortenAddress(successData.txHash)}
                            </a>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={shareToTwitter}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <Share2 size={20} />
                        Share
                      </button>
                      <button
                        onClick={resetForm}
                        className="flex-1 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
                      >
                        Send Another
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
