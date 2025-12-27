import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-plane-sunset.jpg";

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
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden pt-24 pb-16 md:pt-28"
    >
      {/* Background and Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Airplane wing over sunset clouds, setting the scene for a cinematic TripWise journey"
          loading="lazy"
          style={{ transform: `translateY(${clampedOffset}px) scale(1.1)` }}
          className="h-full w-full object-cover align-middle transition-transform duration-100 ease-out"
        />
        {/* Cinematic gradient overlay at the bottom to transition to the next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        {/* Subtle top gradient */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="site-container relative z-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 text-center md:items-center">
          <div className="mx-auto max-w-3xl">
            {/* Upper Label */}
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500">
              Your journey awaits
            </p>

            {/* Display Heading */}
            <h1
              id="hero-heading"
              className="text-balance font-display text-4xl font-semibold leading-tight text-[#0F172A] md:text-5xl md:leading-tight lg:text-6xl"
            >
              Discover the
              <span className="block font-accent text-primary text-5xl md:text-6xl lg:text-7xl -mt-1 md:-mt-2 lowercase">
                world
              </span>
              with TripWise
            </h1>

            {/* Description Paragraph */}
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-slate-500 md:text-base opacity-90">
              A unified travel companion that transforms how you explore, plan, and experience every destination—powered quietly by TripWise AI.
            </p>

            {/* Call to Action Buttons */}
            <div id="start-trip" className="mt-10 flex flex-col items-center justify-center gap-3 text-sm md:flex-row md:gap-4">
              <button
                onClick={() => navigate("/identify")}
                className="btn-cinematic h-12 rounded-full px-8 text-[11px] font-medium uppercase tracking-[0.24em] bg-primary text-white shadow-lg transition-all hover:bg-primary/90"
              >
                Start your trip
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("journeys");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="btn-cinematic h-12 rounded-full px-8 text-[11px] font-medium uppercase tracking-[0.24em] border border-white/20 bg-white/10 backdrop-blur-md text-[#0F172A] transition-all hover:bg-white/20"
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
