'use client';

import { useState, useEffect } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { paymentApi, TransactionType } from '@/lib/api/payment';
import { useAuth } from '@/lib/auth-context';

interface PaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    price: number;
    type: TransactionType;
    referenceId?: string;
    onSuccess: () => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function PaymentModal({
    open,
    onOpenChange,
    title,
    description,
    price,
    type,
    referenceId,
    onSuccess,
}: PaymentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    async function handlePayment() {
        if (!user) {
            toast.error('Please login to continue');
            return;
        }

        try {
            setIsLoading(true);

            // 1. Create Order
            const order = await paymentApi.createOrder(type, referenceId);

            // 2. Open Razorpay
            const options = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: 'Video App',
                description: title,
                order_id: order.orderId,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        await paymentApi.verifyPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        );
                        toast.success('Payment successful!');
                        onSuccess();
                        onOpenChange(false);
                    } catch (error) {
                        toast.error('Payment verification failed');
                        console.error(error);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#000000',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error('Failed to initiate payment');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Unlock Content</DialogTitle>
                    <DialogDescription>
                        Purchase this content to get full access.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    <div className="text-3xl font-bold">
                        ${price}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handlePayment} disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Pay Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
