import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, ExternalLink, Home } from 'lucide-react';
import { bookingApi, type TripwiseBooking } from '@/lib/api/bookingApi';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { SiteHeader } from '@/components/layout/SiteHeader';

export default function BookingConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<TripwiseBooking | null>(null);
  const [loading, setLoading] = useState(true);

  const passUrl = `${window.location.origin}/pass/${bookingId}`;

  useEffect(() => {
    if (!bookingId) return;
    bookingApi.getBooking(bookingId).then(r => {
      if (r.data) setBooking(r.data);
    }).finally(() => setLoading(false));
  }, [bookingId]);

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 font-sans relative">
      <LiquidBackground />
      <SiteHeader />

      <div className="max-w-md mx-auto relative z-10 space-y-6 text-center">

        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Trip Confirmed!</h1>
          {booking && (
            <p className="text-muted-foreground text-sm">
              {booking.destination} · Booking #{booking.flightPnr}
            </p>
          )}
        </motion.div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex flex-col items-center gap-4"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Your Digital Travel Pass</p>
          <div className="p-4 bg-white rounded-2xl shadow-2xl">
            <QRCodeSVG
              value={passUrl}
              size={180}
              bgColor="#ffffff"
              fgColor="#1a0a2e"
              level="M"
              includeMargin={false}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-[220px]">
            Scan to access your boarding pass, hotel voucher and transport details
          </p>
        </motion.div>

        {/* Booking refs */}
        {booking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-white/10 bg-white/[0.025] divide-y divide-white/[0.05] text-left overflow-hidden"
          >
            {[
              { label: booking.airline ? `${booking.airline} ${booking.transportNumber || ''}`.trim() : 'Flight / Transport', value: booking.flightPnr },
              { label: 'Hotel Voucher', value: booking.hotelConfirmationRef || booking.hotelRef },
              { label: 'Local Transport', value: booking.localTransportBookingRef || booking.transportRef },
              { label: 'Total Paid', value: booking.totalAmount },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center px-5 py-3">
                <span className="text-muted-foreground text-sm">{label}</span>
                <span className="text-white text-sm font-mono">{value}</span>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex flex-col gap-3">
          <a
            href={passUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            View Digital Pass
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 rounded-2xl border border-white/10 text-muted-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
}
