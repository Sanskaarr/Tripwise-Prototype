import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoMark from "@/assets/tripwise-logo.png";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "start-trip", label: "Start Journey" },
  { id: "journeys", label: "Plan Trip" },
  { id: "journeys", label: "Local Guide" },
];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const offset = 96; // approximate header height
  const target = window.scrollY + rect.top - offset;
  window.scrollTo({ top: target, behavior: "smooth" });
};

export const SiteHeader = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center">
      <div
        className={`pointer-events-auto mt-4 flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2.5 text-xs font-medium md:px-5 md:py-3 lg:px-6 lg:text-sm glass-nav transition-all duration-300 ${
          scrolled ? "scale-[1.02] bg-opacity-100" : "bg-opacity-95"
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-full px-1 py-0.5 hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <img
              src={logoMark}
              alt="TripWise logo showing a stylized airplane icon"
              className="h-7 w-7 object-contain transition-transform duration-300 hover:scale-110 active:scale-95"
            />
            <div className="leading-tight text-left">
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80">AI travel companion</span>
              <div className="text-sm font-semibold md:text-base">TripWise</div>
            </div>
          </button>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="story-link text-[13px] text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            className="hidden md:inline-flex text-[13px]"
            onClick={() => scrollToSection("start-trip")}
          >
            Start your trip
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/80 backdrop-blur-md transition hover:bg-background md:h-9 md:px-4"
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[8px] text-background transition-transform ${
                menuOpen ? "rotate-90" : ""
              }`}
            >
              ☼
            </span>
          </button>
        </div>
      </div>

      {/* Full-page menu overlay */}
      <div
        className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-400 ${
          menuOpen ? "pointer-events-auto opacity-100" : "opacity-0"
        }`}
      >
        {menuOpen && (
          <div className="flex h-full w-full flex-col bg-background px-6 pb-10 pt-8 text-foreground md:px-24">
            <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
              <span>TripWise</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/90 text-xs shadow-sm hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-between">
              <div className="mt-16 space-y-10">
                {NAV_ITEMS.map((item, index) => (
                  <button
                    key={item.id + item.label}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      scrollToSection(item.id);
                    }}
                    className="group flex w-full items-baseline gap-6 text-left"
                  >
                    <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                      0{index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-[2.75rem]">
                        {item.label}
                      </div>
                      {index === 0 && (
                        <div className="mt-4 h-px w-full bg-secondary/60" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                <span>🌐 Available in 10+ languages</span>
                <span>✈️ AI-powered travel companion</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
