import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingTabBarProps {
  children: React.ReactNode;
  className?: string;
}

export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({ 
  children, 
  className 
}) => {
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className={cn(
        'fixed bottom-6 left-4 right-4 z-50',
        'mx-auto max-w-md',
        className
      )}
    >
      <div className="glass-tab-pill">
        {/* Specular highlight */}
        <div className="glass-tab-specular" />
        
        <div className="relative z-10 flex items-center justify-center px-8 py-4">
          {children}
        </div>
      </div>
    </motion.footer>
  );
};

export default FloatingTabBar;
