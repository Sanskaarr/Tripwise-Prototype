import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  loginWithPhone: async (phoneNumber) => {
    try {
      const response = await apiClient.post('/auth/login', { phoneNumber });
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  completeOnboarding: async (onboardingData) => {
    try {
      const response = await apiClient.post('/auth/onboarding', onboardingData);
      return response.data;
    } catch (error) {
      console.error('Onboarding failed:', error);
      throw error;
    }
  },

  register: async (userData) => {
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
  planTrip: async (userId, destination, duration, budget, preferences = '') => {
    try {
      const response = await apiClient.post('/travel/plan', {
        userId,
        destination,
        duration,
        budget,
        preferences
      });
      return response.data;
    } catch (error) {
      console.error('Trip planning failed:', error);
      throw error;
    }
  },

  getAIIntent: async (userId, userInput, language) => {
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
  searchOptions: async (type, searchData) => {
    try {
      const response = await apiClient.post(`/bookings/${type}/search`, searchData);
      return response.data;
    } catch (error) {
      console.error(`Search ${type} failed:`, error);
      throw error;
    }
  },

  confirmBooking: async (bookingId, optionId) => {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/confirm`, null, {
        params: { optionId }
      });
      return response.data;
    } catch (error) {
      console.error('Booking confirmation failed:', error);
      throw error;
    }
  },
};

export const localGuideAPI = {
  getGuide: async (userId, location, category = 'general') => {
    try {
      const response = await apiClient.post('/travel/recommendations', {
        userId,
        location,
        category
      });
      return response.data;
    } catch (error) {
      console.error('Local guide failed:', error);
      throw error;
    }
  },
};

export default apiClient;
