import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { paymentAPI } from "@/services/api";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { trip, chosen } = (location.state as any) || {};
  const total = chosen?.price || 7200;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await paymentAPI.processPayment({
        bookingId: Math.random().toString(36).substr(2, 9),
        amount: typeof total === 'number' ? total : 7200,
        paymentMethod: "Card",
      });

      if (response.success) {
        toast({ title: "Payment Successful", description: `Transaction ID: ${response.transactionId}` });
        navigate("/guide", { state: { city: trip?.to || "Goa" } });
      } else {
        toast({ title: "Payment Failed", description: response.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-14 md:py-16">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Step 4</p>
      <h1 className="mb-4 text-2xl font-semibold">Payment</h1>

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
        <p className="text-lg font-semibold">₹ {total}</p>
      </Card>

      <form onSubmit={handlePayment} className="space-y-4">
        <Card className="p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="0000 0000 0000 0000" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" required />
              </div>
            </div>
          </div>
        </Card>

        <Button type="submit" disabled={loading} className="w-full text-xs uppercase tracking-[0.24em]">
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </form>
    </main>
  );
};

export default PaymentPage;
