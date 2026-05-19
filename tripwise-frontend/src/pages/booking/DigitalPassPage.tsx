import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Plane, Train, Bus, BedDouble, MapPin, CalendarDays, CreditCard, Loader2, Clock, ArrowRight } from 'lucide-react';
import { bookingApi, type TripwiseBooking } from '@/lib/api/bookingApi';

function PassSection({ icon, color, bg, title, children }: {
  icon: React.ReactNode; color: string; bg: string; title: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10">
      <div className={`px-5 py-3 ${bg} flex items-center gap-2`}>
        <span className={color}>{icon}</span>
        <span className={`text-xs font-black uppercase tracking-[0.2em] ${color}`}>{title}</span>
      </div>
      <div className="bg-white/[0.02] px-5 py-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-white font-semibold text-sm mt-0.5">{value}</p>
    </div>
  );
}

function TearLine() {
  return (
    <div className="flex items-center gap-0 my-1">
      <div className="w-4 h-4 rounded-full bg-black/60 -ml-2 flex-shrink-0" />
      <div className="flex-1 border-t-2 border-dashed border-white/10 mx-1" />
      <div className="w-4 h-4 rounded-full bg-black/60 -mr-2 flex-shrink-0" />
    </div>
  );
}

function TransportIcon({ type, mode }: { type?: string; mode: string }) {
  const t = (type || mode).toLowerCase();
  if (t.includes('train') || t.includes('rail')) return <Train className="w-5 h-5" />;
  if (t.includes('bus')) return <Bus className="w-5 h-5" />;
  return <Plane className="w-5 h-5" />;
}

function RouteStrip({ from, to, time, arrivalTime, number }: {
  from: string; to: string; time?: string; arrivalTime?: string; number?: string;
}) {
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="text-center flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">From</p>
        <p className="text-white font-bold text-base">{from}</p>
        {time && <p className="text-xs text-sky-400 font-mono mt-0.5">{time}</p>}
      </div>
      <div className="flex-1 flex flex-col items-center gap-0.5">
        {number && <p className="text-[10px] text-muted-foreground font-mono">{number}</p>}
        <div className="flex items-center gap-1 w-full">
          <div className="h-px flex-1 bg-white/20" />
          <ArrowRight className="w-3.5 h-3.5 text-white/40" />
          <div className="h-px flex-1 bg-white/20" />
        </div>
      </div>
      <div className="text-center flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">To</p>
        <p className="text-white font-bold text-base">{to}</p>
        {arrivalTime && <p className="text-xs text-sky-400 font-mono mt-0.5">{arrivalTime}</p>}
      </div>
    </div>
  );
}

function formatDate(iso: string | undefined) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

