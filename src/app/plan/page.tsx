"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plane, MapPin, Calendar, Wallet, Train, Bus, ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { VoiceInput } from "@/components/VoiceInput";
import { VoiceAssistant } from "@/components/VoiceAssistant";

const travelModes = [
  { id: "all", label: "All", icon: Plane },
  { id: "train", label: "Train", icon: Train },
  { id: "flight", label: "Flight", icon: Plane },
  { id: "bus", label: "Bus", icon: Bus },
];

const popularDestinations = [
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Delhi", state: "NCR" },
  { city: "Bangalore", state: "Karnataka" },
  { city: "Goa", state: "Goa" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Kerala", state: "Kerala" },
];

export default function PlanTrip() {
  const router = useRouter();
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    budget: "",
    mode: "all",
  });
  const [loading, setLoading] = useState(false);

  const handleVoiceInput = useCallback((transcript: string) => {
    const lower = transcript.toLowerCase();
    
    if (lower.includes("from")) {
      const fromMatch = lower.match(/from\s+(\w+)/);
      if (fromMatch) setForm((f) => ({ ...f, from: fromMatch[1] }));
    }
    if (lower.includes("to")) {
      const toMatch = lower.match(/to\s+(\w+)/);
      if (toMatch) setForm((f) => ({ ...f, to: toMatch[1] }));
    }
    if (lower.includes("train")) {
      setForm((f) => ({ ...f, mode: "train" }));
    } else if (lower.includes("flight") || lower.includes("fly")) {
      setForm((f) => ({ ...f, mode: "flight" }));
    } else if (lower.includes("bus")) {
      setForm((f) => ({ ...f, mode: "bus" }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.date) return;

    setLoading(true);
    const params = new URLSearchParams({
      from: form.from,
      to: form.to,
      date: form.date,
      mode: form.mode,
      ...(form.budget && { budget: form.budget }),
    });

    setTimeout(() => {
      router.push(`/booking?${params.toString()}`);
    }, 500);
  };

  const selectDestination = (city: string) => {
    if (!form.from) {
      setForm((f) => ({ ...f, from: city }));
    } else {
      setForm((f) => ({ ...f, to: city }));
    }
  };

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
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Where would you like to go?
            </h1>
            <p className="text-slate-500">
              Enter your travel details or use voice to plan your trip
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl shadow-sky-100 border border-sky-100 p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Trip Details</h2>
              <VoiceInput
                onTranscript={handleVoiceInput}
                placeholder="Speak to fill"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={form.from}
                      onChange={(e) => setForm({ ...form, from: e.target.value })}
                      placeholder="Departure city"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    To
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input
                      type="text"
                      value={form.to}
                      onChange={(e) => setForm({ ...form, to: e.target.value })}
                      placeholder="Destination city"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Travel Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl text-slate-800 focus:border-sky-300 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Budget (Optional)
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      placeholder="Max budget in ₹"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-3">
                  Travel Mode
                </label>
                <div className="flex flex-wrap gap-3">
                  {travelModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setForm({ ...form, mode: mode.id })}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                        form.mode === mode.id
                          ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <mode.icon className="w-5 h-5" />
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!form.from || !form.to || !form.date || loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search Options</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <h3 className="text-sm font-medium text-slate-500 mb-4">Popular Destinations</h3>
            <div className="flex flex-wrap gap-3">
              {popularDestinations.map((dest) => (
                <button
                  key={dest.city}
                  onClick={() => selectDestination(dest.city)}
                  className="px-4 py-2 bg-white border border-slate-100 rounded-full text-sm text-slate-600 hover:border-sky-200 hover:bg-sky-50 transition-all"
                >
                  {dest.city}, {dest.state}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <VoiceAssistant />
    </div>
  );
}
