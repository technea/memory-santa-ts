'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ============================
// 🎵 AUDIO HOOK
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

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; 
      audioRef.current.play().catch(e => console.warn("Audio blocked by browser:", e));
    }
  };

  return play; 
};

// ============================
// 🎨 LOGO COMPONENTS
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
// 🎮 GAME COMPONENT
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
// 📊 DATA UTILITIES
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
// 🎯 MISSION PROGRESS
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
// 🤖 AI MEME GENERATOR
// ============================
interface AIMemeGeneratorProps {
  level: number;
}

