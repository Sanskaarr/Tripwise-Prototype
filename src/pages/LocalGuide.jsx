import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Utensils, AlertCircle, Phone, Home } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading local guide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to {guide?.city}!
            </h2>
            <p className="text-gray-600">Your local travel guide</p>
          </div>

          <div className="grid gap-6">
            <Section
              icon={<MapPin size={24} />}
              title="Top Attractions"
              color="blue"
            >
              <div className="space-y-3">
                {guide?.attractions.map((attraction, index) => (
                  <Card key={index}>
                    <h4 className="font-bold text-gray-800">{attraction.name}</h4>
                    <p className="text-sm text-gray-600">{attraction.description}</p>
                  </Card>
                ))}
              </div>
            </Section>

            <Section
              icon={<Utensils size={24} />}
              title="Local Food"
              color="green"
            >
              <div className="space-y-3">
                {guide?.food.map((food, index) => (
                  <Card key={index}>
                    <h4 className="font-bold text-gray-800">{food.name}</h4>
                    <p className="text-sm text-gray-600">{food.description}</p>
                  </Card>
                ))}
              </div>
            </Section>

            <Section
              icon={<AlertCircle size={24} />}
              title="Travel Tips"
              color="yellow"
            >
              <ul className="space-y-2">
                {guide?.tips.map((tip, index) => (
                  <li key={index} className="flex gap-2 text-gray-700">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section
              icon={<Phone size={24} />}
              title="Emergency Contacts"
              color="red"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Police</span>
                  <a
                    href={`tel:${guide?.emergency.police}`}
                    className="font-bold text-red-600 hover:underline"
                  >
                    {guide?.emergency.police}
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Ambulance</span>
                  <a
                    href={`tel:${guide?.emergency.ambulance}`}
                    className="font-bold text-red-600 hover:underline"
                  >
                    {guide?.emergency.ambulance}
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tourist Helpline</span>
                  <a
                    href={`tel:${guide?.emergency.helpline}`}
                    className="font-bold text-red-600 hover:underline"
                  >
                    {guide?.emergency.helpline}
                  </a>
                </div>
              </div>
            </Section>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, color, children }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      {children}
    </div>
  );
}
