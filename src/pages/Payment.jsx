import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Receipt } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
            <CheckCircle size={64} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your booking has been confirmed
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
              <Receipt size={16} />
              <span>Booking ID</span>
            </div>
            <p className="font-mono font-bold text-lg text-gray-800">{bookingId}</p>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting to local guide...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Complete Payment
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Route</p>
                  <p className="font-semibold text-gray-800">
                    {booking.tripData.from} → {booking.tripData.destination}
                  </p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Travel</p>
                  <p className="font-semibold text-gray-800">{booking.travel.name}</p>
                  <p className="text-sm text-gray-600">₹{booking.travel.price}</p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Hotel</p>
                  <p className="font-semibold text-gray-800">{booking.hotel.name}</p>
                  <p className="text-sm text-gray-600">₹{booking.hotel.price}</p>
                </div>

                <div className="pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{booking.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <PaymentQR onPaymentComplete={handlePaymentComplete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
