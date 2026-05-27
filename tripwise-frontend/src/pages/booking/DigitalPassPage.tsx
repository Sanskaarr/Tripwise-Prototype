import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Plane, Train, Bus, BedDouble, MapPin, CalendarDays, CreditCard,
  Loader2, ArrowRight, Download, ArrowLeft, CheckCircle2, Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { bookingApi, type TripwiseBooking } from '@/lib/api/bookingApi';

// ─── helpers ─────────────────────────────────────────────────────────────────

function TransportIcon({ type, mode }: { type?: string; mode?: string }) {
  const t = ((type || mode) ?? '').toLowerCase();
  if (t.includes('train') || t.includes('rail')) return <Train className="w-4 h-4" />;
  if (t.includes('bus'))  return <Bus className="w-4 h-4" />;
  return <Plane className="w-4 h-4" />;
}

/** Ticket perforation line between sections */
function TearLine({ accentColor = 'bg-slate-100' }: { accentColor?: string }) {
  return (
    <div className="flex items-center my-0 print:hidden relative">
      <div className={`w-5 h-5 rounded-full ${accentColor} border border-slate-200 -ml-2.5 flex-shrink-0 z-10 shadow-sm`} />
      <div className="flex-1 border-t-2 border-dashed border-slate-200" />
      <div className={`w-5 h-5 rounded-full ${accentColor} border border-slate-200 -mr-2.5 flex-shrink-0 z-10 shadow-sm`} />
    </div>
  );
}

