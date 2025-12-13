import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Receipt, Sparkles, MapPin, Hotel, Plane } from 'lucide-react';
import { PaymentQR } from '../components/PaymentQR';
import { bookingAPI } from '../services/api';

export function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
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
        setBookingId(response.data.bookingId);
        setPaymentSuccess(true);

        setTimeout(() => {
          navigate('/local-guide', {
            state: { destination: booking.tripData.destination },
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
      <div className="min-h-screen bg-navy-deep relative overflow-hidden flex items-center justify-center px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative glassmorphism p-12 rounded-3xl shadow-2xl max-w-md w-full text-center animate-fade-in">
          <div className="relative inline-flex mb-8">
            <div className="absolute inset-0 bg-green-500 blur-2xl opacity-50 animate-pulse" />
            <div className="relative glassmorphism p-6 rounded-2xl">
              <CheckCircle size={80} className="text-green-400" />
            </div>
          </div>
          
          <h2 className="text-4xl font-display font-bold text-ice-white mb-4">
            Payment <span className="text-gradient">Successful</span>!
          </h2>
          <p className="text-ice-white/60 text-lg mb-8">
            Your booking has been confirmed
          </p>
          
          <div className="glassmorphism p-6 rounded-2xl mb-8 border border-green-500/30">
            <div className="flex items-center justify-center gap-2 text-sm text-ice-white/60 mb-3">
              <Receipt size={18} />
              <span className="tracking-wider uppercase">Booking ID</span>
            </div>
            <p className="font-mono font-bold text-2xl text-gradient">{bookingId}</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-ice-white/50 text-sm">
            <div className="w-2 h-2 bg-aurora-blue rounded-full animate-pulse" />
            <span>Redirecting to local guide...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep relative overflow-hidden py-20 px-4 pt-32">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-40 left-20 w-96 h-96 bg-aurora-blue rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-aurora-pink rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="glassmorphism rounded-3xl p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 glassmorphism px-5 py-2 rounded-full mb-6">
              <Sparkles size={18} className="text-aurora-purple" />
              <span className="text-sm font-medium tracking-wider uppercase">Step 3 of 3</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-ice-white mb-3">
              Complete <span className="text-gradient">Payment</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Booking Summary */}
            <div className="animate-slide-in-left">
              <h3 className="text-2xl font-display font-bold text-ice-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-aurora-blue to-aurora-purple rounded-full" />
                Booking Summary
              </h3>
              
              <div className="space-y-5">
                <div className="glassmorphism p-5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin size={20} className="text-aurora-blue" />
                    <p className="text-sm text-ice-white/60 tracking-wider uppercase">Route</p>
                  </div>
                  <p className="font-display font-semibold text-ice-white text-lg">
                    {booking.tripData.from} → {booking.tripData.destination}
                  </p>
                </div>

                <div className="glassmorphism p-5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Plane size={20} className="text-aurora-purple" />
                    <p className="text-sm text-ice-white/60 tracking-wider uppercase">Travel</p>
                  </div>
                  <p className="font-display font-semibold text-ice-white text-lg">{booking.travel.name}</p>
                  <p className="text-sm text-ice-white/50 mt-1">₹{booking.travel.price}</p>
                </div>

                <div className="glassmorphism p-5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Hotel size={20} className="text-aurora-pink" />
                    <p className="text-sm text-ice-white/60 tracking-wider uppercase">Hotel</p>
                  </div>
                  <p className="font-display font-semibold text-ice-white text-lg">{booking.hotel.name}</p>
                  <p className="text-sm text-ice-white/50 mt-1">₹{booking.hotel.price}</p>
                </div>

                <div className="glassmorphism p-6 rounded-2xl border-2 border-aurora-blue/30 bg-aurora-blue/5">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-display font-bold text-ice-white">Total Amount</span>
                    <span className="text-3xl font-display font-bold text-gradient">
                      ₹{booking.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center justify-center animate-slide-in-right">
              <PaymentQR onPaymentComplete={handlePaymentComplete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
