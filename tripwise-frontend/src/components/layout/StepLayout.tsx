import { motion, AnimatePresence } from 'framer-motion';
import ProgressIndicator from '@/components/planning/ProgressIndicator';
import FloatingNav from '@/components/ui/FloatingNav';
import { LiquidBackground } from '@/components/ui/LiquidBackground';

interface StepLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
  showProgress?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  stepNumber?: number;
  currentStepComponent?: React.ReactNode;
}

const StepLayout = ({
  children,
  currentStep,
  totalSteps = 12,
  showProgress = true
}: StepLayoutProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background */}
      <LiquidBackground />

      {/* Floating Glass Header */}
      <FloatingNav>
        {showProgress && (
          <div className="hidden md:block w-64">
            <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        )}
      </FloatingNav>

      {/* Mobile Progress - Floating pill */}
      {showProgress && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="md:hidden fixed top-20 left-4 right-4 z-40"
        >
          <div className="ios-glass px-6 py-4 rounded-full shadow-lg border border-white/20">
            <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        </motion.div>
      )}

      {/* Content */}
      <main className="relative z-10 pt-28 md:pt-32 pb-24 px-4 sm:px-6 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Glass Card Container */}
              <div className="ios-glass rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/10 relative overflow-hidden">
                {/* Inner shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                {/* Content wrapper */}
                <div className="relative">
                  {children}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom info */}
      <div className="fixed bottom-6 left-0 right-0 z-20 pointer-events-none">
        <p className="text-xs md:text-sm text-white/50 text-center font-medium tracking-wide uppercase shadow-sm">
          Your progress is saved automatically ✨
        </p>
      </div>
    </div>
  );
};

export default StepLayout;
