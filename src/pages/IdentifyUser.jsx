import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Sparkles } from 'lucide-react';

export function IdentifyUser() {
  const [identifier, setIdentifier] = useState('');
  const [isReturning, setIsReturning] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (identifier.trim()) {
      const hasVisited = localStorage.getItem('tripwise_user');
      setIsReturning(!!hasVisited);
      localStorage.setItem('tripwise_user', identifier);
      
      setTimeout(() => {
        navigate('/plan-trip');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep relative overflow-hidden flex items-center justify-center px-4 pt-24">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aurora-purple rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-aurora-blue rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative glassmorphism p-10 rounded-3xl shadow-2xl max-w-lg w-full animate-fade-in">
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-aurora-purple blur-xl opacity-50 animate-pulse" />
            <div className="relative glassmorphism p-6 rounded-2xl">
              <User size={56} className="text-aurora-purple" />
            </div>
          </div>
          
          <div className="mb-4 inline-flex items-center gap-2 glassmorphism px-5 py-2 rounded-full">
            <Sparkles size={16} className="text-aurora-blue" />
            <span className="text-xs font-medium tracking-wider uppercase">Step 1 of 3</span>
          </div>
          
          <h2 className="text-4xl font-display font-bold text-ice-white mb-3">
            Who's <span className="text-gradient">Traveling</span>?
          </h2>
          <p className="text-ice-white/60 text-lg">
            Enter your contact to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="animate-slide-in-left">
            <label className="block text-sm font-semibold text-ice-white/80 mb-3 tracking-wide">
              PHONE / EMAIL
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora-blue">
                {identifier.includes('@') ? <Mail size={22} /> : <Phone size={22} />}
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter phone or email"
                className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 rounded-xl text-ice-white placeholder-ice-white/40 focus:border-aurora-blue focus:outline-none transition-all duration-300 text-lg"
                required
              />
            </div>
          </div>

          {isReturning && (
            <div className="glassmorphism border border-green-500/30 rounded-xl p-5 text-ice-white text-center animate-fade-in bg-green-500/10">
              <span className="text-2xl mb-2 block">🎉</span>
              <span className="font-semibold">Welcome back!</span>
            </div>
          )}

          {isReturning === false && identifier && (
            <div className="glassmorphism border border-aurora-blue/30 rounded-xl p-5 text-ice-white text-center animate-fade-in bg-aurora-blue/10">
              <span className="text-2xl mb-2 block">✈️</span>
              <span className="font-semibold">Let's plan your first adventure!</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white text-lg font-display font-semibold rounded-xl hover:shadow-2xl hover:shadow-aurora-purple/50 transition-all duration-300 transform hover:scale-[1.02] animate-slide-in-right"
          >
            Continue to Planning
          </button>
        </form>
      </div>
    </div>
  );
}
