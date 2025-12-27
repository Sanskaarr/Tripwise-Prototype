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

export const tripAPI = {
  planTrip: async (tripData) => {
    const response = await apiClient.post('/trip/plan', tripData);
    return response.data;
  },
};

export const bookingAPI = {
  confirmBooking: async (bookingData) => {
    const response = await apiClient.post('/booking/confirm', bookingData);
    return response.data;
  },

  getOptions: async (destination, mode) => {
    // Mocking options since backend doesn't have a specific endpoint yet, 
    // but in a real scenario this would call a backend service.
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
  getGuide: async (location) => {
    const response = await apiClient.post('/local-guide', { location });
    return response.data;
  },
};

export const paymentAPI = {
  processPayment: async (paymentData) => {
    const response = await apiClient.post('/payment/process', paymentData);
    return response.data;
  },
};

export default apiClient;
