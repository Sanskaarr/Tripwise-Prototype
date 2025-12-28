import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-plane-sunset.jpg";
import { Button } from "@/components/ui/button";

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        {/* Aesthetic Overlays */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        
          {/* SMOOTH MERGE: The crucial gradient to blend into the next section */}
          <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-transparent via-transparent to-transparent" />
        </div>

        <div className="site-container relative z-20 text-center">

        <div className="mx-auto max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/60">
              Personalized Discovery
            </p>
            <h1 className="font-display text-6xl font-light tracking-tighter text-white md:text-8xl lg:text-[9rem] leading-[0.85]">
              Discover the 
              <span className="mt-6 block font-handwriting text-5xl italic text-white/90 lowercase md:mt-8 md:text-7xl lg:text-8xl">
                world
              </span>
              <span className="mt-2 block">with TripWise</span>
            </h1>
          </div>

          <p className="mx-auto max-w-xl font-sans text-sm font-light leading-relaxed text-white/70 md:text-base">
            Your cinematic AI travel companion. Quietly crafting journeys 
            that resonate with your soul, one destination at a time.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button
              size="lg"
              className="ios-glass h-14 min-w-[200px] border-white/20 bg-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-white/20"
              onClick={() => navigate("/identify")}
            >
              Start Journey
            </Button>
            <button
              onClick={() => {
                const el = document.getElementById("highlights");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-14 min-w-[200px] rounded-full border border-white/10 bg-transparent text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition-all hover:bg-white/5 hover:text-white"
            >
              Explore Features
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
