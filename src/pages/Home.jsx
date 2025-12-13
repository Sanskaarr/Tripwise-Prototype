import { useNavigate } from 'react-router-dom';
import { Plane, Mic, Globe, CreditCard, MapPin } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-8 rounded-full shadow-2xl">
              <Plane size={64} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Welcome to TripWise
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Plan. Book. Explore — All in One Place.
          </p>
          <button
            onClick={() => navigate('/identify')}
            className="px-12 py-4 bg-blue-600 text-white text-xl font-semibold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Your Trip
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <FeatureCard
            icon={<Plane size={32} />}
            title="Easy Planning"
            description="Plan your perfect trip with AI assistance"
          />
          <FeatureCard
            icon={<CreditCard size={32} />}
            title="Quick Booking"
            description="Book tickets and hotels in seconds"
          />
          <FeatureCard
            icon={<Mic size={32} />}
            title="Voice Support"
            description="Use voice commands for hands-free experience"
          />
          <FeatureCard
            icon={<Globe size={32} />}
            title="Multi-Language"
            description="Available in multiple languages"
          />
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
            <MapPin className="text-blue-600" size={24} />
            <span className="text-gray-700 font-medium">
              Your AI Travel Companion for Every Journey
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
