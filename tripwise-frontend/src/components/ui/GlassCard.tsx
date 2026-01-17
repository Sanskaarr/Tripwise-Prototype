import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "pink" | "none";
}

export const GlassCard = ({
  children,
  className,
  glowColor = "none",
  ...props
}: GlassCardProps) => {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl group",
        className
      )}
      initial={{ y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.5, ease: "easeOut" } }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* Inner subtle shimmer for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

      {/* Shine Effect Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </div>

      {/* Optional Corner Glows */}
      {glowColor !== "none" && (
        <>
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl opacity-60" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-400/20 blur-3xl opacity-60" />
        </>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