export default function DigitalPassPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<TripwiseBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const passUrl = `${window.location.origin}/pass/${bookingId}`;

  useEffect(() => {
    if (!bookingId) { setError('Invalid pass link'); setLoading(false); return; }
    bookingApi.getBooking(bookingId)
      .then(r => {
        if (r.data) setBooking(r.data);
        else setError('Booking not found');
      })
      .catch(() => setError('Failed to load booking'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0118]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0118]">
        <p className="text-muted-foreground">{error || 'Booking not found'}</p>
      </div>
    );
  }

  const transportTypeLabel = booking.transportType === 'TRAIN' ? 'Train Ticket'
    : booking.transportType === 'BUS' ? 'Bus Ticket'
    : booking.transportMode?.toLowerCase().includes('train') ? 'Train Ticket'
    : booking.transportMode?.toLowerCase().includes('bus') ? 'Bus Ticket'
    : 'Flight Ticket';

  const hasReturnFlight = !!(booking.returnTransportNumber || booking.returnPnr);
  const mainPnr = booking.flightPnr || '—';
  const hotelConfRef = booking.hotelConfirmationRef || booking.hotelRef || '—';
  const localRef = booking.localTransportBookingRef || booking.transportRef || '—';

  const fromCity = booking.fromCity || 'Origin';
  const toCity = booking.toCity || booking.destination;

  return (
    <div className="min-h-screen bg-[#0d0118] px-4 py-10 font-sans">
      <div className="max-w-sm mx-auto space-y-4">

        {/* Header + QR */}
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-violet-900/20 px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary/70">TripWise Pass</p>
              <h1 className="text-xl font-extrabold text-white mt-1">Trip to {booking.destination}</h1>
              <p className="text-muted-foreground text-xs mt-1 font-mono">{mainPnr}</p>
              {booking.airline && (
                <p className="text-primary/80 text-xs mt-0.5">{booking.airline} {booking.transportNumber || ''}</p>
              )}
            </div>
            <div className="bg-white p-2 rounded-xl flex-shrink-0">
              <QRCodeSVG value={passUrl} size={72} bgColor="#fff" fgColor="#1a0a2e" level="M" />
            </div>
          </div>
        </div>

        {/* Arrival Transport Ticket */}
        <TearLine />
        <PassSection
          icon={<TransportIcon type={booking.transportType} mode={booking.transportMode} />}
          color="text-sky-400"
          bg="bg-sky-500/10"
          title={transportTypeLabel}
        >
          <RouteStrip
            from={fromCity}
            to={toCity}
            time={booking.departureTime}
            arrivalTime={booking.arrivalTime}
            number={booking.transportNumber}
          />
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <Field label="PNR / Ref" value={mainPnr} />
            <Field label="Class" value={booking.travelClass || 'Economy'} />
            {booking.transportDate && <Field label="Date" value={booking.transportDate} />}
            {booking.seatOrCoach && <Field label="Seat / Coach" value={booking.seatOrCoach} />}
            {booking.platform && <Field label="Terminal / Platform" value={booking.platform} />}
            <Field label="Status" value="Confirmed" />
          </div>
        </PassSection>

        {/* Return Transport (if exists) */}
        {hasReturnFlight && (
          <>
            <TearLine />
            <PassSection
              icon={<TransportIcon type={booking.transportType} mode={booking.transportMode} />}
              color="text-violet-400"
              bg="bg-violet-500/10"
              title="Return Journey"
            >
              <RouteStrip
                from={toCity}
                to={fromCity}
                time={booking.returnDepartureTime}
                arrivalTime={booking.returnArrivalTime}
                number={booking.returnTransportNumber}
              />
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <Field label="PNR / Ref" value={booking.returnPnr} />
                {booking.returnDate && <Field label="Date" value={booking.returnDate} />}
                {booking.returnSeat && <Field label="Seat" value={booking.returnSeat} />}
                <Field label="Status" value="Confirmed" />
              </div>
            </PassSection>
          </>
        )}

        {/* Hotel Voucher */}
        <TearLine />
        <PassSection icon={<BedDouble className="w-5 h-5" />} color="text-emerald-400" bg="bg-emerald-500/10" title="Hotel Voucher">
          <Field label="Hotel" value={booking.hotelName} />
          {booking.hotelAddress && <Field label="Address" value={booking.hotelAddress} />}
          {booking.roomType && <Field label="Room Type" value={booking.roomType} />}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Check-in</p>
              <p className="text-white font-semibold text-sm mt-0.5">
                {booking.checkInDate ? formatDate(booking.checkInDate) : 'Day 1'}
                {booking.hotelCheckInTime && (
                  <span className="text-sky-400 font-mono ml-1.5 text-xs">{booking.hotelCheckInTime}</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Check-out</p>
              <p className="text-white font-semibold text-sm mt-0.5">
                {booking.checkOutDate ? formatDate(booking.checkOutDate) : 'Last Day'}
                {booking.hotelCheckOutTime && (
                  <span className="text-sky-400 font-mono ml-1.5 text-xs">{booking.hotelCheckOutTime}</span>
                )}
              </p>
            </div>
            <Field label="Confirmation" value={hotelConfRef} />
            <Field label="Status" value="Confirmed" />
          </div>
        </PassSection>

        {/* Local Transport */}
        <TearLine />
        <PassSection icon={<MapPin className="w-5 h-5" />} color="text-amber-400" bg="bg-amber-500/10" title="Local Transport">
          {booking.localTransportOperator && <Field label="Operator" value={booking.localTransportOperator} />}
          <Field label="Reference" value={localRef} />
          <Field label="Coverage" value="As per itinerary" />
        </PassSection>

        {/* Payment Summary */}
        <TearLine />
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Payment Summary</p>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground text-sm">Total Paid</span>
            <span className="ml-auto text-primary font-extrabold text-lg font-mono">{booking.totalAmount}</span>
          </div>
          {booking.razorpayPaymentId && (
            <p className="text-xs text-muted-foreground font-mono break-all">
              Payment ID: {booking.razorpayPaymentId}
            </p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground pb-4">
          Powered by TripWise
        </p>
      </div>
    </div>
  );
}
