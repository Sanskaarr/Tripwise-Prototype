import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { trip, chosen } = (location.state as any) || {};
  const total = chosen?.price || "₹ 7,200";

  const handleSuccess = () => {
    toast({ title: "Payment marked as successful", description: "TripWise has saved this demo booking." });
    navigate("/guide", { state: { city: trip?.to || "Goa" } });
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-14 md:py-16">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Step 4</p>
      <h1 className="mb-4 text-2xl font-semibold">Payment (demo only)</h1>

      <Card className="mb-6 space-y-3 p-5 text-sm">
        <p className="font-semibold">Trip summary</p>
        <p className="text-muted-foreground">
          {trip?.from && trip?.to
            ? `${trip.from} → ${trip.to} on ${trip.date || "your selected date"}`
            : "Sample journey for this demo"}
        </p>
        {chosen && (
          <p className="text-xs text-muted-foreground">{chosen.title}</p>
        )}
        <p className="pt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</p>
        <p className="text-lg font-semibold">{total}</p>
      </Card>

      <Card className="mb-6 flex flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground">
        <div className="mb-2 h-40 w-40 rounded-2xl border border-dashed border-muted bg-muted/40" />
        <p>QR code placeholder · In a real app this would be your UPI or card payment screen.</p>
      </Card>

      <Button onClick={handleSuccess} className="w-full text-xs uppercase tracking-[0.24em]">
        Mark payment as successful
      </Button>
    </main>
  );
};

export default PaymentPage;
