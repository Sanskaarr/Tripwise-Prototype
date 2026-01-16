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

        <motion.div
          className="w-full max-w-xl relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Glass Card - Grounded Style */}
          <div className="ios-glass relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            {/* Inner shimmer */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer opacity-40" />

            {/* Corner Glows */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-400/20 blur-3xl" />

            <div className="relative space-y-8 text-center">
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
                      <Button
                        onClick={handleResume}
                        className="group relative h-14 min-w-[200px] overflow-hidden rounded-2xl bg-primary text-sm font-bold uppercase tracking-[0.1em] text-primary-foreground transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Resume <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      </Button>

                      <Button
                        onClick={handleStartPlanning}
                        variant="ghost"
                        className="h-14 min-w-[140px] rounded-2xl text-muted-foreground font-medium hover:bg-black/5 hover:text-foreground transition-colors"
                      >
                        Start Fresh
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleStartPlanning}
                    disabled={isCreating}
                    size="lg"
                    className="group relative h-16 w-full overflow-hidden rounded-2xl bg-primary text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isCreating ? (
                      <span className="relative z-10 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Starting...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center">
                        Begin Planning
                        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                    {!isCreating && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </Button>
                )}

                <p className="text-[10px] text-muted-foreground/40 font-bold tracking-[0.2em] uppercase pt-2">
                  Takes about 5 minutes • Auto-saved
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div >
      </div >
    </>
  );
}
