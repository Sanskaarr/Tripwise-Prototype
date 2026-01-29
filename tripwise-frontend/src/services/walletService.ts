import axios from 'axios';

const API_URL = 'http://localhost:8080/api/wallet';

export interface Wallet {
    id: string;
    profileId: string;
    balance: number;
    currency: string;
}

export interface Transaction {
    id: string;
    walletId: string;
    amount: number;
    type: 'TOPUP' | 'SPEND' | 'REFUND';
    method: 'UPI' | 'NET_BANKING' | 'DEBIT_CARD' | 'CREDIT_CARD';
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    timestamp: string;
    description: string;
}

export interface AddFundsRequest {
    profileId: string;
    amount: number;
    method: string;
}

export const walletService = {
    getBalance: async (profileId: string) => {
        const response = await axios.get(`${API_URL}/balance/${profileId}`);
        return response.data;
    },

    addFunds: async (data: AddFundsRequest) => {
        const response = await axios.post(`${API_URL}/add-funds`, data);
        return response.data;
    },

    getHistory: async (profileId: string) => {
        const response = await axios.get(`${API_URL}/history/${profileId}`);
        return response.data;
    }
};
