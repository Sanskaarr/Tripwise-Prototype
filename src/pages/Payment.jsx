import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Receipt, Sparkles, MapPin, Hotel, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import { PaymentQR } from '../components/PaymentQR';
import { bookingAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';

export function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();
  const booking = location.state?.booking;

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handlePaymentComplete = async () => {
    try {
      const response = await bookingAPI.confirmBooking({
        ...booking,
        paymentMethod: 'UPI',
        paymentStatus: 'completed',
      });

      if (response.success) {
        const newBookingId = response.data.bookingId;
        setBookingId(newBookingId);
        setPaymentSuccess(true);

        // Save booking to localStorage for user dashboard
        const bookingWithId = {
          ...booking,
          bookingId: newBookingId,
          timestamp: new Date().toISOString(),
        };

        if (user && user.identifier) {
          const existingBookings = JSON.parse(
            localStorage.getItem(`bookings_${user.identifier}`) || '[]'
          );
          existingBookings.push(bookingWithId);
          localStorage.setItem(
            `bookings_${user.identifier}`,
            JSON.stringify(existingBookings)
          );
        }

        setTimeout(() => {
          navigate('/booking-details', {
            state: { booking: bookingWithId },
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  if (!booking) {
    navigate('/plan-trip');
    return null;
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen section-bg-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white/60 backdrop-blur-xl p-12 rounded-3xl shadow-lg border border-charcoal/5 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="inline-flex mb-8 bg-accent-sage/20 p-6 rounded-2xl"
          >
            <CheckCircle size={80} className="text-accent-sage" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl font-display font-bold text-charcoal mb-4"
          >
            Payment <span className="text-gradient-pastel">Successful</span>!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray text-lg mb-8"
          >
            Your booking has been confirmed
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-accent-sage/10 border border-accent-sage/30 p-6 rounded-2xl mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray mb-3">
              <Receipt size={18} />
              <span className="tracking-wider uppercase">Booking ID</span>
            </div>
            <p className="font-mono font-bold text-2xl text-accent-sage">{bookingId}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex items-center justify-center gap-2 text-gray text-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-accent-coral rounded-full"
            />
            <span>Redirecting to local guide...</span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-bg-sky py-20 px-4 pt-32">
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
              <Sparkles size={18} className="text-accent-lavender" />
              <span className="text-sm font-medium tracking-wider text-gray">STEP 3 OF 3</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-3"
            >
              Complete <span className="text-gradient-pastel">Payment</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-2xl font-display font-bold text-charcoal mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-accent-coral rounded-full" />
                Booking Summary
              </h3>
              
              <div className="space-y-5">
                <div className="bg-white/80 p-5 rounded-2xl border border-charcoal/10">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin size={20} className="text-accent-coral" />
                    <p className="text-sm text-gray tracking-wider uppercase">Route</p>
                  </div>
                  <p className="font-display font-semibold text-charcoal text-lg">
                    {booking.tripData.from} → {booking.tripData.destination}
                  </p>
                </div>

                <div className="bg-white/80 p-5 rounded-2xl border border-charcoal/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Plane size={20} className="text-accent-lavender" />
                    <p className="text-sm text-gray tracking-wider uppercase">Travel</p>
                  </div>
                  <p className="font-display font-semibold text-charcoal text-lg">{booking.travel.name}</p>
                  <p className="text-sm text-gray mt-1">₹{booking.travel.price}</p>
                </div>

                <div className="bg-white/80 p-5 rounded-2xl border border-charcoal/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Hotel size={20} className="text-accent-coral" />
                    <p className="text-sm text-gray tracking-wider uppercase">Hotel</p>
                  </div>
                  <p className="font-display font-semibold text-charcoal text-lg">{booking.hotel.name}</p>
                  <p className="text-sm text-gray mt-1">₹{booking.hotel.price}</p>
                </div>

                <div className="bg-accent-coral/10 border-2 border-accent-coral/30 p-6 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-display font-bold text-charcoal">Total Amount</span>
                    <span className="text-3xl font-display font-bold text-gradient-pastel">
                      ₹{booking.total}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center justify-center"
            >
              <PaymentQR onPaymentComplete={handlePaymentComplete} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}