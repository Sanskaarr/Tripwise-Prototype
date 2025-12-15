import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Hotel, Star, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <div className="min-h-screen section-bg-cream flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 border-4 border-accent-coral/20 border-t-accent-coral rounded-full"
          />
          <p className="text-gray text-lg">Finding best options for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-bg-peach py-20 px-4 pt-32">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 shadow-lg border border-charcoal/5"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-charcoal/10 mb-6"
            >
              <Sparkles size={18} className="text-accent-coral" />
              <span className="text-sm font-medium tracking-wider text-gray">STEP 2 OF 3</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-3"
            >
              Choose Your <span className="text-gradient-pastel">Travel Options</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray text-lg"
            >
              {tripData.from} → {tripData.destination}
            </motion.p>
          </div>

          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-2xl font-display font-bold text-charcoal mb-5 flex items-center gap-3">
                <div className="w-1 h-8 bg-accent-coral rounded-full" />
                {tripData.mode} Options
              </h3>
              <div className="space-y-4">
                {options?.travelOptions.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                  >
                    <TripCard
                      option={option}
                      selected={selectedTravel?.id === option.id}
                      onSelect={() => setSelectedTravel(option)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h3 className="text-2xl font-display font-bold text-charcoal mb-5 flex items-center gap-3">
                <div className="w-1 h-8 bg-accent-lavender rounded-full" />
                <Hotel size={28} className="text-accent-lavender" />
                Hotel Options
              </h3>
              <div className="space-y-4">
                {options?.hotels.map((hotel, index) => (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                  >
                    <HotelCard
                      hotel={hotel}
                      selected={selectedHotel?.id === hotel.id}
                      onSelect={() => setSelectedHotel(hotel)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              className="border-t border-charcoal/10 pt-8"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-display font-semibold text-charcoal">Total Cost</span>
                <span className="text-4xl font-display font-bold text-gradient-pastel">
                  ₹{(selectedTravel?.price || 0) + (selectedHotel?.price || 0)}
                </span>
              </div>

              <motion.button
                onClick={handleContinue}
                disabled={!selectedTravel || !selectedHotel}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full py-5 bg-charcoal text-cream text-lg font-display font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                Continue to Payment
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function HotelCard({ hotel, selected, onSelect }) {
  return (
    <motion.div
      whileHover={{ scale: selected ? 1 : 1.01, y: -4 }}
      className={`rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
        selected 
          ? 'border-accent-lavender bg-accent-lavender/10 shadow-lg' 
          : 'border-charcoal/10 bg-white/80 hover:border-accent-lavender/50'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-display font-bold text-charcoal mb-2">{hotel.name}</h4>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className={`${i < hotel.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray/20'}`}
              />
            ))}
            <span className="text-sm text-gray ml-1">{hotel.rating}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-accent-lavender">₹{hotel.price}</div>
          <div className="text-xs text-gray">per night</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {hotel.amenities.map((amenity, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-charcoal/5 border border-charcoal/10 text-gray text-xs rounded-full"
          >
            {amenity}
          </span>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-6 right-6 w-6 h-6 bg-accent-lavender rounded-full flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      )}
    </motion.div>
  );
}
