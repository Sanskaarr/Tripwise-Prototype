import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Hotel, Star } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding best options for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Available Options
          </h2>
          <p className="text-gray-600 text-center mb-8">
            {tripData.from} → {tripData.destination}
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {tripData.mode} Options
              </h3>
              <div className="space-y-3">
                {options?.travelOptions.map((option) => (
                  <TripCard
                    key={option.id}
                    option={option}
                    selected={selectedTravel?.id === option.id}
                    onSelect={() => setSelectedTravel(option)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Hotel size={24} />
                Hotel Options
              </h3>
              <div className="space-y-3">
                {options?.hotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    selected={selectedHotel?.id === hotel.id}
                    onSelect={() => setSelectedHotel(hotel)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-700">Total Cost</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{(selectedTravel?.price || 0) + (selectedHotel?.price || 0)}
                </span>
              </div>

              <button
                onClick={handleContinue}
                disabled={!selectedTravel || !selectedHotel}
                className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400"
              >
                Continue to Payment
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
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
        selected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-bold text-gray-800">{hotel.name}</h4>
          <div className="flex items-center gap-1 mt-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-gray-600">{hotel.rating}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-blue-600">₹{hotel.price}</div>
          <div className="text-xs text-gray-500">per night</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {hotel.amenities.map((amenity, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );
}
