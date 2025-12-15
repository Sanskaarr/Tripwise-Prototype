import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Calendar, Hotel, Plane, Package, LogOut, Plus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';

export function UserDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useUser();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/identify');
      return;
    }

    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem(`bookings_${user.identifier}`) || '[]');
    setBookings(savedBookings);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen section-bg-beige py-20 px-4 pt-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* User Header */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-charcoal/5 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-coral to-accent-lavender rounded-full flex items-center justify-center">
                  <User size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-charcoal mb-1">
                    {t('welcome') || 'Welcome'}, {user?.name}!
                  </h1>
                  <p className="text-gray">{user?.identifier}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/plan-trip')}
                  className="flex items-center gap-2 px-6 py-3 bg-accent-coral text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <Plus size={20} />
                  <span>{t('newTrip') || 'New Trip'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-charcoal/10 text-charcoal rounded-xl hover:shadow-md transition-all"
                >
                  <LogOut size={20} />
                  <span>{t('logout') || 'Logout'}</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              icon={<Package size={28} />}
              label={t('totalBookings') || 'Total Bookings'}
              value={bookings.length}
              color="coral"
            />
            <StatCard 
              icon={<Plane size={28} />}
              label={t('upcomingTrips') || 'Upcoming Trips'}
              value={bookings.filter(b => new Date(b.tripData.date) >= new Date()).length}
              color="lavender"
            />
            <StatCard 
              icon={<MapPin size={28} />}
              label={t('destinationsVisited') || 'Destinations Visited'}
              value={new Set(bookings.map(b => b.tripData.destination)).size}
              color="sage"
            />
          </div>

          {/* Bookings List */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-charcoal/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-charcoal">
                {t('myBookings') || 'My Bookings'}
              </h2>
              {bookings.length > 0 && (
                <span className="text-sm text-gray">
                  {bookings.length} {t('booking' + (bookings.length !== 1 ? 's' : '')) || 'bookings'}
                </span>
              )}
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-16">
                <Package size={64} className="mx-auto mb-4 text-gray/30" />
                <h3 className="text-xl font-display font-bold text-charcoal mb-2">
                  {t('noBookingsYet') || 'No bookings yet'}
                </h3>
                <p className="text-gray mb-6">
                  {t('startPlanningTrip') || 'Start planning your first trip!'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/plan-trip')}
                  className="px-8 py-3 bg-charcoal text-cream rounded-xl hover:shadow-lg transition-all"
                >
                  {t('planYourFirstTrip') || 'Plan Your First Trip'}
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <BookingCard key={booking.bookingId || index} booking={booking} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    coral: 'from-accent-coral/20 to-accent-coral/5 text-accent-coral',
    lavender: 'from-accent-lavender/20 to-accent-lavender/5 text-accent-lavender',
    sage: 'from-accent-sage/20 to-accent-sage/5 text-accent-sage',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 border border-charcoal/5`}
    >
      <div className="flex items-center justify-between mb-3">
        {icon}
        <span className="text-4xl font-display font-bold">{value}</span>
      </div>
      <p className="text-sm font-semibold uppercase tracking-wider opacity-80">{label}</p>
    </motion.div>
  );
}

function BookingCard({ booking }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isPast = new Date(booking.tripData.date) < new Date();

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      onClick={() => navigate('/booking-details', { state: { booking } })}
      className="bg-white/80 rounded-2xl p-6 border border-charcoal/10 cursor-pointer hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isPast ? 'bg-gray/10 text-gray' : 'bg-accent-sage/10 text-accent-sage'
            }`}>
              {isPast ? (t('completed') || 'Completed') : (t('upcoming') || 'Upcoming')}
            </span>
            <span className="text-xs text-gray font-mono">{booking.bookingId}</span>
          </div>
          <h3 className="text-xl font-display font-bold text-charcoal mb-1">
            {booking.tripData.destination}
          </h3>
          <p className="text-gray text-sm">
            {booking.tripData.from} → {booking.tripData.destination}
          </p>
        </div>
        <ChevronRight size={24} className="text-gray" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-accent-coral" />
          <span className="text-sm text-gray">{booking.tripData.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Plane size={16} className="text-accent-lavender" />
          <span className="text-sm text-gray">{booking.travel.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Hotel size={16} className="text-accent-sage" />
          <span className="text-sm text-gray">{booking.hotel.name}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-charcoal/10">
        <span className="text-sm text-gray">{t('totalPaid') || 'Total Paid'}</span>
        <span className="text-2xl font-display font-bold text-gradient-pastel">₹{booking.total}</span>
      </div>
    </motion.div>
  );
}
