import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-plane-sunset.jpg";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const handleScroll = () => {
      const y = window.scrollY;
      setParallaxOffset(y * -0.06);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const clampedOffset = Math.max(-32, Math.min(32, parallaxOffset));

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24 pb-16 md:pt-28"
    >
      {/* Full-bleed hero image */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Airplane wing over sunset clouds, setting the scene for a cinematic TripWise journey"
          loading="lazy"
          style={{ transform: `translateY(${clampedOffset}px)` }}
          className="h-full w-full object-cover align-middle"
        />
        {/* Subtle top gradient to avoid any visible edge on light backgrounds */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/15 via-black/5 to-transparent" />
        {/* Very light bottom gradient: keep ~80% of the image visible while ensuring text readability */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
      </div>

      <div className="site-container relative z-10 items-center pt-0">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 text-center md:items-center">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Your journey awaits
            </p>
            <h1
              id="hero-heading"
              className="text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl md:leading-tight lg:text-6xl"
            >
              Discover the
              <span className="block font-handwriting text-primary text-5xl md:text-6xl lg:text-7xl">world</span>
              with TripWise
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              A unified travel companion that transforms how you explore, plan, and experience every destination—powered
              quietly by TripWise AI.
            </p>

            <div
              id="start-trip"
              className="mt-8 flex flex-col items-center justify-center gap-3 text-sm md:flex-row md:gap-4"
            >
              <Button
                variant="hero"
                size="lg"
                className="text-xs uppercase tracking-[0.24em]"
                onClick={() => navigate("/identify")}
              >
                Start your trip
              </Button>
              <button
                type="button"
                className="btn-glass text-xs uppercase tracking-[0.24em]"
                onClick={() => {
                  const el = document.getElementById("journeys");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
