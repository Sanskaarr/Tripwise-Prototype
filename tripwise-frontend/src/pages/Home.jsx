import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, Shield, Zap, Globe, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
            >
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary-foreground/80 tracking-wide uppercase">
                {t('aiPowered') || 'Next-Generation AI Travel'}
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-8xl font-display font-bold tracking-tight mb-8"
            >
              {t('welcomeTitle') || 'Travel Smarter with'} 
              <span className="text-gradient block mt-2">AI Intelligence</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              {t('welcomeDescription') || 'The only AI travel companion that understands your preferences, predicts your needs, and crafts perfect journeys across the globe.'}
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button 
                onClick={() => navigate('/identify')}
                className="btn-primary py-4 px-10 text-lg flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                {t('getStarted')}
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => navigate('/plan-trip')}
                className="btn-secondary py-4 px-10 text-lg w-full sm:w-auto"
              >
                {t('viewFeatures') || 'Explore Features'}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features Preview */}
      <section className="py-20 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem 
              icon={<Shield className="text-primary" size={32} />}
              title={t('secureTravel') || 'Secure & Reliable'}
              description={t('secureTravelDesc') || 'Your data and bookings are protected with military-grade encryption and 24/7 monitoring.'}
            />
            <FeatureItem 
              icon={<Zap className="text-accent" size={32} />}
              title={t('instantPlanning') || 'Instant Itineraries'}
              description={t('instantPlanningDesc') || 'Generate comprehensive multi-day travel plans in seconds based on your specific interests.'}
            />
            <FeatureItem 
              icon={<Globe className="text-primary" size={32} />}
              title={t('globalReach') || 'Global Expertise'}
              description={t('globalReachDesc') || 'Deep knowledge of over 10,000 destinations, including hidden local gems only residents know.'}
            />
          </div>
        </div>
      </section>

      {/* Image/Visual Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative rounded-3xl overflow-hidden aspect-[16/9] max-w-5xl mx-auto group shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
              alt="Travel Adventure"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row items-end justify-between gap-6">
              <div className="max-w-md">
                <h3 className="text-3xl font-bold mb-2">Ready for your next adventure?</h3>
                <p className="text-gray-300">Start planning your dream trip today with our intelligent assistant.</p>
              </div>
              <button 
                onClick={() => navigate('/identify')}
                className="bg-white text-black font-bold py-4 px-8 rounded-xl hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
              >
                Start Now <Compass size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Compass size={24} className="text-primary" />
            <span className="text-xl font-bold tracking-tight">TripWise</span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 TripWise AI Travel Companion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-8 group transition-all duration-300 hover:border-primary/30"
    >
      <div className="mb-6 p-4 w-fit rounded-2xl bg-white/5 group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
