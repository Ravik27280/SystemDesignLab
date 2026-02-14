import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

export const DashboardPage: React.FC = () => {
    return (
        <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <div>
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                    Welcome back!
                </h2>
                <p className="text-[rgb(var(--color-text-secondary))]">
                    Continue your system design journey
                </p>
            </div>

            {/* Quick Start */}
            <Card>
                <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-4">
                    Quick Start
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-app bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all cursor-pointer">
                        <h4 className="font-medium text-[rgb(var(--color-text-primary))] mb-2">
                            Start New Problem
                        </h4>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-3">
                            Choose from our collection of real-world system design problems
                        </p>
                        <Button variant="ghost" size="sm">
                            Browse Problems <ArrowRight className="w-4 h-4 ml-1 inline" />
                        </Button>
                    </div>
                    <div className="p-4 rounded-app bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all cursor-pointer">
                        <h4 className="font-medium text-[rgb(var(--color-text-primary))] mb-2">
                            Practice Mode
                        </h4>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-3">
                            Timed practice sessions to simulate real interviews
                        </p>
                        <Button variant="ghost" size="sm">
                            Start Practice <Clock className="w-4 h-4 ml-1 inline" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Recent Designs */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                        Recent Designs
                    </h3>
                    <Button variant="ghost" size="sm">
                        View All
                    </Button>
                </div>
                <div className="space-y-3">
                    {[
                        { name: 'Instagram System Design', date: '2 days ago', difficulty: 'medium' },
                        { name: 'URL Shortener', date: '5 days ago', difficulty: 'easy' },
                    ].map((design, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-app bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-[rgb(var(--color-text-primary))]">
                                        {design.name}
                                    </h4>
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                                        Last edited {design.date}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        design.difficulty === 'easy'
                                            ? 'success'
                                            : design.difficulty === 'medium'
                                                ? 'warning'
                                                : 'error'
                                    }
                                >
                                    {design.difficulty}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
