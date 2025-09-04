"use client";
import { useEffect } from 'react';
import { motion, AnimatePresence, Variants, Easing } from "framer-motion";
import { ChallengeSolve } from "@/types/ctfd";
import { useAppSounds } from "@/hooks/useAppSounds";

interface FirstBloodAnimationProps {
  isVisible: boolean;
  solve: ChallengeSolve;
  challengeName?: string;
  onClose: () => void;
}

export function FirstBloodAnimation({
  isVisible,
  solve,
  challengeName = "Unknown Challenge",
  onClose,
}: FirstBloodAnimationProps) {
  const sounds = useAppSounds();
  
  // Play sound effect when animation becomes visible
  useEffect(() => {
    if (isVisible) {
      sounds.playFirstBlood();
      
      // Auto-dismiss after 9 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 9000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, sounds, onClose]);
  
  // Animation variants
  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  // Easing functions
  const easings: Easing[] = ["easeInOut", "easeIn", "easeOut"];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onClose}
        >
          {/* Blood effect overlay */}
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={overlayVariants}
          >
            {/* Dynamic liquid lines with Framer Motion */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${i * 5}%`,
                  width: '6%',
                  backgroundColor: '#ff0000',
                  opacity: 0.15,
                  filter: 'blur(20px)'
                }}
                initial={{ scaleY: 0, transformOrigin: Math.random() > 0.5 ? 'top' : 'bottom' }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random(),
                  ease: easings[Math.floor(Math.random() * easings.length)]
                }}
              />
            ))}
          </motion.div>

          {/* Overlay content */}
          <motion.div 
            className="relative max-w-4xl mx-auto p-8 text-center z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.h1 
              className="text-5xl font-bold text-red-500 drop-shadow-lg mb-4"
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: ["0 0 8px #ff0000", "0 0 16px #ff0000", "0 0 8px #ff0000"] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2 
              }}
            >
              🏆 First Blood! 🏆
            </motion.h1>

            <motion.p 
              className="text-2xl text-white mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {solve?.name ?? "Unknown User"} solved{" "}
              <span className="underline decoration-red-500 decoration-wavy">
                {challengeName}
              </span>
            </motion.p>

            <motion.p 
              className="text-gray-300 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              (click anywhere to dismiss)
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
