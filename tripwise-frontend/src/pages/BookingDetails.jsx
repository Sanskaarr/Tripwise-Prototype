import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Phone, Mail, Hotel, Plane, Train, Bus, CheckCircle, Download, Share2, Sparkles, Clock, DollarSign, Tag, Briefcase, Coffee, Key, Shield, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { tripAPI, localGuideAPI } from '../services/api';

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
        const userId = user?.userId || localStorage.getItem('tripwise_userId') || 'anonymous';
        // Use localGuideAPI to get recommendations for the destination
        const response = await localGuideAPI.getGuide(userId, booking.tripData.destination);
        if (response.success) {
          setAiDetails({ suggestions: response.recommendations });
        }
      } catch (error) {
        console.error('Error generating booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    generateAIDetails();
  }, [booking, navigate, user?.userId]);

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

  const getTravelIcon = (mode) => {
    switch(mode?.toLowerCase()) {
      case 'flight': return <Plane size={24} />;
      case 'train': return <Train size={24} />;
      case 'bus': return <Bus size={24} />;
      default: return <Plane size={24} />;
    }
  };

  return (
    <div className="min-h-screen section-bg-cream py-20 px-4 pt-32">
      <div className="max-w-6xl mx-auto">
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

          {/* Detailed Travel Information */}
          <div className="bg-gradient-to-br from-accent-coral/5 to-accent-lavender/5 rounded-2xl p-8 mb-8 border border-charcoal/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent-coral/10 rounded-xl">
                {getTravelIcon(booking.travel.mode)}
              </div>
              <h3 className="text-2xl font-display font-bold text-charcoal">
                {t('travelDetails') || 'Travel Details'}
              </h3>
            </div>

            {/* Operator & Service Details */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white/80 rounded-xl p-5">
                <p className="text-xs text-gray uppercase tracking-wider mb-2">Operator/Service</p>
                <p className="text-xl font-bold text-charcoal">{booking.travel.operator || booking.travel.name}</p>
                <p className="text-sm text-gray mt-1">{booking.travel.number || 'Service Number TBD'}</p>
              </div>
              <div className="bg-white/80 rounded-xl p-5">
                <p className="text-xs text-gray uppercase tracking-wider mb-2">Travel Mode & Class</p>
                <p className="text-xl font-bold text-charcoal capitalize">{booking.travel.mode || booking.tripData.travelMode}</p>
                <p className="text-sm text-gray mt-1">{booking.travel.class || 'Economy Class'}</p>
              </div>
              <div className="bg-white/80 rounded-xl p-5">
                <p className="text-xs text-gray uppercase tracking-wider mb-2">Booking Status</p>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-accent-sage" />
                  <p className="text-xl font-bold text-accent-sage">{booking.travel.status || 'Confirmed'}</p>
                </div>
              </div>
            </div>

            {/* Journey Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/80 rounded-xl p-5 border-l-4 border-accent-coral">
                <p className="text-xs text-gray uppercase tracking-wider mb-2">Departure</p>
                <p className="text-lg font-bold text-charcoal">{booking.tripData.from}</p>
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray flex items-center gap-2">
                    <Clock size={16} /> Time: <span className="font-semibold text-charcoal">{booking.travel.departureTime || '09:00 AM'}</span>
                  </p>
                  <p className="text-sm text-gray flex items-center gap-2">
                    <Calendar size={16} /> Date: <span className="font-semibold text-charcoal">{booking.tripData.date}</span>
                  </p>
                  {booking.travel.terminal && (
                    <p className="text-sm text-gray flex items-center gap-2">
                      <MapPin size={16} /> {booking.travel.terminal}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-white/80 rounded-xl p-5 border-l-4 border-accent-lavender">
                <p className="text-xs text-gray uppercase tracking-wider mb-2">Arrival</p>
                <p className="text-lg font-bold text-charcoal">{booking.tripData.destination}</p>
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray flex items-center gap-2">
                    <Clock size={16} /> Time: <span className="font-semibold text-charcoal">{booking.travel.arrivalTime || '12:00 PM'}</span>
                  </p>
                  <p className="text-sm text-gray flex items-center gap-2">
                    <Calendar size={16} /> Date: <span className="font-semibold text-charcoal">{booking.tripData.date}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Travel Essentials */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <InfoCard icon={<Clock size={20} />} label="Duration" value={booking.travel.duration || "3h 0m"} />
              <InfoCard icon={<Users size={20} />} label="Travelers" value={`${booking.tripData.travelers} Person(s)`} />
              <InfoCard icon={<Tag size={20} />} label="Seat/Berth" value={booking.travel.seats || 'TBA'} />
              <InfoCard icon={<DollarSign size={20} />} label="Travel Cost" value={`₹${booking.travel.price}`} accent />
            </div>

            {/* PNR & Additional Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div className="bg-white/80 rounded-xl p-5">
                <p className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Key size={16} /> Booking Reference (PNR)
                </p>
                <p className="text-lg font-mono font-bold text-charcoal tracking-wide">{booking.travel.pnr || booking.bookingId}</p>
              </div>
              <div className="bg-white/80 rounded-xl p-5">
                <p className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Briefcase size={16} /> Baggage Allowance
                </p>
                <p className="text-sm text-charcoal font-medium">{booking.travel.baggage || '15kg Check-in + 7kg Cabin'}</p>
              </div>
            </div>

            {/* Meals & Cancellation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 rounded-xl p-5">
                <p className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Coffee size={16} /> Meal Plan
                </p>
                <p className="text-sm text-charcoal">{booking.travel.meals || 'Available for purchase'}</p>
              </div>
              <div className="bg-white/80 rounded-xl p-5">
                <p className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Shield size={16} /> Cancellation Policy
                </p>
                <p className="text-sm text-charcoal">{booking.travel.cancellation || 'Cancellation charges apply as per operator policy'}</p>
              </div>
            </div>
          </div>

          {/* Detailed Hotel Information */}
          <div className="bg-gradient-to-br from-accent-lavender/5 to-accent-sage/5 rounded-2xl p-8 mb-8 border border-charcoal/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent-lavender/10 rounded-xl">
                <Hotel size={24} className="text-accent-lavender" />
              </div>
              <h3 className="text-2xl font-display font-bold text-charcoal">
                {t('hotelDetails') || 'Hotel Details'}
              </h3>
            </div>

            {/* Hotel Basic Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/80 rounded-xl p-5">
                <p className="text-xs text-gray uppercase tracking-wider mb-2">Hotel Name</p>
                <p className="text-xl font-bold text-charcoal">{booking.hotel.name}</p>
                <p className="text-sm text-gray mt-1">⭐ {booking.hotel.rating || '4.5'} Star Rating</p>
                {booking.hotel.confirmationNumber && (
                  <p className="text-xs font-mono text-gray mt-2">Conf. #{booking.hotel.confirmationNumber}</p>
                )}
              </div>
              <div className="bg-white/80 rounded-xl p-5">
                <p className="text-xs text-gray uppercase tracking-wider mb-2">Location</p>
                <p className="text-lg font-bold text-charcoal">{booking.tripData.destination}</p>
                <p className="text-sm text-gray mt-1">{booking.hotel.address || 'City Center'}</p>
              </div>
            </div>

            {/* Check-in/out Details */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/80 rounded-xl p-5 border-l-4 border-accent-sage">
                <p className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Calendar size={16} /> Check-in
                </p>
                <p className="text-sm text-charcoal font-semibold">{booking.tripData.date}</p>
                <p className="text-xs text-gray mt-1">After {booking.hotel.checkIn || '2:00 PM'}</p>
              </div>
              <div className="bg-white/80 rounded-xl p-5 border-l-4 border-accent-coral">
                <p className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Calendar size={16} /> Check-out
                </p>
                <p className="text-sm text-charcoal font-semibold">{booking.tripData.date}</p>
                <p className="text-xs text-gray mt-1">Before {booking.hotel.checkOut || '11:00 AM'}</p>
              </div>
              <div className="bg-white/80 rounded-xl p-5 border-l-4 border-accent-lavender">
                <p className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock size={16} /> Nights
                </p>
                <p className="text-2xl font-bold text-charcoal">{booking.hotel.nights || 3}</p>
                <p className="text-xs text-gray mt-1">Night(s)</p>
              </div>
            </div>

            {/* Room Details */}
            <div className="bg-white/80 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray uppercase tracking-wider mb-3 font-semibold">Room Details</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray mb-1">Room Type</p>
                  <p className="text-base font-bold text-charcoal">{booking.hotel.roomType || 'Deluxe Double Room'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray mb-1">Bed Type</p>
                  <p className="text-base font-semibold text-charcoal">{booking.hotel.bedType || 'King Size Bed'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray mb-1">Room Size</p>
                  <p className="text-base font-semibold text-charcoal">{booking.hotel.roomSize || '300 sq ft'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray mb-1">Max Occupancy</p>
                  <p className="text-base font-semibold text-charcoal">{booking.hotel.maxOccupancy || booking.tripData.travelers} Guest(s)</p>
                </div>
              </div>
            </div>

            {/* Meal Plan & Parking */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/80 rounded-xl p-5">
                <p className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Coffee size={16} /> Meal Plan
                </p>
                <p className="text-sm font-semibold text-charcoal">{booking.hotel.mealPlan || 'Breakfast Included'}</p>
              </div>
              {booking.hotel.parking && (
                <div className="bg-white/80 rounded-xl p-5">
                  <p className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MapPin size={16} /> Parking
                  </p>
                  <p className="text-sm font-semibold text-charcoal">{booking.hotel.parking}</p>
                </div>
              )}
            </div>

            {/* Amenities */}
            {booking.hotel.amenities && booking.hotel.amenities.length > 0 && (
              <div className="bg-white/80 rounded-xl p-5 mb-6">
                <p className="text-xs text-gray uppercase tracking-wider mb-3 font-semibold">Room Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {booking.hotel.amenities.map((amenity, index) => (
                    <span key={index} className="px-4 py-2 bg-accent-lavender/10 text-accent-lavender text-sm font-medium rounded-full border border-accent-lavender/20">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            {booking.hotel.facilities && booking.hotel.facilities.length > 0 && (
              <div className="bg-white/80 rounded-xl p-5 mb-6">
                <p className="text-xs text-gray uppercase tracking-wider mb-3 font-semibold">Hotel Facilities</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {booking.hotel.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-charcoal">
                      <CheckCircle size={16} className="text-accent-sage" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Requests */}
            {booking.hotel.specialRequests && (
              <div className="bg-accent-sage/10 rounded-xl p-5 mb-6 border border-accent-sage/20">
                <p className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Info size={16} /> Special Requests
                </p>
                <p className="text-sm text-charcoal">{booking.hotel.specialRequests}</p>
              </div>
            )}

            {/* Hotel Policies */}
            {booking.hotel.policies && booking.hotel.policies.length > 0 && (
              <div className="bg-white/80 rounded-xl p-5 mb-4">
                <p className="text-xs text-gray uppercase tracking-wider mb-3 font-semibold flex items-center gap-2">
                  <AlertCircle size={16} /> Hotel Policies
                </p>
                <ul className="space-y-2">
                  {booking.hotel.policies.map((policy, index) => (
                    <li key={index} className="text-sm text-charcoal flex items-start gap-2">
                      <span className="text-accent-coral mt-1">•</span>
                      <span>{policy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cancellation */}
            <div className="bg-white/80 rounded-xl p-5">
              <p className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                <Shield size={16} /> Cancellation Policy
              </p>
              <p className="text-sm text-charcoal">{booking.hotel.cancellation || 'Free cancellation up to 24 hours before check-in. Cancellation charges apply after that.'}</p>
            </div>

            {/* Total Hotel Cost */}
            <div className="mt-6 bg-gradient-to-r from-accent-lavender/20 to-accent-sage/20 rounded-xl p-5 border border-accent-lavender/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray uppercase tracking-wider mb-1">Total Hotel Cost</p>
                  <p className="text-sm text-gray">₹{booking.hotel.price} × {booking.hotel.nights || 3} nights</p>
                </div>
                <p className="text-3xl font-display font-bold text-accent-lavender">₹{booking.hotel.price * (booking.hotel.nights || 3)}</p>
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

          {/* Total Cost - Compact */}
          <div className="bg-gradient-to-r from-accent-coral to-accent-lavender p-5 rounded-xl text-white text-center mb-8">
            <p className="text-xs uppercase tracking-wider mb-1 opacity-90">{t('totalCost') || 'Total Cost'}</p>
            <p className="text-3xl font-display font-bold">₹{booking.total}</p>
            <p className="text-xs mt-1 opacity-80">Travel: ₹{booking.travel.price} + Hotel: ₹{booking.hotel.price}</p>
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

function InfoCard({ icon, label, value, accent }) {
  return (
    <div className={`bg-white/80 rounded-xl p-4 ${accent ? 'ring-2 ring-accent-coral/30' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`${accent ? 'text-accent-coral' : 'text-gray'}`}>{icon}</div>
        <p className="text-xs text-gray uppercase tracking-wider">{label}</p>
      </div>
      <p className={`text-lg font-bold ${accent ? 'text-accent-coral' : 'text-charcoal'}`}>{value}</p>
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