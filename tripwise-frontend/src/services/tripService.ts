import { apiClient } from '@/lib/api/client';

const API_URL = '/api/trips';

export const tripService = {
    getUserTrips: async (userId: string) => {
        try {
            const response = await apiClient.get(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user trips:', error);
            throw error;
        }
    },


    createTrip: async (tripData: any) => {
        try {
            const response = await apiClient.post(`${API_URL}/create`, tripData);
            return response.data;
        } catch (error) {
            console.error('Error creating trip:', error);
            throw error;
        }
    }
};
