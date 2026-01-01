'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Zap, Gift, Sparkles, RefreshCw, 
  ChevronLeft, ChevronRight, X, BookOpen, 
  Wallet, Brain, Target, Layers, Globe, 
  Cpu, Lock, Star, CheckCircle, Shield, 
  Code, Coins, Users, Network, Clock,
  Home, Moon, Sun, Menu, Loader2, Copy, LogOut
} from 'lucide-react';

// ============================
// IMPORT USER'S NFT COLLECTION FILE
// ============================
import {
  DripmasNFT3D,
  NFTCollectionModal,
  getPremiumDetails,
  MissionProgress,
  BaseLogo
} from '../components/NFT3DCollection';

// ============================
// WAGMI & Viem Imports for Wallet & Blockchain
// ============================
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// ============================
// NFT SMART CONTRACT CONFIGURATION (Real Contract)
// ============================
const NFT_CONTRACT_ADDRESS = "0x940DE0Ef8d4A1C80aeBd9f7944e8bFB86953edc4";
const NFT_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "safeMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ============================
// ENHANCED ANIMATED BACKGROUND
// ============================
const EnhancedBackground = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <div className={`fixed inset-0 z-[-2] overflow-hidden transition-all duration-700 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-[#0a0a0f] via-[#0f172a] to-[#1e1b4b]' 
        : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-white'
    }`}>
      
      {/* Static Grid Lines */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(90deg, transparent 95%, ${isDarkMode ? '#ffffff' : '#000000'} 100%)`,
          backgroundSize: '50px 50px'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(transparent 95%, ${isDarkMode ? '#ffffff' : '#000000'} 100%)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Blobs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] ${
          isDarkMode ? 'bg-blue-600/20' : 'bg-blue-200/40'
        }`}
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] ${
          isDarkMode ? 'bg-purple-600/20' : 'bg-purple-200/40'
        }`}
      />
    </div>
  );
};

// ============================
// LEVEL CONFIG (10 LEVELS)
// ============================
const LEVEL_CONFIG: Record<number, any> = {
  1: { pairs: 4, cols: 4, rows: 2, moves3: 10, moves2: 14, points: 100 },
  2: { pairs: 6, cols: 4, rows: 3, moves3: 16, moves2: 22, points: 250 },
  3: { pairs: 8, cols: 4, rows: 4, moves3: 24, moves2: 32, points: 500 },
  4: { pairs: 10, cols: 4, rows: 5, moves3: 32, moves2: 45, points: 1000 },
  5: { pairs: 12, cols: 4, rows: 6, moves3: 42, moves2: 55, points: 2000 },
  6: { pairs: 14, cols: 4, rows: 7, moves3: 52, moves2: 68, points: 3000 },
  7: { pairs: 16, cols: 4, rows: 8, moves3: 64, moves2: 80, points: 4000 },
  8: { pairs: 18, cols: 6, rows: 6, moves3: 76, moves2: 95, points: 5000 },
  9: { pairs: 20, cols: 5, rows: 8, moves3: 90, moves2: 110, points: 6000 },
  10: { pairs: 24, cols: 6, rows: 8, moves3: 110, moves2: 130, points: 8000 },
};

// ============================
// CARD COMPONENT
// ============================
const PremiumCard = ({ isFlipped, isMatched, onClick, value, isDarkMode }: any) => {
  const asset = useMemo(() => [
    { icon: '🔵', label: 'Base' }, { icon: '🛡️', label: 'Secure' },
    { icon: '⚡', label: 'Fast' }, { icon: '💎', label: 'Value' },
    { icon: '🌈', label: 'NFT' }, { icon: '🏗️', label: 'Build' },
    { icon: '📱', label: 'Smart' }, { icon: '🤝', label: 'Social' },
    { icon: '💰', label: 'DeFi' }, { icon: '🚀', label: 'Scale' },
    { icon: '🔐', label: 'Safe' }, { icon: '🌐', label: 'Web3' }
  ][value % 12], [value]);

  return (
    <motion.div 
      onClick={onClick} 
      className="relative w-full cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ aspectRatio: '4/5' }}
    >
      <motion.div 
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
        style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%' }}
      >
        {/* Front */}
        <div 
          className={`absolute inset-0 rounded-2xl ${
            isDarkMode ? 'bg-[#0052FF]' : 'bg-blue-500'
          } border-2 ${
            isDarkMode ? 'border-white/20' : 'border-blue-600/30'
          } flex flex-col items-center justify-center backface-hidden shadow-xl overflow-hidden`}
          style={{ transform: 'rotateY(0deg)', backfaceVisibility: 'hidden' }}
        >
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)]' 
              : 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent)]'
          }`} />
          <span className="text-3xl font-bold text-white mb-1">ⓑ</span>
          <span className={`text-[10px] font-black text-white/70 tracking-widest`}>BASE</span>
        </div>
        
        {/* Back */}
        <div 
          className={`absolute inset-0 rounded-2xl ${
            isDarkMode ? 'bg-slate-900' : 'bg-white'
          } border-2 ${
            isDarkMode ? 'border-blue-500/50' : 'border-blue-400/50'
          } flex flex-col items-center justify-center backface-hidden shadow-lg`}
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <span className="text-2xl mb-1">{asset.icon}</span>
          <span className={`text-[9px] font-bold ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          } uppercase tracking-tighter`}>{asset.label}</span>
          {isMatched && (
            <div className={`absolute inset-0 ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-400/20'
            } animate-pulse rounded-2xl`} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================
// HINT SYSTEM COMPONENT
// ============================
const HintSystem = ({ 
  onUseHint,
  availableHints,
  isDarkMode 
}: any) => {
  const getHint = () => {
    if (availableHints <= 0) return;
    onUseHint();
  };

  return (
    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-blue-50'} mb-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain size={18} className={isDarkMode ? "text-yellow-400" : "text-yellow-600"} />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Hint System ({availableHints} left)
          </span>
        </div>
        <button
          onClick={getHint}
          disabled={availableHints <= 0}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            availableHints > 0
              ? isDarkMode 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-gray-400 text-gray-300 cursor-not-allowed'
          }`}
        >
          Use Hint
        </button>
      </div>
      
      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
        Reveals two matching cards for 3 seconds
      </p>
    </div>
  );
};

// ============================
// MAIN COMPONENT
// ============================
export default function BaseMemoryGame() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameBoard, setGameBoard] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showLearning, setShowLearning] = useState(false);
  const [availableHints, setAvailableHints] = useState(3);
  const [completedLevels, setCompletedLevels] = useState<number[]>([1]);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode
  const [activeTab, setActiveTab] = useState<'game' | 'collection' | 'missions'>('game');
  const [nftMintingStatus, setNftMintingStatus] = useState<Record<number, boolean>>({});
  const [showMintModal, setShowMintModal] = useState(false);
  const [mintingLevel, setMintingLevel] = useState<number | null>(null);
  const [mintTransactionHash, setMintTransactionHash] = useState<string | null>(null);
  const [showUserNFTCollection, setShowUserNFTCollection] = useState(false);
  const [showUserMissionProgress, setShowUserMissionProgress] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showMintButton, setShowMintButton] = useState(false);
  const [tempFlippedCards, setTempFlippedCards] = useState<Set<number>>(new Set());
  const [connectingWallet, setConnectingWallet] = useState(false);

  // WAGMI hooks
  const { address, isConnected, chainId, isConnecting } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { 
    writeContractAsync, 
    isPending: isMintPending, 
    error: mintError
  } = useWriteContract();
  const { 
    isLoading: isConfirming, 
    isSuccess: isMintConfirmed 
  } = useWaitForTransactionReceipt({ hash: mintTransactionHash as `0x${string}` });

  const config = LEVEL_CONFIG[currentLevel] || LEVEL_CONFIG[1];

  const isLevelUnlocked = useCallback((level: number): boolean => {
    return level === 1 || completedLevels.includes(level - 1);
  }, [completedLevels]);

  const getStarRating = useCallback((moves: number, level: number): number => {
    const config = LEVEL_CONFIG[level];
    if (!config) return 1;
    if (moves <= config.moves3) return 3;
    if (moves <= config.moves2) return 2;
    return 1;
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const initializeGame = useCallback(() => {
    const values = Array.from({ length: config.pairs }, (_, i) => i)
      .flatMap(i => [i, i])
      .sort(() => Math.random() - 0.5)
      .map((value, id) => ({ id, value }));
    
    setGameBoard(values);
    setFlippedCards(new Set());
    setTempFlippedCards(new Set());
    setMatchedPairs(new Set());
    setMoves(0);
    setTimer(0);
    setIsTimerRunning(false);
    setIsLevelCompleted(false);
    setShowMintButton(false);
  }, [config]);

  useEffect(() => {
    const savedLevels = localStorage.getItem('baseMemoryCompletedLevels');
    const savedPoints = localStorage.getItem('baseMemoryPoints');
    const savedTheme = localStorage.getItem('baseMemoryTheme');
    const savedMintStatus = localStorage.getItem('baseMemoryNftMintStatus');
    const savedHints = localStorage.getItem('baseMemoryHints');
    
    if (savedLevels) {
      try {
        const parsed = JSON.parse(savedLevels);
        if (Array.isArray(parsed)) {
          setCompletedLevels(parsed);
        }
      } catch (e) {
        console.error('Error loading completed levels:', e);
      }
    }
    
    if (savedPoints) {
      setUserPoints(parseInt(savedPoints) || 0);
    }
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
    
    if (savedMintStatus) {
      try {
        const parsed = JSON.parse(savedMintStatus);
        if (parsed && typeof parsed === 'object') {
          setNftMintingStatus(parsed);
        }
      } catch (e) {
        console.error('Error loading NFT mint status:', e);
      }
    }

    if (savedHints) {
      setAvailableHints(parseInt(savedHints) || 3);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('baseMemoryCompletedLevels', JSON.stringify(completedLevels));
    localStorage.setItem('baseMemoryPoints', userPoints.toString());
    localStorage.setItem('baseMemoryTheme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('baseMemoryNftMintStatus', JSON.stringify(nftMintingStatus));
    localStorage.setItem('baseMemoryHints', availableHints.toString());
  }, [completedLevels, userPoints, isDarkMode, nftMintingStatus, availableHints]);

  useEffect(() => { 
    initializeGame(); 
  }, [initializeGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !isLevelCompleted) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isLevelCompleted]);

  useEffect(() => {
    if (isMintConfirmed && mintingLevel) {
      setNftMintingStatus(prev => ({ ...prev, [mintingLevel]: true }));
      setTimeout(() => {
        setShowMintModal(false);
        setMintingLevel(null);
        setMintTransactionHash(null);
      }, 3000);
    }
  }, [isMintConfirmed, mintingLevel]);

  const handleCardClick = (id: number) => {
    if (flippedCards.size >= 2 || matchedPairs.has(id) || flippedCards.has(id) || isLevelCompleted || tempFlippedCards.has(id)) return;
    
    if (!isTimerRunning) setIsTimerRunning(true);
    const newFlipped = new Set(flippedCards).add(id);
    setFlippedCards(newFlipped);

    if (newFlipped.size === 2) {
      setMoves(m => m + 1);
      const [id1, id2] = Array.from(newFlipped);
      const c1 = gameBoard.find(c => c.id === id1);
      const c2 = gameBoard.find(c => c.id === id2);

      if (c1?.value === c2?.value) {
        setTimeout(() => {
          setMatchedPairs(prev => {
            const next = new Set(prev).add(id1).add(id2);
            if (next.size === gameBoard.length) {
              setIsTimerRunning(false);
              setIsLevelCompleted(true);
              const pointsEarned = config.points;
              setUserPoints(prev => prev + pointsEarned);
              if (!completedLevels.includes(currentLevel) && currentLevel <= 10) {
                setCompletedLevels(prev => [...prev, currentLevel]);
              }
              setShowMintButton(true);
              setTimeout(() => {
                setShowCelebration(true);
              }, 800);
            }
            return next;
          });
          setFlippedCards(new Set());
        }, 800);
      } else {
        setTimeout(() => setFlippedCards(new Set()), 1200);
      }
    }
  };

  const useHint = () => {
    if (availableHints <= 0) return;
    
    const unmatchedCards = gameBoard.filter((card: any) => 
      !matchedPairs.has(card.id) && !flippedCards.has(card.id) && !tempFlippedCards.has(card.id)
    );
    
    if (unmatchedCards.length < 2) return;
    
    const firstCard = unmatchedCards[0];
    const matchingCard = gameBoard.find((card: any) => 
      card.value === firstCard.value && card.id !== firstCard.id && !matchedPairs.has(card.id)
    );
    
    if (matchingCard) {
      setTempFlippedCards(new Set([firstCard.id, matchingCard.id]));
      setAvailableHints(prev => prev - 1);
      
      setTimeout(() => {
        setTempFlippedCards(new Set());
      }, 3000);
    }
  };

  const connectWallet = async (connectorType: 'injected' | 'walletConnect') => {
    try {
      setConnectingWallet(true);
      const connector = connectors.find(c => 
        connectorType === 'injected' ? c.id === 'injected' : c.id === 'walletConnect'
      );
      
      if (!connector) throw new Error('Connector not found');
      
      await connectAsync({ connector });
      setShowWalletModal(false);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnectingWallet(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnectAsync();
      setShowWalletModal(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const switchToBaseNetwork = async () => {
    try {
      await switchChainAsync({ chainId: base.id });
    } catch (error) {
      console.error('Failed to switch to Base network:', error);
    }
  };

  const mintNFT = async (level: number) => {
    if (!isConnected || !address) {
      setShowWalletModal(true);
      return;
    }
    
    if (chainId !== base.id) {
      const shouldSwitch = window.confirm('You need to be on Base network to mint NFTs. Switch to Base network?');
      if (shouldSwitch) {
        await switchToBaseNetwork();
      }
      return;
    }
    
    setMintingLevel(level);
    setShowMintModal(true);
    
    try {
      const tokenId = level;
      const tokenURI = `https://ipfs.io/ipfs/QmYourIPFSCID/${level}.json`;
      
      const hash = await writeContractAsync({
        address: NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_CONTRACT_ABI,
        functionName: 'safeMint',
        args: [address, BigInt(tokenId), tokenURI],
      });
      
      setMintTransactionHash(hash);
    } catch (error: any) {
      console.error('Minting failed:', error);
      alert(`Minting failed: ${error.message || 'Unknown error'}`);
      setShowMintModal(false);
      setMintingLevel(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const nextLevel = () => {
    if (currentLevel < 10 && isLevelUnlocked(currentLevel + 1)) {
      setCurrentLevel(prev => prev + 1);
      setShowCelebration(false);
      initializeGame();
    }
  };

  const previousLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(prev => prev - 1);
      setShowCelebration(false);
      initializeGame();
    }
  };

  const selectLevel = (level: number) => {
    if (isLevelUnlocked(level)) {
      setCurrentLevel(level);
      setShowLevelSelect(false);
      initializeGame();
    }
  };

  const resetLevel = () => {
    initializeGame();
    setShowCelebration(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentStars = getStarRating(moves, currentLevel);
  const currentTier = getPremiumDetails(currentLevel);

  return (
    <div
      className={`w-full min-h-screen transition-all duration-300 ${
        isDarkMode ? 'text-white bg-[#0a0a0f]' : 'text-gray-900 bg-white'
      } font-sans overflow-x-hidden`}
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)'}}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&display=swap');
        body { 
          font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .backface-hidden { 
          backface-visibility: hidden; 
          -webkit-backface-visibility: hidden;
        }
      `}</style>

      <EnhancedBackground isDarkMode={isDarkMode} />

      {/* HEADER */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b px-4 py-3 ${
        isDarkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
            }`} title="Menu">
              <Menu size={20} className={isDarkMode ? "text-white" : "text-gray-900"} />
            </button>
            <div className="flex items-center gap-2">
              <BaseLogo size={24} />
              <span className={`font-bold text-sm ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Base Memory
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
              }`} 
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              {isDarkMode ? 
                <Sun size={18} className="text-white" /> : 
                <Moon size={18} className="text-gray-900" />
              }
            </button>
            
            <button 
              onClick={() => setShowWalletModal(true)}
              className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors flex items-center gap-1">
              {isConnected ? (
                <>
                  <Wallet size={14} />
                  <span>{address?.slice(0, 4)}...{address?.slice(-4)}</span>
                </>
              ) : (
                <>
                  <Wallet size={14} />
                  <span>Connect</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-md mx-auto px-4 pb-20 pt-4">
        {/* Current Level Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Level {currentLevel}
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Match {config.pairs} pairs of cards
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={previousLevel}
                disabled={currentLevel === 1}
                className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${
                  isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Previous Level"
              >
                <ChevronLeft size={18} className={isDarkMode ? "text-white" : "text-gray-900"} />
              </button>
              <button 
                onClick={nextLevel}
                disabled={currentLevel === 10 || !isLevelUnlocked(currentLevel + 1)}
                className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${
                  isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Next Level"
              >
                <ChevronRight size={18} className={isDarkMode ? "text-white" : "text-gray-900"} />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className={`h-1.5 rounded-full overflow-hidden ${
            isDarkMode ? 'bg-white/10' : 'bg-gray-200'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${(matchedPairs.size / gameBoard.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: 'Moves', val: moves, icon: <Target size={14} /> },
            { label: 'Time', val: formatTime(timer), icon: <Clock size={14} /> },
            { label: 'Hints', val: availableHints, icon: <Brain size={14} /> },
            { label: 'Points', val: userPoints, icon: <Trophy size={14} /> },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl p-3 text-center ${
              isDarkMode ? 'bg-white/5' : 'bg-gray-100'
            }`}>
              <div className={`flex items-center justify-center gap-1 mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {s.icon}
                <span className="text-[10px] font-semibold">{s.label}</span>
              </div>
              <div className={`text-lg font-bold ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* NFT Preview Section */}
        <div className="mb-6">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Level {currentLevel} Reward
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentTier.name} - {config.points} points
              </p>
            </div>
          </div>
        </div>

        {/* Hint System */}
        <HintSystem
          onUseHint={useHint}
          availableHints={availableHints}
          isDarkMode={isDarkMode}
        />

        {/* Game Grid */}
        {isLevelCompleted ? (
          <div className={`mb-6 p-6 rounded-2xl text-center border ${
            isDarkMode 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="text-5xl mb-4">🎉</div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Level {currentLevel} Complete!
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You matched all {config.pairs} pairs in {moves} moves!
            </p>
            
            {/* NFT MINT BUTTON */}
            {showMintButton && !nftMintingStatus[currentLevel] && (
              <div className="mb-4">
                <button
                  onClick={() => mintNFT(currentLevel)}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-sm text-white hover:opacity-90 transition-opacity mb-2"
                >
                  🪙 Mint Level {currentLevel} NFT
                </button>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Mint your NFT reward on Base network
                </p>
              </div>
            )}
            
            {nftMintingStatus[currentLevel] && (
              <div className={`mb-4 p-3 rounded-lg ${
                isDarkMode ? 'bg-green-500/10' : 'bg-green-50'
              }`}>
                <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ✅ NFT Already Minted!
                </p>
              </div>
            )}
            
            <button
              onClick={() => setShowCelebration(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full font-bold text-sm text-white w-full hover:opacity-90 transition-opacity"
            >
              View Rewards
            </button>
          </div>
        ) : (
          <div 
            className="grid gap-3 mb-6"
            style={{ gridTemplateColumns: `repeat(${config.cols}, 1fr)` }}
          >
            {gameBoard.map((card) => (
              <PremiumCard
                key={card.id}
                isFlipped={flippedCards.has(card.id) || tempFlippedCards.has(card.id)}
                isMatched={matchedPairs.has(card.id)}
                onClick={() => handleCardClick(card.id)}
                value={card.value}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}

        {/* Game Controls */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button 
            onClick={() => setShowWalletModal(true)}
            className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
              isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
            }`}>
            <Wallet size={18} className={isDarkMode ? "text-purple-400" : "text-purple-500"} />
            <span className="text-xs font-semibold">Wallet</span>
          </button>
          
          <button 
            onClick={resetLevel}
            className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors flex flex-col items-center gap-1">
            <RefreshCw size={18} className="text-white" />
            <span className="text-xs font-semibold text-white">Reset</span>
          </button>
          
          <button 
            onClick={() => setShowLearning(true)}
            className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
              isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
            }`}>
            <BookOpen size={18} className={isDarkMode ? "text-cyan-400" : "text-cyan-500"} />
            <span className="text-xs font-semibold">Learn</span>
          </button>
        </div>

        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Progress: {completedLevels.length}/10 levels
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((star) => (
                <div
                  key={star}
                  className={`text-sm ${star <= currentStars ? 'text-yellow-400' : isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}
                >
                  ★
                </div>
              ))}
            </div>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${
            isDarkMode ? 'bg-white/10' : 'bg-gray-200'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${(completedLevels.length / 10) * 100}%` }}
            />
          </div>
        </div>
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t px-4 py-3 ${
        isDarkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button 
            onClick={() => setActiveTab('game')}
            className={`py-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'game' 
                ? 'bg-blue-600 text-white' 
                : isDarkMode 
                  ? 'hover:bg-white/5 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
            }`}
            title="Game"
          >
            <Home size={20} />
            <span className="text-xs">Game</span>
          </button>
          
          <button 
            onClick={() => setShowUserNFTCollection(true)}
            className={`py-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'collection' 
                ? 'bg-blue-600 text-white' 
                : isDarkMode 
                  ? 'hover:bg-white/5 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
            }`}
            title="View NFT Collection"
          >
            <Trophy size={20} />
            <span className="text-xs">NFTs</span>
          </button>
          
          <button 
            onClick={() => setShowUserMissionProgress(true)}
            className={`py-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'missions' 
                ? 'bg-blue-600 text-white' 
                : isDarkMode 
                  ? 'hover:bg-white/5 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
            }`}
            title="View Missions"
          >
            <Target size={20} />
            <span className="text-xs">Missions</span>
          </button>
          
          <button 
            onClick={() => setShowLevelSelect(true)}
            className={`py-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
              isDarkMode 
                ? 'hover:bg-white/5 text-white' 
                : 'hover:bg-gray-100 text-gray-900'
            }`}
            title="Select Level"
          >
            <Layers size={20} />
            <span className="text-xs">Levels</span>
          </button>
        </div>
      </nav>

      {/* WALLET MODAL - UPDATED FOR FARCASTER */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowWalletModal(false)}
          >
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }}
              className={`w-full max-w-sm rounded-2xl p-6 border ${
                isDarkMode ? 'bg-[#1a1a1f] border-white/10' : 'bg-white border-gray-200'
              } relative`}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowWalletModal(false)}
                className={`absolute top-4 right-4 p-1 ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                <X size={20} />
              </button>
              
              <h3 className={`text-lg font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {isConnected ? 'Wallet' : 'Connect Wallet'}
              </h3>
              
              {isConnected ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-white/5' : 'bg-gray-100'
                  }`}>
                    <div className={`text-sm mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Connected Wallet</div>
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-sm truncate">{address}</div>
                      <button 
                        onClick={() => copyToClipboard(address || '')}
                        className="p-1 hover:opacity-80"
                        title="Copy address"
                      >
                        <Copy size={16} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
                      </button>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-white/5' : 'bg-gray-100'
                  }`}>
                    <div className={`text-sm mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Network</div>
                    <div className={`flex items-center gap-2 ${
                      chainId === base.id ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {chainId === base.id ? '✅ Base Network' : `🌐 Chain ID: ${chainId}`}
                    </div>
                  </div>
                  
                  {chainId !== base.id && (
                    <button
                      onClick={switchToBaseNetwork}
                      className="w-full py-3 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                      disabled={connectingWallet}
                    >
                      {connectingWallet ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        'Switch to Base Network'
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={disconnectWallet}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => connectWallet('injected')}
                    disabled={connectingWallet}
                    className={`w-full p-4 rounded-xl transition-colors flex items-center justify-between ${
                      isDarkMode 
                        ? 'bg-white/5 hover:bg-white/10 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Wallet size={20} />
                      <span>Browser Wallet</span>
                    </div>
                    {connectingWallet && <Loader2 size={18} className="animate-spin" />}
                  </button>
                  
                  <button
                    onClick={() => connectWallet('walletConnect')}
                    disabled={connectingWallet}
                    className={`w-full p-4 rounded-xl transition-colors flex items-center justify-between ${
                      isDarkMode 
                        ? 'bg-white/5 hover:bg-white/10 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#3b99fc] rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span>WalletConnect</span>
                    </div>
                    {connectingWallet && <Loader2 size={18} className="animate-spin" />}
                  </button>
                  
                  <div className={`text-xs mt-4 text-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Connect your wallet to mint NFTs and track progress
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NFT Minting Modal */}
      <AnimatePresence>
        {showMintModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
            onClick={() => !isMintPending && setShowMintModal(false)}
          >
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }}
              className={`w-full max-w-sm rounded-3xl p-7 border ${
                isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'
              } relative`}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowMintModal(false)} 
                className={`absolute top-5 right-5 p-2 ${
                  isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-700'
                }`}
                disabled={isMintPending || isConfirming}
              >
                <X size={22} />
              </button>
              
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🪙</div>
                <h3 className={`text-xl font-black mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {isMintConfirmed ? 'NFT Minted!' : 
                   isConfirming ? 'Confirming...' : 
                   isMintPending ? 'Minting...' : 
                   'Mint NFT'}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {isMintConfirmed ? 'Your NFT is now in your wallet!' :
                   isConfirming ? 'Waiting for blockchain confirmation...' :
                   isMintPending ? 'Please confirm in your wallet' :
                   'Mint your NFT reward'}
                </p>
              </div>
              
              {mintError && (
                <div className={`p-4 rounded-xl mb-6 ${
                  isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'
                } border`}>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-red-300' : 'text-red-700'
                  }`}>
                    Error: {mintError.message}
                  </p>
                </div>
              )}
              
              {mintTransactionHash && (
                <div className={`p-4 rounded-xl mb-6 ${
                  isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'
                } border`}>
                  <p className={`text-sm mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Transaction: {mintTransactionHash.slice(0, 10)}...{mintTransactionHash.slice(-8)}
                  </p>
                  <a 
                    href={`https://basescan.org/tx/${mintTransactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs underline ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    View on Basescan ↗
                  </a>
                </div>
              )}
              
              <div className="space-y-4">
                {!isMintConfirmed && !isMintPending && !isConfirming && (
                  <button
                    onClick={() => mintingLevel && mintNFT(mintingLevel)}
                    disabled={isMintPending}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMintPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Minting...
                      </div>
                    ) : 'Mint NFT Now'}
                  </button>
                )}
                
                {isMintConfirmed && (
                  <button
                    onClick={() => setShowMintModal(false)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity"
                  >
                    ✅ Done
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learning Modal */}
      <AnimatePresence>
        {showLearning && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLearning(false)}
          >
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }}
              className={`w-full max-w-sm rounded-3xl p-7 border ${
                isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'
              } relative`}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowLearning(false)} className={`absolute top-5 right-5 p-2 ${
                isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-700'
              }`}>
                <X size={22}/>
              </button>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100'
              }`}>
                <Globe className="text-blue-400" size={24} />
              </div>
              <h3 className={`text-xl font-black mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Learn About Base</h3>
              <p className={`text-sm leading-relaxed mb-7 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain.
                It's incubated within Coinbase, leveraging 10 years of crypto experience.
              </p>
              <div className={`border rounded-2xl p-5 ${
                isDarkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'
              }`}>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">Onchain Tip</span>
                <p className={`text-xs italic ${
                  isDarkMode ? 'text-white/80' : 'text-gray-700'
                }`}>&quot;Base has never been hacked thanks to its rigorous security protocols.&quot;</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEVEL SELECT MODAL */}
      <AnimatePresence>
        {showLevelSelect && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLevelSelect(false)}
          >
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }}
              className={`w-full max-w-sm rounded-3xl p-7 border ${
                isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Select Level</h3>
                <button onClick={() => setShowLevelSelect(false)} className="p-1">
                  <X size={20} className={isDarkMode ? "text-white" : "text-gray-900"} />
                </button>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
                  const isUnlocked = level === 1 || completedLevels.includes(level - 1);
                  const isCurrent = level === currentLevel;
                  const isCompleted = completedLevels.includes(level);
                  
                  return (
                    <button
                      key={level}
                      onClick={() => isUnlocked && selectLevel(level)}
                      disabled={!isUnlocked}
                      className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                        isCurrent 
                          ? 'bg-blue-600 text-white' 
                          : isCompleted 
                            ? 'bg-green-600/30 text-green-400' 
                            : isUnlocked 
                              ? 'hover:bg-opacity-20' 
                              : 'opacity-30'
                      } ${!isUnlocked && 'cursor-not-allowed'} ${
                        isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle size={20} className="text-green-400" />
                      ) : !isUnlocked ? (
                        <Lock size={16} />
                      ) : (
                        <span className="font-bold">{level}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className={`mt-6 text-center text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {completedLevels.length}/10 levels completed
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-blue-600/20 backdrop-blur-md"
            onClick={() => setShowCelebration(false)}
          >
            <div className={`w-full max-w-sm rounded-[2.5rem] p-9 text-center shadow-2xl ${
              isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'
            }`}
            onClick={(e) => e.stopPropagation()}
            >
              <div className="text-7xl mb-5">🏆</div>
              <h2 className="text-3xl font-black mb-3 italic">Level {currentLevel} Complete!</h2>
              <p className={`font-medium mb-7 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>You mastered this level in {moves} moves.</p>
              
              <div className="flex justify-center gap-3 mb-7">
                {[1, 2, 3].map((star) => (
                  <div
                    key={star}
                    className={`text-3xl ${star <= currentStars ? 'text-yellow-400' : isDarkMode ? 'text-gray-700' : 'text-gray-300'}`}
                  >
                    ★
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-9">
                <div className={`p-5 rounded-3xl ${
                  isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
                }`}>
                  <span className={`block text-[10px] font-bold uppercase ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Points</span>
                  <span className={`text-xl font-black ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>+{config.points}</span>
                </div>
                <div className={`p-5 rounded-3xl ${
                  isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
                }`}>
                  <span className={`block text-[10px] font-bold uppercase ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Reward</span>
                  <span className={`text-xl font-black ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    NFT
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {currentLevel < 10 ? (
                  <button 
                    onClick={nextLevel}
                    className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Next Level <ChevronRight size={20}/>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowCelebration(false)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity"
                  >
                    🎉 All 10 Levels Complete!
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    setShowCelebration(false);
                    setShowUserNFTCollection(true);
                  }}
                  className={`w-full font-bold py-4 rounded-2xl transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-800 text-white hover:bg-slate-700' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  View in Collection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Other Modals */}
      <NFTCollectionModal
        isOpen={showUserNFTCollection}
        onClose={() => setShowUserNFTCollection(false)}
        currentLevel={Math.max(...completedLevels, 1)}
      />

      <MissionProgress
        isOpen={showUserMissionProgress}
        onClose={() => setShowUserMissionProgress(false)}
        level={currentLevel}
      />
    </div>
  );
}