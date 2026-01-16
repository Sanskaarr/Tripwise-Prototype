import { SiteHeader } from '@/components/layout/SiteHeader';
import { HeroSection } from '@/components/sections/HeroSection';
import { HighlightsSection } from '@/components/sections/HighlightsSection';
import { LiquidBackground } from '@/components/ui/LiquidBackground';

const Landing = () => {
  return (
    <div className="page-shell">
      <LiquidBackground />
      <SiteHeader />
      <main>
        <HeroSection />
        <HighlightsSection />
      </main>

      <footer className="liquid-glass relative border-t border-white/10 !bg-background/20 pb-12 pt-12">
        <div className="site-container flex flex-col items-center justify-between gap-8 md:flex-row">

          <div className="flex flex-col items-center gap-4 md:items-start">
            <span className="font-display text-xl font-medium">TripWise</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
              AI-powered travel companion
            </span>
          </div>

          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
          </div>

          <div className="text-right">
            <span className="font-handwriting text-lg italic text-muted-foreground">
              Begin your journey when you're ready.
            </span>
          </div>
        </div>
        <div className="mt-12 text-center text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground/40">
          © 2024 TripWise AI · The Art of Exploration
        </div>
      </footer>
    </div>
  );
};

export default Landing;
