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
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Step 3</p>
      <h1 className="mb-1 text-2xl font-semibold">Choose how you&apos;d like to travel</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {trip.from && trip.to
          ? `For this demo, here are some example options from ${trip.from} to ${trip.to}.`
          : "Here are some sample options TripWise might show you."}
      </p>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        {mockOptions.map((opt) => (
          <Card
            key={opt.id}
            className={`cursor-pointer p-4 transition hover:border-primary/60 ${
              selectedId === opt.id ? "border-primary shadow-md" : ""
            }`}
            onClick={() => setSelectedId(opt.id)}
          >
            <h2 className="mb-1 text-sm font-semibold">{opt.title}</h2>
            <p className="text-xs text-muted-foreground">{opt.subtitle}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{opt.time}</p>
            <p className="mt-3 text-sm font-semibold">{opt.price}</p>
          </Card>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold">Suggested stays</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {mockHotels.map((hotel) => (
            <Card key={hotel.id} className="p-4 text-sm">
              <p className="font-semibold">{hotel.name}</p>
              <p className="text-xs text-muted-foreground">{hotel.details}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{hotel.price}</p>
            </Card>
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
