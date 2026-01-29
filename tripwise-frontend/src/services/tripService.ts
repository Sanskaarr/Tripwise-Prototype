import axios from 'axios';

const API_URL = 'http://localhost:8080/api/trips';

export const tripService = {
    getUserTrips: async (userId: string) => {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user trips:', error);
            throw error;
        }
    },

    getTripDetails: async (tripId: string) => {
        try {
            const response = await axios.get(`${API_URL}/${tripId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching trip details:', error);
            throw error;
        }
    },

    createTrip: async (tripData: any) => {
        try {
            const response = await axios.post(`${API_URL}/create`, tripData);
            return response.data;
        } catch (error) {
            console.error('Error creating trip:', error);
            throw error;
        }
    }
};
