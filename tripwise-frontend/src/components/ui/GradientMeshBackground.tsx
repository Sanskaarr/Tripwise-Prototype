import React from 'react';
import { motion } from 'framer-motion';

export const GradientMeshBackground: React.FC<{ variant?: 'purple' | 'blue' | 'sunset' }> = ({ 
  variant = 'purple' 
}) => {
  const gradients = {
    purple: {
      primary: 'from-violet-600 via-purple-500 to-fuchsia-500',
      secondary: 'from-indigo-500 via-purple-400 to-pink-400',
      accent: 'from-blue-400 via-violet-400 to-purple-500',
    },
    blue: {
      primary: 'from-blue-600 via-cyan-500 to-teal-400',
      secondary: 'from-indigo-400 via-blue-400 to-cyan-300',
      accent: 'from-sky-400 via-blue-300 to-indigo-400',
    },
    sunset: {
      primary: 'from-orange-500 via-pink-500 to-purple-600',
      secondary: 'from-amber-400 via-rose-400 to-violet-500',
      accent: 'from-yellow-400 via-orange-400 to-pink-500',
    },
  };

  const colors = gradients[variant];

  return (
    <div className="gradient-mesh-background">
      {/* Base gradient layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary} opacity-90`} />
      
      {/* Animated mesh orbs */}
      <motion.div
        className={`mesh-orb mesh-orb-1 bg-gradient-to-br ${colors.secondary}`}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className={`mesh-orb mesh-orb-2 bg-gradient-to-br ${colors.accent}`}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, 80, 20, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className={`mesh-orb mesh-orb-3 bg-gradient-to-br ${colors.primary}`}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.3, 0.95, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className={`mesh-orb mesh-orb-4 bg-gradient-to-br ${colors.secondary}`}
        animate={{
          x: [0, -50, 80, 0],
          y: [0, 100, -20, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Noise overlay for texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-radial-vignette" />
    </div>
  );
};

export default GradientMeshBackground;
