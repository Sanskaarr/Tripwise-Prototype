import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone } from 'lucide-react';

export function IdentifyUser() {
  const [identifier, setIdentifier] = useState('');
  const [isReturning, setIsReturning] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (identifier.trim()) {
      const hasVisited = localStorage.getItem('tripwise_user');
      setIsReturning(!!hasVisited);
      localStorage.setItem('tripwise_user', identifier);
      
      setTimeout(() => {
        navigate('/plan-trip');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
            <User size={48} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Who's Traveling?
          </h2>
          <p className="text-gray-600">
            Enter your phone number or email to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number / Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {identifier.includes('@') ? <Mail size={20} /> : <Phone size={20} />}
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter phone or email"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-lg"
                required
              />
            </div>
          </div>

          {isReturning && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-center animate-fade-in">
              Welcome back! 🎉
            </div>
          )}

          {isReturning === false && identifier && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-center animate-fade-in">
              Let's plan your first trip! ✈️
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
