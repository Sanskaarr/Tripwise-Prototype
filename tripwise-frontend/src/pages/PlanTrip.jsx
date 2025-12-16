import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export function PlanTrip() {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState('');

  const userId = user?.userId || localStorage.getItem('tripwise_userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    setLoading(true);
    setError('');
    setAiResponse(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/trip/ai-intent`, {
        userId,
        userInput: userInput.trim(),
        language: user?.preferredLanguage || 'English'
      });

      setAiResponse(response.data);
    } catch (err) {
      console.error('AI intent processing failed:', err);
      const message = err?.response?.data?.message || 'Failed to process your request. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const examplePrompts = [
    "I want to go to Jaipur this weekend",
    "Plan a budget trip to Goa",
    "Suggest a solo trip for 3 days",
    "Family vacation in Kerala under ₹50,000"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] via-[#F9F6F1] to-[#F5F0E8] relative overflow-hidden pt-24 pb-12 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(232,175,160,0.08),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(184,201,180,0.06),transparent_50%)]" />
      
      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-sand mb-6">
            <Sparkles size={18} className="text-accent-coral" />
            <span className="text-sm font-medium text-charcoal/70">AI-Powered Travel Planning</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-charcoal mb-4">
            Where do you want to go?
          </h1>
          <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">
            Describe your travel plans in your own words and let TripWise create a personalized itinerary for you
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-sand/30 overflow-hidden"
        >
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="E.g., I want to visit Jaipur this weekend with my family. We love history and local food. Budget around ₹30,000."
                  rows={4}
                  disabled={loading}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-sand bg-white/80 text-charcoal placeholder-charcoal/40 focus:border-accent-coral focus:outline-none transition-all resize-none disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !userInput.trim()}
                className="w-full bg-gradient-to-r from-accent-coral to-[#D4A89D] text-white py-4 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing your request...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Plan My Trip
                  </>
                )}
              </button>
            </form>

            {!aiResponse && !loading && (
              <div className="mt-8">
                <p className="text-xs font-semibold tracking-wider text-charcoal/50 mb-3">TRY THESE EXAMPLES</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {examplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUserInput(prompt)}
                      className="text-left px-4 py-3 rounded-xl bg-sand/30 border border-sand hover:border-accent-coral hover:bg-white/80 text-sm text-charcoal/70 transition-all"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-8 pb-8"
              >
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </motion.div>
            )}

            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-sand/50 bg-gradient-to-br from-white to-sand/10"
              >
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={20} className="text-accent-coral" />
                    <h2 className="text-xl font-semibold text-charcoal">Your Personalized Trip Plan</h2>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <div className="space-y-4 text-charcoal/80 leading-relaxed whitespace-pre-wrap">
                      {aiResponse.suggestion}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-sand/50 flex gap-3">
                    <button
                      onClick={() => {
                        setUserInput('');
                        setAiResponse(null);
                      }}
                      className="px-6 py-3 rounded-xl border-2 border-sand text-charcoal/70 font-medium hover:border-accent-coral transition-all"
                    >
                      Plan Another Trip
                    </button>
                    <button
                      onClick={() => navigate('/booking')}
                      className="flex-1 bg-gradient-to-r from-accent-coral to-[#D4A89D] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Continue to Booking
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center text-sm text-charcoal/50"
        >
          <p>Powered by AI • Personalized using your travel preferences</p>
        </motion.div>
      </div>
    </div>
  );
}
