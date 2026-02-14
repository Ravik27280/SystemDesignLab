import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileQuestion, Layers, Trophy, Target, Settings, Zap } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
    { to: '/problems', label: 'Problems', icon: FileQuestion },
    { to: '/designs', label: 'My Designs', icon: Layers },
    { to: '/practice', label: 'Practice Mode', icon: Target },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-[rgb(var(--color-surface))] border-r border-[rgb(var(--color-border))] flex flex-col transition-theme">
            {/* Logo */}
            <div className="p-6 border-b border-[rgb(var(--color-border))]">
                <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-[rgb(var(--color-primary))]" />
                    <span className="text-xl font-bold text-[rgb(var(--color-text-primary))]">
                        SystemDesignLab
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center gap-3 px-4 py-2.5 rounded-app text-sm font-medium transition-all',
                                            isActive
                                                ? 'bg-[rgb(var(--color-primary))] text-white'
                                                : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-card))] hover:text-[rgb(var(--color-text-primary))]'
                                        )
                                    }
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[rgb(var(--color-border))]">
                <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                    © 2026 SystemDesignLab
                </div>
            </div>
        </aside>
    );
};
