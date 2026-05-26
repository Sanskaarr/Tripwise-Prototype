import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Plane, Train, Bus, BedDouble, MapPin, CalendarDays, CreditCard,
  Loader2, ArrowRight, Download, ArrowLeft, CheckCircle2,
} from 'lucide-react';
import { bookingApi, type TripwiseBooking } from '@/lib/api/bookingApi';
import { LiquidBackground } from '@/components/ui/LiquidBackground';

// ─── helpers ─────────────────────────────────────────────────────────────────

function TransportIcon({ type, mode }: { type?: string; mode?: string }) {
  const t = ((type || mode) ?? '').toLowerCase();
  if (t.includes('train') || t.includes('rail')) return <Train className="w-4 h-4" />;
  if (t.includes('bus'))  return <Bus className="w-4 h-4" />;
  return <Plane className="w-4 h-4" />;
}

function TearLine() {
  return (
    <div className="flex items-center my-0 print:hidden">
      <div className="w-5 h-5 rounded-full bg-[#0d0118] border border-white/10 -ml-2.5 flex-shrink-0 z-10" />
      <div className="flex-1 border-t-2 border-dashed border-white/10" />
      <div className="w-5 h-5 rounded-full bg-[#0d0118] border border-white/10 -mr-2.5 flex-shrink-0 z-10" />
    </div>
  );
}

