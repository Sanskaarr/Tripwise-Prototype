import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export const HighlightsSection = () => {
  const items = [
    {
      eyebrow: "01",
      title: "Plan with TripWise AI",
      body: "Share how you travel and let TripWise sketch routes, timings, and must-see moments in seconds.",
    },
    {
      eyebrow: "02",
      title: "Itineraries that flex",
      body: "Swap plans on the fly. Your companion adapts days around energy, weather, and what you discover.",
    },
    {
      eyebrow: "03",
      title: "One clear brief",
      body: "Keep confirmations, directions, and local notes in a single, cinematic trip view you can just follow.",
    },
  ];

  const { ref, visible } = useScrollReveal();

  return (
    <section
      id="journeys"
      ref={ref as React.RefObject<HTMLElement>}
      aria-labelledby="journeys-heading"
      className={cn(
        "mb-20 md:mb-24 lg:mb-28 transition-all duration-700 motion-safe:translate-y-6 motion-safe:opacity-0",
        visible && "motion-safe:translate-y-0 motion-safe:opacity-100"
      )}
    >
      <div className="site-container space-y-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <p className="section-label">TripWise · How it helps</p>
            <h2
              id="journeys-heading"
              className="text-balance text-2xl font-semibold leading-snug md:text-3xl lg:text-[2.3rem]"
            >
              A calm companion
              <br />
              for every journey.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            Less tab chaos, more presence. TripWise quietly keeps timing, tickets, and turns in sync while you enjoy
            the view.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.title}
              className={cn(
                "glass-panel hover-lift flex flex-col justify-between p-5 text-sm md:p-6 transition-all duration-700 motion-safe:translate-y-6 motion-safe:opacity-0",
                visible && `motion-safe:translate-y-0 motion-safe:opacity-100`,
                visible && `motion-safe:[transition-delay:${index * 80}ms]`
              )}
            >
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{item.eyebrow}</span>
                <h3 className="text-base font-semibold md:text-lg">{item.title}</h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>Trip preview</span>
                <span className="story-link text-[11px]">See a sample flow</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
