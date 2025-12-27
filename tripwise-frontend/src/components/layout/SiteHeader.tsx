import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoMark from "@/assets/tripwise-logo.png";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "start-trip", label: "Start Journey" },
  { id: "journeys", label: "Plan Trip" },
  { id: "guide", label: "Local Guide" },
];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const offset = 96;
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
        className={`pointer-events-auto mt-4 flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2.5 md:px-5 md:py-3 lg:px-6 glass-nav transition-all duration-300 ${
          scrolled ? "bg-white/80" : "bg-white/70"
        }`}
        style={{
          boxShadow: 'rgba(255, 255, 255, 0.55) 0px 0px 0px 1px, rgba(156, 179, 201, 0.4) 0px 18px 60px 0px',
          height: '71.5px'
        }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-full px-1 py-0.5 transition-transform duration-300 hover:scale-[1.02] focus:outline-none"
          >
            <img
              src={logoMark}
              alt="TripWise logo"
              className="h-7 w-7 object-contain transition-transform duration-300 hover:scale-110 active:scale-95"
            />
            <div className="leading-tight text-left">
              <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500/80">
                AI travel companion
              </span>
              <div className="text-sm font-semibold text-[#0F172A] md:text-base font-sans">
                TripWise
              </div>
            </div>
          </button>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (window.location.pathname !== "/") {
                  navigate("/");
                  setTimeout(() => scrollToSection(item.id), 100);
                } else {
                  scrollToSection(item.id);
                }
              }}
              className="relative text-[13px] font-medium text-slate-500 transition-colors hover:text-[#0F172A]"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="hidden h-9 items-center justify-center rounded-full bg-white/70 px-4 text-[13px] font-medium text-[#0F172A] shadow-sm transition-transform hover:scale-105 active:scale-95 md:inline-flex border border-slate-200/50"
            onClick={() => navigate("/identify")}
          >
            Start your trip
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200/60 bg-white/70 px-3 py-0 backdrop-blur-md transition hover:bg-white md:px-4"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0F172A]/80">
              {menuOpen ? "Close" : "Menu"}
            </span>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full bg-[#0F172A] text-[8px] text-[#F1F5F9] transition-transform ${
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
        className={`pointer-events-none fixed inset-0 z-30 transition-all duration-500 ${
          menuOpen ? "pointer-events-auto opacity-100 backdrop-blur-xl" : "opacity-0 backdrop-blur-0"
        }`}
      >
        {menuOpen && (
          <div className="flex h-full w-full flex-col bg-white/95 px-6 pb-10 pt-8 text-[#0F172A] md:px-24">
            <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.26em] text-slate-500">
              <span>TripWise</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xs shadow-sm hover:bg-slate-50 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center">
              <div className="space-y-8 md:space-y-12">
                {NAV_ITEMS.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      if (window.location.pathname !== "/") {
                        navigate("/");
                        setTimeout(() => scrollToSection(item.id), 100);
                      } else {
                        scrollToSection(item.id);
                      }
                    }}
                    className="group flex w-full items-baseline gap-6 text-left"
                  >
                    <span className="text-sm font-medium uppercase tracking-[0.26em] text-slate-400">
                      0{index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl transition-transform duration-300 group-hover:translate-x-2">
                        {item.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-8 text-[11px] uppercase tracking-[0.26em] text-slate-400">
                <span>🌐 Global availability</span>
                <span>✈️ Powered by AI</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
