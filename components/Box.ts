'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, ReactElement } from 'react';
import { NFT_COMPONENTS } from './NFTAvatars';

// Define props interface
interface BoxProps {
  id: number;
  index?: number;
  onClick?: (id: number) => void;
  isFlipped: boolean;
  isMatched: boolean;
  value: number;
  nftComponent?: React.ComponentType;
  isHintRevealed?: boolean;
  funMode?: boolean;
  level?: number;
}

// Level color configuration interface
interface LevelColors {
  [key: number]: {
    primary: string;
    secondary: string;
    glow: string;
  };
}

// Define NFT Component type
interface NFTComponentType {
  Component: React.ComponentType;
}

export default function Box({ 
  id, 
  index = 0, 
  onClick, 
  isFlipped, 
  isMatched, 
  value, 
  nftComponent, 
  isHintRevealed = false, 
  funMode = false,
  level = 1 
}: BoxProps) {
  const [showFlip, setShowFlip] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Level-based colors with proper typing
  const levelColors: LevelColors = {
    1: { primary: '#0052FF', secondary: '#00D4FF', glow: 'rgba(0, 82, 255, 0.5)' },
    2: { primary: '#FF0080', secondary: '#FF6B9D', glow: 'rgba(255, 0, 128, 0.5)' },
    3: { primary: '#00CC88', secondary: '#33FFB3', glow: 'rgba(0, 204, 136, 0.5)' },
    4: { primary: '#FF6B00', secondary: '#FFA64D', glow: 'rgba(255, 107, 0, 0.5)' },
    5: { primary: '#9C27B0', secondary: '#E040FB', glow: 'rgba(156, 39, 176, 0.5)' }
  };

  // Safely get colors based on level
  const currentLevel = Math.min(Math.max(level, 1), 5);
  const colors = levelColors[currentLevel] || levelColors[1];

  useEffect(() => {
    if (isMatched || isHintRevealed || isFlipped) {
      setShowFlip(true);
    } else {
      setShowFlip(false);
    }
  }, [isMatched, isHintRevealed, isFlipped]);

  const handleClick = (): void => {
    if (!isMatched && !isFlipped && onClick) {
      setShowFlip(true);
      onClick(id);
    }
  };

  // Type-safe NFT Component renderer
  const renderNFTComponent = (): ReactElement => {
    // Special case for Santa card (value 999)
    if (value === 999) {
      return (
        <motion.div
          className="w-full h-full flex items-center justify-center text-7xl"
          animate={{ 
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎅
        </motion.div>
      );
    }

    // Use custom nftComponent if provided
    if (nftComponent) {
      const CustomComponent = nftComponent;
      return <CustomComponent />;
    }

    // Use default NFT components
    // Check if NFT_COMPONENTS exists and has elements
    if (!NFT_COMPONENTS || NFT_COMPONENTS.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center text-3xl">
          🎨
        </div>
      );
    }

    // Safely access the NFT component
    const nftIndex = Math.abs(value) % NFT_COMPONENTS.length;
    const NFTItem = NFT_COMPONENTS[nftIndex] as NFTComponentType;
    
    if (!NFTItem || !NFTItem.Component) {
      return (
        <div className="w-full h-full flex items-center justify-center text-3xl">
          🎨
        </div>
      );
    }

    const NFTComponent = NFTItem.Component;
    return <NFTComponent />;
  };

  return (
    <motion.div
      className="relative w-full aspect-square cursor-pointer perspective"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1
      }}
      transition={{ 
        delay: index * 0.02, 
        duration: 0.4
      }}
      whileHover={!isMatched && !isFlipped ? { 
        scale: 1.08, 
        y: -8
      } : {}}
      whileTap={!isMatched && !isFlipped ? { scale: 0.92 } : {}}
    >
      {/* Outer Glow Effect */}
      <motion.div
        className="absolute -inset-2 rounded-[2.2rem] z-0"
        animate={{
          background: isMatched 
            ? `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`
            : isHovered && !isFlipped
            ? `radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)`
            : 'transparent'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Main Card Container */}
      <motion.div
        className="w-full h-full relative"
        animate={{ 
          rotateY: showFlip ? 180 : 0
        }}
        transition={{ 
          duration: 0.6
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* FRONT SIDE - Fancy Glass Effect */}
        <div
          className="absolute w-full h-full rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden border border-white/30 dark:border-slate-600/50"
          style={{
            backfaceVisibility: 'hidden',
            background: `linear-gradient(135deg, rgba(0,82,255,0.15) 0%, rgba(0,212,255,0.1) 100%)`
          }}
        >
          {/* Animated Glass Texture */}
          <div className="absolute inset-0 backdrop-blur-xl saturate-150" />

          {/* Dynamic Shine Effect */}
          <motion.div
            className="absolute inset-[-200%] bg-gradient-to-r from-transparent via-white/30 dark:via-slate-300/20 to-transparent rotate-12"
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.1
            }}
          />

          {/* Frosted Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 dark:from-slate-300/5 dark:to-slate-400/10" />

          {/* Central Question Mark with Glow */}
          <motion.div
            className="relative z-20"
            animate={isHovered && !isMatched && !isFlipped ? {
              scale: [1, 1.1, 1]
            } : {}}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <span className="text-6xl md:text-7xl font-black text-white/90 dark:text-slate-100 filter drop-shadow-[0_0_20px_rgba(0,82,255,0.7)]">
              ?
            </span>
          </motion.div>

          {/* Corner Accents */}
          <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-70" />
          <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-70" />
          <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-70" />
          <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-70" />

          {/* Glass Reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent" />
        </div>

        {/* BACK SIDE - Premium Revealed Card */}
        <div
          className="absolute w-full h-full rounded-3xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-white/40"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
            background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}10 100%)`
          }}
        >
          {/* Premium Glass Background */}
          <div className="absolute inset-0 backdrop-blur-2xl saturate-200" />
          
          {/* Central Glow */}
          <div className="absolute w-28 h-28 bg-white/40 rounded-full blur-2xl" />

          {/* NFT Content Container */}
          <motion.div
            className="relative z-30 w-full h-full flex items-center justify-center p-5"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1
            }}
            transition={{ 
              delay: 0.15,
              duration: 0.6
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {renderNFTComponent()}
              
              {/* Mini Border Effect */}
              <div className="absolute inset-2 rounded-2xl border border-white/20" />
            </div>
          </motion.div>

          {/* Floating Particles for Matched Cards */}
          {isMatched && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white"
                  initial={{ 
                    x: '50%', 
                    y: '50%', 
                    scale: 0, 
                    opacity: 1 
                  }}
                  animate={{ 
                    x: `${50 + Math.cos(i * 120 * Math.PI/180) * 40}%`,
                    y: `${50 + Math.sin(i * 120 * Math.PI/180) * 40}%`,
                    scale: [0, 1, 0],
                    opacity: [1, 0.5, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </>
          )}

          {/* Top Reflection */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/40 to-transparent opacity-30" />
        </div>
      </motion.div>

      {/* MATCHED GLOW EFFECT */}
      {isMatched && (
        <>
          <motion.div
            className="absolute -inset-1 rounded-[2rem] z-[-1]"
            style={{ 
              background: `radial-gradient(circle at center, ${colors.primary} 0%, transparent 70%)`,
              filter: 'blur(10px)'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.8, 1],
              scale: [1, 1.1]
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Floating Stars */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute text-xl"
              initial={{ 
                x: '50%', 
                y: '50%', 
                scale: 0, 
                opacity: 0 
              }}
              animate={{ 
                x: `${50 + Math.cos(i * 180 * Math.PI/180) * 60}%`,
                y: `${50 + Math.sin(i * 180 * Math.PI/180) * 60}%`,
                scale: [0, 1.5, 0],
                opacity: [1, 0.5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              ⭐
            </motion.div>
          ))}
        </>
      )}

      {/* HINT REVEAL GLOW */}
      {isHintRevealed && !isMatched && (
        <motion.div
          className="absolute -inset-1 rounded-[2rem] border-2 border-yellow-400 z-[-1]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: [0.7, 1],
            scale: [1, 1.05]
          }}
          transition={{ 
            duration: 0.8, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ filter: 'blur(4px)' }}
        />
      )}
    </motion.div>
  );
}