function FieldRow({ label, value, mono, green }: { label: string; value?: string; mono?: boolean; green?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.18em] text-white/40 mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${mono ? 'font-mono' : ''} ${green ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function SectionHeader({ colorClass, bgClass, icon, title }: {
  colorClass: string; bgClass: string; icon: React.ReactNode; title: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 px-5 py-3 ${bgClass} border-b border-white/10`}>
      <span className={colorClass}>{icon}</span>
      <span className={`text-[10px] font-black uppercase tracking-[0.22em] ${colorClass}`}>{title}</span>
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
      <div className="min-h-screen flex items-center justify-center bg-[#0d0118]">
        <LiquidBackground />
        <Loader2 className="w-8 h-8 text-primary animate-spin relative z-10" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0d0118]">
        <LiquidBackground />
        <p className="text-muted-foreground relative z-10">{error || 'Booking not found'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/30 transition-colors"
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
      {/* Print-only global styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-bg { background: white !important; }
          .pass-card { border: 1px solid #e5e7eb !important; background: white !important; break-inside: avoid; }
        }
      `}</style>

      <div className="min-h-screen bg-[#0d0118] relative">
        <LiquidBackground />

        {/* Top nav — hidden on print */}
        <div className="no-print relative z-20 flex items-center justify-between px-4 pt-5 pb-2 max-w-lg mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/25 transition-all"
          >
            <Download className="w-4 h-4" /> Save PDF
          </button>
        </div>

        {/* Pass body */}
        <div ref={printRef} className="relative z-10 max-w-lg mx-auto px-4 pb-12 space-y-0">

          {/* ── Header card ─────────────────────────────────────────── */}
          <div className="pass-card rounded-t-3xl border border-primary/35 bg-gradient-to-br from-primary/20 via-violet-900/20 to-[#0d0118] px-5 py-5">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                {/* Branding */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">TripWise Pass</span>
                </div>
                <h1 className="text-xl font-extrabold text-white leading-tight">
                  Trip to {booking.destination}
                </h1>
                {(booking.transportDate || booking.returnDate) && (
                  <p className="text-muted-foreground text-xs mt-1 font-mono">
                    {booking.transportDate}
                    {booking.returnDate && booking.returnDate !== booking.transportDate && ` → ${booking.returnDate}`}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[9px] uppercase tracking-widest text-white/40">Booking Ref</span>
                  <span className="text-xs font-mono font-bold text-primary/80">{mainPnr}</span>
                </div>
              </div>

              {/* QR code */}
              <div className="flex-shrink-0 bg-white p-2 rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.25)]">
                <QRCodeSVG value={passUrl} size={76} bgColor="#ffffff" fgColor="#1a0a2e" level="M" />
                <p className="text-[8px] text-center text-gray-400 mt-1 font-mono">scan to view</p>
              </div>
            </div>
          </div>

          {/* ── Arrival transport ────────────────────────────────────── */}
          <TearLine />
          <div className="pass-card overflow-hidden border border-sky-500/25 bg-sky-950/20">
            <SectionHeader
              colorClass="text-sky-400"
              bgClass="bg-sky-500/[0.08]"
              icon={<TransportIcon type={booking.transportType} mode={booking.transportMode} />}
              title={transportLabel}
            />
            <div className="px-5 py-4">
              {/* Route strip */}
              <div className="flex items-center gap-2 py-2">
                <div className="text-center flex-shrink-0 w-20">
                  <p className="text-[9px] uppercase tracking-widest text-white/40">From</p>
                  <p className="text-xl font-black text-white font-mono leading-none mt-0.5">
                    {fromDisplay.length <= 4 ? fromDisplay.toUpperCase() : fromDisplay.slice(0, 3).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-white/50 truncate">{fromDisplay}</p>
                  {booking.departureTime && (
                    <p className="text-sky-400 font-mono text-xs font-bold mt-1">{booking.departureTime}</p>
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center gap-0.5">
                  {booking.transportNumber && (
                    <p className="text-[9px] text-white/40 font-mono">{booking.airline ? `${booking.airline} ${booking.transportNumber}` : booking.transportNumber}</p>
                  )}
                  <div className="flex items-center gap-1 w-full">
                    <div className="h-px flex-1 bg-sky-500/30" />
                    <ArrowRight className="w-3.5 h-3.5 text-sky-500/50" />
                    <div className="h-px flex-1 bg-sky-500/30" />
                  </div>
                  {isFlight && <p className="text-[9px] text-white/30">Direct</p>}
                </div>

                <div className="text-center flex-shrink-0 w-20">
                  <p className="text-[9px] uppercase tracking-widest text-white/40">To</p>
                  <p className="text-xl font-black text-white font-mono leading-none mt-0.5">
                    {toDisplay.length <= 4 ? toDisplay.toUpperCase() : toDisplay.slice(0, 3).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-white/50 truncate">{toDisplay}</p>
                  {booking.arrivalTime && (
                    <p className="text-sky-400 font-mono text-xs font-bold mt-1">{booking.arrivalTime}</p>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-3 pt-3 border-t border-white/[0.07]">
                <FieldRow label="PNR / Ref" value={mainPnr} mono />
                <FieldRow label="Class" value={booking.travelClass || 'Economy'} />
                {booking.transportDate && <FieldRow label="Date" value={booking.transportDate} />}
                {booking.seatOrCoach && <FieldRow label="Seat / Coach" value={booking.seatOrCoach} mono />}
                {booking.platform && <FieldRow label="Terminal / Platform" value={booking.platform} />}
                <FieldRow label="Status" value="Confirmed" green />
              </div>
            </div>
          </div>

          {/* ── Hotel voucher ─────────────────────────────────────────── */}
          {booking.hotelName && (
            <>
              <TearLine />
              <div className="pass-card overflow-hidden border border-emerald-500/25 bg-emerald-950/20">
                <SectionHeader
                  colorClass="text-emerald-400"
                  bgClass="bg-emerald-500/[0.08]"
                  icon={<BedDouble className="w-4 h-4" />}
                  title="Hotel Voucher"
                />
                <div className="px-5 py-4 space-y-3">
                  <div>
                    <p className="text-white font-bold text-base leading-snug">{booking.hotelName}</p>
                    {booking.hotelAddress && (
                      <p className="text-white/50 text-xs mt-0.5 leading-snug">{booking.hotelAddress}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-white/[0.07]">
                    {booking.roomType && <FieldRow label="Room Type" value={booking.roomType} />}
                    <FieldRow label="Confirmation" value={hotelRef} mono />
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-white/40 mb-0.5">Check-in</p>
                      <p className="text-sm font-bold text-white">
                        {booking.checkInDate || 'Day 1'}
                        {booking.hotelCheckInTime && (
                          <span className="text-sky-400 font-mono text-xs ml-1.5">{booking.hotelCheckInTime}</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-white/40 mb-0.5">Check-out</p>
                      <p className="text-sm font-bold text-white">
                        {booking.checkOutDate || 'Last Day'}
                        {booking.hotelCheckOutTime && (
                          <span className="text-sky-400 font-mono text-xs ml-1.5">{booking.hotelCheckOutTime}</span>
                        )}
                      </p>
                    </div>
                    <FieldRow label="Status" value="Confirmed" green />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Local transport ───────────────────────────────────────── */}
          <TearLine />
          <div className="pass-card overflow-hidden border border-amber-500/25 bg-amber-950/20">
            <SectionHeader
              colorClass="text-amber-400"
              bgClass="bg-amber-500/[0.08]"
              icon={<MapPin className="w-4 h-4" />}
              title="Local Transport"
            />
            <div className="px-5 py-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {booking.localTransportOperator && <FieldRow label="Operator" value={booking.localTransportOperator} />}
                <FieldRow label="Reference" value={localRef} mono />
                <FieldRow label="Coverage" value="As per itinerary" />
                <FieldRow label="Status" value="Arranged" green />
              </div>
            </div>
          </div>

          {/* ── Payment summary ───────────────────────────────────────── */}
          <TearLine />
          <div className="pass-card rounded-b-3xl overflow-hidden border border-primary/25 bg-primary/[0.04]">
            <SectionHeader
              colorClass="text-primary"
              bgClass="bg-primary/[0.08]"
              icon={<CreditCard className="w-4 h-4" />}
              title="Payment Summary"
            />
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-end justify-between">
                <span className="text-white/60 text-sm">Total Paid</span>
                <span className="text-primary font-extrabold text-2xl font-mono">{booking.totalAmount}</span>
              </div>
              {booking.razorpayPaymentId && (
                <p className="text-[10px] text-white/30 font-mono break-all">
                  Payment ID: {booking.razorpayPaymentId}
                </p>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.07]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-semibold">Payment Successful</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3 h-3 text-white/30" />
                  <span className="text-[10px] text-white/30">
                    {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Action buttons (no-print) ─────────────────────────────── */}
          <div className="no-print pt-5 flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/15 bg-white/[0.04] text-white/80 text-sm font-semibold hover:bg-white/[0.08] transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          <p className="no-print text-center text-[10px] text-white/20 pt-2 pb-4">
            Powered by TripWise · Scan QR to view on mobile
          </p>
        </div>
      </div>
    </>
  );
}
