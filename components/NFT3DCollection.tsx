'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useMemo, useCallback, useContext } from 'react';
import { useWriteContract, usePrepareContractWrite, useAccount, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';

// ============================
// 📦 IMPORT YOUR PROVIDER CONTEXT
// ============================
// Make sure this path matches your actual provider file location
import { useMiniApp, MiniAppContext } from './WagmiProviderWrapper';

// ============================
// 🎵 AUDIO HOOK (UPDATED WITH SAFE PLAY)
// ============================
export const useAudio = (src: string, volume: number = 0.3) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.preload = 'auto';
      audioRef.current = audio;

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [src, volume]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; 
      audioRef.current.play().catch(e => console.warn("Audio blocked by browser:", e));
    }
  }, []);

  return play; 
};

// ============================
// 🎨 LOGO COMPONENTS (UNCHANGED)
// ============================
interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  glowing?: boolean;
}

export const BaseLogo = ({ size = 40, className = "", animated = false }: LogoProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 40 40" 
    className={`${className} ${animated ? 'animate-pulse' : ''}`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="8" fill="#0052FF"/>
    <path d="M20 8L32 20L20 32L8 20L20 8Z" fill="white"/>
    <path d="M20 12L28 20L20 28L12 20L20 12Z" fill="#0052FF"/>
  </svg>
);

export const ChainBLogo = ({ size = 40, className = "", animated = false, glowing = false }: LogoProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 40 40" 
    className={`${className} ${animated ? 'animate-bounce' : ''} ${glowing ? 'drop-shadow-[0_0_10px_#0052FF]' : ''}`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="8" fill="#0052FF"/>
    <path d="M10 10H30V30H10V10Z" fill="#FFFFFF"/>
    <text x="20" y="25" textAnchor="middle" fill="#0052FF" fontSize="16" fontWeight="bold">B</text>
    <circle cx="20" cy="20" r="12" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
    {glowing && (
      <circle cx="20" cy="20" r="15" stroke="#00D4FF" strokeWidth="1" fill="none" opacity="0.5">
        <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite" />
      </circle>
    )}
  </svg>
);

// ============================
// 🎮 GAME COMPONENT (UNCHANGED)
// ============================
interface Coin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export const ChainBGame = () => {
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [gameMessage, setGameMessage] = useState<string>("");

  const playAudio = useCallback((src: string, volume: number = 0.3) => {
    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch(e => console.warn('Audio play failed:', e));
    } catch (error) {
      console.warn('Audio error:', error);
    }
  }, []);

  const startGame = useCallback(() => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setGameMessage("");
    
    playAudio('https://assets.mixkit.co/sfx/preview/mixkit-game-show-intro-331.mp3', 0.3);
    
    const newCoins: Coin[] = [];
    const coinCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 12;
    for (let i = 0; i < coinCount; i++) {
      newCoins.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
        collected: false
      });
    }
    setCoins(newCoins);
  }, [playAudio]);

  const collectCoin = useCallback((coinId: number) => {
    if (!gameActive) return;
    
    setCoins(prev => prev.map(coin => 
      coin.id === coinId ? { ...coin, collected: true } : coin
    ));
    setScore(prev => {
      const newScore = prev + 100;
      if (newScore % 500 === 0) {
        setGameMessage(`🎉 ${newScore} POINTS! AMAZING!`);
        setTimeout(() => setGameMessage(""), 2000);
      }
      return newScore;
    });
    
    playAudio('https://assets.mixkit.co/sfx/preview/mixkit-coin-win-notification-199.mp3', 0.2);
  }, [gameActive, playAudio]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameActive(false);
            setGameMessage("⏰ TIME'S UP!");
            setTimeout(() => setGameMessage(""), 3000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  return (
    <div className="p-4 bg-gradient-to-br from-[#0052FF]/10 to-[#00D4FF]/5 rounded-2xl md:rounded-3xl border border-[#0052FF]/30 shadow-lg">
      <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-2">
          <ChainBLogo size={28} animated />
          <h3 className="text-base md:text-xl font-black text-white">CHAIN B GAME</h3>
        </div>
        <div className="ml-auto flex items-center gap-2 md:gap-4 flex-wrap">
          <div className="text-center min-w-[70px]">
            <div className="text-xs text-white/60">SCORE</div>
            <div className="text-lg md:text-2xl font-black text-[#00D4FF]">{score}</div>
          </div>
          <div className="text-center min-w-[70px]">
            <div className="text-xs text-white/60">TIME</div>
            <div className={`text-lg md:text-2xl font-black ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-[#00D4FF]'}`}>
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>
      
      {gameMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-2 md:p-3 bg-gradient-to-r from-[#0052FF] to-[#00D4FF] rounded-xl text-center font-bold text-white text-sm"
        >
          {gameMessage}
        </motion.div>
      )}
      
      <div className="relative h-40 md:h-64 bg-gradient-to-b from-[#001F3F] to-[#0052FF]/40 rounded-xl md:rounded-2xl border-2 border-[#0052FF]/50 overflow-hidden mb-4 md:mb-6">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 grid-rows-4 gap-2 h-full">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="border border-[#0052FF]/20 rounded"></div>
            ))}
          </div>
        </div>
        
        {coins.map(coin => (
          !coin.collected && (
            <motion.div
              key={coin.id}
              className="absolute cursor-pointer w-6 h-6 md:w-8 md:h-8"
              style={{ left: `${coin.x}%`, top: `${coin.y}%` }}
              onClick={() => collectCoin(coin.id)}
              whileHover={{ scale: 1.2 }}
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 360]
              }}
              transition={{ 
                y: { duration: 1, repeat: Infinity },
                rotate: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-[#00D4FF] to-[#0052FF] rounded-full flex items-center justify-center border-2 border-white/50 shadow-lg">
                <span className="text-xs md:text-sm font-black text-white">B</span>
              </div>
            </motion.div>
          )
        ))}
        
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity 
          }}
        >
          <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-[#0052FF] to-[#00D4FF] rounded-full flex items-center justify-center border-3 md:border-4 border-white/30 shadow-xl">
            <BaseLogo size={16} animated />
          </div>
        </motion.div>
      </div>
      
      <div className="text-xs text-white/60 mb-4 text-center px-2">
        Click on the B coins to collect them! Each coin = 100 points
      </div>
      
      <div className="flex flex-col md:flex-row gap-2 md:gap-3">
        {!gameActive ? (
          <button
            onClick={startGame}
            className="flex-1 py-3 md:py-4 bg-gradient-to-r from-[#0052FF] to-[#00D4FF] text-white font-bold md:font-black rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg text-sm md:text-base"
          >
            {score > 0 ? `🎮 PLAY AGAIN (${score} pts)` : '🎮 START GAME'}
          </button>
        ) : (
          <button
            onClick={() => {
              setGameActive(false);
              setGameMessage("⏸️ GAME PAUSED");
            }}
            className="flex-1 py-3 md:py-4 bg-gradient-to-r from-[#FF4757] to-[#FF6B6B] text-white font-bold md:font-black rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg text-sm md:text-base"
          >
            ⏸️ PAUSE GAME
          </button>
        )}
        
        <button
          onClick={() => {
            if (score > 0) {
              playAudio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3', 0.3);
              alert(`🏆 You earned ${score} points!\n\nPoints have been added to your account on Base!`);
            }
          }}
          disabled={score === 0}
          className={`px-4 md:px-6 py-3 md:py-4 text-white font-bold md:font-black rounded-xl transition-transform shadow-lg text-sm md:text-base ${
            score > 0 
              ? 'bg-gradient-to-r from-[#0052FF] to-[#00D4FF] hover:scale-105 active:scale-95' 
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          CLAIM {score} PTS
        </button>
      </div>
    </div>
  );
};

// ============================
// 📊 DATA UTILITIES (UNCHANGED)
// ============================
interface MemeData {
  level: number;
  texts: string[];
  gifs: string[];
  caption: string;
  mission: string;
  special: string;
  gif?: string;
}

interface PremiumDetails {
  name: string;
  color: string;
  accent: string;
  rarity: string;
  emoji: string;
  points: number;
  effect: string;
  glow: boolean;
}

export const getLevelMemes = (level: number): MemeData => {
  const memes: MemeData[] = [
    { 
      level: 1, 
      texts: ["📦 Just a Lump of Coal! Gas fees were higher than this.", "POV: You bought the top on Christmas Eve.", "Common Coal NFT - Still 100x better than nothing!"], 
      gifs: [
        "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif",
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
        "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif"
      ],
      caption: "Me opening my portfolio 🕳️",
      mission: "Collect 10 coal pieces",
      special: "🔥 First NFT Minted!"
    },
    { 
      level: 2, 
      texts: ["Evergreen NFT - At least it's not a rug pull!", "My portfolio after 1 day of DCA", "When you mint during a bull market"], 
      gifs: [
        "https://media.giphy.com/media/3o7TKTqK4fzG5ZPzTi/giphy.gif",
        "https://media.giphy.com/media/26tP4g7q7ZQkRJMqI/giphy.gif"
      ],
      caption: "When my $100 turns into $101",
      mission: "Complete 5 trades",
      special: "🌲 Evergreen Achievement"
    },
    { 
      level: 3, 
      texts: ["Frostbite NFT - Cold storage never felt so cool", "My hands during a crypto winter", "When you HODL through a dip"], 
      gifs: [
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
        "https://media.giphy.com/media/3o7TKTqK4fzG5ZPzTi/giphy.gif"
      ],
      caption: "Diamond hands in -20°C",
      mission: "Hold for 7 days",
      special: "❄️ Frostbite Badge"
    },
    { 
      level: 4, 
      texts: ["Clockwork Deer NFT - Always on time for the pump", "My portfolio when I time the market perfectly", "When your limit order hits at the bottom"], 
      gifs: [
        "https://media.giphy.com/media/3o7TKTqK4fzG5ZPzTi/giphy.gif",
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
      ],
      caption: "Perfect timing doesn't exi—",
      mission: "Make 3 profitable trades",
      special: "🦌 Precision Trader"
    },
    { 
      level: 5, 
      texts: ["Epic Elf NFT - The magic of compounding", "When you discover staking rewards", "My portfolio after finding a gem early"], 
      gifs: [
        "https://media.giphy.com/media/3o7TKTqK4fzG5ZPzTi/giphy.gif",
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
      ],
      caption: "Finding that 100x gem",
      mission: "Stake for 30 days",
      special: "🧝 Magic Finder"
    },
    { 
      level: 6, 
      texts: ["Royal Cane NFT - Walking through resistance levels", "When you break through ATH", "My confidence after a 10x"], 
      gifs: [
        "https://media.giphy.com/media/3o7TKTqK4fzG5ZPzTi/giphy.gif",
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
      ],
      caption: "Breaking through resistance like",
      mission: "Reach 10x on any asset",
      special: "🍭 Resistance Breaker"
    },
    { 
      level: 7, 
      texts: ["Cyber Snow NFT - The future is decentralized", "When you understand blockchain tech", "My brain after reading whitepapers"], 
      gifs: [
        "https://media.giphy.com/media/3o7TKTqK4fzG5ZPzTi/giphy.gif",
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
      ],
      caption: "Understanding Layer 2 solutions",
      mission: "Use 5 dApps",
      special: "🕶️ Tech Enthusiast"
    },
    { 
      level: 8, 
      texts: ["Aurora NFT - Northern lights of gains", "When your portfolio does the rainbow chart", "Seeing green candles for days"], 
      gifs: [
        "https://media.giphy.com/media/3o7TKTqK4fzG5ZPzTi/giphy.gif",
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
      ],
      caption: "Portfolio during a bull run",
      mission: "10 consecutive green days",
      special: "🌈 Rainbow Chaser"
    },
    { 
      level: 9, 
      texts: ["Diamond Ice NFT - Unbreakable conviction", "When you survive multiple bear markets", "My hands after holding Bitcoin since 2017"], 
      gifs: [
        "https://media.giphy.com/media/3o7TKTqK4fzG5ZPzTi/giphy.gif",
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
      ],
      caption: "Holding through 80% dips",
      mission: "Survive a bear market",
      special: "💎 Diamond Hands"
    },
    { 
      level: 10, 
      texts: ["SANTA GENESIS NFT - All I want for Christmas is Lambo", "When you make it in crypto", "My portfolio after following all the advice"], 
      gifs: [
        "https://media.giphy.com/media/3o7TKTqK4fzG5ZPzTi/giphy.gif",
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
      ],
      caption: "Financial freedom unlocked",
      mission: "Achieve all milestones",
      special: "🎅 Crypto Santa"
    }
  ];
  const meme = memes[Math.min(level - 1, 9)] || memes[0];
  const randomGif = meme.gifs[Math.floor(Math.random() * meme.gifs.length)];
  return { ...meme, gif: randomGif };
};

export const getPremiumDetails = (level: number): PremiumDetails => {
  const tiers: PremiumDetails[] = [
    { 
      name: "Dirty Coal", 
      color: "#001F3F", 
      accent: "#0052FF", 
      rarity: "COMMON", 
      emoji: "🕳️", 
      points: 10,
      effect: "sparkle",
      glow: false
    },
    { 
      name: "Evergreen", 
      color: "#0052FF", 
      accent: "#00D4FF", 
      rarity: "UNCOMMON", 
      emoji: "🎄", 
      points: 25,
      effect: "pulse",
      glow: true
    },
    { 
      name: "Frostbite", 
      color: "#0038B8", 
      accent: "#5C9DFF", 
      rarity: "RARE", 
      emoji: "❄️", 
      points: 50,
      effect: "blink",
      glow: true
    },
    { 
      name: "Clockwork Deer", 
      color: "#0052FF", 
      accent: "#00D4FF", 
      rarity: "RARE", 
      emoji: "🦌", 
      points: 75,
      effect: "spin",
      glow: true
    },
    { 
      name: "Epic Elf", 
      color: "#0052FF", 
      accent: "#00D4FF", 
      rarity: "EPIC", 
      emoji: "🧝", 
      points: 100,
      effect: "glow",
      glow: true
    },
    { 
      name: "Royal Cane", 
      color: "#0052FF", 
      accent: "#00D4FF", 
      rarity: "EPIC", 
      emoji: "🍭", 
      points: 150,
      effect: "rainbow",
      glow: true
    },
    { 
      name: "Cyber Snow", 
      color: "#0052FF", 
      accent: "#00D4FF", 
      rarity: "LEGENDARY", 
      emoji: "🕶️", 
      points: 250,
      effect: "matrix",
      glow: true
    },
    { 
      name: "Aurora", 
      color: "#0052FF", 
      accent: "#00D4FF", 
      rarity: "LEGENDARY", 
      emoji: "🌈", 
      points: 400,
      effect: "aurora",
      glow: true
    },
    { 
      name: "Diamond Ice", 
      color: "#0052FF", 
      accent: "#FFFFFF", 
      rarity: "MYTHIC", 
      emoji: "💎", 
      points: 750,
      effect: "diamond",
      glow: true
    },
    { 
      name: "SANTA GENESIS", 
      color: "#0052FF", 
      accent: "#FFD700", 
      rarity: "GODLIKE", 
      emoji: "🎅", 
      points: 1000,
      effect: "santa",
      glow: true
    }
  ];
  return tiers[Math.min(level - 1, 9)] || tiers[0];
};

// ============================
// 🎯 MISSION PROGRESS (UNCHANGED)
// ============================
interface MissionProgressProps {
  level?: number;
}

export const MissionProgress = ({ level = 1 }: MissionProgressProps) => {
  const memes = useMemo(() => getLevelMemes(level), [level]);
  
  return (
    <div className="p-4 bg-gradient-to-br from-[#0052FF]/10 to-[#00D4FF]/5 rounded-2xl md:rounded-3xl border border-[#0052FF]/30 shadow-lg">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h3 className="text-base md:text-xl font-black text-white">🎯 CURRENT MISSION</h3>
        <span className="ml-auto text-xs md:text-sm text-[#00D4FF] bg-[#0052FF]/20 px-2 md:px-3 py-1 rounded-full">
          Level {level}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs md:text-sm text-white/70 mb-1">
          <span>Mission Progress</span>
          <span>{(level * 10)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#0052FF] to-[#00D4FF] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${level * 10}%` }}
            transition={{ duration: 1 }}
          ></motion.div>
        </div>
      </div>
      
      <div className="bg-black/30 p-3 rounded-xl mb-4">
        <div className="text-white font-bold mb-1 text-sm md:text-base">🎯 {memes.mission}</div>
        <div className="text-xs md:text-sm text-white/70">{memes.caption}</div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-2">
        <button className="flex-1 py-3 bg-gradient-to-r from-[#0052FF] to-[#00D4FF] text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg text-sm">
          START MISSION
        </button>
        <button className="px-3 md:px-4 py-3 bg-gradient-to-r from-[#0052FF] to-[#00D4FF] text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg text-sm">
          CLAIM REWARD
        </button>
      </div>
    </div>
  );
};

