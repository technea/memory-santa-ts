'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Animated NFT Avatar Components
 * Each represents a unique animated NFT revealed on card flip
 */

export function SantaTokenNFT() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Animated sparkles around Santa */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
          style={{
            top: `${30 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
            left: `${50 + Math.sin(i * 60 * Math.PI / 180) * 40}%`
          }}
        />
      ))}
      
      <svg viewBox="0 0 200 200" className="w-24 h-24 relative z-10">
        {/* Enhanced glow background */}
        <motion.circle
          cx="100"
          cy="110"
          r="45"
          fill="url(#santaGradient)"
          opacity="0.3"
          animate={{ r: [45, 55, 45] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Santa hat with enhanced animation */}
        <motion.polygon
          points="100,40 130,80 70,80"
          fill="#DC2626"
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Hat trim */}
        <motion.polygon
          points="70,80 130,80 125,85 75,85"
          fill="white"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Hat pom pom */}
        <motion.circle
          cx="100"
          cy="35"
          r="8"
          fill="white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Face with glow */}
        <motion.circle
          cx="100"
          cy="110"
          r="30"
          fill="#FDBF56"
          animate={{ filter: ["drop-shadow(0 0 8px rgba(253,191,86,0.6))", "drop-shadow(0 0 15px rgba(253,191,86,0.9))"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Animated eyes */}
        <motion.circle cx="90" cy="100" r="4" fill="#000000" />
        <motion.circle cx="110" cy="100" r="4" fill="#000000" />
        <motion.circle cx="92" cy="98" r="1.5" fill="white" />
        <motion.circle cx="112" cy="98" r="1.5" fill="white" />
        
        {/* Animated smile */}
        <motion.path
          d="M 92 115 Q 100 120 108 115"
          stroke="#000000"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ d: ["M 92 115 Q 100 120 108 115", "M 92 115 Q 100 122 108 115", "M 92 115 Q 100 120 108 115"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Gradient definition */}
        <defs>
          <radialGradient id="santaGradient">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.3" />
          </radialGradient>
        </defs>
      </svg>
      <div className="absolute bottom-2 text-xs font-bold text-white text-center drop-shadow-lg">SANTA</div>
    </motion.div>
  );
}

export function SnowflakeNFT() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    >
      <svg viewBox="0 0 200 200" className="w-24 h-24">
        {/* Snowflake center */}
        <motion.circle
          cx="100"
          cy="100"
          r="8"
          fill="#FFFFFF"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* 6 snowflake arms */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.g 
            key={angle} 
            transform={`rotate(${angle} 100 100)`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
          >
            <line x1="100" y1="100" x2="100" y2="30" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="92" y1="45" x2="100" y2="30" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="108" y1="45" x2="100" y2="30" stroke="#FFFFFF" strokeWidth="2" />
          </motion.g>
        ))}
        
        {/* Floating ice particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * 2 * Math.PI;
          const radius = 65;
          const x = 100 + Math.cos(angle) * radius;
          const y = 100 + Math.sin(angle) * radius;
          
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="#E0F2FE"
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          );
        })}
        
        {/* Pulsing glow */}
        <motion.circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="1.5"
          opacity="0.4"
          animate={{ r: [45, 60, 45] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
      <div className="absolute bottom-2 text-xs font-bold text-blue-100 text-center">FROST</div>
    </motion.div>
  );
}

export function GiftNFT() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      {/* Floating gift particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`gift-particle-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: ['#DC2626', '#FBBF24', '#3B82F6', '#10B981'][i]
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, (i % 2 ? 15 : -15), 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3
          }}
        />
      ))}
      
      <svg viewBox="0 0 200 200" className="w-24 h-24 relative z-10">
        {/* Gift box */}
        <motion.rect 
          x="60" 
          y="70" 
          width="80" 
          height="80" 
          fill="#FBBF24" 
          rx="4"
          animate={{ 
            fill: ['#FBBF24', '#FCD34D', '#FBBF24']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Ribbon horizontal */}
        <rect x="60" y="105" width="80" height="10" fill="#DC2626" />
        
        {/* Ribbon vertical */}
        <rect x="105" y="70" width="10" height="80" fill="#DC2626" />
        
        {/* Bow - Left side */}
        <motion.circle
          cx="90"
          cy="65"
          r="8"
          fill="#DC2626"
          animate={{ 
            scale: [1, 1.1, 1],
            y: [65, 62, 65]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Bow - Right side */}
        <motion.circle
          cx="110"
          cy="65"
          r="8"
          fill="#DC2626"
          animate={{ 
            scale: [1, 1.1, 1],
            y: [65, 62, 65]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: 0.2
          }}
        />
        
        {/* Bow center */}
        <motion.circle
          cx="100"
          cy="65"
          r="4"
          fill="#FFFFFF"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Shine effect */}
        <motion.rect
          x="70"
          y="80"
          width="12"
          height="20"
          fill="#FFFFFF"
          opacity="0.6"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Glow */}
        <motion.rect
          x="58"
          y="68"
          width="84"
          height="84"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          opacity="0.4"
          rx="4"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
      <div className="absolute bottom-2 text-xs font-bold text-white text-center">GIFT</div>
    </motion.div>
  );
}

