'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DripmasNFT3D from './NFT3DCollection';

interface LevelInfo {
  level: number;
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  color: string;
  icon: string;
  points: number;
}

export default function NFTShowcasePage() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedLevelInfo, setSelectedLevelInfo] = useState<LevelInfo | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Level data with details
  const levelsInfo: LevelInfo[] = [
    { level: 1, title: "Base Beginner", description: "First steps into onchain gaming", rarity: 'common', color: 'from-blue-400 to-cyan-500', icon: '🎁', points: 100 },
    { level: 2, title: "Memory Master", description: "Matched your first 5 pairs", rarity: 'common', color: 'from-green-400 to-emerald-500', icon: '🧠', points: 250 },
    { level: 3, title: "Chain Champion", description: "Level 3 completed with 3 stars", rarity: 'uncommon', color: 'from-purple-400 to-pink-500', icon: '⚡', points: 500 },
    { level: 4, title: "Decentralized Duelist", description: "First blockchain transaction", rarity: 'uncommon', color: 'from-yellow-400 to-orange-500', icon: '🛡️', points: 1000 },
    { level: 5, title: "Web3 Warrior", description: "Halfway through the journey", rarity: 'rare', color: 'from-red-400 to-rose-500', icon: '⚔️', points: 2000 },
    { level: 6, title: "NFT Navigator", description: "Collected your first 3 NFTs", rarity: 'rare', color: 'from-indigo-400 to-violet-500', icon: '🧭', points: 4000 },
    { level: 7, title: "Blockchain Baron", description: "Mastered Base ecosystem", rarity: 'epic', color: 'from-teal-400 to-cyan-500', icon: '👑', points: 8000 },
    { level: 8, title: "Santa's Elite", description: "Gifted 10+ presents", rarity: 'epic', color: 'from-amber-400 to-yellow-500', icon: '🎅', points: 16000 },
    { level: 9, title: "Winter Wizard", description: "Completed all puzzles", rarity: 'legendary', color: 'from-pink-400 to-rose-500', icon: '🧙', points: 32000 },
    { level: 10, title: "Crypto Santa", description: "Ultimate onchain achievement", rarity: 'legendary', color: 'from-emerald-400 to-green-500', icon: '👑', points: 64000 }
  ];

  // Get total points
  const totalPoints = levelsInfo.reduce((sum, level) => sum + level.points, 0);

  // Check if we're on client for animations
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLevelSelect = (level: number): void => {
    setSelectedLevel(level);
    const info = levelsInfo.find(l => l.level === level) || null;
    setSelectedLevelInfo(info);
  };

  const handleCloseModal = (): void => {
    setSelectedLevel(null);
    setSelectedLevelInfo(null);
  };

  const handleKeyPress = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && selectedLevel !== null) {
      handleCloseModal();
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedLevel]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse mx-auto mb-4" />
          <div className="text-white font-bold">Loading NFT Collection...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 sm:mb-12 md:mb-16"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tighter">
          <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            NFT COLLECTION
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          Collect exclusive NFTs for each level completed. Each NFT represents your onchain achievements on Base.
        </p>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-8">
          <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800">
            <div className="text-2xl font-bold text-white">{levelsInfo.length}</div>
            <div className="text-xs text-gray-400">Total NFTs</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800">
            <div className="text-2xl font-bold text-emerald-400">{totalPoints.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Total Points</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800">
            <div className="text-2xl font-bold text-yellow-400">{levelsInfo.filter(l => l.rarity === 'legendary').length}</div>
            <div className="text-xs text-gray-400">Legendary</div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Grid of Levels */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
        {levelsInfo.map((levelInfo: LevelInfo) => (
          <motion.button
            key={levelInfo.level}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleLevelSelect(levelInfo.level)}
            className="relative group focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-[2.5rem]"
            aria-label={`View Level ${levelInfo.level} NFT: ${levelInfo.title}`}
          >
            {/* Outer Glow Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${levelInfo.color} rounded-[2.5rem] blur opacity-0 group-hover:opacity-75 transition-all duration-500`} />
            
            {/* Main Card */}
            <div className="relative aspect-square bg-gray-900/80 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center backdrop-blur-xl overflow-hidden shadow-xl transition-all duration-300 group-hover:border-white/30">
              
              {/* Card Background */}
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${levelInfo.color}`} />
              
              {/* Level Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  levelInfo.rarity === 'common' ? 'bg-gray-600 text-gray-300' :
                  levelInfo.rarity === 'uncommon' ? 'bg-green-600 text-green-300' :
                  levelInfo.rarity === 'rare' ? 'bg-blue-600 text-blue-300' :
                  levelInfo.rarity === 'epic' ? 'bg-purple-600 text-purple-300' :
                  'bg-yellow-600 text-yellow-300'
                }`}>
                  {levelInfo.rarity.toUpperCase()}
                </span>
              </div>
              
              {/* Icon Animation */}
              <motion.div 
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="text-5xl md:text-6xl mb-3"
              >
                {levelInfo.icon}
              </motion.div>
              
              {/* Level Text */}
              <div className="text-center z-10 px-2">
                <span className="font-black text-xl tracking-widest text-white">LVL {levelInfo.level}</span>
                <p className="text-xs text-gray-400 mt-1 truncate max-w-full">{levelInfo.title}</p>
              </div>
              
              {/* Points Badge */}
              <div className="absolute bottom-4">
                <span className="px-2 py-1 rounded-lg bg-black/50 text-xs text-yellow-400 font-bold">
                  {levelInfo.points.toLocaleString()} pts
                </span>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="max-w-2xl mx-auto mt-12 p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
        <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
          <span>📊</span> Rarity Distribution
        </h3>
        <div className="flex flex-wrap gap-2">
          {['common', 'uncommon', 'rare', 'epic', 'legendary'].map((rarity) => (
            <div key={rarity} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                rarity === 'common' ? 'bg-gray-500' :
                rarity === 'uncommon' ? 'bg-green-500' :
                rarity === 'rare' ? 'bg-blue-500' :
                rarity === 'epic' ? 'bg-purple-500' :
                'bg-yellow-500'
              }`} />
              <span className="text-xs text-gray-400 capitalize">{rarity}</span>
              <span className="text-xs text-gray-500">
                ({levelsInfo.filter(l => l.rarity === rarity).length})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for 3D View */}
      <AnimatePresence>
        {selectedLevel && selectedLevelInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-lg"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              className="relative w-full max-w-6xl h-[90vh] bg-gray-900 rounded-[3rem] border border-white/20 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.5)]"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={handleCloseModal}
                className="absolute top-6 right-6 z-[210] bg-gray-800/80 hover:bg-red-600 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 border border-white/10"
                aria-label="Close NFT view"
              >
                <span className="text-xl">✕</span>
              </button>

              <div className="w-full h-full flex flex-col lg:flex-row p-6 md:p-8">
                {/* Left Panel - NFT Info */}
                <div className="lg:w-2/5 p-4 md:p-8 flex flex-col">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-3 rounded-2xl bg-gradient-to-r ${selectedLevelInfo.color}`}>
                          <span className="text-3xl">{selectedLevelInfo.icon}</span>
                        </div>
                        <div>
                          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter">
                            LEVEL {selectedLevelInfo.level}
                          </h2>
                          <p className="text-gray-400 font-mono tracking-widest text-xs uppercase">
                            {selectedLevelInfo.rarity.toUpperCase()} NFT
                          </p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{selectedLevelInfo.title}</h3>
                      <p className="text-gray-300 mb-6">{selectedLevelInfo.description}</p>
                    </div>

                    {/* NFT Stats */}
                    <div className="space-y-4 mb-8">
                      <div className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Points Value</span>
                          <span className="text-2xl font-bold text-yellow-400">
                            {selectedLevelInfo.points.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Rarity</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            selectedLevelInfo.rarity === 'common' ? 'bg-gray-600 text-gray-300' :
                            selectedLevelInfo.rarity === 'uncommon' ? 'bg-green-600 text-green-300' :
                            selectedLevelInfo.rarity === 'rare' ? 'bg-blue-600 text-blue-300' :
                            selectedLevelInfo.rarity === 'epic' ? 'bg-purple-600 text-purple-300' :
                            'bg-yellow-600 text-yellow-300'
                          }`}>
                            {selectedLevelInfo.rarity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Unlocked At</span>
                          <span className="text-lg font-bold text-cyan-400">
                            Level {selectedLevelInfo.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button 
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:opacity-90 transition-opacity"
                        onClick={() => {
                          const text = `🎁 Level ${selectedLevelInfo.level} NFT: ${selectedLevelInfo.title} - ${selectedLevelInfo.description}`;
                          navigator.clipboard.writeText(text).then(() => {
                            alert('NFT info copied to clipboard! 📋');
                          });
                        }}
                      >
                        Share
                      </button>
                      <button 
                        className="px-6 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white font-bold hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          // Navigate to previous/next NFT
                          const currentIndex = levelsInfo.findIndex(l => l.level === selectedLevel);
                          const nextIndex = (currentIndex + 1) % levelsInfo.length;
                          handleLevelSelect(levelsInfo[nextIndex].level);
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Right Panel - 3D Component */}
                <div className="lg:w-3/5 flex flex-col p-4 md:p-8">
                  <div className="flex-1 w-full bg-black/60 rounded-[2rem] border border-white/10 overflow-hidden relative shadow-inner">
                    {/* 3D Component */}
                    <DripmasNFT3D level={selectedLevel} />
                    
                    {/* Loading Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
                        <div className="text-white/80 text-sm">Loading 3D NFT...</div>
                      </div>
                    </div>
                    
                    {/* Controls Guide */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/30 tracking-[0.3em] uppercase pointer-events-none">
                      Drag to Rotate • Scroll to Zoom
                    </div>
                    
                    {/* NFT ID Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 rounded-full bg-black/70 text-xs text-gray-300 border border-white/20">
                        NFT #{selectedLevelInfo.level.toString().padStart(3, '0')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-6 p-4 rounded-2xl bg-gray-800/30 border border-gray-700/50">
                    <p className="text-sm text-gray-400 text-center">
                      This is an interactive 3D representation of your onchain achievement.
                      The actual NFT is stored on the Base blockchain.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}