// ============================
// 🤖 AI MEME GENERATOR (UNCHANGED)
// ============================
interface AIMemeGeneratorProps {
  level: number;
}

interface MemeStyle {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface GeneratedMeme {
  template: string;
  topText: string;
  bottomText: string;
  style: string;
  timestamp: string;
}

export const AIMemeGenerator = ({ level }: AIMemeGeneratorProps) => {
  const [memeText, setMemeText] = useState<string>("");
  const [generatedMeme, setGeneratedMeme] = useState<GeneratedMeme | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [style, setStyle] = useState<string>("crypto");
  const [memeHistory, setMemeHistory] = useState<GeneratedMeme[]>([]);

  const memeStyles = useMemo<MemeStyle[]>(() => [
    { id: "crypto", name: "Crypto", emoji: "📈", color: "from-[#0052FF] to-[#00D4FF]" },
    { id: "degen", name: "Degen", emoji: "🤑", color: "from-[#0052FF] to-[#8A2BE2]" },
    { id: "santa", name: "Santa", emoji: "🎅", color: "from-[#0052FF] to-[#FF6B6B]" },
    { id: "nft", name: "NFT", emoji: "🖼️", color: "from-[#0052FF] to-[#00FFFF]" },
  ], []);

  const playAudio = useCallback((src: string, volume: number = 0.3) => {
    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch(e => console.warn('Audio play failed:', e));
    } catch (error) {
      console.warn('Audio error:', error);
    }
  }, []);

