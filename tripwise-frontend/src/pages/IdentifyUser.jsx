import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Sparkles, ArrowRight, ArrowLeft, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { authAPI } from '../services/api';

export function IdentifyUser() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useUser();

  const handleNameSubmit = (e) => {
    if (e) e.preventDefault();
    if (name.trim()) {
      setStep(2);
    }
  };

  const handleContactSubmit = async (e) => {
    if (e) e.preventDefault();
    if (identifier.trim()) {
      setLoading(true);
      setError('');
      
      try {
        const response = await authAPI.loginWithPhone(identifier.trim());
        const phoneFromResponse = response?.userDetails?.phoneNumber || identifier.trim();

        login({
          identifier: phoneFromResponse,
          name,
          userId: response?.userId,
          phoneNumber: phoneFromResponse,
        });
        
        if (response.isFirstTime) {
          navigate('/onboarding');
        } else {
          navigate('/plan-trip');
        }
      } catch (err) {
        console.log('User not found, treating as new user');
        login({ identifier, name, phoneNumber: identifier });
        navigate('/onboarding');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[70%] h-[70%] bg-accent/5 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-glow">
              <Compass size={28} className="text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight">TripWise</span>
          </Link>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Sparkles size={16} className="text-primary" />
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Identity Verification</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {step === 1 ? "What's your " : "How can we "}
            <span className="text-gradient">{step === 1 ? "name" : "reach you"}</span>?
          </h1>
          <p className="text-gray-400">
            {step === 1 ? "Tell us who you are so we can personalize your experience." : "We'll use this to save your trips and sync your preferences."}
          </p>
        </div>

        <div className="glass-card p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNameSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary tracking-widest uppercase ml-1 opacity-70">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-lg"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Continue <ArrowRight size={20} />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleContactSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary tracking-widest uppercase ml-1 opacity-70">Phone or Email</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                      {identifier.includes('@') ? <Mail size={20} /> : <Phone size={20} />}
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter phone or email"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-lg"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                
                {error && <p className="text-destructive text-xs text-center">{error}</p>}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary px-6"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    type="submit"
                    disabled={!identifier.trim() || loading}
                    className="btn-primary flex-1 py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Start Planning"}
                    <Compass size={20} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        
        <p className="text-center mt-8 text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}

import { Link } from 'react-router-dom';
