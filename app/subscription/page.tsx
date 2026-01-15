import { SubscriptionPlans } from '@/components/subscription-plans';

export default function SubscriptionPage() {
    return (
        <div className="container mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Upgrade your experience
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Unlock exclusive content, ad-free streaming, and more with our premium
                    subscription plans.
                </p>
            </div>

            <SubscriptionPlans />
        </div>
    );
}
