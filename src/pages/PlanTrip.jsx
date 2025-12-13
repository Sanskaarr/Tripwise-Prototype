import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, IndianRupee, Plane, Train, Bus, Sparkles, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { VoiceInput } from '../components/VoiceInput';
import { tripAPI } from '../services/api';

export function PlanTrip() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    destination: '',
    travelers: '1',
    tripType: '',
    date: '',
    budget: '',
    mode: 'Flight',
  });
  const [loading, setLoading] = useState(false);

  const handleVoiceTranscript = (field) => (transcript) => {
    setFormData((prev) => ({ ...prev, [field]: transcript }));
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
              <span className="text-sm font-medium tracking-wider text-gray">AI PLANNING</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-3"
            >
              Plan Your <span className="text-gradient-pastel">Dream Trip</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray text-lg"
            >
              Tell us where you want to go and we'll handle the rest
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                FROM
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-coral" size={22} />
                  <input
                    type="text"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="Your current location"
                    className="w-full pl-14 pr-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal placeholder-gray/50 focus:border-accent-coral focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
                <VoiceInput onTranscript={handleVoiceTranscript('from')} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                DESTINATION
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-lavender" size={22} />
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Where do you want to go?"
                    className="w-full pl-14 pr-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal placeholder-gray/50 focus:border-accent-lavender focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
                <VoiceInput onTranscript={handleVoiceTranscript('destination')} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                NUMBER OF TRAVELERS
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-sage" size={22} />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  placeholder="How many people?"
                  className="w-full pl-14 pr-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal placeholder-gray/50 focus:border-accent-sage focus:outline-none transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
            >
              <label className="block text-sm font-semibold text-gray mb-4 tracking-wide">
                TRIP TYPE
              </label>
              <div className="grid grid-cols-3 gap-4">
                <TripTypeButton
                  icon={<Heart size={28} />}
                  label="Honeymoon"
                  selected={formData.tripType === 'honeymoon'}
                  onClick={() => setFormData({ ...formData, tripType: 'honeymoon' })}
                />
                <TripTypeButton
                  icon={<Users size={28} />}
                  label="Family"
                  selected={formData.tripType === 'family'}
                  onClick={() => setFormData({ ...formData, tripType: 'family' })}
                />
                <TripTypeButton
                  icon={<Sparkles size={28} />}
                  label="Friends"
                  selected={formData.tripType === 'friends'}
                  onClick={() => setFormData({ ...formData, tripType: 'friends' })}
                />
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                  TRAVEL DATE
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-coral" size={22} />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal focus:border-accent-coral focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                  BUDGET (Optional)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-lavender" size={22} />
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="Your budget"
                    className="w-full pl-14 pr-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal placeholder-gray/50 focus:border-accent-lavender focus:outline-none transition-all duration-300"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <label className="block text-sm font-semibold text-gray mb-4 tracking-wide">
                TRAVEL MODE
              </label>
              <div className="grid grid-cols-3 gap-4">
                <ModeButton
                  icon={<Plane size={28} />}
                  label="Flight"
                  selected={formData.mode === 'Flight'}
                  onClick={() => setFormData({ ...formData, mode: 'Flight' })}
                />
                <ModeButton
                  icon={<Train size={28} />}
                  label="Train"
                  selected={formData.mode === 'Train'}
                  onClick={() => setFormData({ ...formData, mode: 'Train' })}
                />
                <ModeButton
                  icon={<Bus size={28} />}
                  label="Bus"
                  selected={formData.mode === 'Bus'}
                  onClick={() => setFormData({ ...formData, mode: 'Bus' })}
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-charcoal text-cream text-lg font-display font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  Planning Your Journey...
                </span>
              ) : (
                'Find Travel Options'
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

function TripTypeButton({ icon, label, selected, onClick }) {
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