  const generateMeme = useCallback(() => {
    if (!memeText.trim()) {
      alert("Please enter a meme idea!");
      return;
    }
    
    setIsGenerating(true);
    playAudio('https://assets.mixkit.co/sfx/preview/mixkit-magic-sparkle-whoosh-1556.mp3', 0.3);
    
    setTimeout(() => {
      const memeTemplates: GeneratedMeme[] = [
        {
          template: "https://i.imgflip.com/1bij.jpg",
          topText: memeText.toUpperCase(),
          bottomText: level > 5 ? "ON BASE CHAIN" : "BASED AF",
          style,
          timestamp: new Date().toLocaleTimeString()
        },
        {
          template: "https://i.imgflip.com/26am.jpg",
          topText: "WHEN YOU MINT",
          bottomText: memeText,
          style,
          timestamp: new Date().toLocaleTimeString()
        },
        {
          template: "https://i.imgflip.com/1c1uej.jpg",
          topText: memeText,
          bottomText: "BUT IT'S ON BASE",
          style,
          timestamp: new Date().toLocaleTimeString()
        }
      ];
      
      const randomMeme = memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
      setGeneratedMeme(randomMeme);
      setMemeHistory(prev => [randomMeme, ...prev.slice(0, 4)]);
      setIsGenerating(false);
    }, 1500);
  }, [memeText, style, level, playAudio]);

