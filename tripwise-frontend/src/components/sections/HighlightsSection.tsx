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
      id="highlights"
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(
        "relative py-40 md:py-64 transition-all duration-1000 ease-out motion-safe:translate-y-12 motion-safe:opacity-0",
        visible && "motion-safe:translate-y-0 motion-safe:opacity-100"
      )}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[140px]" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[120px]" />

      <div className="site-container">
        <div className="mb-32 flex flex-col items-center text-center space-y-8">
          <p className="font-handwriting text-3xl text-primary/40 italic">The Art of Exploration</p>
          <h2 className="font-display text-5xl font-light tracking-tighter md:text-7xl lg:text-[6rem] leading-[0.9]">
            A calm companion <br /> for every journey.
          </h2>
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

          <div className="grid gap-12 md:grid-cols-3">
            {items.map((item, index) => (
              <article
                key={item.title}
                className={cn(
                  "glass-panel group relative flex flex-col p-10 space-y-10 transition-all duration-700",
                  visible && `motion-safe:[transition-delay:${index * 200}ms]`
                )}
              >

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-primary/60">
                    {item.eyebrow}
                  </span>
                  <div className="h-[1px] w-8 bg-primary/10 transition-all group-hover:w-12 group-hover:bg-primary/30" />
                </div>
                
                <h3 className="font-display text-3xl font-light leading-[1.1] tracking-tight md:text-4xl">
                  {item.title}
                </h3>
                
                <p className="font-sans text-[16px] font-light leading-relaxed text-muted-foreground/70 transition-colors group-hover:text-muted-foreground">
                  {item.body}
                </p>
              </div>

              <button className="group/btn flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground transition-all hover:gap-6 hover:text-primary">
                Explore Method
                <div className="h-[1px] w-8 bg-muted-foreground/30 transition-all group-hover/btn:w-12 group-hover/btn:bg-primary" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
