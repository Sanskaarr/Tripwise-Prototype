import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) return;

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.loginWithPhone(trimmedPhone);
      console.log('Login response:', response);

      if (response?.isFirstTime) {
        navigate('/plan-trip');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      const message = err?.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 16 }}>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone" style={{ display: 'block', marginBottom: 8 }}>
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number"
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
          required
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
    </div>
  );
}
