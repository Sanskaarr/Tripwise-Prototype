import React from 'react';

const FeatureCard = ({ number, title, description, delay }: { number: string; title: string; description: string; delay: string }) => {
  return (
    <article 
      className={`glass-panel flex flex-col justify-between p-5 text-sm md:p-6 transition-all duration-700 motion-safe:translate-y-0 motion-safe:opacity-100`}
      style={{ transitionDelay: delay }}
    >
      <div className="space-y-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500/80 font-medium">
          {number}
        </span>
        <h3 className="text-base font-semibold md:text-lg text-slate-900">
          {title}
        </h3>
        <p className="text-[13px] leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-slate-400 font-medium">
        <span>Trip preview</span>
        <button className="hover:text-teal-600 transition-colors uppercase tracking-[0.22em]">
          See a sample flow
        </button>
      </div>
    </article>
  );
};

export default function Features() {
  const features = [
    {
      number: "01",
      title: "Plan with TripWise AI",
      description: "Share how you travel and let TripWise sketch routes, timings, and must-see moments in seconds.",
      delay: "0ms"
    },
    {
      number: "02",
      title: "Itineraries that flex",
      description: "Swap plans on the fly. Your companion adapts days around energy, weather, and what you discover.",
      delay: "80ms"
    },
    {
      number: "03",
      title: "One clear brief",
      description: "Keep confirmations, directions, and local notes in a single, cinematic trip view you can just follow.",
      delay: "160ms"
    }
  ];

  return (
    <section 
      id="journeys" 
      className="mb-20 md:mb-24 lg:mb-32 pt-20 transition-all duration-700 motion-safe:translate-y-0 motion-safe:opacity-100"
    >
      <div className="container px-6 lg:px-0">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end mb-12">
          <div className="space-y-4">
            <p className="section-label text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500/70">
              TripWise · How it helps
            </p>
            <h2 
              id="journeys-heading" 
              className="text-balance text-3xl font-semibold leading-snug md:text-4xl lg:text-[2.3rem] text-slate-900"
            >
              A calm companion<br className="hidden md:block" /> for every journey.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500 md:text-[15px] pb-1">
            Less tab chaos, more presence. TripWise quietly keeps timing, tickets, and turns in sync while you enjoy the view.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard 
              key={feature.number}
              number={feature.number}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}