function FieldRow({ label, value, mono, green }: { label: string; value?: string; mono?: boolean; green?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400 mb-0.5 font-semibold">{label}</p>
      <p className={`text-sm font-bold ${mono ? 'font-mono' : ''} ${green ? 'text-emerald-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}

function SectionHeader({ accentColor, bgClass, borderClass, icon, title }: {
  accentColor: string; bgClass: string; borderClass: string; icon: React.ReactNode; title: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 px-5 py-3 ${bgClass} border-b ${borderClass}`}>
      <span className={accentColor}>{icon}</span>
      <span className={`text-[10px] font-black uppercase tracking-[0.22em] ${accentColor}`}>{title}</span>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function DigitalPassPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [booking, setBooking] = useState<TripwiseBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const passUrl = `${window.location.origin}/pass/${bookingId}`;

  useEffect(() => {
    if (!bookingId) { setError('Invalid pass link'); setLoading(false); return; }
    bookingApi.getBooking(bookingId)
      .then(r => { if (r.data) setBooking(r.data); else setError('Booking not found'); })
      .catch(() => setError('Failed to load booking'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-indigo-50/40">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading your pass…</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40">
        <p className="text-slate-500">{error || 'Booking not found'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Dashboard
        </button>
      </div>
    );
  }

  const isFlight = !booking.transportType?.toLowerCase().includes('train') && !booking.transportType?.toLowerCase().includes('bus')
    && !booking.transportMode?.toLowerCase().includes('train') && !booking.transportMode?.toLowerCase().includes('bus');

  const fromDisplay = booking.fromCity || 'Origin';
  const toDisplay   = booking.toCity || booking.destination;
  const mainPnr     = booking.flightPnr || '—';
  const hotelRef    = booking.hotelConfirmationRef || booking.hotelRef || '—';
  const localRef    = booking.localTransportBookingRef || booking.transportRef || '—';

  const transportLabel = isFlight ? 'Flight Ticket'
    : booking.transportType === 'TRAIN' || booking.transportMode?.toLowerCase().includes('train') ? 'Train Ticket'
    : 'Bus Ticket';

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .pass-card { border: 1px solid #e5e7eb !important; background: white !important; break-inside: avoid; }
        }
      `}</style>

      {/* Page shell — TripWise light background */}
      <div className="min-h-screen relative bg-gradient-to-br from-white via-slate-50 to-indigo-50/50">

        {/* Subtle decorative radial glows */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-100/20 rounded-full blur-3xl" />
        </div>

        {/* Top nav */}
        <div className="no-print relative z-20 flex items-center justify-between px-4 pt-5 pb-3 max-w-lg mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <Download className="w-4 h-4" /> Save PDF
          </button>
        </div>

        {/* Pass body */}
        <motion.div
          ref={printRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-lg mx-auto px-4 pb-12 space-y-0"
        >

          {/* ── Header card ──────────────────────────────────────────────── */}
          <div className="pass-card rounded-t-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
            {/* Top accent gradient bar */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

            <div className="px-5 py-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* Branding label */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-primary bg-primary/8 border border-primary/15 px-2.5 py-1 rounded-full">
                      <Sparkles className="w-2.5 h-2.5" />
                      TripWise Pass
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                    Trip to {booking.destination}
                  </h1>
                  {(booking.transportDate || booking.returnDate) && (
                    <p className="text-slate-500 text-xs mt-1.5 font-mono font-semibold">
                      {booking.transportDate}
                      {booking.returnDate && booking.returnDate !== booking.transportDate && ` → ${booking.returnDate}`}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold">Booking Ref</span>
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg">{mainPnr}</span>
                  </div>
                </div>

                {/* QR code */}
                <div className="flex-shrink-0 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-md">
                  <QRCodeSVG value={passUrl} size={76} bgColor="#ffffff" fgColor="#1e1b4b" level="M" />
                  <p className="text-[8px] text-center text-slate-400 mt-1.5 font-mono font-semibold">scan to view</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Transport ticket ─────────────────────────────────────────── */}
          <TearLine accentColor="bg-sky-50" />
          <div className="pass-card overflow-hidden border border-sky-200/60 bg-white shadow-sm">
            <SectionHeader
              accentColor="text-sky-600"
              bgClass="bg-sky-50"
              borderClass="border-sky-200/50"
              icon={<TransportIcon type={booking.transportType} mode={booking.transportMode} />}
              title={transportLabel}
            />
            <div className="px-5 py-4">
              {/* Route strip */}
              <div className="flex items-center gap-2 py-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 -mx-1">
                <div className="text-center flex-shrink-0 w-20">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">From</p>
                  <p className="text-2xl font-black text-slate-800 font-mono leading-none mt-0.5">
                    {fromDisplay.length <= 4 ? fromDisplay.toUpperCase() : fromDisplay.slice(0, 3).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{fromDisplay}</p>
                  {booking.departureTime && (
                    <p className="text-sky-600 font-mono text-xs font-bold mt-1">{booking.departureTime}</p>
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center gap-1">
                  {booking.transportNumber && (
                    <p className="text-[9px] text-slate-400 font-mono font-semibold">
                      {booking.airline ? `${booking.airline} ${booking.transportNumber}` : booking.transportNumber}
                    </p>
                  )}
                  <div className="flex items-center gap-1 w-full">
                    <div className="h-px flex-1 bg-sky-300/60" />
                    <div className="w-6 h-6 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-sky-500" />
                    </div>
                    <div className="h-px flex-1 bg-sky-300/60" />
                  </div>
                  {isFlight && <p className="text-[9px] text-slate-400 font-semibold">Direct</p>}
                </div>

                <div className="text-center flex-shrink-0 w-20">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">To</p>
                  <p className="text-2xl font-black text-slate-800 font-mono leading-none mt-0.5">
                    {toDisplay.length <= 4 ? toDisplay.toUpperCase() : toDisplay.slice(0, 3).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{toDisplay}</p>
                  {booking.arrivalTime && (
                    <p className="text-sky-600 font-mono text-xs font-bold mt-1">{booking.arrivalTime}</p>
                  )}
                </div>
              </div>

              {/* Fields grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-4 pt-3 border-t border-slate-100">
                <FieldRow label="PNR / Ref" value={mainPnr} mono />
                <FieldRow label="Class" value={booking.travelClass || 'Economy'} />
                {booking.transportDate && <FieldRow label="Date" value={booking.transportDate} />}
                {booking.seatOrCoach && <FieldRow label="Seat / Coach" value={booking.seatOrCoach} mono />}
                {booking.platform && <FieldRow label="Terminal / Platform" value={booking.platform} />}
                <FieldRow label="Status" value="Confirmed" green />
              </div>
            </div>
          </div>

          {/* ── Hotel voucher ──────────────────────────────────────────────── */}
          {booking.hotelName && (
            <>
              <TearLine accentColor="bg-emerald-50" />
              <div className="pass-card overflow-hidden border border-emerald-200/60 bg-white shadow-sm">
                <SectionHeader
                  accentColor="text-emerald-700"
                  bgClass="bg-emerald-50"
                  borderClass="border-emerald-200/50"
                  icon={<BedDouble className="w-4 h-4" />}
                  title="Hotel Voucher"
                />
                <div className="px-5 py-4 space-y-3">
                  <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3">
                    <p className="text-slate-800 font-bold text-base leading-snug">{booking.hotelName}</p>
                    {booking.hotelAddress && (
                      <p className="text-slate-500 text-xs mt-0.5 leading-snug flex items-start gap-1">
                        <MapPin className="w-3 h-3 mt-0.5 text-amber-500 shrink-0" />
                        {booking.hotelAddress}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-2 border-t border-slate-100">
                    {booking.roomType && <FieldRow label="Room Type" value={booking.roomType} />}
                    <FieldRow label="Confirmation" value={hotelRef} mono />
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400 mb-0.5 font-semibold">Check-in</p>
                      <p className="text-sm font-bold text-slate-800">
                        {booking.checkInDate || 'Day 1'}
                        {booking.hotelCheckInTime && (
                          <span className="text-sky-600 font-mono text-xs ml-1.5">{booking.hotelCheckInTime}</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400 mb-0.5 font-semibold">Check-out</p>
                      <p className="text-sm font-bold text-slate-800">
                        {booking.checkOutDate || 'Last Day'}
                        {booking.hotelCheckOutTime && (
                          <span className="text-sky-600 font-mono text-xs ml-1.5">{booking.hotelCheckOutTime}</span>
                        )}
                      </p>
                    </div>
                    <FieldRow label="Status" value="Confirmed" green />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Local transport ─────────────────────────────────────────────── */}
          <TearLine accentColor="bg-amber-50" />
          <div className="pass-card overflow-hidden border border-amber-200/60 bg-white shadow-sm">
            <SectionHeader
              accentColor="text-amber-700"
              bgClass="bg-amber-50"
              borderClass="border-amber-200/50"
              icon={<MapPin className="w-4 h-4" />}
              title="Local Transport"
            />
            <div className="px-5 py-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {booking.localTransportOperator && <FieldRow label="Operator" value={booking.localTransportOperator} />}
                <FieldRow label="Reference" value={localRef} mono />
                <FieldRow label="Coverage" value="As per itinerary" />
                <FieldRow label="Status" value="Arranged" green />
              </div>
            </div>
          </div>

          {/* ── Payment summary ─────────────────────────────────────────────── */}
          <TearLine accentColor="bg-indigo-50" />
          <div className="pass-card rounded-b-3xl overflow-hidden border border-indigo-200/60 bg-white shadow-sm">
            <SectionHeader
              accentColor="text-indigo-600"
              bgClass="bg-indigo-50"
              borderClass="border-indigo-200/50"
              icon={<CreditCard className="w-4 h-4" />}
              title="Payment Summary"
            />
            <div className="px-5 py-5 space-y-4">
              {/* Total amount hero */}
              <div className="flex items-end justify-between bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Total Paid</p>
                  <span className="text-slate-800 font-black text-3xl font-mono">{booking.totalAmount}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 text-xs font-bold">Paid</span>
                </div>
              </div>

              {booking.razorpayPaymentId && (
                <p className="text-[10px] text-slate-400 font-mono break-all bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
                  Payment ID: {booking.razorpayPaymentId}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 text-xs font-bold">Payment Successful</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Action buttons ───────────────────────────────────────────────── */}
          <div className="no-print pt-5 flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:shadow-md transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              style={{ background: 'linear-gradient(135deg, hsl(222,47%,11%) 0%, hsl(228,50%,20%) 100%)' }}
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          <p className="no-print text-center text-[10px] text-slate-400 pt-3 pb-4 font-semibold">
            Powered by TripWise · Scan QR to view on mobile
          </p>
        </motion.div>
      </div>
    </>
  );
}
