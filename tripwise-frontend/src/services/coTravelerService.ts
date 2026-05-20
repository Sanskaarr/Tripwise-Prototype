import { apiClient } from '@/lib/api/client';

const API_URL = '/api/cotravelers';

export interface CoTraveler {
    id?: string;
    profileId: string;
    name: string;
    relation: string;
    ageGroup: string;
    preferences: string[];
}

export const coTravelerService = {
    getCoTravelers: async (profileId: string) => {
        const response = await apiClient.get(`${API_URL}/profile/${profileId}`);
        return response.data;
    },

    addCoTraveler: async (data: CoTraveler) => {
        const response = await apiClient.post(API_URL, data);
        return response.data;
    },

    updateCoTraveler: async (id: string, data: CoTraveler) => {
        const response = await apiClient.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    deleteCoTraveler: async (id: string) => {
        await apiClient.delete(`${API_URL}/${id}`);
    }
};
