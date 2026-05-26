import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Plane, BedDouble, MapPin, CreditCard, Ticket } from 'lucide-react';
import { useWizardStore } from '@/store/wizardStore';
import { bookingApi } from '@/lib/api/bookingApi';
import { LiquidBackground } from '@/components/ui/LiquidBackground';

interface PaymentState {
  sessionId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

interface Step {
  icon: React.ElementType;
  label: string;
  sublabel: string;
}

type StepStatus = 'pending' | 'loading' | 'done';

export default function BookingProgressPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentState | null;
  const { selectedHotel, selectedTransport, setBookingId } = useWizardStore();

  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([
    'loading', 'pending', 'pending', 'pending', 'pending',
  ]);
  const [bookingId, setLocalBookingId] = useState<string | null>(null);
  const [animationDone, setAnimationDone] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const calledRef = useRef(false);

  const transportLabel = selectedTransport?.mode || 'your flight';
  const hotelLabel = selectedHotel?.name || 'your hotel';

  const steps: Step[] = [
    { icon: CreditCard,  label: 'Payment secured',                   sublabel: 'Razorpay payment verified' },
    { icon: Plane,       label: `Confirming ${transportLabel}`,       sublabel: 'Checking seat availability...' },
    { icon: BedDouble,   label: `Reserving ${hotelLabel}`,            sublabel: 'Locking in your room...' },
    { icon: MapPin,      label: 'Arranging local transport',          sublabel: 'Coordinating pickup & tours...' },
    { icon: Ticket,      label: 'Generating your Travel Pass',        sublabel: 'Compiling all booking refs...' },
  ];

  // Redirect if navigated here without payment state
  useEffect(() => {
    if (!state?.sessionId) {
      navigate('/dashboard', { replace: true });
    }
  }, []);

  // Call booking API once
  useEffect(() => {
    if (!state?.sessionId || calledRef.current) return;
    calledRef.current = true;

    bookingApi.createBooking(state.sessionId, {
      razorpayPaymentId: state.razorpayPaymentId,
      razorpayOrderId: state.razorpayOrderId,
      razorpaySignature: state.razorpaySignature,
    }).then(result => {
      // Use shareToken as the public pass identifier — backend GET endpoint looks up by shareToken
      const token = result.data?.shareToken || result.data?.id;
      if (token) {
        setBookingId(token);
        setLocalBookingId(token);
      } else {
        setApiError('Booking could not be confirmed. Please contact support.');
      }
    }).catch(() => {
      setApiError('Network error. Please check your connection and try again.');
    });
  }, [state]);

  // Animate steps: each step shows for 900ms, then next appears
  useEffect(() => {
    const STEP_DELAY = 900;
    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach((_, i) => {
      // Mark step i as done, step i+1 as loading
      timers.push(setTimeout(() => {
        setStepStatuses(prev => {
          const next = [...prev] as StepStatus[];
          next[i] = 'done';
          if (i + 1 < next.length) next[i + 1] = 'loading';
          return next;
        });
      }, (i + 1) * STEP_DELAY));
    });

    // Animation fully complete after all steps done
    timers.push(setTimeout(() => setAnimationDone(true), (steps.length + 0.5) * STEP_DELAY));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Navigate when both booking is ready AND animation has finished
  useEffect(() => {
    if (bookingId && animationDone) {
      navigate(`/booking/${bookingId}`, { replace: true });
    }
  }, [bookingId, animationDone]);

  if (apiError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <LiquidBackground />
        <div className="relative z-10 max-w-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Booking Issue</h2>
          <p className="text-muted-foreground text-sm">{apiError}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <LiquidBackground />

      <div className="relative z-10 w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(124,58,237,0.3)]"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-white">Booking in Progress</h1>
          <p className="text-muted-foreground text-sm mt-1">Please don't close this page</p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <AnimatePresence>
            {steps.map((step, i) => {
              const status = stepStatuses[i];
              if (status === 'pending') return null;
              const Icon = step.icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-500 ${
                    status === 'done'
                      ? 'border-emerald-500/40 bg-emerald-500/[0.07]'
                      : 'border-primary/30 bg-primary/[0.06]'
                  }`}
                >
                  {/* Left icon */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                    status === 'done' ? 'bg-emerald-500/20' : 'bg-primary/15'
                  }`}>
                    <Icon className={`w-4 h-4 ${status === 'done' ? 'text-emerald-400' : 'text-primary'}`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${status === 'done' ? 'text-white' : 'text-white/80'}`}>
                      {step.label}
                    </p>
                    {status === 'loading' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-muted-foreground mt-0.5"
                      >
                        {step.sublabel}
                      </motion.p>
                    )}
                  </div>

                  {/* Right status */}
                  <div className="flex-shrink-0">
                    {status === 'done' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </motion.div>
                    ) : (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground">
          Generating your booking confirmations and Travel Pass…
        </p>
      </div>
    </div>
  );
}
