import axios from 'axios';

const API_URL = 'http://localhost:8080/api/cotravelers';

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
        const response = await axios.get(`${API_URL}/profile/${profileId}`);
        return response.data;
    },

    addCoTraveler: async (data: CoTraveler) => {
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    updateCoTraveler: async (id: string, data: CoTraveler) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    deleteCoTraveler: async (id: string) => {
        await axios.delete(`${API_URL}/${id}`);
    }
};
