import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Utensils, AlertCircle, Phone, Home, Sparkles, Compass, Star, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { localGuideAPI } from '../services/api';
import { useUser } from '../contexts/UserContext';

export function LocalGuide() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const destination = location.state?.destination || 'Your Destination';

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const userId = user?.userId || localStorage.getItem('tripwise_userId') || 'anonymous';
        const response = await localGuideAPI.getGuide(userId, destination);
        if (response.success) {
          // Note: The backend returns 'recommendations' as a string, 
          // but the Escape Echoes UI expects an object with attractions, food, tips, etc.
          // Since we are discarding Escape Echoes logic, we should probably update the UI 
          // to show the AI-generated text properly.
          setGuide(response.recommendations);
        }
      } catch (error) {
        console.error('Error fetching guide:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [destination, user?.userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto mb-6 border-4 border-primary/20 border-t-primary rounded-full shadow-glow"
          />
          <p className="text-primary animate-pulse font-medium tracking-widest uppercase text-xs">Decrypting Local Wisdom...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
              <Sparkles size={16} className="text-primary" />
              <span className="text-xs font-bold text-primary tracking-widest uppercase">Expert Insights</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">Explore <span className="text-gradient">{destination}</span></h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Curated local knowledge, hidden gems, and essential information for your journey.
            </p>
          </motion.div>

            <div className="grid grid-cols-1 gap-8">
              <motion.div variants={itemVariants} className="glass-card p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Compass size={24} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Personalized Guide</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                    {guide}
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={itemVariants} className="glass-card p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                    <Navigation size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Plan Your Route</h3>
                  <p className="text-gray-400 text-sm">Need a custom itinerary based on these recommendations?</p>
                  <button 
                    onClick={() => navigate('/plan-trip')}
                    className="btn-primary w-full py-3"
                  >
                    Generate Detailed Plan
                  </button>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                    <Home size={32} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Go Back</h3>
                  <p className="text-gray-400 text-sm">Return to your dashboard or explore more destinations.</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="btn-secondary w-full py-3 flex items-center justify-center gap-2"
                  >
                    Exit Guide
                  </button>
                </motion.div>
              </div>
            </div>

        </motion.div>
      </div>
    </div>
  );
}

function Section({ title, icon, children, variants }) {
  return (
    <motion.div variants={variants} className="glass-card p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          {icon}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function GuideCard({ title, description, icon }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-bold text-white group-hover:text-primary transition-colors">{title}</h4>
      </div>
      <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
    </div>
  );
}

function EmergencyItem({ label, number }) {
  return (
    <a 
      href={`tel:${number}`}
      className="flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/10 hover:bg-destructive/10 transition-all group"
    >
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <div className="flex items-center gap-2 text-destructive font-bold">
        <Phone size={14} />
        {number}
      </div>
    </a>
  );
}
