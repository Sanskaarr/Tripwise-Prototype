import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, IndianRupee, Plane, Train, Bus, Sparkles, Users, Heart, UserPlus, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { VoiceInput } from '../components/VoiceInput';
import { tripAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';

export function PlanTrip() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    from: '',
    destination: '',
    date: '',
    budget: '',
    mode: 'Flight',
    travelers: '1',
    tripType: 'solo',
  });
  const [loading, setLoading] = useState(false);

  // Auto-fill name from user context
  useEffect(() => {
    if (user && user.name) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const handleVoiceTranscript = (field) => (transcript) => {
    setFormData((prev) => ({ ...prev, [field]: transcript }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await tripAPI.planTrip(formData);
      if (response.success) {
        navigate('/booking', { state: { tripData: formData } });
      }
    } catch (error) {
      console.error('Error planning trip:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen section-bg-beige py-20 px-4 pt-32">
      <div className="max-w-3xl mx-auto">
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
              <Sparkles size={18} className="text-accent-lavender" />
              <span className="text-sm font-medium tracking-wider text-gray">{t('aiPlanning')}</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-3"
            >
              {t('planYourDreamTrip')} <span className="text-gradient-pastel">{t('dreamTrip')}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray text-lg"
            >
              {t('whereYouWantToGo')}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Name Field - First */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                {t('yourName')}
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-coral" size={22} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder={t('enterFullName')}
                    className="w-full pl-14 pr-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal placeholder-gray/50 focus:border-accent-coral focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
                <VoiceInput onTranscript={handleVoiceTranscript('name')} />
              </div>
            </motion.div>

            {/* Trip Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <label className="block text-sm font-semibold text-gray mb-4 tracking-wide">
                {t('tripType')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <TripTypeButton
                  icon={<UserIcon size={24} />}
                  label={t('solo')}
                  value="solo"
                  selected={formData.tripType === 'solo'}
                  onClick={() => handleChange('tripType', 'solo')}
                />
                <TripTypeButton
                  icon={<Heart size={24} />}
                  label={t('honeymoon')}
                  value="honeymoon"
                  selected={formData.tripType === 'honeymoon'}
                  onClick={() => handleChange('tripType', 'honeymoon')}
                />
                <TripTypeButton
                  icon={<Users size={24} />}
                  label={t('family')}
                  value="family"
                  selected={formData.tripType === 'family'}
                  onClick={() => handleChange('tripType', 'family')}
                />
                <TripTypeButton
                  icon={<UserPlus size={24} />}
                  label={t('friends')}
                  value="friends"
                  selected={formData.tripType === 'friends'}
                  onClick={() => handleChange('tripType', 'friends')}
                />
              </div>
            </motion.div>

            {/* Number of Travelers */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                {t('numberOfTravelers')}
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-lavender" size={22} />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.travelers}
                  onChange={(e) => handleChange('travelers', e.target.value)}
                  placeholder={t('howManyPeople')}
                  className="w-full pl-14 pr-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal placeholder-gray/50 focus:border-accent-lavender focus:outline-none transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            {/* From Field */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                {t('from')}
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-coral" size={22} />
                  <input
                    type="text"
                    value={formData.from}
                    onChange={(e) => handleChange('from', e.target.value)}
                    placeholder={t('yourCurrentLocation')}
                    className="w-full pl-14 pr-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal placeholder-gray/50 focus:border-accent-coral focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
                <VoiceInput onTranscript={handleVoiceTranscript('from')} />
              </div>
            </motion.div>

            {/* Destination Field */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                {t('destination')}
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-lavender" size={22} />
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => handleChange('destination', e.target.value)}
                    placeholder={t('whereDoYouWantToGo')}
                    className="w-full pl-14 pr-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal placeholder-gray/50 focus:border-accent-lavender focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
                <VoiceInput onTranscript={handleVoiceTranscript('destination')} />
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Travel Date */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                  {t('travelDate')}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-coral" size={22} />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full pl-14 pr-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal focus:border-accent-coral focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
              </motion.div>

              {/* Budget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2 }}
              >
                <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                  {t('budget')}
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-lavender" size={22} />
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    placeholder={t('yourBudget')}
                    className="w-full pl-14 pr-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal placeholder-gray/50 focus:border-accent-lavender focus:outline-none transition-all duration-300"
                  />
                </div>
              </motion.div>
            </div>

            {/* Travel Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              <label className="block text-sm font-semibold text-gray mb-4 tracking-wide">
                {t('travelMode')}
              </label>
              <div className="grid grid-cols-3 gap-4">
                <ModeButton
                  icon={<Plane size={28} />}
                  label={t('flight')}
                  selected={formData.mode === 'Flight'}
                  onClick={() => handleChange('mode', 'Flight')}
                />
                <ModeButton
                  icon={<Train size={28} />}
                  label={t('train')}
                  selected={formData.mode === 'Train'}
                  onClick={() => handleChange('mode', 'Train')}
                />
                <ModeButton
                  icon={<Bus size={28} />}
                  label={t('bus')}
                  selected={formData.mode === 'Bus'}
                  onClick={() => handleChange('mode', 'Bus')}
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-charcoal text-cream text-lg font-display font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  {t('planningYourJourney')}
                </span>
              ) : (
                t('findTravelOptions')
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function ModeButton({ icon, label, selected, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: selected ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`group flex flex-col items-center justify-center gap-3 p-5 rounded-xl border transition-all duration-300 ${
        selected
          ? 'border-accent-coral bg-accent-coral/20 text-accent-coral shadow-lg'
          : 'border-charcoal/10 bg-white/80 text-gray hover:border-accent-coral/50'
      }`}
    >
      <div className={`transition-transform duration-300 ${selected ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className="text-sm font-semibold tracking-wide">{label}</span>
    </motion.button>
  );
}

function TripTypeButton({ icon, label, value, selected, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: selected ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`group flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
        selected
          ? 'border-accent-lavender bg-accent-lavender/20 text-accent-lavender shadow-lg'
          : 'border-charcoal/10 bg-white/80 text-gray hover:border-accent-lavender/50'
      }`}
    >
      <div className={`transition-transform duration-300 ${selected ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className="text-xs font-semibold tracking-wide">{label}</span>
    </motion.button>
  );
}