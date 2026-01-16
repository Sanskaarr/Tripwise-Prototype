import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-plane-sunset.jpg";

export const HeroSection = () => {
    const [parallaxOffset, setParallaxOffset] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleScroll = () => {
            const y = window.scrollY;
            setParallaxOffset(y * -0.12);
        };

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleStartPlanning = () => {
        navigate('/auth');
    };

    return (
        <section
            id="home"
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
        >
            {/* Background Image with Parallax + Mouse Movement */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{
                    transform: `scale(1.2) translateY(${parallaxOffset}px) translateX(${mousePosition.x}px) rotateY(${mousePosition.x * 0.1}deg)`,
                }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
            >
                <div
                    className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out will-change-transform"
                    style={{
                        backgroundImage: `url(${heroImage})`,
                        filter: 'brightness(0.85) contrast(1.1) saturate(1.2)',
                    }}
                />

                {/* Enhanced Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-purple-500/20" />

                {/* Animated light rays */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-white/40 via-white/10 to-transparent rotate-12 blur-sm animate-pulse-soft" />
                    <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-white/30 via-white/5 to-transparent -rotate-6 blur-sm animate-pulse-soft" style={{ animationDelay: '1s' }} />
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-background via-background/50 to-transparent" />
            </motion.div>

            {/* Floating glass orbs for depth */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full ios-glass opacity-20 blur-3xl"
                animate={{
                    y: [-20, 20, -20],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full liquid-glass opacity-15 blur-3xl"
                animate={{
                    y: [20, -30, 20],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            <div className="site-container relative z-20 text-center">
                <motion.div
                    className="mx-auto max-w-5xl space-y-14"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <div className="space-y-6">

                        <div className="relative">
                            {/* Glowing text effect */}
                            <div className="absolute inset-0 blur-2xl opacity-40">
                                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9]">
                                    Discover the world
                                </h1>
                            </div>

                            <motion.h1
                                className="relative font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                Discover the
                                <motion.span
                                    className="mt-6 block font-handwriting text-6xl md:text-7xl lg:text-8xl italic text-white/95 lowercase"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                                >
                                    world
                                </motion.span>
                                <span className="mt-4 block text-base md:text-xl font-light tracking-[0.2em] uppercase opacity-90">with TripWise</span>
                            </motion.h1>
                        </div>
                    </div>

                    <motion.p
                        className="mx-auto max-w-xl font-sans text-base md:text-lg font-light leading-relaxed text-white/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                    >
                        Your cinematic AI travel companion. Quietly crafting journeys
                        that resonate with your soul, one destination at a time.
                    </motion.p>

                    <motion.div
                        className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                    >
                        <Button
                            size="lg"
                            className="group relative h-14 min-w-[200px] overflow-hidden rounded-full border-white/30 bg-white/15 text-[11px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-xl transition-all duration-500 hover:bg-white/25 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                            onClick={handleStartPlanning}
                        >
                            <span className="relative z-10">Start Journey</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </Button>

                        <button
                            onClick={() => {
                                const el = document.getElementById("highlights");
                                el?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="group h-14 min-w-[200px] rounded-full border-2 border-white/20 bg-white/5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 backdrop-blur-xl transition-all duration-500 hover:border-white/40 hover:bg-white/10 hover:scale-105"
                        >
                            <span className="inline-flex items-center gap-2">
                                Explore Features
                                <svg className="w-4 h-4 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                    </motion.div>


                </motion.div>
            </div>
        </section>
    );
};
