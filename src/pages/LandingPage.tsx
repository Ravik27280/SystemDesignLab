import React from 'react';
import { ArrowRight, Zap, Code, Target, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[rgb(var(--color-bg))] transition-theme">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Zap className="w-12 h-12 text-[rgb(var(--color-primary))]" />
                            <h1 className="text-5xl font-bold text-[rgb(var(--color-text-primary))]">
                                SystemDesignLab
                            </h1>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[rgb(var(--color-text-primary))] mb-6">
                            Master System Design Interviews
                        </h2>
                        <p className="text-xl text-[rgb(var(--color-text-secondary))] mb-8 max-w-2xl mx-auto">
                            Practice with real-world problems, design scalable architectures, and get AI-powered
                            feedback to ace your next interview.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/problems">
                                <Button size="lg">
                                    Get Started <ArrowRight className="w-5 h-5 ml-2 inline" />
                                </Button>
                            </Link>
                            <Link to="/pricing">
                                <Button variant="secondary" size="lg">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-[rgb(var(--color-surface))]">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-3xl font-bold text-center text-[rgb(var(--color-text-primary))] mb-12">
                        Why SystemDesignLab?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card>
                            <Code className="w-10 h-10 text-[rgb(var(--color-primary))] mb-4" />
                            <h4 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                                Real-World Problems
                            </h4>
                            <p className="text-[rgb(var(--color-text-secondary))]">
                                Practice with actual system design problems asked at top tech companies.
                            </p>
                        </Card>
                        <Card>
                            <Target className="w-10 h-10 text-[rgb(var(--color-primary))] mb-4" />
                            <h4 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                                Interactive Canvas
                            </h4>
                            <p className="text-[rgb(var(--color-text-secondary))]">
                                Design architectures visually with drag-and-drop components.
                            </p>
                        </Card>
                        <Card>
                            <Trophy className="w-10 h-10 text-[rgb(var(--color-primary))] mb-4" />
                            <h4 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                                AI Feedback
                            </h4>
                            <p className="text-[rgb(var(--color-text-secondary))]">
                                Get instant, detailed feedback on your designs to improve faster.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-4">
                        Ready to Level Up?
                    </h3>
                    <p className="text-lg text-[rgb(var(--color-text-secondary))] mb-8">
                        Join thousands of developers preparing for system design interviews.
                    </p>
                    <Link to="/problems">
                        <Button size="lg">Start Practicing Now</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};
