import React from 'react';
import { Bell, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAppStore } from '../store';

interface TopbarProps {
    title?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title }) => {
    const { user } = useAppStore();

    return (
        <header className="h-16 bg-[rgb(var(--color-surface))] border-b border-[rgb(var(--color-border))] flex items-center justify-between px-6 transition-theme">
            {/* Left: Title */}
            <div>
                {title && (
                    <h1 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                        {title}
                    </h1>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Upgrade to Pro */}
                {user?.plan === 'free' && (
                    <a
                        href="/pricing"
                        className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-app hover:opacity-90 transition-opacity"
                    >
                        Upgrade to Pro
                    </a>
                )}

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <button className="p-2 rounded-app hover:bg-[rgb(var(--color-card))] transition-theme">
                    <Bell className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                </button>

                {/* User Profile */}
                <button className="flex items-center gap-2 p-2 rounded-app hover:bg-[rgb(var(--color-card))] transition-theme">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
};
