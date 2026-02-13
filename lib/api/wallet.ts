import { apiClient } from '../auth';

export interface Wallet {
    id: string;
    balance: number;
    lockedBalance: number;
    totalWithdrawn: number;
}

export interface WalletTransaction {
    id: string;
    type: 'CREDIT' | 'DEBIT';
    subType: 'EARNING' | 'WITHDRAWAL' | 'REFUND';
    amount: number;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    referenceId: string;
    createdAt: string;
    metadata?: any;
}

export interface Payout {
    id: string;
    amount: number;
    status: 'PENDING' | 'PROCESSED' | 'FAILED';
    failureReason?: string;
    razorpayPayoutId?: string;
    createdAt: string;
}

export const walletApi = {
    getWallet: async (): Promise<Wallet> => {
        const response = await apiClient.get('/wallet');
        return response.data;
    },

    getTransactions: async (page = 1, limit = 10): Promise<{ data: WalletTransaction[], meta: { total: number, page: number, limit: number } }> => {
        // Assuming backend might implement pagination later, but for now filtering is not implemented in backend.
        // The current backend getWallet doesn't return transactions.
        // I need to update backend to return transactions or add a separate endpoint.
        // Let's check WalletController.
        const response = await apiClient.get(`/wallet/transactions?page=${page}&limit=${limit}`);
        return response.data;
    },

    requestWithdrawal: async (amount: number): Promise<{ payout: Payout, transaction: WalletTransaction }> => {
        const response = await apiClient.post('/wallet/withdraw', { amount });
        return response.data;
    }
};