export function CrystalNFT() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      {/* Crystal sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`crystal-sparkle-${i}`}
          className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4
          }}
          style={{
            top: `${40 + Math.cos(i * 72 * Math.PI / 180) * 30}%`,
            left: `${50 + Math.sin(i * 72 * Math.PI / 180) * 30}%`
          }}
        />
      ))}
      
      <svg viewBox="0 0 200 200" className="w-24 h-24 relative z-10">
        {/* Crystal gem */}
        <motion.polygon
          points="100,50 150,100 140,160 60,160 50,100"
          fill="#06B6D4"
          animate={{ 
            fill: ['#06B6D4', '#22D3EE', '#06B6D4']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Crystal facets */}
        <polygon points="100,50 125,100 100,110" fill="#0891B2" />
        <polygon points="125,100 150,100 140,130" fill="#06B6D4" />
        <polygon points="60,160 100,110 140,160" fill="#155E75" />
        
        {/* Shine effect */}
        <motion.polygon
          points="100,50 120,85 100,95"
          fill="#FFFFFF"
          opacity="0.6"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Rotating glow */}
        <motion.circle
          cx="100"
          cy="105"
          r="55"
          fill="none"
          stroke="#06B6D4"
          strokeWidth="2"
          opacity="0.4"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      <div className="absolute bottom-2 text-xs font-bold text-cyan-100 text-center">CRYSTAL</div>
    </motion.div>
  );
}

