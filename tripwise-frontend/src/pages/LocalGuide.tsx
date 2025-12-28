import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";

const LocalGuidePage = () => {
  const location = useLocation();
  const { city } = (location.state as any) || { city: "Goa" };

    return (
      <main className="mx-auto max-w-5xl px-4 py-14 md:py-24">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.5em] text-primary/40">Step 5</p>
        <h1 className="mb-1 text-4xl font-light tracking-tight">Welcome to {city}</h1>
        <p className="mb-10 text-sm text-primary/60">
          Here&apos;s how TripWise could guide you once you arrive.
        </p>
  
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="glass-panel p-8 text-sm">
            <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Top attractions</h2>
            <ul className="space-y-3 text-xs text-primary/40">
              <li>• Sunset point at the main beach</li>
              <li>• Old town walking trail</li>
              <li>• Local market for crafts</li>
            </ul>
          </div>
  
          <div className="glass-panel p-8 text-sm">
            <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Local food</h2>
            <ul className="space-y-3 text-xs text-primary/40">
              <li>• Family-run thali spots</li>
              <li>• Evening street food lane</li>
              <li>• Cafe for remote work</li>
            </ul>
          </div>
  
          <div className="glass-panel p-8 text-sm">
            <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Culture & rules</h2>
            <ul className="space-y-3 text-xs text-primary/40">
              <li>• Dress modestly at temples</li>
              <li>• Check local quiet hours</li>
              <li>• Respect no-photo zones</li>
            </ul>
          </div>
  
          <div className="glass-panel p-8 text-sm">
            <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Emergency contacts</h2>
            <ul className="space-y-3 text-xs text-primary/40">
              <li>• 112 – National emergency</li>
              <li>• Local hospital: +91-000-000-0000</li>
              <li>• TripWise support (demo)</li>
            </ul>
          </div>
  
          <div className="glass-panel p-8 text-sm md:col-span-2 lg:col-span-3">
            <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Map view (placeholder)</h2>
            <div className="h-64 w-full rounded-[1.5rem] border border-white/10 bg-white/5 backdrop-blur-xl" />
            <p className="mt-4 text-xs text-primary/40">
              In a real build this could embed a live map with your hotel, stations, and saved places.
            </p>
          </div>
        </section>
      </main>
    );

};

export default LocalGuidePage;
