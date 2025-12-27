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
        const numericAmount = typeof total === 'string' 
          ? parseInt(total.replace(/[^\d]/g, '')) 
          : (typeof total === 'number' ? total : 7200);
        
        const response = await paymentAPI.processPayment({
          bookingId: Math.random().toString(36).substr(2, 9),
          amount: numericAmount,
          paymentMethod: "Card",
        });

        if (response.success) {
          const txnId = response.transactionId || response.paymentId || 'TXN-MOCK';
          toast({ title: "Payment Successful", description: `Transaction ID: ${txnId}` });
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
      <div className="glass-card p-6 md:p-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Step 4</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-white">Secure payment</h1>

        <div className="mb-8 glassmorphism p-5 rounded-xl space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Trip summary</p>
          <p className="text-white font-medium">
            {trip?.from && trip?.to
              ? `${trip.from} → ${trip.to}`
              : "Sample journey for this demo"}
          </p>
          {chosen && (
            <p className="text-sm text-gray-400">{chosen.title}</p>
          )}
          <div className="pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">Total amount</p>
            <p className="text-2xl font-bold text-primary">{total}</p>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="cardNumber" className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Card Number</label>
              <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="bg-white/5 border-white/10" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="expiry" className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Expiry Date</label>
                <Input id="expiry" placeholder="MM/YY" className="bg-white/5 border-white/10" required />
              </div>
              <div className="grid gap-2">
                <label htmlFor="cvv" className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">CVV</label>
                <Input id="cvv" placeholder="123" className="bg-white/5 border-white/10" required />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full btn-primary mt-4">
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default PaymentPage;
