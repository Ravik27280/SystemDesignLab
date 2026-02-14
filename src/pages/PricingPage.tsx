import React from 'react';
import { Check } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const pricingPlans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for getting started',
        features: [
            '5 system design problems',
            'Basic architecture components',
            'Community support',
            'Limited AI feedback',
        ],
        cta: 'Get Started',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '$19',
        period: '/month',
        description: 'For serious interview preparation',
        features: [
            'All system design problems',
            'All architecture components',
            'Priority support',
            'Unlimited AI feedback',
            'Practice mode with timer',
            'Detailed analytics',
            'Export designs',
        ],
        cta: 'Upgrade to Pro',
        highlighted: true,
    },
];

export const PricingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[rgb(var(--color-bg))] py-12 transition-theme">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-[rgb(var(--color-text-secondary))]">
                        Choose the plan that's right for you
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {pricingPlans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={
                                plan.highlighted
                                    ? 'border-2 border-[rgb(var(--color-primary))] relative'
                                    : ''
                            }
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <Badge variant="primary">Most Popular</Badge>
                                </div>
                            )}
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-bold text-[rgb(var(--color-text-primary))]">
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className="text-[rgb(var(--color-text-secondary))]">
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[rgb(var(--color-text-secondary))] mt-2">
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-[rgb(var(--color-success))] flex-shrink-0 mt-0.5" />
                                        <span className="text-[rgb(var(--color-text-primary))]">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.highlighted ? 'primary' : 'secondary'}
                                className="w-full"
                            >
                                {plan.cta}
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
