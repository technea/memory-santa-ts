'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Zap, Gift, Sparkles, RefreshCw, 
  ChevronLeft, ChevronRight, X, BookOpen, 
  Wallet, Info, Brain, Target, ShieldCheck, 
  Layers, Globe, Cpu, Lock, Star, CheckCircle,
  ExternalLink, Home, Settings, HelpCircle,
  Award, Clock, TrendingUp, Moon, Sun, Image, 
  Filter, Grid, List, Key, Users, Coins, Code, 
  Shield, Database, Network, Smartphone, Hash,
  Eye, EyeOff, Lightbulb, Menu
} from 'lucide-react';

// ============================
// IMPORT USER'S NFT COLLECTION FILE
// ============================
import {
  DripmasNFT3D,
  NFTCollectionModal,
  getPremiumDetails,
  getLevelMemes,
  MissionProgress,
  AIMemeGenerator,
  ChainBGame,
  BaseLogo,
  ChainBLogo
} from '../components/NFT3DCollection';

// ============================
// WAGMI & Viem Imports for Wallet & Blockchain
// ============================
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// ============================
// NFT SMART CONTRACT CONFIGURATION
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
// ENHANCED ANIMATED BACKGROUND (UPDATED)
// ============================
const EnhancedBackground = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

      {/* Client-Only Particles */}
      {isClient && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-[3px] h-[3px] ${isDarkMode ? 'bg-blue-400/40' : 'bg-blue-500/30'} rounded-full`}
          initial={{
            x: Math.random() * 100 + 'vw',
            y: Math.random() * 100 + 'vh',
            opacity: 0.2
          }}
          animate={{
            x: [null, `calc(${Math.random() * 100}vw + ${Math.random() * 200 - 100}px)`],
            y: [null, `calc(${Math.random() * 100}vh + ${Math.random() * 200 - 100}px)`],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};
// ============================
// LEVEL CONFIG (10 LEVELS) - SAME
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
// LEVEL LEARNING CONTENT (10 LEVELS) - SAME
// ============================
const LEVEL_LEARNING: Record<number, any> = {
  1: {
    title: "The Base Vision",
    icon: <Globe className="text-blue-400" />,
    content: "Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain.",
    funFact: "Base is incubated within Coinbase, leveraging 10 years of crypto experience."
  },
  2: {
    title: "The Superchain & OP Stack",
    icon: <Layers className="text-blue-400" />,
    content: "Base is built on the OP Stack in collaboration with Optimism, making it part of a unified 'Superchain'.",
    funFact: "The Superchain allows different L2s to share security and communication layers!"
  },
  3: {
    title: "Account Abstraction",
    icon: <Cpu className="text-blue-400" />,
    content: "Base supports Smart Wallets, allowing users to pay gas with any token or even use FaceID to sign transactions.",
    funFact: "Smart Wallets remove the need for complex seed phrases for new users."
  },
  4: {
    title: "EIP-4844 (Blobs)",
    icon: <Zap className="text-blue-400" />,
    content: "Base utilizes 'Blobs' to store data on Ethereum efficiently, which drastically reduced fees in 2024.",
    funFact: "After EIP-4844, transaction fees on Base dropped by over 90%!"
  },
  5: {
    title: "Onchain Summer",
    icon: <Sparkles className="text-blue-400" />,
    content: "Base is the home of onchain culture, from world-class art to social protocols like Farcaster.",
    funFact: "Thousands of developers build on Base because it's EVM-equivalent."
  },
  6: {
    title: "Security & Audits",
    icon: <Shield className="text-blue-400" />,
    content: "Base inherits Ethereum's security and undergoes regular audits by top security firms.",
    funFact: "Base has never been hacked thanks to its rigorous security protocols."
  },
  7: {
    title: "Developer Tools",
    icon: <Code className="text-blue-400" />,
    content: "Base offers powerful developer tools like Foundry, Hardhat, and comprehensive documentation.",
    funFact: "Base has the most developer-friendly documentation in the blockchain space."
  },
  8: {
    title: "DeFi Ecosystem",
    icon: <Coins className="text-blue-400" />,
    content: "Base hosts top DeFi protocols with billions in TVL, offering high yields and low fees.",
    funFact: "Base has over $10B in total value locked across various DeFi protocols."
  },
  9: {
    title: "Social & NFTs",
    icon: <Users className="text-blue-400" />,
    content: "Base is becoming the hub for social apps and NFT communities with minimal fees.",
    funFact: "Farcaster, a decentralized social network, runs entirely on Base."
  },
  10: {
    title: "Future of Onchain",
    icon: <Network className="text-blue-400" />,
    content: "Base is paving the way for the future where everything from identity to finance lives onchain.",
    funFact: "Base processes millions of transactions daily with sub-cent fees."
  }
};

// ============================
// QUIZ QUESTIONS - SAME
// ============================
const QUIZ_QUESTIONS: any[] = [
  {
    question: "Which open-source stack is Base built on?",
    answer: "op stack",
    explanation: "Correct! Base is built on the OP Stack by Optimism.",
    reward: "+1 Hint"
  },
  {
    question: "Base is an Ethereum _____ blockchain (Layer 1 or Layer 2?)",
    answer: "layer 2",
    explanation: "Exactly! It scales Ethereum as a Layer 2.",
    reward: "+1 Hint"
  },
  {
    question: "What is the collective of chains like Base and Optimism called?",
    answer: "superchain",
    explanation: "Correct! They form the Superchain ecosystem.",
    reward: "+1 Hint"
  },
  {
    question: "True or False: Base has its own native network token.",
    answer: "false",
    explanation: "Correct! Base uses ETH for gas and does not have a native token.",
    reward: "+1 Hint"
  },
  {
    question: "Which company incubated Base?",
    answer: "coinbase",
    explanation: "Yes! Base is incubated by Coinbase.",
    reward: "+1 Hint"
  }
];

// ============================
// CARD COMPONENT - SAME
// ============================
const PremiumCard = ({ isFlipped, isMatched, onClick, value, isDarkMode }: any) => {
  const asset = useMemo(() => [
    { icon: '🔵', label: 'Base' }, { icon: '🛡️', label: 'Secure' },
    { icon: '⚡', label: 'Fast' }, { icon: '💎', label: 'Value' },
    { icon: '🌈', label: 'NFT' }, { icon: '🏗️', label: 'Build' },
    { icon: '📱', label: 'Smart' }, { icon: '🤝', label: 'Social' },
    { icon: '💰', label: 'DeFi' }, { icon: '🚀', label: 'Scale' },
    { icon: '🔐', label: 'Safe' }, { icon: '🌐', label: 'Web3' },
    { icon: '🎨', label: 'Art' }, { icon: '📊', label: 'Data' }
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
          <span className={`text-[10px] font-black ${
            isDarkMode ? 'text-white/50' : 'text-white/70'
          } tracking-widest`}>BASE</span>
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
// HINT SYSTEM COMPONENT - SAME
// ============================
const HintSystem = ({ 
  gameBoard, 
  matchedPairs, 
  flippedCards, 
  onUseHint,
  availableHints,
  isDarkMode 
}: any) => {
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState<number | null>(null);

  const getHint = () => {
    if (availableHints <= 0 || matchedPairs.size === gameBoard.length) return;
    
    const unmatchedCards = gameBoard.filter((card: any) => 
      !matchedPairs.has(card.id) && !flippedCards.has(card.id)
    );
    
    if (unmatchedCards.length < 2) return;
    
    const firstCard = unmatchedCards[0];
    const matchingCard = gameBoard.find((card: any) => 
      card.value === firstCard.value && card.id !== firstCard.id && !matchedPairs.has(card.id)
    );
    
    if (matchingCard) {
      setHintIndex(firstCard.id);
      setTimeout(() => setHintIndex(matchingCard.id), 500);
      onUseHint();
      
      setTimeout(() => {
        setHintIndex(null);
      }, 2000);
    }
  };

  return (
    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-blue-50'} mb-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className={isDarkMode ? "text-yellow-400" : "text-yellow-600"} />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Hint System ({availableHints} left)
          </span>
        </div>
        <button
          onClick={getHint}
          disabled={availableHints <= 0 || matchedPairs.size === gameBoard.length}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            availableHints > 0 && matchedPairs.size !== gameBoard.length
              ? isDarkMode 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
          }`}
        >
          Use Hint
        </button>
      </div>
      
      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
        Click to reveal two matching cards for 3 seconds
      </p>
      
      {hintIndex !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center p-2 rounded-lg ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}
        >
          <span className={`text-sm font-bold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
            💡 Look at card #{hintIndex + 1}!
          </span>
        </motion.div>
      )}
    </div>
  );
};

// ============================
// MAIN COMPONENT - UPDATED FOR FARCASTER MINI-APP LAYOUT
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
  const [showQuiz, setShowQuiz] = useState(false);
  const [availableHints, setAvailableHints] = useState(3);
  const [completedLevels, setCompletedLevels] = useState<number[]>([1]);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'game' | 'collection' | 'missions'>('game');
  const [nftMintingStatus, setNftMintingStatus] = useState<Record<number, boolean>>({});
  const [showMintModal, setShowMintModal] = useState(false);
  const [mintingLevel, setMintingLevel] = useState<number | null>(null);
  const [mintTransactionHash, setMintTransactionHash] = useState<string | null>(null);
  const [showUserNFTCollection, setShowUserNFTCollection] = useState(false);
  const [showAIMemeGenerator, setShowAIMemeGenerator] = useState(false);
  const [showChainBGame, setShowChainBGame] = useState(false);
  const [showUserMissionProgress, setShowUserMissionProgress] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // WAGMI hooks
  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();
  const { 
    writeContract, 
    isPending: isMintPending, 
    isSuccess: isMintStarted,
    data: mintHash,
    error: mintError
  } = useWriteContract();
  const { 
    isLoading: isConfirming, 
    isSuccess: isMintConfirmed 
  } = useWaitForTransactionReceipt({ hash: mintHash });

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
    setMatchedPairs(new Set());
    setMoves(0);
    setTimer(0);
    setIsTimerRunning(false);
    setIsLevelCompleted(false);
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
    
    if (savedTheme === 'light') {
      setIsDarkMode(false);
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
    if (flippedCards.size >= 2 || matchedPairs.has(id) || flippedCards.has(id) || isLevelCompleted) return;
    
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

  const connectWallet = async () => {
    try {
      if (!isConnected) {
        // Try injected first (MetaMask)
        try {
          await connect({ connector: injected({}) });
          setShowWalletModal(false);
        } catch (injectedError) {
          console.log('Injected wallet not available, trying WalletConnect...');
          // Fallback to WalletConnect
          await connect({ connector: walletConnect({ projectId: 'YOUR_WALLETCONNECT_PROJECT_ID' }) });
          setShowWalletModal(false);
        }
      }
    } catch (e) { 
      console.error('Failed to connect wallet:', e);
      alert('Failed to connect wallet. Please make sure you have MetaMask or Coinbase Wallet installed.');
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setShowWalletModal(false);
  };

  const switchToBaseNetwork = async () => {
    try {
      await switchChain({ chainId: base.id });
    } catch (error) {
      console.error('Failed to switch to Base network:', error);
      alert('Please switch to Base network manually in your wallet.');
    }
  };

  const mintNFT = async (level: number) => {
    if (!isConnected) {
      setShowWalletModal(true);
      return;
    }
    
    if (chainId !== base.id) {
      const shouldSwitch = confirm('You need to be on Base network to mint NFTs. Switch to Base network?');
      if (shouldSwitch) {
        await switchToBaseNetwork();
      }
      return;
    }
    
    setMintingLevel(level);
    setShowMintModal(true);
    
    try {
      const tier = getPremiumDetails(level);
      const tokenId = level;
      const tokenURI = `https://your-metadata-server.com/nft/${level}.json`;
      
      writeContract({
        address: NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_CONTRACT_ABI,
        functionName: 'safeMint',
        args: [address as `0x${string}`, BigInt(tokenId), tokenURI],
        chainId: base.id,
      });
      
      if (mintHash) {
        setMintTransactionHash(mintHash);
      }
      
    } catch (error) {
      console.error('Minting failed:', error);
      alert(`Minting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowMintModal(false);
      setMintingLevel(null);
    }
  };

  const useHint = () => {
    if (availableHints <= 0) {
      alert('No hints available! Complete quizzes to earn more hints.');
      return;
    }
    setAvailableHints(prev => prev - 1);
  };

  const earnHint = () => {
    if (isLevelCompleted) return;
    
    const randomQuiz = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
    setCurrentQuiz(randomQuiz);
    setShowQuiz(true);
    setQuizAnswer('');
    setQuizFeedback('');
  };

  const submitQuizAnswer = () => {
    if (!currentQuiz || !quizAnswer.trim()) return;
    
    const isCorrect = quizAnswer.trim().toLowerCase() === currentQuiz.answer.toLowerCase();
    if (isCorrect) {
      setQuizFeedback(`✅ ${currentQuiz.explanation} ${currentQuiz.reward}`);
      setAvailableHints(prev => prev + 1);
    } else {
      setQuizFeedback(`❌ Not quite. The correct answer is: "${currentQuiz.answer}".`);
    }
    
    setTimeout(() => {
      setShowQuiz(false);
      setQuizFeedback('');
      setQuizAnswer('');
    }, isCorrect ? 1500 : 2000);
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
      className={`w-full min-h-screen transition-all duration-300 ${isDarkMode ? 'text-slate-100 bg-[#0a0a0f]' : 'text-slate-900 bg-white'} font-sans selection:bg-blue-500/30 overflow-x-hidden`}
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)'}}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&display=swap');
        body { 
          font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-feature-settings: "ss01", "ss02", "cv01", "cv02";
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .backface-hidden { 
          backface-visibility: hidden; 
          -webkit-backface-visibility: hidden;
        }
        * {
          box-sizing: border-box;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.03); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 82, 255, 0.18); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 82, 255, 0.3); }
      `}</style>

      <EnhancedBackground isDarkMode={isDarkMode} />

      {/* FARCASTER STYLE HEADER */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Menu">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <BaseLogo size={24} />
              <span className={`font-bold text-sm transition-colors duration-300 ${
  isDarkMode ? 'text-slate-100' : 'text-slate-300'
}`}>
  Base Memory
</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" 
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button 
              onClick={() => setShowWalletModal(true)}
              className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-xs font-semibold transition-colors flex items-center gap-1">
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
              <h1 className="text-xl font-bold">Level {currentLevel}</h1>
              <p className="text-sm text-gray-400">{LEVEL_LEARNING[currentLevel]?.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={previousLevel}
                disabled={currentLevel === 1}
                className="p-1.5 rounded-lg bg-white/5 disabled:opacity-30"
                title="Previous Level"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={nextLevel}
                disabled={currentLevel === 10 || !isLevelUnlocked(currentLevel + 1)}
                className="p-1.5 rounded-lg bg-white/5 disabled:opacity-30"
                title="Next Level"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${(matchedPairs.size / gameBoard.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: 'Moves', val: moves, icon: <Target size={14}/> },
            { label: 'Time', val: formatTime(timer), icon: <Clock size={14}/> },
            { label: 'Hints', val: availableHints, icon: <Brain size={14}/> },
            { label: 'Points', val: userPoints, icon: <Trophy size={14}/> },
          ].map((s, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-white/5' : 'bg-slate-100'} rounded-xl p-3 text-center`}>
              <div className={`flex items-center justify-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mb-1`}>
                {s.icon}
                <span className="text-[10px] font-semibold">{s.label}</span>
              </div>
              <div className="text-lg font-bold text-blue-500">{s.val}</div>
            </div>
          ))}
        </div>

        {/* NFT Preview Section */}
        <div className="mb-6">
          <DripmasNFT3D 
            level={currentLevel} 
            currentLevel={Math.max(...completedLevels, 1)}
          />
          <div className="mt-3 text-center">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              Reward: {currentTier.name} ({config.points} points)
            </span>
          </div>
        </div>

        {/* Hint System */}
        <HintSystem
          gameBoard={gameBoard}
          matchedPairs={matchedPairs}
          flippedCards={flippedCards}
          onUseHint={useHint}
          availableHints={availableHints}
          isDarkMode={isDarkMode}
        />

        {/* Game Grid */}
        {isLevelCompleted ? (
          <div className={`mb-6 p-6 ${isDarkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'} border rounded-2xl text-center`}>
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">Level {currentLevel} Complete!</h3>
            <p className="text-sm text-gray-400 mb-4">
              You matched all {config.pairs} pairs in {moves} moves!
            </p>
            <button
              onClick={() => setShowCelebration(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full font-bold text-sm text-white w-full"
            >
              Claim Reward
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
                isFlipped={flippedCards.has(card.id)}
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
            onClick={earnHint}
            disabled={isLevelCompleted}
            className={`py-3 rounded-xl ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'} transition-colors disabled:opacity-40 flex flex-col items-center gap-1`}>
            <Brain size={18} className={isDarkMode ? "text-purple-400" : "text-purple-500"} />
            <span className="text-xs font-semibold">Earn Hint</span>
          </button>
          
          <button 
            onClick={resetLevel}
            className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors flex flex-col items-center gap-1">
            <RefreshCw size={18} className="text-white" />
            <span className="text-xs font-semibold text-white">Reset</span>
          </button>
          
          <button 
            onClick={() => setShowLearning(true)}
            className={`py-3 rounded-xl ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'} transition-colors flex flex-col items-center gap-1`}>
            <BookOpen size={18} className={isDarkMode ? "text-cyan-400" : "text-cyan-500"} />
            <span className="text-xs font-semibold">Learn</span>
          </button>
        </div>

        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Progress: {completedLevels.length}/10 levels</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((star) => (
                <div
                  key={star}
                  className={`text-sm ${star <= currentStars ? 'text-yellow-400' : 'text-gray-600'}`}
                >
                  ★
                </div>
              ))}
            </div>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${(completedLevels.length / 10) * 100}%` }}
            />
          </div>
        </div>
      </main>

      {/* BOTTOM NAVIGATION - FARCASTER STYLE */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-t border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button 
            onClick={() => setActiveTab('game')}
            className={`py-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${activeTab === 'game' ? 'bg-blue-600' : 'hover:bg-white/5'}`}
            title="Game"
          >
            <Home size={20} />
            <span className="text-xs">Game</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('collection');
              setShowUserNFTCollection(true);
            }}
            className={`py-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${activeTab === 'collection' ? 'bg-blue-600' : 'hover:bg-white/5'}`}
            title="View NFT Collection"
          >
            <Trophy size={20} />
            <span className="text-xs">NFTs</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('missions');
              setShowUserMissionProgress(true);
            }}
            className={`py-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${activeTab === 'missions' ? 'bg-blue-600' : 'hover:bg-white/5'}`}
            title="View Missions"
          >
            <Target size={20} />
            <span className="text-xs">Missions</span>
          </button>
          
          <button 
            onClick={() => setShowLevelSelect(true)}
            className="py-3 rounded-lg flex flex-col items-center gap-1 hover:bg-white/5 transition-colors"
            title="Select Level"
          >
            <Layers size={20} />
            <span className="text-xs">Levels</span>
          </button>
        </div>
      </nav>

      {/* WALLET MODAL */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }}
              className="w-full max-w-sm bg-[#1a1a1f] rounded-2xl p-6 border border-white/10 relative"
            >
              <button 
                onClick={() => setShowWalletModal(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-lg font-bold mb-4">Connect Wallet</h3>
              
              {isConnected ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-sm text-gray-400">Connected as</div>
                    <div className="font-mono text-sm truncate">{address}</div>
                  </div>
                  
                  {chainId !== base.id && (
                    <button
                      onClick={switchToBaseNetwork}
                      className="w-full py-3 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-semibold transition-colors"
                    >
                      Switch to Base Network
                    </button>
                  )}
                  
                  <button
                    onClick={disconnectWallet}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={connectWallet}
                    className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet size={20} />
                      <span>MetaMask / Injected</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => connect({ connector: walletConnect({ projectId: 'YOUR_WALLETCONNECT_PROJECT_ID' }) })}
                    className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet size={20} />
                      <span>WalletConnect</span>
                    </div>
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REST OF THE MODALS REMAIN THE SAME */}
      <NFTCollectionModal
        isOpen={showUserNFTCollection}
        onClose={() => setShowUserNFTCollection(false)}
        currentLevel={Math.max(...completedLevels, 1)}
      />

      <AnimatePresence>
        {showAIMemeGenerator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setShowAIMemeGenerator(false)}
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <AIMemeGenerator level={currentLevel} />
              <button
                onClick={() => setShowAIMemeGenerator(false)}
                className="mt-4 w-full py-3 bg-gradient-to-r from-[#0052FF] to-[#00D4FF] text-white rounded-xl font-bold hover:opacity-90"
              >
                🚀 CLOSE GENERATOR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chain B Game Modal */}
      <AnimatePresence>
        {showChainBGame && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setShowChainBGame(false)}
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <ChainBGame />
              <button
                onClick={() => setShowChainBGame(false)}
                className="mt-4 w-full py-3 bg-gradient-to-r from-[#0052FF] to-[#00D4FF] text-white rounded-xl font-bold hover:opacity-90"
              >
                🎮 CLOSE GAME
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Progress Modal */}
      <AnimatePresence>
        {showUserMissionProgress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setShowUserMissionProgress(false)}
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <MissionProgress level={currentLevel} />
              <button
                onClick={() => setShowUserMissionProgress(false)}
                className="mt-4 w-full py-3 bg-gradient-to-r from-[#0052FF] to-[#00D4FF] text-white rounded-xl font-bold hover:opacity-90"
              >
                🎯 CLOSE MISSIONS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NFT Minting Modal */}
      <AnimatePresence>
        {showMintModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }}
              className={`w-full max-w-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-7 border ${isDarkMode ? 'border-white/10' : 'border-slate-200'} relative`}
            >
              <button onClick={() => setShowMintModal(false)} className={`absolute top-5 right-5 p-2 ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`} title="Close Mint Modal">
                <X size={22} />
              </button>
              
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{mintingLevel ? getPremiumDetails(mintingLevel).emoji : '🪙'}</div>
                <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                  {isMintConfirmed ? 'NFT Minted Successfully!' : 
                   isConfirming ? 'Confirming Transaction...' : 
                   isMintPending ? 'Minting in Progress...' : 
                   'Mint Your NFT'}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isMintConfirmed ? `Your ${mintingLevel ? getPremiumDetails(mintingLevel).name : 'NFT'} is now in your wallet!` :
                   isConfirming ? 'Waiting for blockchain confirmation...' :
                   isMintPending ? 'Please confirm the transaction in your wallet' :
                   `Mint ${mintingLevel ? getPremiumDetails(mintingLevel).name : 'NFT'} to your wallet`}
                </p>
              </div>
              
              {mintError && (
                <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'} border`}>
                  <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                    Error: {mintError.message}
                  </p>
                </div>
              )}
              
              {mintTransactionHash && (
                <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'} border`}>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'} mb-2`}>
                    Transaction: {mintTransactionHash.slice(0, 10)}...{mintTransactionHash.slice(-8)}
                  </p>
                  <a 
                    href={`https://basescan.org/tx/${mintTransactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline`}
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
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMintPending ? 'Minting...' : 'Mint NFT'}
                  </button>
                )}
                
                {isMintConfirmed && (
                  <button
                    onClick={() => setShowMintModal(false)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform"
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
          >
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }}
              className={`w-full max-w-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-7 border ${isDarkMode ? 'border-white/10' : 'border-slate-200'} relative`}
            >
              <button onClick={() => setShowLearning(false)} className={`absolute top-5 right-5 p-2 ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`} title="Close Learning Modal"><X size={22}/></button>
              <div className={`w-14 h-14 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100'} rounded-2xl flex items-center justify-center mb-5`}>
                {LEVEL_LEARNING[currentLevel]?.icon}
              </div>
              <h3 className={`text-xl font-black mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{LEVEL_LEARNING[currentLevel]?.title}</h3>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-sm leading-relaxed mb-7`}>{LEVEL_LEARNING[currentLevel]?.content}</p>
              <div className={`${isDarkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'} border rounded-2xl p-5`}>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">Onchain Tip</span>
                <p className={`text-xs ${isDarkMode ? 'text-white/80' : 'text-slate-700'} italic`}>&quot;{LEVEL_LEARNING[currentLevel]?.funFact}&quot;</p>
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
          >
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }}
              className={`w-full max-w-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-7 border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Select Level</h3>
                <button onClick={() => setShowLevelSelect(false)} className="p-1">
                  <X size={20} />
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
                          ? 'bg-blue-600' 
                          : isCompleted 
                            ? 'bg-green-600/30' 
                            : isUnlocked 
                              ? 'bg-white/5 hover:bg-white/10' 
                              : 'bg-white/5 opacity-30'
                      } ${!isUnlocked && 'cursor-not-allowed'}`}
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
              
              <div className="mt-6 text-center text-sm text-gray-400">
                {completedLevels.length}/10 levels completed
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REST OF THE MODALS REMAIN THE SAME (Quiz Modal, Win Celebration, etc.) */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }}
              className={`w-full max-w-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-7 border ${isDarkMode ? 'border-white/10' : 'border-slate-200'} relative`}
            >
              <button onClick={() => setShowQuiz(false)} className={`absolute top-5 right-5 p-2 ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                <X size={22} />
              </button>
              
              <h3 className={`text-xl font-black mb-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                🎓 Base Quiz
              </h3>

              {currentQuiz && (
                <div className="space-y-5">
                  <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'} text-sm`}>{currentQuiz.question}</p>
                  
                  <input
                    type="text"
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className={`w-full p-4 ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-slate-100 border-slate-200'} border rounded-xl ${isDarkMode ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-500'} text-sm`}
                    onKeyDown={(e) => e.key === 'Enter' && submitQuizAnswer()}
                  />
                  
                  {quizFeedback && (
                    <div className={`p-4 rounded-xl ${
                      quizFeedback.includes('✅') 
                        ? isDarkMode ? 'bg-green-500/10 text-green-300' : 'bg-green-50 text-green-700'
                        : isDarkMode ? 'bg-red-500/10 text-red-300' : 'bg-red-50 text-red-700'
                    }`}>
                      {quizFeedback}
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <button
                      onClick={submitQuizAnswer}
                      className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl font-bold hover:scale-105 transition-transform text-sm text-white"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setShowQuiz(false)}
                      className={`px-5 py-4 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} rounded-xl font-bold transition-colors text-sm`}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}
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
          >
            <div className={`w-full max-w-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-[2.5rem] p-9 text-center ${isDarkMode ? 'text-white' : 'text-slate-900'} shadow-2xl`}>
              <div className="text-7xl mb-5">{currentTier.emoji}</div>
              <h2 className="text-3xl font-black mb-3 italic">{currentTier.name} Unlocked!</h2>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} font-medium mb-7`}>You mastered Level {currentLevel} in {moves} moves.</p>
              
              <div className="flex justify-center gap-3 mb-7">
                {[1, 2, 3].map((star) => (
                  <div
                    key={star}
                    className={`text-3xl ${star <= currentStars ? 'text-yellow-400' : isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}
                  >
                    ★
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-9">
                <div className={`p-5 rounded-3xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <span className={`block text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} uppercase`}>Points</span>
                  <span className="text-xl font-black text-blue-500">+{config.points}</span>
                </div>
                <div className={`p-5 rounded-3xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <span className={`block text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} uppercase`}>Rarity</span>
                  <span className={`text-xl font-black ${currentTier.rarity === 'GODLIKE' ? 'text-yellow-500' : 'text-green-500'}`}>
                    {currentTier.rarity}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {currentLevel < 10 ? (
                  <button 
                    onClick={nextLevel}
                    className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    Next Level <ChevronRight size={20}/>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowCelebration(false)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform"
                  >
                    🎉 All 10 Levels Complete!
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    setShowCelebration(false);
                    setShowUserNFTCollection(true);
                  }}
                  className={`w-full ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'} font-bold py-4 rounded-2xl transition-colors`}
                >
                  View in Collection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
