"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, CheckCircle2, Plane, ArrowRight, Loader2, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { PaymentQR } from "@/components/PaymentQR";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { confirmBooking, mockTravelOptions, mockHotels } from "@/lib/api";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const travelId = searchParams.get("travel") || "";
  const hotelId = searchParams.get("hotel");
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";

  const travel = mockTravelOptions.find((t) => t.id === travelId);
  const hotel = hotelId ? mockHotels.find((h) => h.id === hotelId) : null;
  const totalPrice = (travel?.price || 0) + (hotel?.pricePerNight || 0) * 2;

  const handlePaymentSuccess = async () => {
    const result = await confirmBooking({
      travelOptionId: travelId,
      hotelId: hotelId || undefined,
    });
    setBookingId(result.bookingId);
    setBookingComplete(true);
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
        <Navbar />
        
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl shadow-sky-100 border border-sky-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center text-white">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
                <p className="text-white/80">Your trip is all set</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Booking Reference</p>
                  <p className="text-2xl font-mono font-bold text-slate-800">{bookingId}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                      <Plane className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{travel?.name}</p>
                      <p className="text-sm text-slate-500">
                        {travel?.departure} - {travel?.arrival}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {from} → {to}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>

                  {hotel && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-lg">🏨</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{hotel.name}</p>
                        <p className="text-sm text-slate-500">2 nights stay</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-slate-600">Total Paid</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </div>

                <Link
                  href={`/guide?city=${to}`}
                  className="block w-full text-center py-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all"
                >
                  Explore {to} Local Guide
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </main>

        <VoiceAssistant />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-bold text-slate-800 mb-3">Complete Your Booking</h1>
            <p className="text-slate-500">Secure payment powered by UPI</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-sky-100 shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                    <Plane className="w-6 h-6 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{travel?.name}</p>
                    <p className="text-sm text-slate-500">
                      {travel?.departure} - {travel?.arrival}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-800">
                    ₹{travel?.price.toLocaleString()}
                  </p>
                </div>

                {hotel && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <span className="text-xl">🏨</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{hotel.name}</p>
                      <p className="text-sm text-slate-500">2 nights</p>
                    </div>
                    <p className="font-semibold text-slate-800">
                      ₹{(hotel.pricePerNight * 2).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-sky-500" />
                  <div className="flex-1">
                    <p className="text-slate-800">
                      {from} → {to}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-lg text-slate-600">Total</span>
                  <span className="text-2xl font-bold text-slate-800">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-sky-100 shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold text-slate-800 mb-6 text-center">
                Pay with UPI
              </h2>
              <PaymentQR amount={totalPrice} onSuccess={handlePaymentSuccess} />
            </motion.div>
          </div>
        </div>
      </main>

      <VoiceAssistant />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
