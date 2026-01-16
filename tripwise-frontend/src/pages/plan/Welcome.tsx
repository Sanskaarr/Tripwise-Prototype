import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { SiteHeader } from "@/components/layout/SiteHeader";

const Welcome = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (name.trim()) {
      sessionStorage.setItem("travelerName", name);
      navigate("/plan/step/1");
    }
  };

  return (
    <>
      <LiquidBackground />
      <SiteHeader />

      <div className="relative flex min-h-screen items-center justify-center px-4">
        {/* Floating glass orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full liquid-glass opacity-10 blur-3xl"
          animate={{
            y: [-30, 30, -30],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full ios-glass opacity-15 blur-3xl"
          animate={{
            y: [20, -40, 20],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        <motion.div
          className="relative w-full max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main glass panel with enhanced effects */}
          <div className="ios-glass relative overflow-hidden rounded-[3rem] p-12 md:p-16 shadow-2xl">
            {/* Shimmer effect on border */}
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer opacity-40" />

            {/* Top corner glow */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-400/20 blur-3xl" />

            <div className="relative space-y-12">
              <div className="space-y-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/60">
                    Step 0 of 12
                  </p>

                  <motion.h1
                    className="mt-8 font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.9]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Welcome to
                    <span className="mt-4 block font-handwriting text-6xl md:text-7xl lg:text-8xl italic lowercase text-primary/90">
                      TripWise
                    </span>
                  </motion.h1>
                </motion.div>

                <motion.p
                  className="mx-auto max-w-md text-base text-muted-foreground/80 leading-relaxed md:text-lg font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  Let's craft your perfect journey. What should we call you?
                </motion.p>
              </div>

              {/* Divider with animation */}
              <motion.div
                className="flex items-center gap-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium tracking-wide"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                    className="h-16 rounded-2xl border-white/20 bg-white/5 px-6 text-lg backdrop-blur-xl transition-all duration-300 placeholder:text-muted-foreground/40 focus:border-primary/50 focus:bg-white/10 focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={!name.trim()}
                  size="lg"
                  className="group relative h-16 w-full overflow-hidden rounded-2xl bg-primary text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10">Begin Your Journey</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              </motion.div>

              {/* Bottom quote */}
              <motion.p
                className="text-center font-handwriting text-xl italic text-muted-foreground/50 md:text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                "Every journey begins with a single step"
              </motion.p>
            </div>
          </div>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/20 blur-sm"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 60}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default Welcome;
