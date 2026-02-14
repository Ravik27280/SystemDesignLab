import React, { useState } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAppStore } from '../store';

interface TopbarProps {
    title?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title }) => {
    const { user, logout } = useAppStore();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

                {/* User Profile with Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-2 rounded-app hover:bg-[rgb(var(--color-card))] transition-theme"
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <span className="text-sm font-medium text-[rgb(var(--color-text-primary))] hidden sm:block">
                            {user?.name || 'User'}
                        </span>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-app shadow-app-lg py-2 z-50">
                            <div className="px-4 py-2 border-b border-[rgb(var(--color-border))]">
                                <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                                    {user?.email}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[rgb(var(--color-surface))] transition-theme"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
