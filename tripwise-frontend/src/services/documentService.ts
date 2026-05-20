import { apiClient } from '@/lib/api/client';

const API_URL = '/api/documents';

export interface TravelDocument {
    id?: string;
    profileId: string;
    type: string;
    documentNumber: string;
    expiryDate: string;
    fileUrl: string;
}

export const documentService = {
    getDocuments: async (profileId: string) => {
        const response = await apiClient.get(`${API_URL}/profile/${profileId}`);
        return response.data;
    },

    addDocument: async (data: TravelDocument) => {
        const response = await apiClient.post(API_URL, data);
        return response.data;
    },

    deleteDocument: async (id: string) => {
        await apiClient.delete(`${API_URL}/${id}`);
    }
};
