"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, MapPin, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { TripCard, HotelCard } from "@/components/TripCard";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { planTrip, type TravelOption, type Hotel } from "@/lib/api";

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedTravel, setSelectedTravel] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const mode = searchParams.get("mode") || "all";
  const budget = searchParams.get("budget");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await planTrip({
        from,
        to,
        date,
        mode,
        budget: budget ? parseInt(budget) : undefined,
      });
      setTravelOptions(data.travelOptions);
      setHotels(data.hotels);
      setLoading(false);
    };

    if (from && to && date) {
      fetchData();
    }
  }, [from, to, date, mode, budget]);

  const handleContinue = () => {
    if (!selectedTravel) return;

    const params = new URLSearchParams({
      travel: selectedTravel,
      ...(selectedHotel && { hotel: selectedHotel }),
      from,
      to,
      date,
    });

    router.push(`/payment?${params.toString()}`);
  };

  const selectedTravelOption = travelOptions.find((t) => t.id === selectedTravel);
  const selectedHotelOption = hotels.find((h) => h.id === selectedHotel);
  const totalPrice =
    (selectedTravelOption?.price || 0) + (selectedHotelOption?.pricePerNight || 0) * 2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white rounded-2xl border border-sky-100 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-500" />
              <span className="font-medium text-slate-800">{from}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <span className="font-medium text-slate-800">{to}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="text-slate-600">
                {new Date(date).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
              <p className="text-slate-500">Finding the best options for you...</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">
                    Travel Options
                  </h2>
                  <div className="space-y-3">
                    {travelOptions.map((option) => (
                      <TripCard
                        key={option.id}
                        option={option}
                        selected={selectedTravel === option.id}
                        onSelect={() => setSelectedTravel(option.id)}
                      />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">
                    Hotel Suggestions (Optional)
                  </h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {hotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        selected={selectedHotel === hotel.id}
                        onSelect={() =>
                          setSelectedHotel(selectedHotel === hotel.id ? null : hotel.id)
                        }
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="sticky top-24 bg-white rounded-2xl border border-sky-100 shadow-xl shadow-sky-50 p-6"
                >
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">
                    Booking Summary
                  </h2>

                  {selectedTravelOption ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-sky-50 rounded-xl">
                        <p className="text-sm text-slate-500 mb-1">Travel</p>
                        <p className="font-medium text-slate-800">
                          {selectedTravelOption.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {selectedTravelOption.departure} - {selectedTravelOption.arrival}
                        </p>
                        <p className="text-emerald-600 font-semibold mt-2">
                          ₹{selectedTravelOption.price.toLocaleString()}
                        </p>
                      </div>

                      {selectedHotelOption && (
                        <div className="p-4 bg-emerald-50 rounded-xl">
                          <p className="text-sm text-slate-500 mb-1">Hotel (2 nights)</p>
                          <p className="font-medium text-slate-800">
                            {selectedHotelOption.name}
                          </p>
                          <p className="text-emerald-600 font-semibold mt-2">
                            ₹{(selectedHotelOption.pricePerNight * 2).toLocaleString()}
                          </p>
                        </div>
                      )}

                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-slate-600">Total</span>
                          <span className="text-2xl font-bold text-slate-800">
                            ₹{totalPrice.toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={handleContinue}
                          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all"
                        >
                          Continue to Payment
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400">Select a travel option to continue</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>

      <VoiceAssistant />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
