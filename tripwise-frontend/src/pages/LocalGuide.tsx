import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";

const LocalGuidePage = () => {
  const location = useLocation();
  const { city } = (location.state as any) || { city: "Goa" };

  return (
    <main className="mx-auto max-w-5xl px-4 py-14 md:py-16">
      <div className="glass-card p-6 md:p-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Step 5</p>
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-white">Welcome to {city}</h1>
        <p className="mb-8 text-sm text-gray-400">
          Here&apos;s how TripWise could guide you once you arrive.
        </p>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="glassmorphism p-6 rounded-xl">
            <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Top attractions</h2>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Sunset point at the main beach</li>
              <li>• Old town walking trail</li>
              <li>• Local market for crafts</li>
            </ul>
          </div>

          <div className="glassmorphism p-6 rounded-xl">
            <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Local food</h2>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Family-run thali spots</li>
              <li>• Evening street food lane</li>
              <li>• Cafe for remote work</li>
            </ul>
          </div>

          <div className="glassmorphism p-6 rounded-xl">
            <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Culture & rules</h2>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Dress modestly at temples</li>
              <li>• Check local quiet hours</li>
              <li>• Respect no-photo zones</li>
            </ul>
          </div>

          <div className="glassmorphism p-6 rounded-xl">
            <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Emergency</h2>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• 112 – National emergency</li>
              <li>• Local hospital: +91-000-000-0000</li>
              <li>• TripWise support (demo)</li>
            </ul>
          </div>

          <div className="glassmorphism p-6 rounded-xl md:col-span-2 lg:col-span-3">
            <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Map view (placeholder)</h2>
            <div className="h-64 w-full rounded-2xl border border-dashed border-white/20 bg-white/5" />
            <p className="mt-4 text-xs text-gray-500">
              In a real build this could embed a live map with your hotel, stations, and saved places.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LocalGuidePage;
