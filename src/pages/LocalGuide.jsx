import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Utensils, AlertCircle, Phone, Home, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { localGuideAPI } from '../services/api';

export function LocalGuide() {
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.destination;

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destination) {
      navigate('/plan-trip');
      return;
    }

    const fetchGuide = async () => {
      try {
        const response = await localGuideAPI.getGuide(destination);
        if (response.success) {
          setGuide(response.data);
        }
      } catch (error) {
        console.error('Error fetching guide:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [destination, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen section-bg-cream flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 border-4 border-accent-lavender/20 border-t-accent-lavender rounded-full"
          />
          <p className="text-gray text-lg">Loading local guide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-bg-blush py-20 px-4 pt-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 shadow-lg border border-charcoal/5"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-charcoal/10 mb-6"
            >
              <Sparkles size={18} className="text-accent-coral" />
              <span className="text-sm font-medium tracking-wider text-gray">LOCAL GUIDE</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-6xl font-display font-bold text-charcoal mb-3"
            >
              Welcome to <span className="text-gradient-pastel">{guide?.city}</span>!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray text-lg"
            >
              Your comprehensive local travel guide
            </motion.p>
          </div>

          <div className="grid gap-8">
            <Section
              icon={<MapPin size={28} />}
              title="Top Attractions"
              color="coral"
              delay={0.8}
            >
              <div className="grid md:grid-cols-2 gap-4">
                {guide?.attractions.map((attraction, index) => (
                  <Card key={index} delay={1 + index * 0.1}>
                    <h4 className="font-display font-bold text-charcoal text-lg mb-2">{attraction.name}</h4>
                    <p className="text-sm text-gray">{attraction.description}</p>
                  </Card>
                ))}
              </div>
            </Section>

            <Section
              icon={<Utensils size={28} />}
              title="Must-Try Local Food"
              color="lavender"
              delay={1.2}
            >
              <div className="grid md:grid-cols-2 gap-4">
                {guide?.food.map((food, index) => (
                  <Card key={index} delay={1.4 + index * 0.1}>
                    <h4 className="font-display font-bold text-charcoal text-lg mb-2">{food.name}</h4>
                    <p className="text-sm text-gray">{food.description}</p>
                  </Card>
                ))}
              </div>
            </Section>

            <Section
              icon={<AlertCircle size={28} />}
              title="Essential Travel Tips"
              color="sage"
              delay={1.6}
            >
              <ul className="space-y-3">
                {guide?.tips.map((tip, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.8 + index * 0.1 }}
                    className="flex gap-3 text-gray"
                  >
                    <span className="text-accent-coral mt-1 text-xl">•</span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </Section>

            <Section
              icon={<Phone size={28} />}
              title="Emergency Contacts"
              color="red"
              delay={2}
            >
              <div className="grid md:grid-cols-3 gap-4">
                <EmergencyCard 
                  label="Police"
                  number={guide?.emergency.police}
                  delay={2.2}
                />
                <EmergencyCard 
                  label="Ambulance"
                  number={guide?.emergency.ambulance}
                  delay={2.3}
                />
                <EmergencyCard 
                  label="Tourist Helpline"
                  number={guide?.emergency.helpline}
                  delay={2.4}
                />
              </div>
            </Section>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
            className="mt-12 text-center"
          >
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-charcoal text-cream font-display font-semibold text-lg rounded-xl hover:shadow-xl transition-all duration-300"
            >
              <Home size={24} />
              <span>Back to Home</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ icon, title, color, children, delay }) {
  const colorClasses = {
    coral: 'bg-accent-coral',
    lavender: 'bg-accent-lavender',
    sage: 'bg-accent-sage',
    red: 'bg-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/80 border border-charcoal/10 rounded-2xl p-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl ${colorClasses[color]} text-white`}>
          {icon}
        </div>
        <h3 className="text-2xl md:text-3xl font-display font-bold text-charcoal">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Card({ children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="bg-white/80 p-5 rounded-xl border border-charcoal/10 hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {children}
    </motion.div>
  );
}

function EmergencyCard({ label, number, delay }) {
  return (
    <motion.a
      href={`tel:${number}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-red-50 border-2 border-red-200 hover:border-red-300 p-6 rounded-xl text-center transition-all duration-300 group"
    >
      <p className="text-sm text-gray mb-2 tracking-wider uppercase">{label}</p>
      <p className="text-2xl font-display font-bold text-red-500 group-hover:text-red-600 transition-colors">
        {number}
      </p>
    </motion.a>
  );
}
