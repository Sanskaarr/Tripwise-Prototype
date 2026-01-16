import React from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingNavProps {
  children?: React.ReactNode;
  className?: string;
  showLogo?: boolean;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ 
  children, 
  className,
  showLogo = true 
}) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-4 left-4 right-4 z-50',
        'mx-auto max-w-4xl',
        className
      )}
    >
      <div className="glass-nav-pill">
        {/* Specular highlight */}
        <div className="glass-nav-specular" />
        
        <div className="relative z-10 flex items-center justify-between px-6 py-3">
          {showLogo && (
            <a href="/" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
              <Plane className="w-5 h-5 rotate-[-30deg]" strokeWidth={1.5} />
              <span className="text-lg font-semibold tracking-tight">TripWise</span>
            </a>
          )}
          
          {children}
        </div>
      </div>
    </motion.header>
  );
};

export default FloatingNav;