  return (
    <div className="p-4 bg-gradient-to-br from-[#001F3F] to-[#0052FF]/20 rounded-2xl md:rounded-3xl border border-[#0052FF]/30 shadow-lg">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <ChainBLogo size={24} animated glowing />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00D4FF] rounded-full animate-ping"></div>
        </div>
        <h3 className="text-base md:text-xl font-black text-white">AI MEME GENERATOR</h3>
        <span className="ml-auto text-xs md:text-sm text-[#00D4FF] bg-[#0052FF]/20 px-2 py-1 rounded-full">
          Level {level}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-xs md:text-sm text-white/60 mb-2">Choose Style:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {memeStyles.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all text-sm ${
                style === s.id 
                  ? `bg-gradient-to-br ${s.color} border-2 border-white/30 scale-105` 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <span className="text-xl md:text-2xl mb-1">{s.emoji}</span>
              <span className="text-xs font-bold text-white">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <textarea
          value={memeText}
          onChange={(e) => setMemeText(e.target.value)}
          placeholder="Type your meme idea..."
          className="w-full h-28 p-3 bg-black/40 border-2 border-[#0052FF]/50 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00D4FF] resize-none text-sm"
          maxLength={200}
        />
        <div className="flex justify-between mt-2">
          <p className="text-xs text-white/40">Enter your meme idea</p>
          <span className="text-xs text-white/40">{memeText.length}/200</span>
        </div>
      </div>
      
      <button
        onClick={generateMeme}
        disabled={isGenerating || !memeText.trim()}
        className={`w-full py-3 rounded-xl font-bold text-sm md:text-base mb-4 transition-all shadow-lg ${
          isGenerating 
            ? 'bg-gray-600 cursor-not-allowed' 
            : !memeText.trim()
            ? 'bg-gray-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#0052FF] via-[#00D4FF] to-[#0052FF] hover:scale-[1.02] active:scale-95'
        }`}
      >
        {isGenerating ? '✨ GENERATING...' : '🎯 GENERATE AI MEME'}
      </button>
      
      {generatedMeme && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 rounded-xl p-3 border border-white/20 mb-4"
        >
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0052FF]/20 to-[#00D4FF]/20 rounded-lg blur-lg"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-3 rounded-lg border border-white/20">
              <div className="text-center mb-3">
                <div className="text-lg font-black text-white mb-1 uppercase">
                  {generatedMeme.topText}
                </div>
                <div className="text-base font-bold text-[#00D4FF] italic">
                  {generatedMeme.bottomText}
                </div>
              </div>
              <div className="flex justify-center">
                <div className={`text-3xl ${
                  generatedMeme.style === 'crypto' ? 'text-[#00D4FF]' :
                  generatedMeme.style === 'degen' ? 'text-[#8A2BE2]' :
                  generatedMeme.style === 'santa' ? 'text-[#FF6B6B]' :
                  'text-[#00FFFF]'
                }`}>
                  {memeStyles.find(s => s.id === generatedMeme.style)?.emoji || "🎯"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <BaseLogo size={14} />
              <span className="text-xs text-white/60">Minted on Base</span>
            </div>
            <button 
              onClick={() => {
                playAudio('https://assets.mixkit.co/sfx/preview/mixkit-camera-shutter-click-1133.mp3', 0.3);
                alert('Meme saved to your collection! 📸');
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-[#0052FF] to-[#00D4FF] text-white text-xs font-bold rounded-full hover:scale-105 active:scale-95 transition-transform"
            >
              SAVE MEME
            </button>
          </div>
        </motion.div>
      )}
      
      {memeHistory.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-white/60 mb-2">Recent Memes:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {memeHistory.slice(0, 3).map((meme, index) => (
              <div key={index} className="bg-black/30 p-2 rounded-lg">
                <div className="text-xs text-white/70 truncate">{meme.topText}</div>
                <div className="text-[10px] text-white/40">{meme.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================
// ✨ SPECIAL EFFECTS COMPONENT (UNCHANGED)
// ============================
interface NFTSpecialEffectsProps {
  effect: string;
}

const NFTSpecialEffects = ({ effect }: NFTSpecialEffectsProps) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {effect === 'sparkle' && [...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3
          }}
        />
      ))}
    </div>
  );
};

// ============================
// 📜 NFT CONTRACT CONFIGURATION
// ============================
// Replace with your actual deployed contract address
const NFT_CONTRACT_ADDRESS = '0xYourContractAddressHere';
const NFT_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "level", "type": "uint256" },
      { "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "mintNFT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

// ============================
// 🏆 NFT COLLECTION MODAL - UPDATED FOR REAL FARCASTER INTEGRATION
// ============================
interface NFTCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel?: number;
}

