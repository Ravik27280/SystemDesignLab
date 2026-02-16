import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Settings, User } from 'lucide-react';
import { useAppStore } from '../../store';
import { Button } from '../../components/Button';

export const WorkspaceHeader: React.FC = () => {
    const navigate = useNavigate();
    const { currentProblem } = useAppStore();

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
                            <p className="text-[10px] text-[rgb(var(--color-text-tertiary))] font-medium uppercase tracking-wider">
                                {currentProblem.difficulty} Difficulty
                            </p>
                        )}
                    </div>
                </div>
            </div>

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
