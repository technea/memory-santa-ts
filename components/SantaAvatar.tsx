'use client';

import { motion } from 'framer-motion';

export default function SantaAvatar() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-full"
      initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        rotate: 0,
        y: [0, -5, 0]
      }}
      transition={{ 
        duration: 0.8,
        type: "spring",
        stiffness: 200
      }}
    >
      {/* Glowing Background Effect */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-red-500/30 to-pink-500/30 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Main Santa Container */}
      <div className="relative z-10">
        {/* Floating Effect */}
        <motion.div
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 1, -1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          {/* SVG Low-Poly Santa Avatar */}
          <svg
            width="180"
            height="220"
            viewBox="0 0 200 240"
            className="drop-shadow-[0_10px_30px_rgba(220,38,38,0.5)]"
          >
            {/* Animated Hat */}
            <motion.polygon
              points="100,20 140,60 60,60"
              fill="#DC2626"
              animate={{ 
                fill: ['#DC2626', '#EF4444', '#DC2626']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <polygon points="100,20 160,80 60,80" fill="#991B1B" />
            
            {/* Hat brim with shine */}
            <ellipse cx="100" cy="80" rx="70" ry="15" fill="#F3F4F6" />
            <ellipse cx="100" cy="80" rx="60" ry="10" fill="#FFFFFF" opacity="0.5" />
            
            {/* Pom pom with bounce */}
            <motion.circle
              cx="100"
              cy="15"
              r="12"
              fill="#FFFFFF"
              animate={{ 
                scale: [1, 1.1, 1],
                y: [0, -2, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Sparkle on pom pom */}
            <motion.circle
              cx="100"
              cy="15"
              r="4"
              fill="#FFD700"
              animate={{ 
                opacity: [0, 1, 0],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Face */}
            <circle cx="100" cy="120" r="35" fill="#FDBF56" />
            
            {/* Shiny cheeks */}
            <motion.circle
              cx="85"
              cy="115"
              r="8"
              fill="#FF9E7D"
              opacity="0.3"
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.circle
              cx="115"
              cy="115"
              r="8"
              fill="#FF9E7D"
              opacity="0.3"
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
            />
            
            {/* Beard with snow effect */}
            <ellipse cx="100" cy="145" rx="40" ry="30" fill="#FFFFFF" />
            
            {/* Snow dots on beard */}
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                cx={85 + i * 7}
                cy={140 + (i % 2) * 10}
                r="2"
                fill="#E5E7EB"
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2
                }}
              />
            ))}
            
            {/* Animated Eyes */}
            <motion.circle
              cx="88"
              cy="110"
              r="4"
              fill="#000000"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.circle
              cx="112"
              cy="110"
              r="4"
              fill="#000000"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
            />
            
            {/* Eye shines */}
            <circle cx="86" cy="108" r="1" fill="#FFFFFF" />
            <circle cx="110" cy="108" r="1" fill="#FFFFFF" />
            
            {/* Nose with glow */}
            <motion.circle
              cx="100"
              cy="125"
              r="5"
              fill="#DC2626"
              animate={{ 
                scale: [1, 1.1, 1],
                fill: ['#DC2626', '#EF4444', '#DC2626']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Blinking Mouth */}
            <motion.path
              d="M 92 140 Q 100 145 108 140"
              stroke="#DC2626"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              animate={{ 
                d: [
                  "M 92 140 Q 100 145 108 140",
                  "M 92 140 Q 100 142 108 140",
                  "M 92 140 Q 100 145 108 140"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Body - Suit */}
            <motion.path
              d="M 65 155 L 65 210 L 135 210 L 135 155 Z"
              fill="#DC2626"
              animate={{ 
                fill: ['#DC2626', '#EF4444', '#DC2626']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Belt with shine */}
            <rect x="70" y="190" width="60" height="8" fill="#FFD700" />
            <motion.rect
              x="72"
              y="191"
              width="56"
              height="6"
              fill="#FFED4E"
              animate={{ 
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Belt buckle with sparkle */}
            <motion.circle
              cx="100"
              cy="194"
              r="6"
              fill="#FDB813"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Arms */}
            <rect x="50" y="165" width="15" height="35" rx="7" fill="#FDBF56" />
            <rect x="135" y="165" width="15" height="35" rx="7" fill="#FDBF56" />
            
            {/* Waving Gloves */}
            <motion.circle
              cx="57"
              cy="205"
              r="8"
              fill="#FFFFFF"
              animate={{ 
                y: [0, -3, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            <motion.circle
              cx="143"
              cy="205"
              r="8"
              fill="#FFFFFF"
              animate={{ 
                y: [0, -3, 0],
                rotate: [0, -5, 0, 5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.5
              }}
            />
            
            {/* Snowflakes around Santa */}
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * 2 * Math.PI;
              const radius = 100;
              const x = 100 + Math.cos(angle) * radius;
              const y = 120 + Math.sin(angle) * radius;
              
              return (
                <motion.path
                  key={i}
                  d="M -2 0 L 2 0 M 0 -2 L 0 2 M -1.4 -1.4 L 1.4 1.4 M -1.4 1.4 L 1.4 -1.4"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  transform={`translate(${x}, ${y}) rotate(${i * 45})`}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Santa Label with Glow */}
      <motion.p
        className="mt-4 text-xl font-black text-center bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 bg-clip-text text-transparent"
        animate={{ 
          scale: [1, 1.05, 1],
          textShadow: [
            "0 0 10px rgba(239, 68, 68, 0.5)",
            "0 0 20px rgba(239, 68, 68, 0.8)",
            "0 0 10px rgba(239, 68, 68, 0.5)"
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        🎅 SANTA'S SPECIAL 🎄
      </motion.p>
      
      {/* Subtitle */}
      <motion.p
        className="mt-2 text-sm text-gray-300 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Find my match to earn bonus!
      </motion.p>
    </motion.div>
  );
}