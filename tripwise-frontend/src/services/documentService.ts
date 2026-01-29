import axios from 'axios';

const API_URL = 'http://localhost:8080/api/documents';

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
        const response = await axios.get(`${API_URL}/profile/${profileId}`);
        return response.data;
    },

    addDocument: async (data: TravelDocument) => {
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    deleteDocument: async (id: string) => {
        await axios.delete(`${API_URL}/${id}`);
    }
};
