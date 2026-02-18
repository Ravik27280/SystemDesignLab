import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Zap, BarChart, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useNavigate } from 'react-router-dom';
import { updateProfile, getUserStats, type UserStats } from '../api/profile.api';

export const ProfilePage: React.FC = () => {
    const { user, setUser } = useAppStore();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState<UserStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (user) {
                try {
                    const data = await getUserStats();
                    setStats(data);
                } catch (error) {
                    console.error('Failed to load stats', error);
                }
            }
        };
        fetchStats();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const updatedUser = await updateProfile({ name });
            setUser(updatedUser);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-8">
                My Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-[rgb(var(--color-card))] p-6 rounded-xl border border-[rgb(var(--color-border))] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Zap className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">Designs Created</span>
                    </div>
                    <p className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{stats?.designsCount || 0}</p>
                </div>

                <div className="bg-[rgb(var(--color-card))] p-6 rounded-xl border border-[rgb(var(--color-border))] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">Problems Solved</span>
                    </div>
                    <p className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{stats?.problemsSolved || 0}</p>
                </div>

                <div className="bg-[rgb(var(--color-card))] p-6 rounded-xl border border-[rgb(var(--color-border))] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-violet-500/10 rounded-lg">
                            <BarChart className="w-5 h-5 text-violet-500" />
                        </div>
                        <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">Average Score</span>
                    </div>
                    <p className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{stats?.averageScore || 0}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Profile Form */}
                <div className="md:col-span-2 bg-[rgb(var(--color-card))] rounded-xl border border-[rgb(var(--color-border))] overflow-hidden shadow-sm h-fit">
                    <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-end p-6 relative">
                        <div className="absolute -bottom-10 left-6">
                            <div className="w-24 h-24 bg-[rgb(var(--color-surface))] rounded-full p-1 border border-[rgb(var(--color-border))]">
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                    <User className="w-12 h-12 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-14 px-8 pb-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">{user?.name}</h2>
                            <p className="text-[rgb(var(--color-text-secondary))]">{user?.email}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                    Display Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                    Email Address
                                </label>
                                <div className="relative opacity-60">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                                    <input
                                        type="email"
                                        value={user?.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-[rgb(var(--color-text-secondary))] cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex items-center gap-4">
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                                {message && (
                                    <span className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                                        {message}
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Subscription Card */}
                <div className="bg-[rgb(var(--color-card))] rounded-xl border border-[rgb(var(--color-border))] overflow-hidden shadow-sm h-fit">
                    <div className="p-6 bg-gradient-to-br from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-card))]">
                        <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))] mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[rgb(var(--color-primary))]" />
                            Subscription
                        </h3>

                        <div className="mb-6">
                            <div className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Current Plan</div>
                            <div className={`text-2xl font-bold capitalize flex items-center gap-2 ${user?.role === 'pro' ? 'text-indigo-500' : 'text-[rgb(var(--color-text-primary))]'}`}>
                                {user?.role} Plan
                                {user?.role === 'pro' && <Badge variant="primary">Active</Badge>}
                            </div>
                        </div>

                        {user?.role === 'pro' ? (
                            <div className="space-y-4">
                                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                                    Your next billing date is <span className="font-semibold text-[rgb(var(--color-text-primary))]">March 20, 2026</span>.
                                </p>
                                <Button variant="secondary" className="w-full" onClick={() => alert('Manage subscription coming soon!')}>
                                    Manage Subscription
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                                    Upgrade to Pro to unlock unlimited AI reviews, advanced components, and more.
                                </p>
                                <Button variant="primary" className="w-full" onClick={() => navigate('/pricing')}>
                                    Upgrade to Pro
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
