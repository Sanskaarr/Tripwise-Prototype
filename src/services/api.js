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
    // Get AI-powered suggestions
    const aiSuggestions = await aiService.generateTripSuggestions(tripData);
    
    return {
      success: true,
      message: 'Trip planned successfully',
      data: {
        tripId: Math.random().toString(36).substr(2, 9),
        ...tripData,
        aiSuggestions: aiSuggestions.suggestions,
        aiSource: aiSuggestions.source
      }
    };
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
            name: mode === 'Flight' ? 'IndiGo 6E-2341' : mode === 'Train' ? 'Rajdhani Express 12301' : 'Volvo Multi-Axle AC Sleeper',
            number: mode === 'Flight' ? '6E-2341' : mode === 'Train' ? '12301' : 'MH12AB1234',
            operator: mode === 'Flight' ? 'IndiGo Airlines' : mode === 'Train' ? 'Indian Railways' : 'RedBus Express',
            price: mode === 'Flight' ? 5500 : mode === 'Train' ? 1200 : 800,
            duration: mode === 'Flight' ? '2h 30m' : mode === 'Train' ? '8h 15m' : '12h 30m',
            departureTime: '08:00 AM',
            arrivalTime: mode === 'Flight' ? '10:30 AM' : mode === 'Train' ? '4:15 PM' : '8:30 PM',
            class: mode === 'Flight' ? 'Economy' : mode === 'Train' ? '2-Tier AC' : 'AC Sleeper',
            seats: mode === 'Flight' ? '18A, 18B' : mode === 'Train' ? 'B3-25, B3-26' : 'Lower Berth 12, 13',
            pnr: `PNR${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            terminal: mode === 'Flight' ? 'Terminal 2' : mode === 'Train' ? 'Platform 4' : 'Bay 12',
            baggage: mode === 'Flight' ? '15kg Check-in + 7kg Cabin' : mode === 'Train' ? '40kg per passenger' : '20kg per passenger',
            meals: mode === 'Flight' ? 'Available for purchase' : mode === 'Train' ? 'Meals included' : 'Not included',
            cancellation: mode === 'Flight' ? 'Cancellation fee ₹1500 before 24hrs' : mode === 'Train' ? 'Cancellation charges as per IRCTC policy' : 'Full refund 6hrs before departure',
            status: 'Confirmed',
          },
          {
            id: 2,
            mode: mode,
            name: mode === 'Flight' ? 'Air India AI-101' : mode === 'Train' ? 'Shatabdi Express 12002' : 'Premium AC Luxury Coach',
            number: mode === 'Flight' ? 'AI-101' : mode === 'Train' ? '12002' : 'DL05CD5678',
            operator: mode === 'Flight' ? 'Air India' : mode === 'Train' ? 'Indian Railways' : 'VRL Travels',
            price: mode === 'Flight' ? 6200 : mode === 'Train' ? 1500 : 1000,
            duration: mode === 'Flight' ? '2h 45m' : mode === 'Train' ? '7h 30m' : '11h',
            departureTime: '11:00 AM',
            arrivalTime: mode === 'Flight' ? '1:45 PM' : mode === 'Train' ? '6:30 PM' : '10:00 PM',
            class: mode === 'Flight' ? 'Business' : mode === 'Train' ? 'Executive Chair Car' : 'Premium AC',
            seats: mode === 'Flight' ? '4A, 4B' : mode === 'Train' ? 'A1-15, A1-16' : 'Seat 5, 6',
            pnr: `PNR${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            terminal: mode === 'Flight' ? 'Terminal 3' : mode === 'Train' ? 'Platform 8' : 'Bay 3',
            baggage: mode === 'Flight' ? '25kg Check-in + 7kg Cabin' : mode === 'Train' ? '50kg per passenger' : '25kg per passenger',
            meals: mode === 'Flight' ? 'Complimentary meals included' : mode === 'Train' ? 'Premium meals included' : 'Breakfast included',
            cancellation: mode === 'Flight' ? 'Flexible cancellation up to 12hrs before' : mode === 'Train' ? 'Minimal cancellation charges' : 'Free cancellation 12hrs before',
            status: 'Confirmed',
          },
        ],
        hotels: [
          {
            id: 1,
            name: 'Grand Plaza Hotel & Suites',
            price: 3000,
            rating: 4.5,
            address: 'Marine Drive, Downtown Area',
            checkIn: '2:00 PM',
            checkOut: '11:00 AM',
            roomType: 'Deluxe Double Room with City View',
            bedType: 'King Size Bed',
            roomSize: '320 sq ft',
            maxOccupancy: 2,
            nights: 3,
            totalRooms: 1,
            amenities: ['Free WiFi', 'Breakfast Buffet', 'Swimming Pool', 'Gym', 'Room Service 24/7', 'Air Conditioning', 'Mini Bar'],
            mealPlan: 'Breakfast Included (Buffet)',
            parking: 'Free parking available',
            cancellation: 'Free cancellation up to 24 hours before check-in',
            confirmationNumber: `HTL${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            specialRequests: 'Non-smoking room, High floor preferred',
            facilities: ['Elevator', 'Concierge', 'Laundry Service', 'Restaurant', 'Bar', 'Conference Room'],
            policies: [
              'ID proof mandatory at check-in',
              'Early check-in subject to availability',
              'Pets not allowed',
              'No smoking in rooms (penalty applies)'
            ]
          },
          {
            id: 2,
            name: 'City View Resort & Spa',
            price: 4500,
            rating: 4.8,
            address: 'Lakeside Boulevard, Premium District',
            checkIn: '3:00 PM',
            checkOut: '12:00 PM',
            roomType: 'Executive Suite with Balcony',
            bedType: 'Super King Size Bed',
            roomSize: '450 sq ft',
            maxOccupancy: 3,
            nights: 3,
            totalRooms: 1,
            amenities: ['Premium WiFi', 'Breakfast & Dinner', 'Infinity Pool', 'Spa & Wellness Center', 'Gym', 'Butler Service', 'Jacuzzi', 'Mini Bar Premium'],
            mealPlan: 'Half Board (Breakfast + Dinner)',
            parking: 'Complimentary valet parking',
            cancellation: 'Free cancellation up to 48 hours before check-in',
            confirmationNumber: `HTL${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            specialRequests: 'Honeymoon package, Late checkout if possible',
            facilities: ['Concierge 24/7', 'Business Center', 'Multi-cuisine Restaurant', 'Rooftop Bar', 'Spa', 'Yoga Studio', 'Kids Play Area'],
            policies: [
              'Valid ID and credit card required',
              'Damage deposit of ₹5000 (refundable)',
              'Children under 5 stay free',
              'Smoking allowed only in designated areas'
            ]
          },
        ],
      }
    };
  },
};

export const localGuideAPI = {
  getGuide: async (city) => {
    // Get AI-powered local guide
    const aiGuide = await aiService.generateLocalGuide(city);
    
    return {
      success: true,
      data: {
        city: city,
        aiGuide: aiGuide.guide,
        aiSource: aiGuide.source,
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