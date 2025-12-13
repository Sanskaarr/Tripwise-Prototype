"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plane, ArrowRight, User, Mail, Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { VoiceAssistant } from "@/components/VoiceAssistant";

export default function IdentifyUser() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [isReturning, setIsReturning] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    const returning = identifier.includes("@") || identifier.length === 10;
    setIsReturning(returning);

    setTimeout(() => {
      localStorage.setItem("tripwise_user", identifier);
      router.push("/plan");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex flex-col">
      <header className="p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
            TripWise
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl shadow-sky-100 border border-sky-100 p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 flex items-center justify-center">
                <User className="w-8 h-8 text-sky-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                {isReturning === null
                  ? "Let's Get Started"
                  : isReturning
                  ? "Welcome Back! 👋"
                  : "Let's Plan Your First Trip! 🎉"}
              </h1>
              <p className="text-slate-500">
                Enter your phone or email to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  {identifier.includes("@") ? (
                    <Mail className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Phone className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Phone number or email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!identifier.trim() || loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
              <Sparkles className="w-5 h-5 text-sky-500 flex-shrink-0" />
              <p className="text-sm text-slate-600">
                No account needed! Just enter your details to start planning.
              </p>
            </div>
          </motion.div>

          <p className="text-center text-sm text-slate-400 mt-6">
            Your privacy is important to us. We don't share your data.
          </p>
        </div>
      </main>

      <VoiceAssistant />
    </div>
  );
}
