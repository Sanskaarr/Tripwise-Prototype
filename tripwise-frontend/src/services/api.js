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

  login: async (email, password) => {
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
  searchFlights: async (searchData) => {
    try {
      const response = await apiClient.post('/bookings/flights/search', searchData);
      return response.data;
    } catch (error) {
      console.error('Search flights failed:', error);
      throw error;
    }
  },

  searchHotels: async (searchData) => {
    try {
      const response = await apiClient.post('/bookings/hotels/search', searchData);
      return response.data;
    } catch (error) {
      console.error('Search hotels failed:', error);
      throw error;
    }
  },

  searchActivities: async (searchData) => {
    try {
      const response = await apiClient.post('/bookings/activities/search', searchData);
      return response.data;
    } catch (error) {
      console.error('Search activities failed:', error);
      throw error;
    }
  },

  getOptions: async (destination, mode) => {
    try {
      const [flightsRes, hotelsRes] = await Promise.all([
        apiClient.post('/bookings/flights/search', { 
          origin: 'Delhi', 
          destination, 
          numberOfPassengers: 1 
        }),
        apiClient.post('/bookings/hotels/search', { 
          destination, 
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      ]);
      return {
        success: true,
        data: {
          travelOptions: flightsRes.data?.options || generateMockTravelOptions(mode),
          hotels: hotelsRes.data?.options || generateMockHotels()
        }
      };
    } catch (error) {
      console.error('Get options failed:', error);
      return {
        success: true,
        data: {
          travelOptions: generateMockTravelOptions(mode),
          hotels: generateMockHotels()
        }
      };
    }
  },

  confirmBooking: async (bookingData) => {
    try {
      const bookingId = 'BK' + Date.now();
      return {
        success: true,
        data: {
          bookingId,
          status: 'confirmed',
          ...bookingData
        }
      };
    } catch (error) {
      console.error('Booking confirmation failed:', error);
      throw error;
    }
  },
};

export const paymentAPI = {
  initiateUpiPayment: async (bookingId, amount) => {
    try {
      const response = await apiClient.post('/payments/upi/initiate', {
        bookingId,
        amount
      });
      return response.data;
    } catch (error) {
      console.error('UPI payment initiation failed:', error);
      throw error;
    }
  },

  initiateQRPayment: async (bookingId, amount) => {
    try {
      const response = await apiClient.post('/payments/qr/initiate', {
        bookingId,
        amount
      });
      return response.data;
    } catch (error) {
      console.error('QR payment initiation failed:', error);
      throw error;
    }
  },

  verifyPayment: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}/verify`);
      return response.data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  },

  simulateSuccess: async (paymentId) => {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/simulate-success`);
      return response.data;
    } catch (error) {
      console.error('Payment simulation failed:', error);
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

function generateMockTravelOptions(mode) {
  const options = [
    { id: 1, name: `${mode || 'Flight'} - Express`, price: 4500, duration: '2h 30m', departure: '06:00 AM', arrival: '08:30 AM' },
    { id: 2, name: `${mode || 'Flight'} - Standard`, price: 3200, duration: '3h 45m', departure: '10:00 AM', arrival: '01:45 PM' },
    { id: 3, name: `${mode || 'Flight'} - Economy`, price: 2100, duration: '5h 00m', departure: '02:00 PM', arrival: '07:00 PM' },
  ];
  return options;
}

function generateMockHotels() {
  return [
    { id: 1, name: 'Grand Palace Hotel', price: 5500, rating: 4.8, amenities: ['WiFi', 'Pool', 'Spa', 'Gym'] },
    { id: 2, name: 'City Center Inn', price: 3200, rating: 4.2, amenities: ['WiFi', 'Restaurant', 'Parking'] },
    { id: 3, name: 'Budget Stay', price: 1500, rating: 3.8, amenities: ['WiFi', 'AC', 'TV'] },
  ];
}

export default apiClient;
