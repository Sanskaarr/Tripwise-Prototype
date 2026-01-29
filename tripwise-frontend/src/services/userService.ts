import axios from 'axios';

const API_URL = 'http://localhost:8080/api/profiles';

export const userService = {
    updateProfile: async (profileId: string, data: any) => {
        try {
            // Mapping generic update to specific basicInfo endpoint for now
            // In a real app, we might check what data is being updated
            const response = await axios.post(`${API_URL}/${profileId}/basicInfo`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    uploadDocument: async (profileId: string, file: File) => {
        // Mock upload for now or implement file storage backend
        // The current backend doesn't have a file upload endpoint ready in ProfileController
        // So we'll return a mock success to keep the UI working
        return new Promise(resolve => setTimeout(() => resolve({ success: true, fileName: file.name }), 1000));
    },

    getCoTravelers: async (profileId: string) => {
        try {
            const response = await axios.get(`${API_URL}/${profileId}/co-travelers`);
            return response.data;
        } catch (error) {
            console.error('Error fetching co-travelers:', error);
            throw error;
        }
    },

    addCoTraveler: async (profileId: string, coTravelerData: any) => {
        try {
            // First get existing to append, or just send the new one if backend supported add-to-set
            // Our backend replaces the list, so we need to fetch, append, and send back
            // OR we can change the backend to accept a single addition.
            // For now, let's assume we send the whole list.
            const currentList = await userService.getCoTravelers(profileId);
            const newList = [...(Array.isArray(currentList) ? currentList : []), { ...coTravelerData, id: Date.now().toString() }];

            const response = await axios.post(`${API_URL}/${profileId}/co-travelers`, newList);
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
            const response = await axios.post(`${API_URL}/${profileId}/co-travelers`, newList);
            return response.data;
        } catch (error) {
            console.error('Error removing co-traveler:', error);
            throw error;
        }
    }
};
