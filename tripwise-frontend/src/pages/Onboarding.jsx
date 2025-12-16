import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useUser } from '../contexts/UserContext';

const chipClasses = (active) =>
  `px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-300 ${
    active
      ? 'bg-gradient-to-r from-[#E8AFA0] to-[#D4A89D] text-white border-transparent shadow-md scale-105'
      : 'bg-white/80 text-charcoal/70 border-sand hover:border-[#E8AFA0] hover:shadow-sm'
  }`;

export function Onboarding() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [step, setStep] = useState(1);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [communicationPreference, setCommunicationPreference] = useState('');
  const [pastTravelExperience, setPastTravelExperience] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [interests, setInterests] = useState([]);
  const [documentsReady, setDocumentsReady] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = user?.userId || localStorage.getItem('tripwise_userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError('');

    try {
      await authAPI.completeOnboarding({
        userId,
        preferredLanguage,
        budgetRange,
        travelStyle,
        dietaryPreferences,
        interests,
      });
      navigate('/plan-trip');
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to save your preferences. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const interestOptions = ['Food', 'Culture', 'Nature', 'Shopping', 'Nightlife', 'History'];

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] via-[#F9F6F1] to-[#F5F0E8] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(232,175,160,0.08),transparent_40%),radial-gradient(circle_at_15%_85%,rgba(184,201,180,0.06),transparent_45%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMDAsMTg1LDE2MCwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative max-w-3xl mx-auto px-6 py-16 sm:py-20">
        <motion.div
          {...fadeInUp}
          className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-sand/30"
        >
          <div className="px-8 py-10 sm:px-12 sm:py-14">
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-center mb-10"
            >
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal tracking-tight mb-3">
                Let's personalize your TripWise experience
              </h1>
              <p className="text-base text-charcoal/60 leading-relaxed">
                This helps us plan better trips for you.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-12"
            >
              <span className="text-sm font-medium text-charcoal/50">Step {step} of 3</span>
              <div className="flex gap-1.5 ml-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      s === step ? 'w-8 bg-accent-coral' : s < step ? 'w-4 bg-accent-coral/60' : 'w-4 bg-sand'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {step === 1 && (
                <motion.div {...fadeInUp} className="space-y-8">
                  <div className="space-y-5">
                    <h2 className="text-lg font-semibold text-charcoal">Basic Preferences</h2>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-charcoal/70">Preferred Language</label>
                      <div className="flex flex-wrap gap-2.5">
                        {['English', 'Spanish', 'French', 'German', 'Hindi', 'Mandarin'].map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            className={chipClasses(preferredLanguage === lang)}
                            onClick={() => setPreferredLanguage(lang)}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-charcoal/70">Communication Preference</label>
                      <div className="flex flex-wrap gap-2.5">
                        {['App', 'Email', 'WhatsApp'].map((pref) => (
                          <button
                            key={pref}
                            type="button"
                            className={chipClasses(communicationPreference === pref)}
                            onClick={() => setCommunicationPreference(pref)}
                          >
                            {pref}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => communicationPreference && setStep(2)}
                    disabled={!communicationPreference}
                    className="w-full bg-gradient-to-r from-accent-coral to-[#D4A89D] text-white py-4 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div {...fadeInUp} className="space-y-8">
                  <div className="space-y-5">
                    <h2 className="text-lg font-semibold text-charcoal">Travel Style & Experience</h2>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-charcoal/70">Past Travel Experience</label>
                      <div className="flex flex-wrap gap-2.5">
                        {['First-time traveler', 'Occasional traveler', 'Frequent traveler'].map((exp) => (
                          <button
                            key={exp}
                            type="button"
                            className={chipClasses(pastTravelExperience === exp)}
                            onClick={() => setPastTravelExperience(exp)}
                          >
                            {exp}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-charcoal/70">Travel Style</label>
                      <div className="flex flex-wrap gap-2.5">
                        {['Relaxed', 'Adventure', 'Luxury', 'Budget', 'Family', 'Solo'].map((style) => (
                          <button
                            key={style}
                            type="button"
                            className={chipClasses(travelStyle === style)}
                            onClick={() => setTravelStyle(style)}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-charcoal/70">Budget Range</label>
                      <div className="flex flex-wrap gap-2.5">
                        {['Low', 'Medium', 'Flexible'].map((budget) => (
                          <button
                            key={budget}
                            type="button"
                            className={chipClasses(budgetRange === budget)}
                            onClick={() => setBudgetRange(budget)}
                          >
                            {budget}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 rounded-2xl border-2 border-sand text-charcoal/70 font-medium hover:border-accent-coral transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => pastTravelExperience && travelStyle && budgetRange && setStep(3)}
                      disabled={!pastTravelExperience || !travelStyle || !budgetRange}
                      className="flex-1 bg-gradient-to-r from-accent-coral to-[#D4A89D] text-white py-4 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div {...fadeInUp} className="space-y-8">
                  <div className="space-y-5">
                    <h2 className="text-lg font-semibold text-charcoal">Food & Interests</h2>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-charcoal/70">Dietary Preference</label>
                      <div className="flex flex-wrap gap-2.5">
                        {['Vegetarian', 'Non-vegetarian', 'Vegan', 'No preference'].map((diet) => (
                          <button
                            key={diet}
                            type="button"
                            className={chipClasses(dietaryPreferences === diet)}
                            onClick={() => setDietaryPreferences(diet)}
                          >
                            {diet}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-charcoal/70">Interests</label>
                      <div className="flex flex-wrap gap-2.5">
                        {interestOptions.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            className={chipClasses(interests.includes(interest))}
                            onClick={() => toggleInterest(interest)}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-sand/50">
                      <label className="block text-sm font-medium text-charcoal/70">Travel Documents Readiness</label>
                      <div className="flex flex-wrap gap-2.5">
                        {['ID available', 'Passport available', 'Will arrange later'].map((doc) => (
                          <button
                            key={doc}
                            type="button"
                            className={chipClasses(documentsReady === doc)}
                            onClick={() => setDocumentsReady(doc)}
                          >
                            {doc}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-charcoal/50 mt-2">No uploads needed right now.</p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-sand/50">
                      <label className="block text-sm font-medium text-charcoal/70">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-sand bg-white/80 text-charcoal focus:border-accent-coral focus:outline-none transition-all"
                      />
                      <p className="text-xs text-charcoal/50">We'll only use this for trip updates and confirmations.</p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-4 rounded-2xl border-2 border-sand text-charcoal/70 font-medium hover:border-accent-coral transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !userId || !dietaryPreferences || !documentsReady}
                      className="flex-1 bg-gradient-to-r from-accent-coral to-[#D4A89D] text-white py-4 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Continue to TripWise'}
                    </button>
                  </div>

                  <p className="text-center text-xs text-charcoal/40 pt-2">
                    You can update these preferences anytime later.
                  </p>
                </motion.div>
              )}
            </form>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget range</label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="" disabled>Select a budget</option>
              <option value="Budget">Budget</option>
              <option value="Mid-range">Mid-range</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Travel style</label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="" disabled>Select a style</option>
              <option value="Relaxed">Relaxed</option>
              <option value="Adventure">Adventure</option>
              <option value="Family">Family</option>
              <option value="Business">Business</option>
              <option value="Cultural">Cultural</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary preferences</label>
            <input
              type="text"
              value={dietaryPreferences}
              onChange={(e) => setDietaryPreferences(e.target.value)}
              placeholder="e.g., Vegetarian, Vegan, No seafood"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., Beaches, Museums, Food tours"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !userId}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save and continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
