import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Utensils, AlertCircle, Phone, Home, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen bg-navy-deep flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-aurora-purple/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-aurora-purple rounded-full animate-spin"></div>
          </div>
          <p className="text-ice-white/70 text-lg">Loading local guide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep relative overflow-hidden py-20 px-4 pt-32">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-96 h-96 bg-aurora-blue rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-aurora-pink rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="glassmorphism rounded-3xl p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 glassmorphism px-5 py-2 rounded-full mb-6">
              <Sparkles size={18} className="text-aurora-blue" />
              <span className="text-sm font-medium tracking-wider uppercase">Local Guide</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-bold text-ice-white mb-3">
              Welcome to <span className="text-gradient">{guide?.city}</span>!
            </h2>
            <p className="text-ice-white/60 text-lg">
              Your comprehensive local travel guide
            </p>
          </div>

          <div className="grid gap-8">
            {/* Top Attractions */}
            <Section
              icon={<MapPin size={28} />}
              title="Top Attractions"
              color="blue"
              delay="0s"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {guide?.attractions.map((attraction, index) => (
                  <Card key={index} delay={`${index * 0.1}s`}>
                    <h4 className="font-display font-bold text-ice-white text-lg mb-2">{attraction.name}</h4>
                    <p className="text-sm text-ice-white/60">{attraction.description}</p>
                  </Card>
                ))}
              </div>
            </Section>

            {/* Local Food */}
            <Section
              icon={<Utensils size={28} />}
              title="Must-Try Local Food"
              color="purple"
              delay="0.2s"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {guide?.food.map((food, index) => (
                  <Card key={index} delay={`${index * 0.1}s`}>
                    <h4 className="font-display font-bold text-ice-white text-lg mb-2">{food.name}</h4>
                    <p className="text-sm text-ice-white/60">{food.description}</p>
                  </Card>
                ))}
              </div>
            </Section>

            {/* Travel Tips */}
            <Section
              icon={<AlertCircle size={28} />}
              title="Essential Travel Tips"
              color="pink"
              delay="0.4s"
            >
              <ul className="space-y-3">
                {guide?.tips.map((tip, index) => (
                  <li 
                    key={index} 
                    className="flex gap-3 text-ice-white/70 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-aurora-pink mt-1 text-xl">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Emergency Contacts */}
            <Section
              icon={<Phone size={28} />}
              title="Emergency Contacts"
              color="red"
              delay="0.6s"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <EmergencyCard 
                  label="Police"
                  number={guide?.emergency.police}
                  delay="0s"
                />
                <EmergencyCard 
                  label="Ambulance"
                  number={guide?.emergency.ambulance}
                  delay="0.1s"
                />
                <EmergencyCard 
                  label="Tourist Helpline"
                  number={guide?.emergency.helpline}
                  delay="0.2s"
                />
              </div>
            </Section>
          </div>

          {/* Back to Home Button */}
          <div className="mt-12 text-center animate-fade-in">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white font-display font-semibold text-lg rounded-xl hover:shadow-2xl hover:shadow-aurora-blue/50 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Home size={24} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, color, children, delay }) {
  const colorClasses = {
    blue: 'from-aurora-blue to-cyan-400',
    purple: 'from-aurora-purple to-violet-400',
    pink: 'from-aurora-pink to-rose-400',
    red: 'from-red-500 to-rose-500',
  };

  return (
    <div className="glassmorphism border border-white/10 rounded-2xl p-8 animate-fade-in" style={{ animationDelay: delay }}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white`}>
          {icon}
        </div>
        <h3 className="text-2xl md:text-3xl font-display font-bold text-ice-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Card({ children, delay }) {
  return (
    <div 
      className="glassmorphism p-5 rounded-xl border border-white/10 hover-lift cursor-pointer animate-fade-in"
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

function EmergencyCard({ label, number, delay }) {
  return (
    <a
      href={`tel:${number}`}
      className="glassmorphism p-6 rounded-xl border border-red-500/30 hover:border-red-500/50 hover-lift text-center transition-all duration-300 animate-fade-in group"
      style={{ animationDelay: delay }}
    >
      <p className="text-sm text-ice-white/60 mb-2 tracking-wider uppercase">{label}</p>
      <p className="text-2xl font-display font-bold text-red-400 group-hover:text-red-300 transition-colors">
        {number}
      </p>
    </a>
  );
}
