"use client";

import Link from "next/link";
import { Plane, Mic, MapPin, CreditCard, Map, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { VoiceAssistant } from "@/components/VoiceAssistant";

const features = [
  {
    icon: MapPin,
    title: "Smart Planning",
    description: "AI-powered trip planning that understands your preferences",
    color: "from-sky-500 to-blue-600",
  },
  {
    icon: CreditCard,
    title: "Easy Booking",
    description: "Book trains, flights, buses and hotels in one place",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Map,
    title: "Local Guide",
    description: "Get insider tips, food spots, and cultural insights",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Mic,
    title: "Voice Enabled",
    description: "Just speak and let TripWise handle the rest",
    color: "from-purple-500 to-pink-500",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Navbar />
      
      <main className="pt-16">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-sky-100 shadow-sm mb-8">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span className="text-sm text-slate-600">AI-Powered Travel Companion</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-200">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                  TripWise
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl text-slate-600 font-light mb-4"
            >
              Plan. Book. Explore.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-slate-500 mb-12 max-w-lg mx-auto"
            >
              All in One Place — Your intelligent travel companion that makes every journey effortless
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/identify"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all"
              >
                Start Your Trip
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-sky-100 rounded-2xl font-medium text-slate-700 hover:border-sky-200 hover:bg-sky-50 transition-all">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-sky-600" />
                </div>
                <span>Try Voice Command</span>
              </button>
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Everything You Need to Travel Smart
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                From planning to exploring, TripWise is your complete travel ecosystem
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-50 transition-all"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-gradient-to-r from-sky-500 to-emerald-500">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of travelers who use TripWise to make their trips memorable
              </p>
              <Link
                href="/identify"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-600 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        <footer className="py-8 px-4 bg-slate-900 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">TripWise</span>
          </div>
          <p className="text-sm text-slate-400">
            Reducing travel confusion, not adding to it.
          </p>
        </footer>
      </main>

      <VoiceAssistant />
    </div>
  );
}
