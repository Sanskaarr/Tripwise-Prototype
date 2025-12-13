import axios from 'axios';
import { aiService } from './aiService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tripAPI = {
  planTrip: async (tripData) => {
    try {
      const aiResponse = await aiService.generateTripItinerary(tripData);
      
      return {
        success: true,
        message: 'Trip planned successfully',
        data: {
          tripId: Math.random().toString(36).substr(2, 9),
          itinerary: aiResponse.content,
          provider: aiResponse.provider,
          ...tripData
        }
      };
    } catch (error) {
      console.error('Error planning trip:', error);
      return {
        success: true,
        message: 'Trip planned successfully (demo mode)',
        data: {
          tripId: Math.random().toString(36).substr(2, 9),
          ...tripData,
          note: 'AI integration available - configure VITE_GEMINI_API_KEY or VITE_OPENAI_API_KEY to enable'
        }
      };
    }
  },
};

export const bookingAPI = {
  confirmBooking: async (bookingData) => {
    return {
      success: true,
      message: 'Booking confirmed',
      data: {
        bookingId: Math.random().toString(36).substr(2, 9),
        ...bookingData
      }
    };
  },

  getOptions: async (destination, mode) => {
    return {
      success: true,
      data: {
        travelOptions: [
          {
            id: 1,
            mode: mode,
            name: mode === 'Flight' ? 'IndiGo 6E-2341' : mode === 'Train' ? 'Rajdhani Express' : 'Volvo Sleeper',
            price: mode === 'Flight' ? 5500 : mode === 'Train' ? 1200 : 800,
            duration: mode === 'Flight' ? '2h 30m' : mode === 'Train' ? '8h' : '12h',
            departure: '08:00 AM',
            arrival: mode === 'Flight' ? '10:30 AM' : mode === 'Train' ? '4:00 PM' : '8:00 PM',
          },
          {
            id: 2,
            mode: mode,
            name: mode === 'Flight' ? 'Air India AI-101' : mode === 'Train' ? 'Shatabdi Express' : 'AC Sleeper',
            price: mode === 'Flight' ? 6200 : mode === 'Train' ? 1500 : 1000,
            duration: mode === 'Flight' ? '2h 45m' : mode === 'Train' ? '7h 30m' : '11h',
            departure: '11:00 AM',
            arrival: mode === 'Flight' ? '1:45 PM' : mode === 'Train' ? '6:30 PM' : '10:00 PM',
          },
        ],
        hotels: [
          {
            id: 1,
            name: 'Grand Plaza Hotel',
            price: 3000,
            rating: 4.5,
            amenities: ['WiFi', 'Breakfast', 'Pool'],
          },
          {
            id: 2,
            name: 'City View Resort',
            price: 4500,
            rating: 4.8,
            amenities: ['WiFi', 'Breakfast', 'Spa', 'Gym'],
          },
        ],
      }
    };
  },
};

export const localGuideAPI = {
  getGuide: async (city) => {
    return {
      success: true,
      data: {
        city: city,
        attractions: [
          { name: 'Historic Fort', description: 'Ancient fort with stunning architecture' },
          { name: 'Local Market', description: 'Vibrant market for shopping and street food' },
          { name: 'City Museum', description: 'Rich cultural heritage display' },
        ],
        food: [
          { name: 'Local Specialty Dish', description: 'Must-try authentic cuisine' },
          { name: 'Street Food Corner', description: 'Famous snacks and sweets' },
        ],
        tips: [
          'Respect local customs and dress modestly at religious sites',
          'Use public transport or ride-sharing apps for easy commute',
          'Try local cuisine at popular eateries',
        ],
        emergency: {
          police: '100',
          ambulance: '108',
          helpline: '+91-1234567890',
        },
      }
    };
  },
};

export default apiClient;