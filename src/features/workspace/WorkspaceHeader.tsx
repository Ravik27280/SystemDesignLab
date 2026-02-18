import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Home, Settings, User, Timer } from 'lucide-react';
import { useAppStore } from '../../store';
import { Button } from '../../components/Button';

export const WorkspaceHeader: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { currentProblem } = useAppStore();

    const mode = searchParams.get('mode');
    const durationParam = searchParams.get('duration');

    // Timer State
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (mode === 'practice' && durationParam) {
            const initialTime = parseInt(durationParam) * 60; // minutes to seconds
            setTimeLeft(initialTime);

            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === null || prev <= 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [mode, durationParam]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = (seconds: number) => {
        if (seconds < 300) return 'text-red-500 animate-pulse'; // Less than 5 mins
        if (seconds < 900) return 'text-amber-500'; // Less than 15 mins
        return 'text-[rgb(var(--color-primary))]';
    };

    return (
        <div className="h-14 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] flex items-center justify-between px-4 shrink-0 z-20 shadow-sm">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/problems')}
                    className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="font-medium">Back to Problems</span>
                </Button>

                <div className="h-6 w-px bg-[rgb(var(--color-border))]" />

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500">
                        <Home className="w-4 h-4" />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] leading-tight">
                            {currentProblem ? currentProblem.title : 'System Design Workspace'}
                        </h1>
                        {currentProblem && (
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] text-[rgb(var(--color-text-tertiary))] font-medium uppercase tracking-wider">
                                    {currentProblem.difficulty} Difficulty
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Center - Practice Timer */}
            {mode === 'practice' && timeLeft !== null && (
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] shadow-sm">
                    <Timer className={`w-4 h-4 ${getTimerColor(timeLeft)}`} />
                    <span className={`text-sm font-bold font-mono ${getTimerColor(timeLeft)}`}>
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-xs text-[rgb(var(--color-text-tertiary))] font-medium uppercase tracking-wider ml-1">
                        Remaining
                    </span>
                </div>
            )}

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-[rgb(var(--color-text-secondary))]">
                    <Settings className="w-4 h-4" />
                </Button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    <User className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
};
