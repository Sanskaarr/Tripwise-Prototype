import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PageTransition } from '@/components/layout/PageTransition';
'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileStore } from '@/store/profileStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { Loader2, Plane, Map, ArrowRight } from 'lucide-react';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { SiteHeader } from '@/components/layout/SiteHeader';

export default function PlanWelcomePage() {
  const navigate = useNavigate();
  const { profileId, currentStep, initializeProfile } = useProfileStore(useShallow(state => ({
    profileId: state.profileId,
    currentStep: state.currentStep,
    initializeProfile: state.initializeProfile
  })));
  const [isCreating, setIsCreating] = useState(false);

  // Check if user has existing profile
  useEffect(() => {
    if (profileId && currentStep > 1) {
      // User has progress, redirect to their current step
      navigate(`/plan/step/${currentStep}`);
    }
  }, [profileId, currentStep, navigate]);

  const handleStartPlanning = () => {
    setIsCreating(true);

    try {
      // Initialize profile with generated ID if one doesn't exist
      if (!profileId) {
        const newProfileId = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        initializeProfile(newProfileId);
      }

      // Navigate to step 1
      navigate('/plan/step/1');
    } catch (error) {
      console.error('Error starting planning:', error);
      setIsCreating(false);
    }
  };

  const handleResume = () => {
    navigate(`/plan/step/${currentStep}`);
  };

  return (
    <>
      <LiquidBackground />
      <SiteHeader />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Floating background elements matching AuthPage subtlety */}
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-blue-500/5 blur-[100px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] rounded-full bg-purple-500/5 blur-[100px]"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <PageTransition className="w-full max-w-xl relative z-10">
          <GlassCard glowColor="purple" className="p-8 md:p-12">
            <div className="relative space-y-8 text-center">
              {/* Icon/Logo mark */}
              <motion.div
                className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1, delay: 0.2 }}
              >
                <div className="relative">
                  <Plane className="w-8 h-8 text-white/90" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full blur-[2px]"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 mb-6">
                    Let's Begin
                  </p>

                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.1]">
                    Let's craft your <br />
                    <span className="mt-3 block font-handwriting text-5xl md:text-6xl italic text-primary/90 lowercase">
                      perfect journey
                    </span>
                  </h1>
                </motion.div>

                <motion.p
                  className="text-base md:text-lg text-muted-foreground/80 max-w-md mx-auto font-light leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  We'll guide you through a few simple steps to understand your travel style and preferences.
                </motion.p>
              </div>

              {/* Divider */}
              <motion.div
                className="flex items-center gap-4 py-2"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                {profileId && currentStep > 1 ? (
                  <div className="space-y-6 bg-white/40 rounded-3xl p-6 border border-white/20 backdrop-blur-sm shadow-sm ring-1 ring-black/5">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="font-medium text-sm tracking-wide">Trip in progress • Step {currentStep} of 12</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                      <PremiumButton
                        onClick={handleResume}
                        variant="primary"
                        className="min-w-[200px]"
                      >
                        Resume <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </PremiumButton>

                      <PremiumButton
                        onClick={handleStartPlanning}
                        variant="ghost"
                        className="min-w-[140px]"
                      >
                        Start Fresh
                      </PremiumButton>
                    </div>
                  </div>
                ) : (
                  <PremiumButton
                    onClick={handleStartPlanning}
                    isLoading={isCreating}
                    variant="primary"
                    fullWidth
                    className="h-16 text-sm tracking-[0.2em] uppercase"
                  >
                    {!isCreating && (
                      <>
                        Begin Planning
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </PremiumButton>
                )}

                <p className="text-[10px] text-muted-foreground/40 font-bold tracking-[0.2em] uppercase pt-2">
                  Takes about 5 minutes • Auto-saved
                </p>
              </motion.div>
            </div>
          </GlassCard>
        </PageTransition>
      </div>
    </>
  );
}
