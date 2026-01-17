import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { cn } from '@/lib/utils';

interface ConversationalLayoutProps {
    children: ReactNode;
    currentStep: number;
    totalSteps: number;
    title: string;
    description?: string;
    onBack?: () => void;
    onNext?: () => void;
    canNext?: boolean;
    isNextLoading?: boolean;
    nextLabel?: string;
    showSkip?: boolean;
    onSkip?: () => void;
}

export const ConversationalLayout = ({
    children,
    currentStep,
    totalSteps = 12,
    title,
    description,
    onBack,
    onNext,
    canNext = true,
    isNextLoading = false,
    nextLabel = "Continue",
    showSkip = false,
    onSkip
}: ConversationalLayoutProps) => {
    const navigate = useNavigate();
    const progress = (currentStep / totalSteps) * 100;

    // Swipe Logic
    const touchStart = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && onNext && canNext && !isNextLoading) {
            onNext();
        }
        if (isRightSwipe && onBack) {
            onBack();
        }
    };

    return (
        <div
            className="flex items-center justify-center p-2 md:p-4 w-full"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-2xl"
            >
                {/* Main Glass Container - Compact & Centered */}
                <div className="ios-glass relative overflow-hidden rounded-[2rem] shadow-xl border-white/10">

                    {/* Top Bar: Progress & Close */}
                    <div className="flex items-center justify-between px-6 pt-6 pb-2">
                        <div className="flex items-center gap-3">
                            {/* Circular Progress Indicator - Compact */}
                            <div className="relative w-8 h-8 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        className="text-white/10"
                                    />
                                    <motion.circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        className="text-primary drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]"
                                        strokeDasharray={88}
                                        strokeDashoffset={88 - (88 * progress) / 100}
                                        initial={{ strokeDashoffset: 88 }}
                                        animate={{ strokeDashoffset: 88 - (88 * progress) / 100 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </svg>
                                <span className="absolute text-[9px] font-bold text-muted-foreground/80">
                                    {currentStep}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">
                                    Step {currentStep}/{totalSteps}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/plan')}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content Area - Compact */}
                    <div className="px-6 md:px-8 py-4">
                        <motion.div
                            key={title} // Animate text change
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 text-center space-y-1"
                        >
                            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                                {title}
                            </h2>
                            {description && (
                                <p className="text-muted-foreground/80 text-sm md:text-base font-light leading-relaxed max-w-md mx-auto">
                                    {description}
                                </p>
                            )}
                        </motion.div>

                        {/* Interactive Form Area - Smooth Transition */}
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="min-h-[150px]" // Prevent layout shift
                        >
                            {children}
                        </motion.div>
                    </div>

                    {/* Footer Actions - Compact */}
                    <div className="px-6 pb-6 pt-2 flex flex-col-reverse md:flex-row gap-3 items-center justify-between">
                        {onBack ? (
                            <button
                                onClick={onBack}
                                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-3 flex items-center gap-2"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                Back
                            </button>
                        ) : (
                            <div className="w-16" />
                        )}

                        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                            {showSkip && (
                                <button
                                    onClick={onSkip}
                                    className="text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                                >
                                    Skip
                                </button>
                            )}

                            <PremiumButton
                                onClick={onNext}
                                disabled={!canNext}
                                isLoading={isNextLoading}
                                className="w-full md:w-auto min-w-[140px] py-3 text-sm"
                            >
                                {nextLabel}
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </PremiumButton>
                        </div>
                    </div>

                    {/* Background Ambience within card for extra depth */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none -ml-32 -mb-32" />
                </div>
            </motion.div>
        </div>
    );
}
