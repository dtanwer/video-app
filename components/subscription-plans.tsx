'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PaymentModal } from '@/components/payment-modal';
import { TransactionType } from '@/lib/api/payment';

const plans = [
    {
        name: 'Basic',
        price: 9.99,
        description: 'Essential features for casual viewers',
        features: [
            'Access to Basic videos',
            'Ad-free experience',
            'HD streaming',
        ],
        type: 'BASIC',
    },
    {
        name: 'Premium',
        price: 19.99,
        description: 'Ultimate experience for power users',
        features: [
            'Access to All videos',
            '4K streaming',
            'Download for offline',
            'Priority support',
        ],
        type: 'PREMIUM',
    },
];

export function SubscriptionPlans() {
    const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
    const [showPayment, setShowPayment] = useState(false);

    const handleSelectPlan = (plan: typeof plans[0]) => {
        setSelectedPlan(plan);
        setShowPayment(true);
    };

    return (
        <>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {plans.map((plan) => (
                    <Card key={plan.name} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-4xl font-bold mb-6">
                                ${plan.price}
                                <span className="text-sm font-normal text-muted-foreground">
                                    /month
                                </span>
                            </div>
                            <ul className="space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center">
                                        <Check className="w-4 h-4 mr-2 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => handleSelectPlan(plan)}
                            >
                                Choose {plan.name}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {selectedPlan && (
                <PaymentModal
                    open={showPayment}
                    onOpenChange={setShowPayment}
                    title={`${selectedPlan.name} Subscription`}
                    description={`Monthly subscription for ${selectedPlan.name} plan`}
                    price={selectedPlan.price}
                    type={TransactionType.SUBSCRIPTION_PURCHASE}
                    referenceId={selectedPlan.type}
                    onSuccess={() => {
                        // Refresh user profile or redirect
                        window.location.reload();
                    }}
                />
            )}
        </>
    );
}
