import { useNavigate } from 'react-router-dom';
import { Plane, Mic, Globe, CreditCard, MapPin, Sparkles, ArrowRight } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-deep relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-aurora-purple rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-aurora-blue rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-aurora-pink rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative container mx-auto px-6 py-32 pt-40">
        {/* Hero Section */}
        <div className="text-center mb-24 animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-aurora-blue blur-2xl opacity-50 animate-pulse" />
              <div className="relative glassmorphism p-10 rounded-3xl">
                <Plane size={80} className="text-aurora-blue animate-float" />
              </div>
            </div>
          </div>
          
          <div className="mb-6 inline-flex items-center gap-2 glassmorphism px-6 py-3 rounded-full">
            <Sparkles size={20} className="text-aurora-purple" />
            <span className="text-sm font-medium tracking-wider uppercase">AI-Powered Travel</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 animate-slide-in-left">
            <span className="text-gradient">Welcome to</span>
            <br />
            <span className="text-ice-white">TripWise</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-ice-white/70 mb-12 font-light tracking-wide animate-slide-in-right">
            Plan. Book. Explore — <span className="text-aurora-blue font-medium">All in One Place</span>
          </p>
          
          <button
            onClick={() => navigate('/identify')}
            className="group relative px-12 py-5 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white text-xl font-semibold rounded-full hover:shadow-2xl hover:shadow-aurora-blue/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Your Journey
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple to-aurora-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <FeatureCard
            icon={<Plane size={36} />}
            title="Smart Planning"
            description="AI-powered trip planning tailored to your preferences"
            delay="0s"
          />
          <FeatureCard
            icon={<CreditCard size={36} />}
            title="Instant Booking"
            description="Seamless booking for flights and accommodations"
            delay="0.1s"
          />
          <FeatureCard
            icon={<Mic size={36} />}
            title="Voice Control"
            description="Hands-free experience with voice commands"
            delay="0.2s"
          />
          <FeatureCard
            icon={<Globe size={36} />}
            title="Multi-Language"
            description="Travel support in your preferred language"
            delay="0.3s"
          />
        </div>

        {/* Bottom CTA */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 glassmorphism px-8 py-5 rounded-2xl hover-lift cursor-pointer">
            <MapPin className="text-aurora-pink" size={28} />
            <span className="text-xl font-display font-medium">
              Your AI Travel Companion for Every Journey
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <div 
      className="glassmorphism p-8 rounded-2xl hover-lift cursor-pointer group animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className="text-aurora-blue mb-4 group-hover:text-aurora-purple transition-colors duration-300 group-hover:scale-110 transform transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-display font-bold text-ice-white mb-3">{title}</h3>
      <p className="text-ice-white/60 leading-relaxed">{description}</p>
    </div>
  );
}
