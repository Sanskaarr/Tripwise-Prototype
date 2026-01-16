import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'floating' | 'elevated' | 'subtle';
  glow?: boolean;
  hover?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, variant = 'default', glow = false, hover = true, ...props }, ref) => {
    const variants = {
      default: 'glass-card-material',
      floating: 'glass-card-material glass-floating',
      elevated: 'glass-card-material glass-elevated',
      subtle: 'glass-card-subtle',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          variants[variant],
          hover && 'glass-hover',
          glow && 'glass-glow',
          className
        )}
        whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        {...props}
      >
        {/* Specular highlight overlay */}
        <div className="glass-specular" />
        
        {/* Inner glow effect */}
        <div className="glass-inner-glow" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
