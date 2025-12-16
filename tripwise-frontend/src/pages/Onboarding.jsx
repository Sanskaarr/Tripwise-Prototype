import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useUser } from '../contexts/UserContext';

export function Onboarding() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [budgetRange, setBudgetRange] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = user?.userId || localStorage.getItem('tripwise_userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8 mt-12 mb-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Tell us about your travel preferences</h1>
        <p className="text-gray-600 mb-8">We use this information to personalize TripWise for you.</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred language</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Hindi">Hindi</option>
            </select>
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
