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
    <main className="mx-auto max-w-5xl px-4 py-14 md:py-16">
      <div className="glass-card p-6 md:p-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Step 3</p>
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-white">Choose how you&apos;d like to travel</h1>
        <p className="mb-8 text-sm text-gray-400">
          {trip.from && trip.to
            ? `For this demo, here are some example options from ${trip.from} to ${trip.to}.`
            : "Here are some sample options TripWise might show you."}
        </p>

        <section className="mb-10 grid gap-6 md:grid-cols-2">
          {mockOptions.map((opt) => (
            <div
              key={opt.id}
              className={`cursor-pointer glassmorphism p-6 rounded-xl transition-all duration-300 hover:border-primary/60 ${
                selectedId === opt.id ? "border-primary ring-1 ring-primary shadow-glow" : ""
              }`}
              onClick={() => setSelectedId(opt.id)}
            >
              <h2 className="mb-1 text-base font-bold text-white">{opt.title}</h2>
              <p className="text-sm text-gray-400">{opt.subtitle}</p>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">{opt.time}</p>
              <p className="mt-2 text-lg font-bold text-primary">{opt.price}</p>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">Suggested stays</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {mockHotels.map((hotel) => (
              <div key={hotel.id} className="glassmorphism p-4 rounded-xl">
                <p className="font-bold text-white">{hotel.name}</p>
                <p className="text-xs text-gray-400">{hotel.details}</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">{hotel.price}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <Button onClick={handleContinue} className="btn-primary">
            Continue to payment
          </Button>
        </div>
      </div>
    </main>
  );
};

export default BookingOptionsPage;
