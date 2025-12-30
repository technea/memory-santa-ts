'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import NFT3DBox from "../../components/NFT3DCollection";
import MemeGenerator from "../../components/MemeGenerator";

// Types for better TS support in Next 16
interface StatItem {
  label: string;
  value: string;
  color: string;
}

export default function NFTShowcase() {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const levels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    const initialize = async () => {
      try {
        // Farcaster SDK signal ready
        await sdk.actions.ready();
        setIsSDKReady(true);
      } catch (error) {
        console.error("Farcaster SDK initialization failed:", error);
      }
    };

    initialize();
  }, []);

  const stats: StatItem[] = [
    { label: "Active Users", value: "10.5K", color: "#00D4FF" },
    { label: "NFTs Minted", value: "2.3K", color: "#FF6B35" },
    { label: "Memes Created", value: "847", color: "#FFD166" },
    { label: "Gas Saved", value: "$1.2M", color: "#0052FF" }
  ];

  const emojis: string[] = ['🎅', '🎁', '⭐', '🎄', '❄️', '🦌', '🎪', '🔔', '🎶', '✨', '🚀', '💎', '🌈', '🔥', '⚡'];

  // Prevent hydration mismatch or blank screens in Farcaster
  if (!isSDKReady) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-[#0052FF] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] dark:bg-slate-900 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 selection:bg-[#0052FF]/30">
      
      {/* --- HEADER --- */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 sm:mb-16 md:mb-20"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter italic"
          animate={{
            textShadow: [
              "0 0 20px rgba(255, 107, 53, 0.4)",
              "0 0 30px rgba(0, 212, 255, 0.4)",
              "0 0 20px rgba(255, 107, 53, 0.4)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          PREMIUM <span className="text-red-600 dark:text-red-500">SANTA</span> NFT COLLECTION
        </motion.h1>
        <motion.p
          className="text-gray-500 mt-4 font-mono text-xs sm:text-sm tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Base Mainnet • 4.5s Seamless Loops
        </motion.p>
      </motion.header>

      {/* --- NFT GRID --- */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-32"
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">🏆 EXCLUSIVE SHOWCASE</h2>
          <p className="text-[#00D4FF]/80 text-sm">Onchain assets secured by Base</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {levels.map((lvl, index) => (
            <motion.div
              key={lvl}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              className="flex justify-center"
            >
              <NFT3DBox level={lvl} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* --- MEME GENERATOR --- */}
      <motion.section 
        className="mb-32 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-br from-[#001F3F]/50 to-[#0052FF]/10 rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-sm">
          <MemeGenerator />
        </div>
      </motion.section>

      {/* --- FUN ZONE --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {/* Emoji Party */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 text-center">🎯 EMOJI PARTY</h3>
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl p-2 bg-white/5 rounded-lg"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quotes */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 text-center">💡 BASE WISDOM</h3>
          <div className="space-y-3">
            {["Low fees, high vibes 🚀", "Build on Base ⚡", "Fast & Green 🌱"].map((q, i) => (
              <p key={i} className="text-sm italic text-blue-300 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">"{q}"</p>
            ))}
          </div>
        </div>

        {/* Live Stats */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 text-center">📊 LIVE STATS</h3>
          <div className="space-y-3">
            {stats.map((s, i) => (
              <div key={i} className="flex justify-between items-center bg-black/40 p-2 rounded-lg">
                <span className="text-xs text-gray-400">{s.label}</span>
                <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="text-center pb-10">
        <div className="flex justify-center gap-6 opacity-50 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0052FF] rounded flex items-center justify-center text-[10px] font-bold">B</div>
            <span className="text-[10px] uppercase tracking-widest text-white">Base</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎅</span>
            <span className="text-[10px] uppercase tracking-widest text-white">Santa</span>
          </div>
        </div>
        <p className="text-gray-600 text-[10px] mt-6 tracking-widest uppercase">
          Next.js 16 • React 19 • Framer Motion
        </p>
      </footer>
    </div>
  );
}
