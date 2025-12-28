import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const mockOptions = [
  {
    id: "opt1",
    title: "Morning Express – Train",
    subtitle: "Mumbai → Goa",
    time: "06:10 · 9h 30m",
    price: "₹ 1,850",
  },
  {
    id: "opt2",
    title: "Evening Flight",
    subtitle: "Mumbai → Goa",
    time: "19:45 · 1h 10m",
    price: "₹ 5,400",
  },
];

const mockHotels = [
  { id: "h1", name: "Seabreeze Stay", details: "Near beach · Breakfast included", price: "₹ 2,800 / night" },
  { id: "h2", name: "Old Town Homestay", details: "Walkable to cafes", price: "₹ 2,200 / night" },
];

const BookingOptionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const trip = (location.state as any) || {};

  const handleContinue = () => {
    if (!selectedId) {
      toast({ title: "Pick an option", description: "Select a travel plan to continue." });
      return;
    }
    const chosen = mockOptions.find((o) => o.id === selectedId) || mockOptions[0];
    navigate("/payment", { state: { trip, chosen } });
  };

    return (
      <main className="mx-auto max-w-5xl px-4 py-14 md:py-24">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.5em] text-primary/40">Step 3</p>
        <h1 className="mb-1 text-4xl font-light tracking-tight">Choose how you&apos;d like to travel</h1>
        <p className="mb-10 text-sm text-primary/60">
          {trip.from && trip.to
            ? `For this demo, here are some example options from ${trip.from} to ${trip.to}.`
            : "Here are some sample options TripWise might show you."}
        </p>
  
        <section className="mb-12 grid gap-6 md:grid-cols-2">
          {mockOptions.map((opt) => (
            <div
              key={opt.id}
              className={`glass-panel cursor-pointer p-8 transition-all hover:scale-[1.02] ${
                selectedId === opt.id ? "ring-2 ring-primary bg-white/10" : ""
              }`}
              onClick={() => setSelectedId(opt.id)}
            >
              <h2 className="mb-1 text-xl font-medium">{opt.title}</h2>
              <p className="text-xs text-primary/40">{opt.subtitle}</p>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">{opt.time}</p>
              <p className="mt-2 text-lg font-medium">{opt.price}</p>
            </div>
          ))}
        </section>
  
        <section className="mb-12">
          <h2 className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">Suggested stays</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {mockHotels.map((hotel) => (
              <div key={hotel.id} className="glass-panel p-8 text-sm">
                <p className="text-xl font-medium">{hotel.name}</p>
                <p className="text-xs text-primary/40">{hotel.details}</p>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">{hotel.price}</p>
              </div>
            ))}
          </div>
        </section>


      <div className="flex justify-end">
        <Button onClick={handleContinue} className="text-xs uppercase tracking-[0.24em]">
          Continue to payment
        </Button>
      </div>
    </main>
  );
};

export default BookingOptionsPage;