export function StarNFT() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
    >
      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-star-${i}`}
          className="absolute w-6 h-1 bg-gradient-to-r from-yellow-200 to-transparent"
          style={{
            transform: `rotate(${i * 120}deg)`
          }}
          animate={{
            x: [-30, 30],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.7
          }}
        />
      ))}
      
      <svg viewBox="0 0 200 200" className="w-24 h-24 relative z-10">
        {/* Star points */}
        <motion.polygon
          points="100,40 125,80 170,85 135,115 150,160 100,130 50,160 65,115 30,85 75,80"
          fill="#FBBF24"
          animate={{ 
            scale: [1, 1.1, 1],
            fill: ['#FBBF24', '#FCD34D', '#FBBF24']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Inner glow */}
        <motion.circle
          cx="100"
          cy="100"
          r="40"
          fill="none"
          stroke="#FCD34D"
          strokeWidth="2"
          opacity="0.5"
          animate={{ r: [35, 50, 35] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        
        {/* Outer glow */}
        <motion.circle
          cx="100"
          cy="100"
          r="60"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1.5"
          opacity="0.3"
          animate={{ opacity: [0.2, 0.5, 0.2], r: [55, 70, 55] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Center sparkle */}
        <motion.circle
          cx="100"
          cy="100"
          r="12"
          fill="#FFFFFF"
          opacity="0.8"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </svg>
      <div className="absolute bottom-2 text-xs font-bold text-yellow-100 text-center">STAR</div>
    </motion.div>
  );
}

// NEW: Reindeer NFT
export function ReindeerNFT() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      {/* Floating snow around reindeer */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`reindeer-snow-${i}`}
          className="absolute w-1.5 h-1.5 bg-white rounded-full"
          animate={{
            y: [0, -15, 0],
            x: [(i % 2 ? 10 : -10), 0, (i % 2 ? 10 : -10)],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
      
      <svg viewBox="0 0 200 200" className="w-24 h-24 relative z-10">
        {/* Reindeer body */}
        <motion.ellipse
          cx="100"
          cy="130"
          rx="40"
          ry="25"
          fill="#8B4513"
          animate={{ 
            scale: [1, 1.02, 1],
            fill: ['#8B4513', '#A0522D', '#8B4513']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Reindeer head */}
        <motion.ellipse
          cx="100"
          cy="90"
          rx="25"
          ry="20"
          fill="#A0522D"
          animate={{ y: [90, 88, 90] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Antlers */}
        <motion.path
          d="M 80 70 Q 70 40 65 30 M 120 70 Q 130 40 135 30"
          stroke="#8B4513"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{ 
            d: [
              "M 80 70 Q 70 40 65 30 M 120 70 Q 130 40 135 30",
              "M 80 70 Q 72 45 65 30 M 120 70 Q 128 45 135 30",
              "M 80 70 Q 70 40 65 30 M 120 70 Q 130 40 135 30"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Eyes */}
        <motion.circle cx="92" cy="85" r="3" fill="#000000" />
        <motion.circle cx="108" cy="85" r="3" fill="#000000" />
        <motion.circle cx="93" cy="84" r="1" fill="#FFFFFF" />
        <motion.circle cx="107" cy="84" r="1" fill="#FFFFFF" />
        
        {/* Nose - red and glowing */}
        <motion.circle
          cx="100"
          cy="100"
          r="4"
          fill="#DC2626"
          animate={{ 
            scale: [1, 1.3, 1],
            fill: ['#DC2626', '#EF4444', '#DC2626']
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Ears */}
        <motion.path
          d="M 85 75 Q 80 60 85 55"
          stroke="#A0522D"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path
          d="M 115 75 Q 120 60 115 55"
          stroke="#A0522D"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{ rotate: [0, -2, 2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        />
        
        {/* Legs */}
        <rect x="85" y="150" width="6" height="15" rx="2" fill="#8B4513" />
        <rect x="109" y="150" width="6" height="15" rx="2" fill="#8B4513" />
        
        {/* Bell on neck */}
        <motion.circle
          cx="100"
          cy="125"
          r="5"
          fill="#FFD700"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Glow effect */}
        <motion.circle
          cx="100"
          cy="110"
          r="45"
          fill="none"
          stroke="#8B4513"
          strokeWidth="1.5"
          opacity="0.3"
          animate={{ r: [40, 55, 40] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>
      <div className="absolute bottom-2 text-xs font-bold text-amber-100 text-center">REINDEER</div>
    </motion.div>
  );
}

// NEW: Christmas Tree NFT
export function TreeNFT() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {/* Floating ornaments */}
      {[...Array(5)].map((_, i) => {
        const colors = ['#DC2626', '#3B82F6', '#10B981', '#FBBF24', '#8B5CF6'];
        const size = 3 + i;
        
        return (
          <motion.div
            key={`ornament-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: colors[i]
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, (i % 2 ? 12 : -12), 0],
              rotate: [0, 180, 360],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.3
            }}
          />
        );
      })}
      
      <svg viewBox="0 0 200 200" className="w-24 h-24 relative z-10">
        {/* Tree layers */}
        <motion.polygon
          points="100,30 130,80 70,80"
          fill="#16A34A"
          animate={{ 
            fill: ['#16A34A', '#22C55E', '#16A34A']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.polygon
          points="100,60 140,110 60,110"
          fill="#15803D"
          animate={{ y: [60, 58, 60] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
        />
        <motion.polygon
          points="100,90 150,150 50,150"
          fill="#166534"
          animate={{ y: [90, 88, 90] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        />
        
        {/* Tree trunk */}
        <rect x="95" y="150" width="10" height="20" fill="#92400E" />
        
        {/* Tree ornaments */}
        <motion.circle
          cx="100"
          cy="50"
          r="4"
          fill="#DC2626"
          animate={{ 
            scale: [1, 1.3, 1],
            fill: ['#DC2626', '#EF4444', '#DC2626']
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="85"
          cy="75"
          r="3"
          fill="#3B82F6"
          animate={{ 
            scale: [1, 1.2, 1],
            fill: ['#3B82F6', '#60A5FA', '#3B82F6']
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.circle
          cx="115"
          cy="75"
          r="3"
          fill="#FBBF24"
          animate={{ 
            scale: [1, 1.2, 1],
            fill: ['#FBBF24', '#FCD34D', '#FBBF24']
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
        <motion.circle
          cx="100"
          cy="100"
          r="3"
          fill="#8B5CF6"
          animate={{ 
            scale: [1, 1.2, 1],
            fill: ['#8B5CF6', '#A78BFA', '#8B5CF6']
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
        />
        
        {/* Star on top */}
        <motion.polygon
          points="100,20 103,30 113,30 106,35 109,45 100,40 91,45 94,35 87,30 97,30"
          fill="#FBBF24"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Glow effect */}
        <motion.circle
          cx="100"
          cy="110"
          r="60"
          fill="none"
          stroke="#16A34A"
          strokeWidth="1.5"
          opacity="0.3"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
      <div className="absolute bottom-2 text-xs font-bold text-emerald-100 text-center">TREE</div>
    </motion.div>
  );
}

// Type for NFT component
interface NFTComponent {
  Component: React.FC;
  name: string;
}

// Export all NFT components (Now 7 different NFTs!)
export const NFT_COMPONENTS: NFTComponent[] = [
  { Component: SantaTokenNFT, name: 'Santa' },
  { Component: SnowflakeNFT, name: 'Snowflake' },
  { Component: GiftNFT, name: 'Gift' },
  { Component: CrystalNFT, name: 'Crystal' },
  { Component: StarNFT, name: 'Star' },
  { Component: ReindeerNFT, name: 'Reindeer' },
  { Component: TreeNFT, name: 'Tree' }
];