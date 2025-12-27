import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const healthAPI = {
  checkHealth: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};

export const authAPI = {
  loginWithPhone: async (phoneNumber: string) => {
    try {
      const response = await apiClient.post('/auth/login', { phoneNumber });
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  completeOnboarding: async (onboardingData: any) => {
    try {
      const response = await apiClient.post('/auth/onboarding', onboardingData);
      return response.data;
    } catch (error) {
      console.error('Onboarding failed:', error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
};

export const tripAPI = {
  planTrip: async (tripData: any) => {
    try {
      const response = await apiClient.post('/travel/plan', tripData);
      return response.data;
    } catch (error) {
      console.error('Trip planning failed:', error);
      throw error;
    }
  },

  getAIIntent: async (userId: string, userInput: string, language: string) => {
    try {
      const response = await apiClient.post('/trip/ai-intent', {
        userId,
        userInput,
        language
      });
      return response.data;
    } catch (error) {
      console.error('AI Intent failed:', error);
      throw error;
    }
  },
};

export const bookingAPI = {
  searchOptions: async (type: string, searchData: any) => {
    try {
      const response = await apiClient.post(`/bookings/${type}/search`, searchData);
      return response.data;
    } catch (error) {
      console.error(`Search ${type} failed:`, error);
      throw error;
    }
  },

  confirmBooking: async (bookingData: any) => {
    try {
      const response = await apiClient.post('/booking/confirm', bookingData);
      return response.data;
    } catch (error) {
      console.error('Booking confirmation failed:', error);
      throw error;
    }
  },

  getOptions: async (destination: string, mode: string) => {
    return {
      success: true,
      data: {
        travelOptions: [
          {
            id: 1,
            mode: mode,
            name: mode === 'Flight' ? 'IndiGo 6E-2341' : mode === 'Train' ? 'Rajdhani Express 12301' : 'Volvo Multi-Axle AC Sleeper',
            price: mode === 'Flight' ? 5500 : mode === 'Train' ? 1200 : 800,
            duration: '2h 30m',
            departureTime: '08:00 AM',
            status: 'Available',
          },
        ],
        hotels: [
          {
            id: 1,
            name: 'Grand Plaza Hotel',
            price: 3000,
            rating: 4.5,
            address: 'Marine Drive',
            status: 'Available',
          },
        ],
      }
    };
  },
};

export const localGuideAPI = {
  getGuide: async (location: string) => {
    try {
      const response = await apiClient.post('/local-guide', { location });
      return response.data;
    } catch (error) {
      console.error('Local guide failed:', error);
      throw error;
    }
  },
};

export const paymentAPI = {
  processPayment: async (paymentData: any) => {
    try {
      const response = await apiClient.post('/payment/process', paymentData);
      return response.data;
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  },
};

export default apiClient;
