import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PremiumButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'ghost';
    fullWidth?: boolean;
}

export const PremiumButton = ({
    children,
    className,
    isLoading = false,
    variant = 'primary',
    fullWidth = false,
    disabled,
    onClick,
    ...props
}: PremiumButtonProps) => {

    const variants = {
        primary: "bg-gray-900 text-white shadow-lg hover:shadow-xl border border-white/10",
        secondary: "bg-white/80 text-gray-900 shadow-md hover:shadow-lg backdrop-blur-md border border-white/40",
        ghost: "bg-transparent text-gray-600 hover:bg-black/5 hover:text-gray-900"
    };

    return (
        <motion.button
            className={cn(
                "group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-medium overflow-hidden transition-all duration-300",
                variants[variant],
                fullWidth ? "w-full" : "",
                (disabled || isLoading) && "opacity-60 cursor-not-allowed",
                className
            )}
            whileHover={(!disabled && !isLoading) ? { scale: 1.05 } : {}}
            whileTap={(!disabled && !isLoading) ? { scale: 0.95 } : {}}
            onClick={onClick}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Primary Gradient Overlay on Hover - Subtle Blue/Purple instead of Pink */}
            {variant === 'primary' && !disabled && !isLoading && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Content wrapper for z-index */}
            <span className="relative z-10 flex items-center gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </span>
        </motion.button>
    );
};
