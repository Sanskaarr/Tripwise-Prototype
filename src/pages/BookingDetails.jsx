import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Phone, Mail, Hotel, Plane, CheckCircle, Download, Share2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { aiService } from '../services/aiService';

export function BookingDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();
  const booking = location.state?.booking;

  const [aiDetails, setAiDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!booking) {
      navigate('/plan-trip');
      return;
    }

    const generateAIDetails = async () => {
      try {
        const details = await aiService.generateBookingDetails(booking);
        setAiDetails(details);
      } catch (error) {
        console.error('Error generating booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    generateAIDetails();
  }, [booking, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen section-bg-cream flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 border-4 border-accent-coral/20 border-t-accent-coral rounded-full"
          />
          <p className="text-gray text-lg">{t('generatingDetails') || 'Generating booking details...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-bg-cream py-20 px-4 pt-32">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 shadow-lg border border-charcoal/5"
        >
          {/* Success Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="inline-flex mb-6 bg-accent-sage/20 p-6 rounded-2xl"
            >
              <CheckCircle size={60} className="text-accent-sage" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-3">
              {t('bookingConfirmed') || 'Booking Confirmed'}!
            </h2>
            <p className="text-gray text-lg mb-6">
              {t('bookingId') || 'Booking ID'}: <span className="font-mono font-bold text-accent-coral">{booking.bookingId}</span>
            </p>
            
            <div className="flex gap-4 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-charcoal/10 rounded-xl hover:shadow-md transition-all">
                <Download size={20} />
                <span>{t('download') || 'Download'}</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-charcoal/10 rounded-xl hover:shadow-md transition-all">
                <Share2 size={20} />
                <span>{t('share') || 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Trip Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Travel Details */}
            <div className="bg-white/80 rounded-2xl p-6 border border-charcoal/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-accent-coral/10 rounded-xl">
                  <Plane size={24} className="text-accent-coral" />
                </div>
                <h3 className="text-xl font-display font-bold text-charcoal">
                  {t('travelDetails') || 'Travel Details'}
                </h3>
              </div>
              
              <div className="space-y-3">
                <DetailRow icon={<MapPin size={18} />} label={t('route') || 'Route'} value={`${booking.tripData.from} → ${booking.tripData.destination}`} />
                <DetailRow icon={<Calendar size={18} />} label={t('date') || 'Date'} value={booking.tripData.date} />
                <DetailRow icon={<Users size={18} />} label={t('travelers') || 'Travelers'} value={`${booking.tripData.travelers} ${booking.tripData.tripType}`} />
                <DetailRow icon={<Plane size={18} />} label={t('mode') || 'Mode'} value={booking.travel.name} />
              </div>
              
              <div className="mt-4 pt-4 border-t border-charcoal/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray">{t('travelCost') || 'Travel Cost'}</span>
                  <span className="text-2xl font-bold text-accent-coral">₹{booking.travel.price}</span>
                </div>
              </div>
            </div>

            {/* Hotel Details */}
            <div className="bg-white/80 rounded-2xl p-6 border border-charcoal/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-accent-lavender/10 rounded-xl">
                  <Hotel size={24} className="text-accent-lavender" />
                </div>
                <h3 className="text-xl font-display font-bold text-charcoal">
                  {t('hotelDetails') || 'Hotel Details'}
                </h3>
              </div>
              
              <div className="space-y-3">
                <DetailRow icon={<Hotel size={18} />} label={t('hotel') || 'Hotel'} value={booking.hotel.name} />
                <DetailRow icon={<MapPin size={18} />} label={t('location') || 'Location'} value={booking.tripData.destination} />
                <DetailRow icon={<Calendar size={18} />} label={t('checkIn') || 'Check-in'} value={booking.tripData.date} />
                <div className="flex flex-wrap gap-2 mt-3">
                  {booking.hotel.amenities?.map((amenity, index) => (
                    <span key={index} className="px-3 py-1 bg-accent-lavender/10 text-accent-lavender text-xs rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-charcoal/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray">{t('hotelCost') || 'Hotel Cost'}</span>
                  <span className="text-2xl font-bold text-accent-lavender">₹{booking.hotel.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Contact Information */}
          <div className="bg-gradient-to-r from-accent-coral/10 to-accent-lavender/10 rounded-2xl p-6 border border-charcoal/10 mb-8">
            <h3 className="text-xl font-display font-bold text-charcoal mb-4">
              {t('contactInformation') || 'Contact Information'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <DetailRow icon={<Users size={18} />} label={t('name') || 'Name'} value={booking.tripData.name} />
              <DetailRow icon={user?.identifier?.includes('@') ? <Mail size={18} /> : <Phone size={18} />} 
                label={t('contact') || 'Contact'} 
                value={user?.identifier || 'Not provided'} 
              />
            </div>
          </div>

          {/* AI-Generated Travel Suggestions */}
          {aiDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/80 rounded-2xl p-6 border border-accent-coral/20 mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles size={24} className="text-accent-coral" />
                <h3 className="text-xl font-display font-bold text-charcoal">
                  {t('aiTravelSuggestions') || 'AI Travel Suggestions'}
                </h3>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray font-sans text-sm leading-relaxed">{aiDetails.suggestions}</pre>
              </div>
            </motion.div>
          )}

          {/* Destination Images */}
          <div className="mb-8">
            <h3 className="text-2xl font-display font-bold text-charcoal mb-4">
              {t('destinationGallery') || 'Destination Gallery'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="aspect-square rounded-xl overflow-hidden border-2 border-charcoal/10 hover:border-accent-coral transition-all">
                  <img 
                    src={`https://source.unsplash.com/400x400/?${booking.tripData.destination},travel,${num}`}
                    alt={`${booking.tripData.destination} ${num}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-gradient-to-r from-accent-coral to-accent-lavender p-8 rounded-2xl text-white text-center mb-8">
            <p className="text-sm uppercase tracking-wider mb-2 opacity-90">{t('totalCost') || 'Total Cost'}</p>
            <p className="text-5xl font-display font-bold">₹{booking.total}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/user-dashboard')}
              className="flex-1 py-4 bg-white border-2 border-charcoal text-charcoal font-display font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              {t('viewAllBookings') || 'View All Bookings'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/local-guide', { state: { destination: booking.tripData.destination } })}
              className="flex-1 py-4 bg-charcoal text-cream font-display font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              {t('exploreLocalGuide') || 'Explore Local Guide'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-gray mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-semibold text-charcoal">{value}</p>
      </div>
    </div>
  );
}
