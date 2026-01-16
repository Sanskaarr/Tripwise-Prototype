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
        {/* Floating background elements */}
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px]"
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
          className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] rounded-full bg-purple-500/10 blur-[100px]"
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
          className="w-full max-w-2xl relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Glass Card */}
          <div className="ios-glass relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/10">
            {/* Inner shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="relative space-y-10 text-center">
              {/* Icon/Logo mark */}
              <motion.div
                className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1, delay: 0.2 }}
              >
                <div className="relative">
                  <Plane className="w-10 h-10 text-white/90" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full blur-[2px]"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white drop-shadow-sm leading-[1.1]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Let's craft your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300 font-bold">
                    Perfect Journey
                  </span>
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl text-white/70 max-w-lg mx-auto font-light leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  We'll guide you through a few simple steps to understand your travel style and preferences.
                </motion.p>
              </div>

              <motion.div
                className="space-y-6 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                {profileId && currentStep > 1 ? (
                  <div className="space-y-6 bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-3 text-white/80">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <p className="font-medium">Trip in progress • Step {currentStep} of 12</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                      <Button
                        size="lg"
                        onClick={handleResume}
                        className="group relative h-14 px-8 rounded-xl bg-white text-black hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
                          Resume Planning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>

                      <Button
                        size="lg"
                        variant="ghost"
                        onClick={handleStartPlanning}
                        className="h-14 px-8 rounded-xl text-white hover:bg-white/10 transition-colors border border-white/20 hover:border-white/40"
                      >
                        Start Fresh
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleStartPlanning}
                    disabled={isCreating}
                    className="group relative h-16 w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-[1px] shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/25"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80 transition-opacity group-hover:opacity-100" />
                    <div className="relative h-full w-full rounded-2xl bg-black/20 backdrop-blur-sm flex items-center justify-center gap-3 transition-colors group-hover:bg-transparent">
                      {isCreating ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin text-white" />
                          <span className="font-bold tracking-widest text-white uppercase text-sm">Starting...</span>
                        </>
                      ) : (
                        <>
                          <span className="font-bold tracking-[0.2em] text-white uppercase text-sm">Begin Planning</span>
                          <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </Button>
                )}

                <p className="text-xs text-white/40 font-medium tracking-wide uppercase">
                  Takes about 5 minutes • Auto-saved
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
