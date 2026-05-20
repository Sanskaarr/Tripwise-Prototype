import { apiClient } from '@/lib/api/client';

export interface CreateOrderResponse {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    created_at: number;
}

export const paymentService = {
    createOrder: async (amount: number): Promise<CreateOrderResponse> => {
        const response = await apiClient.post('/api/payment/create-order', { amount });
        if (typeof response.data === 'string') {
            return JSON.parse(response.data);
        }
        return response.data;
    },

    verifyPayment: async (data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }) => {
        const response = await apiClient.post('/api/payment/verify', data);
        return response.data;
    }
};
