import { apiClient } from '@/lib/auth';

export enum TransactionType {
    VIDEO_PURCHASE = 'VIDEO_PURCHASE',
    PLAYLIST_PURCHASE = 'PLAYLIST_PURCHASE',
    SUBSCRIPTION_PURCHASE = 'SUBSCRIPTION_PURCHASE',
}

export interface CreateOrderResponse {
    orderId: string;
    amount: number;
    currency: string;
    key: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    message: string;
}

export const paymentApi = {
    createOrder: async (type: TransactionType, referenceId?: string): Promise<CreateOrderResponse> => {
        const response = await apiClient.post<CreateOrderResponse>('/payments/create-order', {
            type,
            referenceId,
        });
        return response.data;
    },

    verifyPayment: async (
        razorpayOrderId: string,
        razorpayPaymentId: string,
        razorpaySignature: string
    ): Promise<VerifyPaymentResponse> => {
        const response = await apiClient.post<VerifyPaymentResponse>('/payments/verify', {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        });
        return response.data;
    },
};
