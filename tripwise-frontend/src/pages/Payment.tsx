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
      <main className="mx-auto max-w-xl px-4 py-14 md:py-24">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.5em] text-primary/40">Step 4</p>
        <h1 className="mb-8 text-4xl font-light tracking-tight">Payment</h1>
  
        <div className="glass-panel mb-8 space-y-4 p-8 text-sm">
          <p className="text-xl font-medium">Trip summary</p>
          <p className="text-primary/60">
            {trip?.from && trip?.to
              ? `${trip.from} → ${trip.to} on ${trip.date || "your selected date"}`
              : "Sample journey for this demo"}
          </p>
          {chosen && (
            <p className="text-xs text-primary/40">{chosen.title}</p>
          )}
          <div className="pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">Total</p>
            <p className="text-2xl font-medium">₹ {total}</p>
          </div>
        </div>
  
        <form onSubmit={handlePayment} className="space-y-6">
          <div className="glass-panel p-8">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="cardNumber" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Card Number</Label>
                <Input id="cardNumber" className="bg-white/5 border-white/10" placeholder="0000 0000 0000 0000" required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="expiry" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Expiry Date</Label>
                  <Input id="expiry" className="bg-white/5 border-white/10" placeholder="MM/YY" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">CVV</Label>
                  <Input id="cvv" className="bg-white/5 border-white/10" placeholder="123" required />
                </div>
              </div>
            </div>
          </div>
  
          <Button type="submit" disabled={loading} className="w-full h-14 ios-glass text-xs uppercase tracking-[0.24em] bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </main>
    );

};

export default PaymentPage;
