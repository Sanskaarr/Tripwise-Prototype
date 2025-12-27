import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section 
      id="home" 
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden pt-24 pb-16 md:pt-28"
    >
      {/* Background and Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image 
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ff3e85b0-b535-4371-94be-f6c006ccc074-escape-echoes-lovable-app/assets/images/hero-plane-sunset-DcXVnwf1-1.jpg"
          alt="Airplane wing over sunset clouds, setting the scene for a cinematic TripWise journey"
          fill
          priority
          className="h-full w-full object-cover"
        />
        {/* Cinematic gradient overlay at the bottom to transition to the next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/20 via-black/5 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 text-center md:items-center">
          <div className="mx-auto max-w-3xl">
            {/* Upper Label */}
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Your journey awaits
            </p>

            {/* Display Heading */}
            <h1 
              id="hero-heading" 
              className="text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl md:leading-tight lg:text-6xl"
            >
              Discover the
              <span className="block font-accent text-primary text-5xl md:text-6xl lg:text-7xl -mt-1 md:-mt-2 lowercase">
                world
              </span>
              with TripWise
            </h1>

            {/* Description Paragraph */}
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base opacity-90">
              A unified travel companion that transforms how you explore, plan, and experience every destination—powered quietly by TripWise AI.
            </p>

            {/* Call to Action Buttons */}
            <div id="start-trip" className="mt-10 flex flex-col items-center justify-center gap-3 text-sm md:flex-row md:gap-4">
              <button 
                className="btn-cinematic h-12 rounded-full px-8 text-[11px] font-medium uppercase tracking-[0.24em] bg-primary text-primary-foreground shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start your trip
              </button>
              
              <button 
                className="btn-cinematic h-12 rounded-full px-8 text-[11px] font-medium uppercase tracking-[0.24em] border border-white/20 bg-white/10 backdrop-blur-md text-foreground transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
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

export default HeroSection;