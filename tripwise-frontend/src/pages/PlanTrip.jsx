import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, Loader2, Mic, MicOff, ArrowRight, Compass, MapPin, Calendar, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { tripAPI } from '../services/api';

export function PlanTrip() {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState('');

  const userId = user?.userId || localStorage.getItem('tripwise_userId');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = user?.preferredLanguage || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ')
        .trim();
      setUserInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = (event) => {
      console.error('Voice input error:', event.error);
      setError('Voice input error. Please try again or type your request.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setVoiceSupported(true);
  }, [user?.preferredLanguage]);

  const handleVoiceToggle = () => {
    if (!voiceSupported || !recognitionRef.current) {
      setError('Voice input is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || loading) return;

    setLoading(true);
    setError('');
    setAiResponse(null);

    try {
      const response = await tripAPI.getAIIntent(
        userId || 'anonymous',
        userInput.trim(),
        user?.preferredLanguage || 'English'
      );
      setAiResponse(response);
    } catch (err) {
      console.error('AI intent processing failed:', err);
      setError('Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const examplePrompts = [
    { text: "Jaipur weekend trip", icon: <MapPin size={14} /> },
    { text: "Budget Goa trip", icon: <Wallet size={14} /> },
    { text: "3 days solo hike", icon: <Compass size={14} /> },
    { text: "Family Kerala plan", icon: <Calendar size={14} /> }
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Intelligence Layer</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Design Your <span className="text-gradient">Journey</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tell us about your dream trip in plain language. Our AI will craft a personalized itinerary just for you.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-1 pb-1 overflow-hidden"
          >
            <div className="p-8 pb-4">
              <div className="relative group">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Where would you like to go? (e.g., 'Plan a romantic 4-day trip to Paris with a focus on art and wine on a moderate budget')"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pt-8 text-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[160px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <div className="absolute top-3 left-6 text-[10px] font-bold text-primary tracking-widest uppercase opacity-50">Describe your intent</div>
                
                <div className="absolute bottom-4 right-4 flex items-center gap-3">
                  <button
                    onClick={handleVoiceToggle}
                    className={`p-3 rounded-xl transition-all ${isListening ? 'bg-primary text-white shadow-glow animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!userInput.trim() || loading}
                    className="btn-primary p-4 rounded-xl disabled:opacity-50 disabled:scale-100"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {examplePrompts.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setUserInput(example.text)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:border-white/20"
                  >
                    {example.icon}
                    {example.text}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden"
              >
                <div className="bg-primary/10 p-6 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg text-white">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-lg">AI Generated Itinerary</h2>
                      <p className="text-xs text-gray-400">Personalized based on your unique profile</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">High Fidelity</div>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Overview Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResultSection title="Overview" content={aiResponse.tripOverview} />
                    <ResultSection title="Duration & Budget" content={`${aiResponse.suggestedDuration} • ${aiResponse.budgetRange}`} />
                  </div>

                  <ResultSection title="The Plan" content={aiResponse.itineraryOutline} isFull />
                  <ResultSection title="Local Recommendations" content={aiResponse.recommendations} isFull />

                  <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {setAiResponse(null); setUserInput('');}}
                      className="btn-secondary flex-1 py-4"
                    >
                      Refine Plan
                    </button>
                    <button
                      onClick={() => navigate('/booking')}
                      className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
                    >
                      Book this Journey <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ResultSection({ title, content, isFull = false }) {
  if (!content) return null;
  return (
    <div className={isFull ? "col-span-full" : ""}>
      <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-3 opacity-80">{title}</h3>
      <div className="bg-white/5 rounded-2xl p-6 border border-white/5 text-gray-300 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}
