import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, IndianRupee, Plane, Train, Bus, Sparkles } from 'lucide-react';
import { VoiceInput } from '../components/VoiceInput';
import { tripAPI } from '../services/api';

export function PlanTrip() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    destination: '',
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
    <div className="min-h-screen bg-navy-deep relative overflow-hidden py-20 px-4 pt-32">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-40 right-20 w-80 h-80 bg-aurora-blue rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-aurora-purple rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="glassmorphism rounded-3xl p-10 shadow-2xl animate-fade-in">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glassmorphism px-5 py-2 rounded-full mb-6">
              <Sparkles size={18} className="text-aurora-purple" />
              <span className="text-sm font-medium tracking-wider uppercase">AI Planning</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-ice-white mb-3">
              Plan Your <span className="text-gradient">Dream Trip</span>
            </h2>
            <p className="text-ice-white/60 text-lg">
              Tell us where you want to go and we'll handle the rest
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* From */}
            <div className="animate-slide-in-left">
              <label className="block text-sm font-semibold text-ice-white/80 mb-3 tracking-wide">
                FROM
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora-blue" size={22} />
                  <input
                    type="text"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="Your current location"
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl text-ice-white placeholder-ice-white/40 focus:border-aurora-blue focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
                <VoiceInput onTranscript={handleVoiceTranscript('from')} />
              </div>
            </div>

            {/* Destination */}
            <div className="animate-slide-in-right">
              <label className="block text-sm font-semibold text-ice-white/80 mb-3 tracking-wide">
                DESTINATION
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora-purple" size={22} />
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Where do you want to go?"
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl text-ice-white placeholder-ice-white/40 focus:border-aurora-purple focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
                <VoiceInput onTranscript={handleVoiceTranscript('destination')} />
              </div>
            </div>

            {/* Date & Budget */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-semibold text-ice-white/80 mb-3 tracking-wide">
                  TRAVEL DATE
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora-blue" size={22} />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl text-ice-white focus:border-aurora-blue focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-semibold text-ice-white/80 mb-3 tracking-wide">
                  BUDGET (Optional)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora-purple" size={22} />
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="Your budget"
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl text-ice-white placeholder-ice-white/40 focus:border-aurora-purple focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Travel Mode */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <label className="block text-sm font-semibold text-ice-white/80 mb-4 tracking-wide">
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white text-lg font-display font-semibold rounded-xl hover:shadow-2xl hover:shadow-aurora-blue/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-fade-in"
              style={{ animationDelay: '0.5s' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Planning Your Journey...
                </span>
              ) : (
                'Find Travel Options'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ModeButton({ icon, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-center justify-center gap-3 p-5 rounded-xl border transition-all duration-300 ${
        selected
          ? 'border-aurora-blue bg-aurora-blue/20 text-aurora-blue shadow-lg shadow-aurora-blue/30'
          : 'border-white/10 bg-white/5 text-ice-white/60 hover:border-aurora-blue/50 hover:bg-white/10'
      }`}
    >
      <div className={`transition-transform duration-300 ${selected ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </div>
      <span className="text-sm font-semibold tracking-wide">{label}</span>
    </button>
  );
}
