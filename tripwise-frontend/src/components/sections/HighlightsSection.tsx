import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const FeatureCard = ({ number, title, description, delay, visible }: { number: string; title: string; description: string; delay: string; visible: boolean }) => {
  return (
    <article
      className={cn(
        "glass-panel hover-lift flex flex-col justify-between p-5 text-sm md:p-6 transition-all duration-700 motion-safe:translate-y-6 motion-safe:opacity-0",
        visible && "motion-safe:translate-y-0 motion-safe:opacity-100"
      )}
      style={{ transitionDelay: delay }}
    >
      <div className="space-y-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500/80">
          {number}
        </span>
        <h3 className="text-base font-semibold text-[#0F172A] md:text-lg">
          {title}
        </h3>
        <p className="text-[13px] leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
        <span>Trip preview</span>
        <button className="transition-colors hover:text-primary uppercase tracking-[0.22em]">
          See a sample flow
        </button>
      </div>
    </article>
  );
};

export const HighlightsSection = () => {
  const { ref, visible } = useScrollReveal();

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
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(
        "mb-20 pt-20 transition-all duration-700 md:mb-24 lg:mb-32",
        "motion-safe:translate-y-6 motion-safe:opacity-0",
        visible && "motion-safe:translate-y-0 motion-safe:opacity-100"
      )}
    >
      <div className="site-container">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <p className="section-label">
              TripWise · How it helps
            </p>
            <h2
              id="journeys-heading"
              className="text-balance font-display text-3xl font-semibold leading-snug text-[#0F172A] md:text-4xl lg:text-[2.3rem]"
            >
              A calm companion
              <br className="hidden md:block" /> for every journey.
            </h2>
          </div>
          <p className="max-w-xs pb-1 text-sm leading-relaxed text-slate-500 md:text-[15px]">
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
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
