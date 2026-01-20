import { apiClient } from '@/lib/auth';

export enum TransactionType {
    VIDEO_PURCHASE = 'VIDEO_PURCHASE',
    PLAYLIST_PURCHASE = 'PLAYLIST_PURCHASE',
    SUBSCRIPTION = 'SUBSCRIPTION',
}

export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: any[];
    created_at: number;
}

export interface VerifyPaymentResponse {
    success: boolean;
    message: string;
}

export const paymentApi = {
    createOrder: async (type: TransactionType, referenceId?: string): Promise<RazorpayOrder> => {
        const response = await apiClient.post<RazorpayOrder>('/payments/create-order', {
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
