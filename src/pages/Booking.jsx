import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Hotel, Star, Sparkles, ArrowRight } from 'lucide-react';
import { TripCard } from '../components/TripCard';
import { bookingAPI } from '../services/api';

export function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const tripData = location.state?.tripData;

  const [options, setOptions] = useState(null);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripData) {
      navigate('/plan-trip');
      return;
    }

    const fetchOptions = async () => {
      try {
        const response = await bookingAPI.getOptions(tripData.destination, tripData.mode);
        if (response.success) {
          setOptions(response.data);
          setSelectedTravel(response.data.travelOptions[0]);
          setSelectedHotel(response.data.hotels[0]);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [tripData, navigate]);

  const handleContinue = () => {
    if (selectedTravel && selectedHotel) {
      navigate('/payment', {
        state: {
          booking: {
            tripData,
            travel: selectedTravel,
            hotel: selectedHotel,
            total: selectedTravel.price + selectedHotel.price,
          },
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-aurora-blue/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-aurora-blue rounded-full animate-spin"></div>
          </div>
          <p className="text-ice-white/70 text-lg">Finding best options for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep relative overflow-hidden py-20 px-4 pt-32">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-80 h-80 bg-aurora-purple rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-aurora-pink rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="glassmorphism rounded-3xl p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 glassmorphism px-5 py-2 rounded-full mb-6">
              <Sparkles size={18} className="text-aurora-blue" />
              <span className="text-sm font-medium tracking-wider uppercase">Step 2 of 3</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-ice-white mb-3">
              Choose Your <span className="text-gradient">Travel Options</span>
            </h2>
            <p className="text-ice-white/60 text-lg">
              {tripData.from} → {tripData.destination}
            </p>
          </div>

          <div className="space-y-10">
            {/* Travel Options */}
            <div className="animate-slide-in-left">
              <h3 className="text-2xl font-display font-bold text-ice-white mb-5 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-aurora-blue to-aurora-purple rounded-full" />
                {tripData.mode} Options
              </h3>
              <div className="space-y-4">
                {options?.travelOptions.map((option, index) => (
                  <div key={option.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <TripCard
                      option={option}
                      selected={selectedTravel?.id === option.id}
                      onSelect={() => setSelectedTravel(option)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Options */}
            <div className="animate-slide-in-right">
              <h3 className="text-2xl font-display font-bold text-ice-white mb-5 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-aurora-purple to-aurora-pink rounded-full" />
                <Hotel size={28} />
                Hotel Options
              </h3>
              <div className="space-y-4">
                {options?.hotels.map((hotel, index) => (
                  <div key={hotel.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <HotelCard
                      hotel={hotel}
                      selected={selectedHotel?.id === hotel.id}
                      onSelect={() => setSelectedHotel(hotel)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Continue */}
            <div className="border-t border-white/10 pt-8 animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-display font-semibold text-ice-white">Total Cost</span>
                <span className="text-4xl font-display font-bold text-gradient">
                  ₹{(selectedTravel?.price || 0) + (selectedHotel?.price || 0)}
                </span>
              </div>

              <button
                onClick={handleContinue}
                disabled={!selectedTravel || !selectedHotel}
                className="group w-full py-5 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white text-lg font-display font-semibold rounded-xl hover:shadow-2xl hover:shadow-aurora-blue/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                Continue to Payment
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HotelCard({ hotel, selected, onSelect }) {
  return (
    <div
      className={`group relative rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 hover-lift ${
        selected 
          ? 'border-aurora-purple bg-aurora-purple/10 shadow-lg shadow-aurora-purple/30' 
          : 'border-white/10 glassmorphism hover:border-aurora-purple/50'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-display font-bold text-ice-white mb-2">{hotel.name}</h4>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className={`${i < hotel.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
              />
            ))}
            <span className="text-sm text-ice-white/60 ml-1">{hotel.rating}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-aurora-purple">₹{hotel.price}</div>
          <div className="text-xs text-ice-white/50">per night</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {hotel.amenities.map((amenity, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-white/5 border border-white/10 text-ice-white/70 text-xs rounded-full"
          >
            {amenity}
          </span>
        ))}
      </div>

      {selected && (
        <div className="absolute top-6 right-6 w-6 h-6 bg-aurora-purple rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
    </div>
  );
}
