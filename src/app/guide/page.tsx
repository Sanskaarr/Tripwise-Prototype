"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Utensils, Lightbulb, Phone, Map as MapIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { SpeakButton } from "@/components/VoiceInput";
import { getLocalGuide, type LocalGuideData } from "@/lib/api";

function GuideContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "Your Destination";
  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState<LocalGuideData | null>(null);
  const [activeTab, setActiveTab] = useState("attractions");

  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      const data = await getLocalGuide(city);
      setGuide(data);
      setLoading(false);
    };
    fetchGuide();
  }, [city]);

  const tabs = [
    { id: "attractions", label: "Attractions", icon: MapPin },
    { id: "food", label: "Food", icon: Utensils },
    { id: "tips", label: "Tips", icon: Lightbulb },
    { id: "emergency", label: "Emergency", icon: Phone },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
          <p className="text-slate-500">Loading guide for {city}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" />
              {city}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Local Guide
            </h1>
            <p className="text-slate-500">
              Everything you need to know about your destination
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden mb-8"
          >
            <div className="h-48 bg-gradient-to-r from-sky-500 to-emerald-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <MapIcon className="w-12 h-12 mx-auto mb-2 opacity-80" />
                  <p className="text-lg font-medium opacity-80">Map View</p>
                  <p className="text-sm opacity-60">Coming Soon</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex overflow-x-auto gap-2 mb-8 pb-2"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {activeTab === "attractions" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guide?.attractions.map((attraction, index) => (
                  <motion.div
                    key={attraction.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-40 bg-slate-200">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-800">{attraction.name}</h3>
                        <SpeakButton text={`${attraction.name}. ${attraction.description}`} />
                      </div>
                      <p className="text-sm text-slate-500 mt-2">{attraction.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "food" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guide?.food.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        {item.type}
                      </span>
                      <SpeakButton text={`${item.name}. ${item.description}`} />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "tips" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Travel Tips & Cultural Insights
                </h3>
                <div className="space-y-4">
                  {guide?.tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-sky-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700">{tip}</p>
                      </div>
                      <SpeakButton text={tip} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "emergency" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Emergency Contacts
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {guide?.emergency.map((contact, index) => (
                    <motion.a
                      key={contact.name}
                      href={`tel:${contact.number}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{contact.name}</p>
                        <p className="text-xl font-bold text-red-600">{contact.number}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <VoiceAssistant />
    </div>
  );
}

export default function GuidePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
        </div>
      }
    >
      <GuideContent />
    </Suspense>
  );
}
