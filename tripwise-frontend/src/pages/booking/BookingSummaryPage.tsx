import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Train, Bus, BedDouble, MapPin, ArrowLeft, ChevronRight, Shield, Clock, Loader2, Wallet, CreditCard } from 'lucide-react';
import { useWizardStore } from '@/store/wizardStore';
import { useProfileStore } from '@/store/profileStore';
import { parseMasterPlan, extractTotalCostNumber } from '@/types/masterPlan';
import { paymentService } from '@/services/paymentService';
import { walletService } from '@/services/walletService';
import { loadRazorpayScript } from '@/utils/razorpay';
import { InteractiveApi, type BookingExpansion } from '@/lib/api/interactiveApi';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { SiteHeader } from '@/components/layout/SiteHeader';

function TransportIcon({ mode }: { mode: string }) {
  const m = mode.toLowerCase();
  if (m.includes('train') || m.includes('rail')) return <Train className="w-5 h-5 text-blue-400" />;
  if (m.includes('bus')) return <Bus className="w-5 h-5 text-amber-400" />;
  return <Plane className="w-5 h-5 text-sky-400" />;
}

export default function BookingSummaryPage() {
  const navigate = useNavigate();
  const { sessionId, selectedHotel, selectedTransport, masterPlan, setBookingId } = useWizardStore();
  const { profileId } = useProfileStore();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expansion, setExpansion] = useState<BookingExpansion | null>(null);
  const [expandLoading, setExpandLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    setExpandLoading(true);
    InteractiveApi.getBookingDetails(sessionId)
      .then(r => { if (r.data) setExpansion(r.data); })
      .catch(() => { /* silently fall back to wizardStore data */ })
      .finally(() => setExpandLoading(false));
  }, [sessionId]);

  useEffect(() => {
    if (!profileId) return;
    walletService.getBalance(profileId)
      .then(w => setWalletBalance(w.balance))
      .catch(() => setWalletBalance(0));
  }, [profileId]);

  const plan = parseMasterPlan(masterPlan || '');
  const totalAmount = extractTotalCostNumber(plan);
  const displayTotal = plan?.totalCost || `₹${totalAmount.toLocaleString('en-IN')}`;

  const walletPortion = totalAmount > 0 ? Math.min(walletBalance, totalAmount) : 0;
  const razorpayPortion = totalAmount - walletPortion;

  const handlePay = async () => {
    if (!sessionId) { setError('Session missing. Please restart.'); return; }
    setPaying(true);
    setError(null);
    try {
      // Wallet covers the full amount — skip Razorpay entirely
      if (razorpayPortion === 0) {
        navigate('/booking/progress', {
          state: {
            sessionId,
            walletAmountUsed: walletPortion,
          },
        });
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay SDK failed to load.');

      // Create order only for the Razorpay portion (remainder after wallet)
      const order = await paymentService.createOrder(razorpayPortion);

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
          amount: order.amount,
          currency: order.currency || 'INR',
          order_id: order.id,
          name: 'TripWise',
          description: `Trip to ${plan?.tripOverview.destination || 'destination'}`,
          theme: { color: '#7c3aed' },
          handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            navigate('/booking/progress', {
              state: {
                sessionId,
                walletAmountUsed: walletPortion > 0 ? walletPortion : undefined,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
            });
            resolve();
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        });
        rzp.open();
      });
    } catch (e: any) {
      if (e?.message !== 'Payment cancelled') setError(e?.message || 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 font-sans relative">
      <LiquidBackground />
      <SiteHeader />

      <div className="max-w-lg mx-auto relative z-10 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-white">Booking Summary</h1>
            <p className="text-xs text-muted-foreground">Review before you pay</p>
          </div>
        </div>

        {/* Destination */}
        {plan && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Trip</p>
            <h2 className="text-lg font-bold text-white">{plan.tripOverview.title}</h2>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-primary" /> {plan.tripOverview.destination}
            </p>
          </div>
        )}

        {/* Arrival Transport */}
        {selectedTransport && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-sky-500/30 bg-sky-500/[0.06] px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-widest text-sky-400">Arrival Transport</p>
              {expandLoading && <Loader2 className="w-3 h-3 text-sky-400 animate-spin" />}
            </div>
            <div className="flex items-center gap-3">
              <TransportIcon mode={selectedTransport.mode} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">
                  {expansion?.transport.carrier
                    ? `${expansion.transport.carrier} ${expansion.transport.number}`
                    : selectedTransport.mode}
                </p>
                <p className="text-muted-foreground text-xs">
                  {expansion?.transport
                    ? `${expansion.transport.fromCode} → ${expansion.transport.toCode} · ${expansion.transport.class}`
                    : selectedTransport.details}
                </p>
              </div>
              <span className="ml-auto font-mono text-sm text-white/80 whitespace-nowrap">{selectedTransport.cost}</span>
            </div>
            {expansion?.transport && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {expansion.transport.departureTime} → {expansion.transport.arrivalTime}
                </span>
                <span>{expansion.transport.duration}</span>
                {expansion.transport.terminal && <span>{expansion.transport.terminal}</span>}
              </div>
            )}
          </motion.div>
        )}

        {/* Hotel */}
        {selectedHotel && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-widest text-emerald-400">Hotel</p>
              {expandLoading && <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />}
            </div>
            <div className="flex items-center gap-3">
              <BedDouble className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white font-semibold truncate">{selectedHotel.name}</p>
                <p className="text-muted-foreground text-xs truncate">
                  {expansion?.hotel.roomType || selectedHotel.address}
                </p>
              </div>
              <span className="ml-auto font-mono text-sm text-white/80 whitespace-nowrap">{selectedHotel.costPerNight}/night</span>
            </div>
            {expansion?.hotel && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-muted-foreground">
                <span>Check-in {expansion.hotel.checkInTime}</span>
                <span>·</span>
                <span>Check-out {expansion.hotel.checkOutTime}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Budget breakdown */}
        {plan && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-2xl border border-white/10 bg-white/[0.025] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Cost Breakdown</p>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {plan.budgetBreakdown.map((item, i) => (
                <div key={i} className="flex justify-between px-5 py-3">
                  <span className="text-muted-foreground text-sm">{item.category}</span>
                  <span className="text-white/80 text-sm font-mono">{item.cost}</span>
                </div>
              ))}
              <div className="flex justify-between px-5 py-4 bg-primary/[0.08]">
                <span className="text-white font-extrabold">Total</span>
                <span className="text-primary font-extrabold text-xl font-mono">{displayTotal}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Wallet breakdown — shown whenever wallet has any balance */}
        {walletPortion > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="rounded-2xl border border-primary/25 bg-primary/[0.05] px-5 py-4 space-y-3">
            <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold">Payment Breakdown</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-primary" /> TripWise Wallet
                </span>
                <span className="text-emerald-400 font-mono font-semibold">
                  − ₹{walletPortion.toLocaleString('en-IN')}
                </span>
              </div>
              {razorpayPortion > 0 ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-muted-foreground" /> Pay via Razorpay
                  </span>
                  <span className="text-white font-mono font-semibold">
                    ₹{razorpayPortion.toLocaleString('en-IN')}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-emerald-400 font-medium">
                  Fully covered by your wallet — no card needed
                </p>
              )}
            </div>
          </motion.div>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">{error}</p>
        )}

        <motion.button
          onClick={handlePay}
          disabled={paying}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(124,58,237,0.35)]"
        >
          {paying ? 'Processing…' : razorpayPortion === 0
            ? `Confirm & Pay from Wallet`
            : `Confirm & Pay ₹${razorpayPortion.toLocaleString('en-IN')}`}
          {!paying && <ChevronRight className="w-5 h-5" />}
        </motion.button>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5" /> Secure payment powered by Razorpay
        </div>
      </div>
    </div>
  );
}
