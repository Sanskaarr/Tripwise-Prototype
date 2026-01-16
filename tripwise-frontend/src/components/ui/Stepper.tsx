import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
    currentStep: number;
    totalSteps?: number;
    steps?: { label: string; id: string }[];
    className?: string; // Additional className for styling
}

export function Stepper({ currentStep, totalSteps = 12, steps, className }: StepperProps) {
    // If steps array is provided, use it, otherwise generate based on totalSteps
    const stepItems = steps || Array.from({ length: totalSteps }, (_, i) => ({
        label: `Step ${i + 1}`,
        id: `step-${i + 1}`
    }));

    const progressPercentage = ((currentStep - 1) / (stepItems.length - 1)) * 100;

    return (
        <div className={cn("w-full max-w-4xl mx-auto px-4", className)}>
            <div className="relative flex items-center justify-between">

                {/* Progress Track Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-white/10 rounded-full z-0" />

                {/* Animated Progress Fill */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-white rounded-full z-0 origin-left"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {/* Steps */}
                {stepItems.map((step, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isActive = stepNum === currentStep;
                    const isFuture = stepNum > currentStep;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                            {/* Step Circle */}
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.2 : 1,
                                    backgroundColor: isCompleted || isActive ? "#ffffff" : "rgba(255, 255, 255, 0.1)",
                                    borderColor: isCompleted || isActive ? "#ffffff" : "rgba(255, 255, 255, 0.3)",
                                }}
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                                    // Hover effect for future steps
                                    isFuture && "group-hover:border-white/50 group-hover:bg-white/5"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4 text-primary font-bold" />
                                ) : (
                                    <span className={cn(
                                        "text-xs font-bold transition-colors duration-300",
                                        isActive ? "text-primary" : "text-white"
                                    )}>
                                        {stepNum}
                                    </span>
                                )}
                            </motion.div>

                            {/* Step Label (Bottom) */}
                            <div className={cn(
                                "absolute top-12 whitespace-nowrap text-[10px] font-medium tracking-wider uppercase transition-all duration-300",
                                isActive ? "text-white opacity-100 transform translate-y-0" : "text-white/40 opacity-0 group-hover:opacity-100 transform -translate-y-1"
                            )}>
                                {step.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
