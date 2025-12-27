import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroSection } from "@/components/sections/HeroSection";
import { HighlightsSection } from "@/components/sections/HighlightsSection";

const Index = () => {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="pt-10">
        <HeroSection />
        <div className="border-t border-muted/70" />
        <HighlightsSection />
      </main>

      <footer className="border-t border-border/40 pb-6 pt-6 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        <div className="site-container flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <span>TripWise · AI-powered travel companion</span>
          <span>Begin your journey when you&apos;re ready.</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
