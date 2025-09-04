'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Target, Crosshair } from 'lucide-react';
import { useAppSounds } from '@/hooks/useAppSounds';

interface LiquidAnimationProps {
  isVisible: boolean;
  onAnimationComplete: () => void;
  previousLeader?: {
    name: string;
    score: number;
  } | null;
  newLeader: {
    name: string;
    score: number;
  };
}

export function LiquidAnimation({ 
  isVisible, 
  onAnimationComplete, 
  previousLeader, 
  newLeader 
}: LiquidAnimationProps) {
  const { playSuccess } = useAppSounds();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Play success sound when animation starts
      playSuccess();
      // Show content after a brief delay
      const contentTimer = setTimeout(() => setShowContent(true), 800);
      
      // Auto-close animation after 6 seconds (giving more time to appreciate the animation)
      const autoCloseTimer = setTimeout(() => {
        onAnimationComplete();
      }, 6000);
      
      return () => {
        clearTimeout(contentTimer);
        clearTimeout(autoCloseTimer);
      };
    } else {
      setShowContent(false);
    }
  }, [isVisible, playSuccess, onAnimationComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onAnimationComplete}
        >
          {/* Crosshair targeting system */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Crosshair lines */}
            <motion.div
              className="absolute w-full h-0.5 bg-red-500 top-1/2 left-0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.div
              className="absolute h-full w-0.5 bg-red-500 left-1/2 top-0"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            
            {/* Corner targeting brackets */}
            {[
              { top: '20%', left: '20%', rotate: 0 },
              { top: '20%', right: '20%', rotate: 90 },
              { bottom: '20%', right: '20%', rotate: 180 },
              { bottom: '20%', left: '20%', rotate: 270 },
            ].map((corner, i) => (
              <motion.div
                key={i}
                className="absolute w-16 h-16"
                style={{ ...corner }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.2 }}
              >
                <motion.div
                  className="w-full h-1 bg-red-400"
                  style={{ transformOrigin: 'left center', transform: `rotate(${corner.rotate}deg)` }}
                />
                <motion.div
                  className="w-1 h-full bg-red-400 absolute top-0 left-0"
                  style={{ transformOrigin: 'center top', transform: `rotate(${corner.rotate}deg)` }}
                />
              </motion.div>
            ))}
          </div>

          {/* Figure animations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Previous leader falling figure (if exists) */}
            {previousLeader && (
              <motion.div
                className="absolute left-1/4 top-1/3"
                initial={{ y: 0, rotate: 0, opacity: 1 }}
                animate={{ 
                  y: 400, 
                  rotate: -90, 
                  opacity: 0,
                  scale: 0.5
                }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeIn" }}
              >
                <div className="flex flex-col items-center">
                  {/* Stick figure */}
                  <div className="relative">
                    {/* Head */}
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-600 mb-1" />
                    {/* Body */}
                    <div className="w-1 h-12 bg-gray-600 mx-auto" />
                    {/* Arms */}
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                      <div className="w-6 h-1 bg-gray-600 rotate-45 absolute -left-3" />
                      <div className="w-6 h-1 bg-gray-600 -rotate-45 absolute -left-3" />
                    </div>
                    {/* Legs */}
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                      <div className="w-6 h-1 bg-gray-600 rotate-45 absolute -left-3" />
                      <div className="w-6 h-1 bg-gray-600 -rotate-45 absolute -left-3" />
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-400 font-semibold">
                    {previousLeader.name}
                  </div>
                </div>
              </motion.div>
            )}

            {/* New leader rising figure */}
            <motion.div
              className="absolute right-1/4 top-1/3"
              initial={{ y: 400, opacity: 0, scale: 0.5 }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                scale: 1,
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 1.5, 
                delay: 0.8,
                rotate: { duration: 0.5, delay: 2 }
              }}
            >
              <div className="flex flex-col items-center">
                {/* Stick figure with crown */}
                <div className="relative">
                  {/* Crown */}
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: -10, opacity: 1 }}
                    transition={{ delay: 2, duration: 0.5 }}
                  >
                    <Crown className="w-6 h-6 text-yellow-400 absolute -top-3 left-1/2 transform -translate-x-1/2" />
                  </motion.div>
                  {/* Head */}
                  <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-yellow-600 mb-1" />
                  {/* Body */}
                  <div className="w-1 h-12 bg-yellow-600 mx-auto" />
                  {/* Arms raised in victory */}
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                    <motion.div 
                      className="w-6 h-1 bg-yellow-600 absolute -left-3"
                      animate={{ rotate: [-30, -45, -30] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 2.5 }}
                    />
                    <motion.div 
                      className="w-6 h-1 bg-yellow-600 absolute -left-3"
                      animate={{ rotate: [30, 45, 30] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 2.5 }}
                    />
                  </div>
                  {/* Legs */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-1 bg-yellow-600 rotate-12 absolute -left-3" />
                    <div className="w-6 h-1 bg-yellow-600 -rotate-12 absolute -left-3" />
                  </div>
                </div>
                <div className="mt-2 text-sm text-yellow-400 font-bold">
                  {newLeader.name}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Muzzle flash effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.15, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-white mix-blend-overlay" />
            {/* Flash rays */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 bg-yellow-300 origin-bottom"
                style={{
                  height: `${Math.random() * 300 + 100}px`,
                  left: '50%',
                  bottom: '50%',
                  transform: `rotate(${i * 30}deg)`,
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 0.25, delay: 0.3 }}
              />
            ))}
          </motion.div>

          {/* Main content with gunshot theme */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 150, 
              damping: 15,
              delay: 1.0
            }}
            className="relative z-10 text-center text-white"
          >
            {/* Target with crosshair */}
            <motion.div
              className="mb-8 flex justify-center"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="relative">
                <Target className="h-24 w-24 text-red-500 drop-shadow-lg" />
                <Crosshair className="h-12 w-12 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </motion.div>

            {/* Text content */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Title with gunshot effect */}
                  <motion.h1
                    className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 bg-clip-text text-transparent"
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    HEADSHOT!
                  </motion.h1>

                  <motion.h2
                    className="text-3xl font-semibold mb-6 text-yellow-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    NEW LEADER
                  </motion.h2>

                  {/* Bullet impact effects */}
                  <div className="flex justify-center gap-4 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-yellow-400 rounded-full"
                        animate={{ 
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{ 
                          duration: 0.5, 
                          repeat: Infinity, 
                          delay: i * 0.1 
                        }}
                      />
                    ))}
                  </div>

                  {/* Previous leader (if exists) */}
                  {previousLeader && (
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mb-4 text-lg text-red-300"
                    >
                      <span className="line-through opacity-75">
                        {previousLeader.name} ({previousLeader.score.toLocaleString()})
                      </span>
                      <div className="text-sm text-red-400">ELIMINATED</div>
                    </motion.div>
                  )}

                  {/* New leader */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="mb-8"
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Trophy className="h-8 w-8 text-yellow-400" />
                      <span className="text-4xl font-bold text-yellow-400">
                        {newLeader.name}
                      </span>
                      <Crown className="h-8 w-8 text-yellow-400" />
                    </div>
                    <motion.div
                      className="text-3xl font-mono text-white"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        textShadow: [
                          "0 0 0px rgba(255,255,255,0)",
                          "0 0 20px rgba(255,255,255,0.8)",
                          "0 0 0px rgba(255,255,255,0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {newLeader.score.toLocaleString()} points
                    </motion.div>
                    <div className="text-lg text-green-400 font-semibold mt-2">
                      VICTORY ACHIEVED
                    </div>
                  </motion.div>

                  {/* Auto-close notice */}
                  <motion.p
                    className="text-sm text-gray-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Auto-closing in 6 seconds... (or click to close)
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Smoke/debris effect at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 w-16 h-16 bg-gray-600 rounded-full opacity-30"
                style={{
                  left: `${20 + i * 15}%`,
                }}
                animate={{
                  y: [0, -100, -200],
                  x: [0, Math.random() * 50 - 25],
                  scale: [0.5, 1, 0.2],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
