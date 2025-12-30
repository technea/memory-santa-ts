'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Define props interface
interface CelebrationAnimationProps {
  stars?: number;
}

// Define confetti piece interface
interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

// Define sparkle interface
interface Sparkle {
  id: number;
  angle: number;
}

/**
 * Celebration Animation Component
 * Shows confetti, coins, and sparkles when a level is completed
 */
export default function CelebrationAnimation({ stars = 3 }: CelebrationAnimationProps) {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({ 
    width: 0, 
    height: 0 
  });

  // Track window size for responsive calculations
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate random confetti pieces
  const confetti: ConfettiPiece[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1,
  }));

  // Generate sparkles
  const sparkles: Sparkle[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (360 / 12) * i,
  }));

  // Color options for confetti
  const confettiColors: string[] = ['#FFD700', '#FFC700', '#00D9FF', '#FF006E', '#8338EC'];

  // Calculate animation values based on window size
  const targetY = windowSize.height > 0 ? windowSize.height + 20 : 1000;
  const sparkleDistance = windowSize.width > 0 ? Math.min(200, windowSize.width * 0.3) : 200;
  const starDistance = windowSize.width > 0 ? Math.min(150, windowSize.width * 0.25) : 150;

  // Safe window check for SSR
  const isClient = typeof window !== 'undefined';

  if (!isClient) {
    return null; // Don't render on server
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100]">
      {/* Confetti */}
      {confetti.map((piece: ConfettiPiece) => (
        <motion.div
          key={`confetti-${piece.id}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            background: confettiColors[piece.id % confettiColors.length],
          }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: targetY,
            x: (Math.random() - 0.5) * 100,
            rotate: Math.random() * 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
        />
      ))}

      {/* Center sparkles burst */}
      {sparkles.map((sparkle: Sparkle) => {
        const angleRad = (sparkle.angle * Math.PI) / 180;
        return (
          <motion.div
            key={`sparkle-${sparkle.id}`}
            className="absolute w-3 h-3"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angleRad) * sparkleDistance,
              y: Math.sin(angleRad) * sparkleDistance,
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: 'easeOut',
            }}
          >
            <div className="w-full h-full bg-yellow-400 rounded-full blur-sm" />
          </motion.div>
        );
      })}

      {/* Star burst */}
      {Array.from({ length: stars }, (_, i: number) => {
        const starAngle = (i / stars) * 360;
        const starAngleRad = (starAngle * Math.PI) / 180;
        
        return (
          <motion.div
            key={`star-${i}`}
            className="absolute text-4xl"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(starAngleRad) * starDistance,
              y: Math.sin(starAngleRad) * starDistance,
              opacity: [1, 0],
              scale: [1, 0.5],
            }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: 'easeOut',
            }}
          >
            ⭐
          </motion.div>
        );
      })}

      {/* Center burst effect */}
      <motion.div
        className="absolute w-20 h-20 rounded-full"
        style={{
          left: '50%',
          top: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{
          scale: [0, 2],
          opacity: [0.8, 0],
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
      />

      {/* Flying coins */}
      {Array.from({ length: 5 }, (_, i: number) => (
        <motion.div
          key={`coin-${i}`}
          className="absolute text-2xl"
          style={{
            left: '20%',
            top: '80%',
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: 60 + i * 30,
            y: -300,
            rotate: [0, 720],
            opacity: [1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.1,
            ease: 'easeOut',
          }}
        >
          🪙
        </motion.div>
      ))}

      {/* Glow overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 via-transparent to-purple-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 2 }}
      />
    </div>
  );
}

// Optional: Add PropTypes for backward compatibility
// import PropTypes from 'prop-types';
// CelebrationAnimation.propTypes = {
//   stars: PropTypes.number,
// };
// CelebrationAnimation.defaultProps = {
//   stars: 3,
// };