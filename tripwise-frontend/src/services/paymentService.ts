import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
        const response = await axios.post(`${API_URL}/api/payment/create-order`, { amount });
        // The backend returns the toString() of the Order object which isn't ideal JSON, 
        // but let's assume valid JSON or we parse it. 
        // Actually PaymentController returns ResponseEntity.ok(order.toString()), which is a string representation.
        // We should fix the backend to return the object itself or a DTO.
        // For now, let's assume the backend will receive a hotfix to return JSON.
        // Wait, I should fix the backend controller to return JSON properly.
        // But if I can't, I'll parse it. 
        // Razorpay Order.toString() is usually a JSON string.
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
        const response = await axios.post(`${API_URL}/api/payment/verify`, data);
        return response.data;
    }
};
