import { apiClient } from '@/lib/api/client';

const API_URL = '/api/profiles';

export const userService = {
    updateProfile: async (profileId: string, data: any) => {
        try {
            // Mapping generic update to specific basicInfo endpoint for now
            // In a real app, we might check what data is being updated
            const response = await apiClient.post(`${API_URL}/${profileId}/basicInfo`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    getCoTravelers: async (profileId: string) => {
        try {
            const response = await apiClient.get(`${API_URL}/${profileId}/co-travelers`);
            return response.data;
        } catch (error) {
            console.error('Error fetching co-travelers:', error);
            throw error;
        }
    },

    updateBasicInfo: async (profileId: string, data: any) => {
        try {
            const response = await apiClient.post(`${API_URL}/${profileId}/basicInfo`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating basic info:', error);
            throw error;
        }
    },

    updateDestination: async (profileId: string, data: any) => {
        try {
            const response = await apiClient.post(`${API_URL}/${profileId}/destination`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating destination:', error);
            throw error;
        }
    },

    updateBudget: async (profileId: string, data: any) => {
        try {
            const response = await apiClient.post(`${API_URL}/${profileId}/budget`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating budget:', error);
            throw error;
        }
    },

    updatePurpose: async (profileId: string, data: any) => {
        try {
            const response = await apiClient.post(`${API_URL}/${profileId}/purpose`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating purpose:', error);
            throw error;
        }
    },

    addCoTraveler: async (profileId: string, coTravelerData: any) => {
        try {
            const currentList = await userService.getCoTravelers(profileId);
            const newList = [...(Array.isArray(currentList) ? currentList : []), { ...coTravelerData, id: Date.now().toString() }];

            const response = await apiClient.post(`${API_URL}/${profileId}/co-travelers`, newList);
            return response.data;
        } catch (error) {
            console.error('Error adding co-traveler:', error);
            throw error;
        }
    },

    // Helper to delete for full functionality
    removeCoTraveler: async (profileId: string, coTravelerId: string) => {
        try {
            const currentList: any[] = await userService.getCoTravelers(profileId);
            if (!Array.isArray(currentList)) return;

            const newList = currentList.filter(c => c.id !== coTravelerId);
            const response = await apiClient.post(`${API_URL}/${profileId}/co-travelers`, newList);
            return response.data;
        } catch (error) {
            console.error('Error removing co-traveler:', error);
            throw error;
        }
    }
};