export const NFTCollectionModal = ({ isOpen, onClose, currentLevel = 1 }: NFTCollectionModalProps) => {
  const [selectedNFT, setSelectedNFT] = useState<number>(currentLevel);
  const [mintedNFTs, setMintedNFTs] = useState<number[]>([]);
  const [txHash, setTxHash] = useState<string>('');
  
  // Get real Farcaster context
  const { isInMiniApp, context } = useMiniApp();
  
  // Get wallet info from wagmi
  const { address, isConnected } = useAccount();
  
  // Real Farcaster user info
  const farcasterUser = context?.user;
  const userAddress = farcasterUser?.address || address;
  const username = farcasterUser?.username || 'Farcaster User';
  const userFid = farcasterUser?.fid || 'N/A';
  
  // Generate token URI for NFT metadata
  const generateTokenURI = (level: number): string => {
    const tier = getPremiumDetails(level);
    return `https://your-metadata-api.com/nft/${level}`;
  };
  
  // Prepare contract write configuration
  const { config } = usePrepareContractWrite({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_CONTRACT_ABI,
    functionName: 'mintNFT',
    args: [userAddress || '0x', selectedNFT, generateTokenURI(selectedNFT)],
    value: parseEther('0.001'), // Mint price
    enabled: !!userAddress && !mintedNFTs.includes(selectedNFT) && selectedNFT <= currentLevel,
  });
  
  // Contract write hook
  const { 
    write: mintNFTReal, 
    isLoading: isMinting, 
    data: mintData 
  } = useWriteContract(config);
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransaction({
    hash: mintData?.hash,
  });
  
  // Handle successful mint
  useEffect(() => {
    if (isConfirmed && mintData?.hash) {
      setTxHash(mintData.hash);
      setMintedNFTs(prev => [...prev, selectedNFT]);
      
      // Play success sound safely
      try {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => console.log('Audio blocked'));
      } catch (error) {
        console.log('Audio error:', error);
      }
      
      // Show success message
      setTimeout(() => {
        alert(`🎉 NFT Minted Successfully!\n\nLevel: ${selectedNFT}\nTransaction: ${mintData.hash}\n\nView on BaseScan: https://basescan.org/tx/${mintData.hash}`);
      }, 500);
    }
  }, [isConfirmed, mintData?.hash, selectedNFT]);
  
  // Safe audio play function
  const playHoverSound = useCallback(() => {
    try {
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
      audio.volume = 0.2;
      audio.load();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silent fail for autoplay restrictions
        });
      }
    } catch (error) {
      // Ignore audio errors
    }
  }, []);
  
  // Handle NFT selection
  const handleNFTSelect = (nftLevel: number) => {
    setSelectedNFT(nftLevel);
    playHoverSound();
  };
  
  // Real mint function
  const handleMint = async () => {
    if (!isInMiniApp) {
      alert('Please open this app in Farcaster (Warpcast) to mint NFTs');
      return;
    }
    
    if (!userAddress) {
      alert('No wallet address found. Make sure you\'re logged into Farcaster.');
      return;
    }
    
    if (selectedNFT > currentLevel) {
      alert(`You need to reach Level ${selectedNFT} to mint this NFT!`);
      return;
    }
    
    if (mintedNFTs.includes(selectedNFT)) {
      alert(`You already minted Level ${selectedNFT} NFT!`);
      return;
    }
    
    // Play minting sound safely
    try {
      const mintSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
      mintSound.volume = 0.3;
      mintSound.load();
      mintSound.play().catch(() => console.log('Mint sound blocked'));
    } catch (error) {
      console.log('Sound error:', error);
    }
    
    // Execute the real mint transaction
    mintNFTReal?.();
  };
  
  const nfts = Array.from({ length: 10 }, (_, i) => i + 1);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-4xl bg-gradient-to-br from-[#001F3F] to-[#0052FF] rounded-2xl md:rounded-3xl p-4 border-2 border-[#0052FF]/50 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <BaseLogo size={28} animated />
                  <ChainBLogo size={14} animated glowing className="absolute -bottom-1 -right-1" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white">🏆 NFT COLLECTION</h2>
                  <p className="text-xs text-[#00D4FF]/80">Mint exclusive NFTs on Base Chain</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-gradient-to-r from-[#FF4757] to-[#FF6B6B] text-white rounded-full font-bold hover:scale-110 transition-transform self-end"
                onMouseEnter={playHoverSound}
              >
                ✕
              </button>
            </div>

            {/* REAL Farcaster User Info Section */}
            {isInMiniApp && farcasterUser ? (
              <div className="mb-6 p-4 bg-gradient-to-r from-[#0052FF]/20 to-purple-500/10 rounded-xl border border-[#0052FF]/30">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-white">@{username}</div>
                      <div className="text-xs text-gray-300">
                        FID: {userFid} • {userAddress?.substring(0, 6)}...{userAddress?.substring(userAddress.length - 4)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                    ✓ Connected via Farcaster
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/30">
                <div className="text-center">
                  <div className="text-yellow-400 text-lg mb-2">⚠️ Not in Farcaster</div>
                  <p className="text-sm text-yellow-300">
                    Open this app in Farcaster (Warpcast) to mint NFTs with your wallet
                  </p>
                </div>
              </div>
            )}

            {/* Transaction Status */}
            {(isMinting || isConfirming || txHash) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-gradient-to-r from-[#0052FF]/30 to-[#00D4FF]/20 rounded-xl border border-[#00D4FF]/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isMinting ? 'bg-yellow-400 animate-pulse' :
                    isConfirming ? 'bg-blue-400 animate-pulse' :
                    'bg-green-400'
                  }`}></div>
                  <div className="text-sm font-bold text-white">
                    {isMinting ? '🔄 Confirm in Wallet...' :
                     isConfirming ? '⏳ Confirming Transaction...' :
                     '✅ Transaction Confirmed!'}
                  </div>
                </div>
                {txHash && (
                  <a 
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#00D4FF] hover:underline block truncate"
                  >
                    View on BaseScan: {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                  </a>
                )}
              </motion.div>
            )}

            {/* NFT Grid */}
            <div className="mb-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 p-2">
                {nfts.map(nft => {
                  const nftTier = getPremiumDetails(nft);
                  const isUnlocked = nft <= currentLevel;
                  const isMinted = mintedNFTs.includes(nft);

                  return (
                    <motion.div
                      key={nft}
                      onClick={() => handleNFTSelect(nft)}
                      onMouseEnter={playHoverSound}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all overflow-hidden h-[100px] sm:h-[120px] ${
                        selectedNFT === nft
                          ? 'border-[#00D4FF] bg-gradient-to-br from-[#0052FF]/40 to-[#00D4FF]/20 scale-105 shadow-2xl shadow-[#00D4FF]/30'
                          : 'border-[#0052FF]/30 bg-gradient-to-br from-black/40 to-black/20 hover:border-[#00D4FF]/50'
                      }`}
                    >
                      <div className="text-center h-full flex flex-col justify-center">
                        <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{nftTier.emoji}</div>
                        <div className="text-xs font-bold text-white mb-1 truncate">{nftTier.name}</div>
                        <div className={`text-[10px] font-bold px-1 py-0.5 rounded-full mb-1 ${
                          nftTier.rarity === 'COMMON' ? 'bg-gray-600 text-gray-200' :
                          nftTier.rarity === 'UNCOMMON' ? 'bg-green-600 text-green-200' :
                          nftTier.rarity === 'RARE' ? 'bg-blue-600 text-blue-200' :
                          nftTier.rarity === 'EPIC' ? 'bg-purple-600 text-purple-200' :
                          nftTier.rarity === 'LEGENDARY' ? 'bg-orange-600 text-orange-200' :
                          nftTier.rarity === 'MYTHIC' ? 'bg-pink-600 text-pink-200' :
                          'bg-yellow-600 text-yellow-200'
                        }`}>
                          {nftTier.rarity}
                        </div>
                        <div className="text-[10px] text-[#FFD166] font-bold">🔥 {nftTier.points} pts</div>
                      </div>

                      {isMinted && (
                        <div className="absolute top-1 right-1 bg-gradient-to-r from-[#00D4FF] to-[#0052FF] rounded-full w-5 h-5 flex items-center justify-center">
                          <span className="text-xs">✓</span>
                        </div>
                      )}

                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xl mb-1">🔒</div>
                            <span className="text-xs font-bold text-white">Level {nft}</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Selected NFT Details and REAL Mint Button */}
            <div className="bg-gradient-to-r from-[#001F3F] to-[#0052FF]/20 p-4 rounded-xl border border-[#0052FF]/30 mb-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-black text-white mb-1">
                    {getPremiumDetails(selectedNFT).name} #{selectedNFT.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-white/70">
                    Rarity: <span style={{ color: getPremiumDetails(selectedNFT).accent }}>
                      {getPremiumDetails(selectedNFT).rarity}
                    </span>
                    <span className="mx-2">•</span>
                    Mint Cost: <span className="text-[#FFD166] font-bold">0.001 ETH</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleMint}
                    disabled={isMinting || isConfirming || selectedNFT > currentLevel || mintedNFTs.includes(selectedNFT) || !isInMiniApp}
                    className={`px-4 md:px-6 py-3 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 ${
                      selectedNFT > currentLevel || mintedNFTs.includes(selectedNFT) || isMinting || isConfirming || !isInMiniApp
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#0052FF] to-[#00D4FF] hover:scale-105'
                    } transition-transform shadow-lg min-w-[140px]`}
                  >
                    {isMinting || isConfirming ? (
                      <>
                        <span className="animate-spin">⟳</span>
                        {isMinting ? 'CONFIRM...' : 'CONFIRMING...'}
                      </>
                    ) : mintedNFTs.includes(selectedNFT) ? (
                      '✅ MINTED'
                    ) : selectedNFT > currentLevel ? (
                      '🔒 LOCKED'
                    ) : !isInMiniApp ? (
                      'OPEN IN FARCASTER'
                    ) : (
                      '🎁 MINT NFT'
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      const meme = getLevelMemes(selectedNFT);
                      alert(`📱 Share this NFT!\n\n${meme.caption}\n\nLevel: ${selectedNFT}\nRarity: ${getPremiumDetails(selectedNFT).rarity}\nPoints: ${getPremiumDetails(selectedNFT).points}\n\nShare on Base chain!`);
                    }}
                    className="px-4 py-3 bg-gradient-to-r from-[#0052FF] to-[#8A2BE2] text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg text-sm"
                  >
                    📤 SHARE
                  </button>
                </div>
              </div>
            </div>

            {/* Gas Fee Estimation */}
            <div className="text-center text-xs text-white/50">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BaseLogo size={12} />
                <span>Powered by Base Network • Real blockchain transactions</span>
              </div>
              <div>Minted NFTs are ERC-721 tokens stored on Base blockchain</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================
// 🎨 3D CUBE COMPONENT - COMPLETE (UNCHANGED)
// ============================
interface NFT3DCubeProps {
  tier: PremiumDetails;
  level: number;
  memes: MemeData;
  isHovered: boolean;
  rotation: { x: number; y: number };
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const NFT3DCube = ({ tier, level, memes, isHovered, rotation, onMouseMove, onMouseEnter, onMouseLeave, onClick }: NFT3DCubeProps) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const cubeSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 144;
  const faces = [
    { transform: `translateZ(${cubeSize/2}px)`, color: tier.color, accent: tier.accent },
    { transform: `rotateY(180deg) translateZ(${cubeSize/2}px)`, color: tier.color, accent: tier.accent },
    { transform: `rotateY(90deg) translateZ(${cubeSize/2}px)`, color: tier.accent, accent: tier.color },
    { transform: `rotateY(-90deg) translateZ(${cubeSize/2}px)`, color: tier.accent, accent: tier.color },
    { transform: `rotateX(90deg) translateZ(${cubeSize/2}px)`, color: tier.color, accent: tier.accent },
    { transform: `rotateX(-90deg) translateZ(${cubeSize/2}px)`, color: tier.color, accent: tier.accent },
  ];

  return (
    <motion.div
      className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 preserve-3d cursor-pointer"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      animate={{
        rotateX: isHovered ? rotation.x : 15,
        rotateY: isHovered ? rotation.y : [0, 360],
        scale: isHovered ? 1.1 : 1
      }}
      transition={{
        rotateY: isHovered ? { type: 'spring', stiffness: 300 } : { duration: 20, repeat: Infinity, ease: "linear" },
        scale: { type: 'spring', stiffness: 400, damping: 10 }
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {isClient && <NFTSpecialEffects effect={tier.effect} />}
      
      {/* COMPLETE 3D CUBE FACES */}
      {faces.map((face, index) => (
        <div
          key={index}
          className="absolute inset-0 flex items-center justify-center border-2 border-[#0052FF]/40 backdrop-blur-xl"
          style={{
            transform: face.transform,
            backgroundColor: `${face.color}80`,
            opacity: 0.95,
            backfaceVisibility: 'hidden',
            boxShadow: `inset 0 0 30px ${face.accent}40, 0 0 20px ${face.color}30`
          }}
        >
          {index === 0 && (
            <div className="flex flex-col items-center">
              <motion.div
                className="text-4xl md:text-6xl mb-2"
                animate={tier.glow ? {
                  filter: ['drop-shadow(0 0 8px currentColor)', 'drop-shadow(0 0 16px currentColor)', 'drop-shadow(0 0 8px currentColor)']
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {tier.emoji}
              </motion.div>
              <div className="text-[10px] font-black bg-[#0052FF]/30 px-2 py-0.5 rounded-full text-white/90">
                #{level.toString().padStart(2, '0')}
              </div>
            </div>
          )}
          
          {/* Other faces patterns */}
          {index === 2 && (
            <div className="text-white/40 text-3xl font-black tracking-widest rotate-45">
              BASE
            </div>
          )}
          
          {index === 3 && (
            <div className="text-white/40 text-3xl font-black tracking-widest -rotate-45">
              CHAIN B
            </div>
          )}
          
          {index === 4 && (
            <div className="text-[#00D4FF]/40 text-2xl font-black">
              🎄
            </div>
          )}
          
          {index === 5 && (
            <div className="text-[#00D4FF]/40 text-2xl font-black">
              ❄️
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
};

// ============================
// 🎯 ACTION BUTTONS (UNCHANGED)
// ============================
interface ActionButtonsProps {
  onMemeGeneratorClick: () => void;
  onGameClick: () => void;
  onCollectionClick: () => void;
}

const ActionButtons = ({
  onMemeGeneratorClick,
  onGameClick,
  onCollectionClick
}: ActionButtonsProps) => {
  const playAudio = useCallback((src: string, volume: number = 0.2) => {
    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch(e => console.warn('Audio play failed:', e));
    } catch (error) {
      console.warn('Audio error:', error);
    }
  }, []);

  const buttons = [
    {
      label: "Meme AI",
      icon: "🎨",
      onClick: onMemeGeneratorClick,
      gradient: "from-[#0052FF] to-[#00D4FF]",
      mobileLabel: "AI"
    },
    {
      label: "Play Game",
      icon: "🎮",
      onClick: onGameClick,
      gradient: "from-[#0052FF] to-[#8A2BE2]",
      mobileLabel: "Play"
    },
    {
      label: "Collection",
      icon: "🏆",
      onClick: onCollectionClick,
      gradient: "from-[#0052FF] to-[#00FFFF]",
      mobileLabel: "NFTs"
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className={`px-3 py-2 bg-gradient-to-r ${button.gradient} text-white text-xs font-bold rounded-full hover:scale-105 active:scale-95 transition-transform flex items-center gap-1 shadow-lg`}
          onMouseEnter={() => playAudio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3', 0.2)}
        >
          <span className="text-sm">{button.icon}</span>
          <span className="hidden sm:inline">{button.label}</span>
          <span className="sm:hidden text-xs">{button.mobileLabel}</span>
        </button>
      ))}
    </div>
  );
};

// ============================
// 🏷️ BRAND HEADER (UNCHANGED)
// ============================
interface BrandHeaderProps {
  level: number;
}

const BrandHeader = ({ level }: BrandHeaderProps) => (
  <div className="absolute top-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#0052FF] to-[#0038B8] rounded-full shadow-[0_0_15px_rgba(0,82,255,0.7)] border border-white/20 backdrop-blur-md">
    <BaseLogo size={10} animated />
    <span className="text-[8px] font-black tracking-widest text-white">BASE</span>
    <div className="h-2 w-[1px] bg-white/30"></div>
    <ChainBLogo size={10} animated glowing={level > 5} />
    <span className="text-[8px] font-black tracking-widest text-white">CHAIN B</span>
  </div>
);

// ============================
// 💬 MEME TEXT DISPLAY (UNCHANGED)
// ============================
interface MemeTextDisplayProps {
  memes: MemeData;
  textIndex: number;
  onShowMeme: () => void;
}

const MemeTextDisplay = ({ memes, textIndex, onShowMeme }: MemeTextDisplayProps) => (
  <motion.div
    key={textIndex}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-4 px-3 py-2 bg-gradient-to-r from-[#0052FF]/20 to-[#00D4FF]/20 border-2 border-[#00D4FF]/30 rounded-xl backdrop-blur-xl w-[90%] max-w-[300px] text-center shadow-lg"
  >
    <div className="flex items-center justify-center gap-2 mb-1">
      <span className="text-xs">💡</span>
      <p className="text-xs font-bold text-white truncate">"{memes.texts[textIndex]}"</p>
    </div>
    <button 
      onClick={onShowMeme}
      className="text-[10px] text-white/70 hover:text-white hover:scale-110 transition-transform"
    >
      👆 Tap to view full meme
    </button>
  </motion.div>
);

// ============================
// 📊 RARITY BADGE (UNCHANGED)
// ============================
interface RarityBadgeProps {
  tier: PremiumDetails;
  level: number;
}

const RarityBadge = ({ tier, level }: RarityBadgeProps) => (
  <div className="absolute bottom-4 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-black/60 to-black/40 rounded-xl border border-[#0052FF]/30 backdrop-blur-md">
    <div className="flex flex-col items-center">
      <span className="text-[8px] text-gray-300 uppercase font-bold">RARITY</span>
      <span className="text-xs font-black" style={{ color: tier.accent }}>
        {tier.rarity}
      </span>
    </div>
    <div className="h-4 w-[1px] bg-gradient-to-b from-transparent via-[#0052FF] to-transparent" />
    <div className="flex flex-col items-center">
      <span className="text-[8px] text-gray-300 uppercase font-bold">COLLECTION</span>
      <span className="text-xs font-black text-white">#{level.toString().padStart(2, '0')}</span>
    </div>
    <div className="h-4 w-[1px] bg-gradient-to-b from-transparent via-[#00D4FF] to-transparent" />
    <div className="flex flex-col items-center">
      <span className="text-[8px] text-gray-300 uppercase font-bold">POINTS</span>
      <span className="text-xs font-black text-[#FFD166]">🔥 {tier.points}</span>
    </div>
  </div>
);

// ============================
// 🎭 MEME MODAL (UNCHANGED)
// ============================
interface MemeModalProps {
  showMeme: boolean;
  setShowMeme: (show: boolean) => void;
  memes: MemeData;
  level: number;
}

const MemeModal = ({ showMeme, setShowMeme, memes, level }: MemeModalProps) => (
  <AnimatePresence>
    {showMeme && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
        onClick={() => setShowMeme(false)}
      >
        <div className="relative w-full max-w-lg">
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl md:rounded-2xl p-4 border-2 border-white/20">
            <img 
              src={memes.gif} 
              alt="meme" 
              className="w-full max-w-xs mx-auto rounded-lg md:rounded-xl border-4 border-[#0052FF] mb-4 object-cover shadow-[0_0_20px_rgba(0,82,255,0.8)]"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'%3E%3Crect width='320' height='320' fill='%230052FF'/%3E%3Ctext x='160' y='160' font-size='48' fill='white' text-anchor='middle' dominant-baseline='middle'%3E🎅%3C/text%3E%3C/svg%3E";
              }}
            />
            <h2 className="text-lg md:text-xl font-black text-white mb-2 text-center">
              {memes.caption}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <BaseLogo size={14} animated />
              <ChainBLogo size={14} animated />
              <p className="text-[#00D4FF] text-xs font-bold">
                🔐 VERIFIED ON BASE • LEVEL {level}
              </p>
            </div>
            <button 
              onClick={() => setShowMeme(false)}
              className="w-full py-3 bg-gradient-to-r from-[#0052FF] to-[#00D4FF] text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-transform border-2 border-white/20 text-sm"
            >
              ✨ CLOSE MEME
            </button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ============================
// 🎄 MAIN 3D NFT COMPONENT - UPDATED WITH REAL PROVIDER
// ============================
interface DripmasNFT3DProps {
  level?: number;
  currentLevel?: number;
}

export const DripmasNFT3D = ({ level = 1, currentLevel = 1 }: DripmasNFT3DProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showMeme, setShowMeme] = useState<boolean>(false);
  const [textIndex, setTextIndex] = useState<number>(0);
  const [showMemeGeneratorModal, setShowMemeGeneratorModal] = useState<boolean>(false);
  const [showGameModal, setShowGameModal] = useState<boolean>(false);
  const [showNFTCollectionModal, setShowNFTCollectionModal] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get Farcaster context
  const { isInMiniApp, context } = useMiniApp();
  
  const memes = useMemo(() => getLevelMemes(level), [level]);
  const tier = useMemo(() => getPremiumDetails(level), [level]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered || !containerRef.current || window.innerWidth < 768) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 20;
    const y = (e.clientX - rect.left - rect.width / 2) / 20;
    setRotation({ x: -x, y });
  }, [isHovered]);

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setTextIndex((prev) => (prev + 1) % memes.texts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, memes.texts.length]);

  const playAudio = useCallback((src: string, volume: number = 0.3) => {
    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch(e => console.warn('Audio play failed:', e));
    } catch (error) {
      console.warn('Audio error:', error);
    }
  }, []);

  if (!isClient) {
    return (
      <div className="relative w-full h-[350px] flex flex-col items-center justify-center bg-slate-950 overflow-hidden rounded-xl md:rounded-2xl border border-[#0052FF]/30 shadow-lg">
        <div className="w-28 h-28 bg-gradient-to-br from-[#001F3F] to-[#0052FF]/20 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Action Buttons */}
      <ActionButtons
        onMemeGeneratorClick={() => setShowMemeGeneratorModal(true)}
        onGameClick={() => setShowGameModal(true)}
        onCollectionClick={() => {
          playAudio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3', 0.3);
          setShowNFTCollectionModal(true);
        }}
      />

      {/* NFT Card Container */}
      <div className="relative w-full h-[350px] flex flex-col items-center justify-center bg-gradient-to-br from-[#001F3F] to-[#0052FF]/10 overflow-hidden rounded-xl md:rounded-2xl border border-[#0052FF]/30 shadow-lg">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(0,82,255,0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(0,212,255,0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(0,82,255,0.1) 0%, transparent 50%)',
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Brand Header */}
        <BrandHeader level={level} />

        {/* 3D Cube */}
        <div ref={containerRef} className="relative flex-1 flex items-center justify-center" style={{ perspective: 800 }}>
          <NFT3DCube
            tier={tier}
            level={level}
            memes={memes}
            isHovered={isHovered}
            rotation={rotation}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setRotation({ x: 0, y: 0 }); }}
            onClick={() => setShowMeme(true)}
          />
        </div>

        {/* Meme Text Display */}
        <MemeTextDisplay
          memes={memes}
          textIndex={textIndex}
          onShowMeme={() => setShowMeme(true)}
        />

        {/* Rarity Badge */}
        <RarityBadge tier={tier} level={level} />
      </div>

      {/* Modals */}
      <MemeModal
        showMeme={showMeme}
        setShowMeme={setShowMeme}
        memes={memes}
        level={level}
      />

      <AnimatePresence>
        {showMemeGeneratorModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setShowMemeGeneratorModal(false)}
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <AIMemeGenerator level={level} />
              <button
                onClick={() => setShowMemeGeneratorModal(false)}
                className="mt-4 w-full py-3 bg-gradient-to-r from-[#0052FF] to-[#00D4FF] text-white rounded-xl font-bold hover:opacity-90"
              >
                🚀 CLOSE GENERATOR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGameModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setShowGameModal(false)}
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <ChainBGame />
              <button
                onClick={() => setShowGameModal(false)}
                className="mt-4 w-full py-3 bg-gradient-to-r from-[#0052FF] to-[#00D4FF] text-white rounded-xl font-bold hover:opacity-90"
              >
                🎮 CLOSE GAME
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NFTCollectionModal
        isOpen={showNFTCollectionModal}
        onClose={() => setShowNFTCollectionModal(false)}
        currentLevel={currentLevel}
      />
    </div>
  );
};

export default DripmasNFT3D;
