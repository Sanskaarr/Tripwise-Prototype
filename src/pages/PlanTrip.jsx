import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, IndianRupee, Plane, Train, Bus } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Plan Your Trip
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Tell us where you want to go
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="Your current location"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    required
                  />
                </div>
                <VoiceInput onTranscript={handleVoiceTranscript('from')} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Where do you want to go?"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    required
                  />
                </div>
                <VoiceInput onTranscript={handleVoiceTranscript('destination')} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (Optional)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="Your budget"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Travel Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                <ModeButton
                  icon={<Plane size={24} />}
                  label="Flight"
                  selected={formData.mode === 'Flight'}
                  onClick={() => setFormData({ ...formData, mode: 'Flight' })}
                />
                <ModeButton
                  icon={<Train size={24} />}
                  label="Train"
                  selected={formData.mode === 'Train'}
                  onClick={() => setFormData({ ...formData, mode: 'Train' })}
                />
                <ModeButton
                  icon={<Bus size={24} />}
                  label="Bus"
                  selected={formData.mode === 'Bus'}
                  onClick={() => setFormData({ ...formData, mode: 'Bus' })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400"
            >
              {loading ? 'Planning...' : 'Find Options'}
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
      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-blue-600 bg-blue-50 text-blue-600'
          : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
