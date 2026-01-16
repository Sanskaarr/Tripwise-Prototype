import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-plane-sunset.jpg";

export const HeroSection = () => {
    const [parallaxOffset, setParallaxOffset] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleScroll = () => {
            const y = window.scrollY;
            setParallaxOffset(y * -0.08);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
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
            {/* Background Image with Parallax */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroImage}
                    alt="Sunset journey background"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform"
                    style={{ transform: `scale(1.1) translateY(${parallaxOffset}px)` }}
                />

                {/* Enhanced Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-purple-500/10" />

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>

            <div className="site-container relative z-20 text-center">
                <div className="mx-auto max-w-5xl space-y-14 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                    <div className="space-y-6">
                        <div className="relative">
                            {/* Glowing text effect */}
                            <div className="absolute inset-0 blur-2xl opacity-40">
                                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9]">
                                    Discover the world
                                </h1>
                            </div>

                            <h1 className="relative font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9]">
                                Discover the
                                <span className="mt-6 block font-handwriting text-6xl md:text-7xl lg:text-8xl italic text-white/95 lowercase">
                                    world
                                </span>
                                <span className="mt-4 block text-base md:text-xl font-light tracking-[0.2em] uppercase opacity-90">with TripWise</span>
                            </h1>
                        </div>
                    </div>

                    <p className="mx-auto max-w-xl font-sans text-base md:text-lg font-light leading-relaxed text-white/80 backdrop-blur-sm">
                        Your cinematic AI travel companion. Quietly crafting journeys
                        that resonate with your soul, one destination at a time.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
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
                    </div>


                </div>
            </div>
        </section>
    );
};
