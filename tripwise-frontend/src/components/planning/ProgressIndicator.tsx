import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  showText?: boolean;
  className?: string;
}

const ProgressIndicator = ({
  currentStep,
  totalSteps = 12,
  showText = true,
  className = '',
}: ProgressIndicatorProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-bold text-primary tabular-nums">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      )}

      {/* iOS 26 Glass Progress Bar */}
      <div className="relative w-full h-3 rounded-full overflow-hidden ios-glass">
        {/* Track glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />

        {/* Animated progress fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent" />

          {/* Animated shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </div>

      {/* Step dots indicator with iOS 26 style */}
      <div className="flex justify-between mt-4 gap-1">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <motion.div
              key={stepNumber}
              className="relative flex flex-col items-center flex-1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <div
                className={`
                  w-2 h-2 rounded-full transition-all duration-500
                  ${isCompleted
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_8px_rgba(59,130,246,0.6)] scale-110'
                    : isCurrent
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-125'
                      : 'bg-muted-foreground/20 scale-100'
                  }
                `}
              />
              {isCurrent && (
                <>
                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute w-4 h-4 rounded-full border-2 border-primary/40"
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  {/* Glow effect */}
                  <motion.div
                    className="absolute w-3 h-3 bg-primary/30 rounded-full blur-sm"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
