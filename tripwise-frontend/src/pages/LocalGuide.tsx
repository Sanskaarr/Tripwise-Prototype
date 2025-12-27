import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";

const LocalGuidePage = () => {
  const location = useLocation();
  const { city } = (location.state as any) || { city: "Goa" };

  return (
    <main className="mx-auto max-w-5xl px-4 py-14 md:py-16">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Step 5</p>
      <h1 className="mb-1 text-2xl font-semibold">Welcome to {city}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Here&apos;s how TripWise could guide you once you arrive.
      </p>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4 text-sm">
          <h2 className="mb-2 text-sm font-semibold">Top attractions</h2>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Sunset point at the main beach</li>
            <li>• Old town walking trail</li>
            <li>• Local market for crafts</li>
          </ul>
        </Card>

        <Card className="p-4 text-sm">
          <h2 className="mb-2 text-sm font-semibold">Local food</h2>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Family-run thali spots</li>
            <li>• Evening street food lane</li>
            <li>• Cafe for remote work</li>
          </ul>
        </Card>

        <Card className="p-4 text-sm">
          <h2 className="mb-2 text-sm font-semibold">Culture & rules</h2>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Dress modestly at temples</li>
            <li>• Check local quiet hours</li>
            <li>• Respect no-photo zones</li>
          </ul>
        </Card>

        <Card className="p-4 text-sm">
          <h2 className="mb-2 text-sm font-semibold">Emergency contacts</h2>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• 112 – National emergency</li>
            <li>• Local hospital: +91-000-000-0000</li>
            <li>• TripWise support (demo)</li>
          </ul>
        </Card>

        <Card className="p-4 text-sm md:col-span-2 lg:col-span-3">
          <h2 className="mb-2 text-sm font-semibold">Map view (placeholder)</h2>
          <div className="h-64 w-full rounded-2xl border border-dashed border-muted bg-muted/40" />
          <p className="mt-2 text-xs text-muted-foreground">
            In a real build this could embed a live map with your hotel, stations, and saved places.
          </p>
        </Card>
      </section>
    </main>
  );
};

export default LocalGuidePage;
