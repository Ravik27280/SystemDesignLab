import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Zap, Brain, Play } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppStore } from '../store';

export const PracticeModePage: React.FC = () => {
    const navigate = useNavigate();
    const { problems } = useAppStore();
    const [selectedDuration, setSelectedDuration] = useState(45); // minutes
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

    const handleStartSession = () => {
        // Find a random problem matching difficulty, or any if not selected
        let eligibleProblems = problems;
        if (selectedDifficulty) {
            eligibleProblems = problems.filter(p => p.difficulty === selectedDifficulty);
        }

        if (eligibleProblems.length === 0) {
            // Fallback or show error
            return;
        }

        const randomProblem = eligibleProblems[Math.floor(Math.random() * eligibleProblems.length)];

        // Navigate to workspace with practice mode params
        navigate(`/workspace/${randomProblem.id}?mode=practice&duration=${selectedDuration}`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-violet-500/10 rounded-full mb-4">
                    <Zap className="w-8 h-8 text-violet-500" />
                </div>
                <h2 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                    System Design Practice Mode
                </h2>
                <p className="text-[rgb(var(--color-text-secondary))] max-w-lg mx-auto">
                    Simulate real interview conditions with timed sessions. Pick a difficulty, set a timer, and solve a random problem.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Duration Selection */}
                <Card className="hover:border-violet-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Timer className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">Session Duration</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[30, 45, 60].map(mins => (
                            <button
                                key={mins}
                                onClick={() => setSelectedDuration(mins)}
                                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${selectedDuration === mins
                                    ? 'bg-blue-500/10 border-blue-500 text-blue-500'
                                    : 'bg-[rgb(var(--color-bg-secondary))] border-transparent text-[rgb(var(--color-text-secondary))] hover:border-[rgb(var(--color-border))]'
                                    }`}
                            >
                                {mins} mins
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Difficulty Selection */}
                <Card className="hover:border-violet-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Brain className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">Difficulty Level</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {['Easy', 'Medium', 'Hard'].map(diff => (
                            <button
                                key={diff}
                                onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${selectedDifficulty === diff
                                    ? diff === 'Easy' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                                        : diff === 'Medium' ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                                            : 'bg-rose-500/10 border-rose-500 text-rose-500'
                                    : 'bg-[rgb(var(--color-bg-secondary))] border-transparent text-[rgb(var(--color-text-secondary))] hover:border-[rgb(var(--color-border))]'
                                    }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="flex justify-center">
                <Button
                    size="lg"
                    onClick={handleStartSession}
                    className="w-full md:w-auto min-w-[200px] h-14 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25"
                >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Start Practice Session
                </Button>
            </div>

            {/* Recent Practice (Placeholder for now) */}
            <div className="mt-12">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[rgb(var(--color-text-secondary))] mb-4">
                    Why Practice Mode?
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))]">
                        <h4 className="font-semibold text-[rgb(var(--color-text-primary))] mb-2">Time Management</h4>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">Learn to structure your design discussion within typical 45-minute interview limits.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))]">
                        <h4 className="font-semibold text-[rgb(var(--color-text-primary))] mb-2">Random Challenges</h4>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">Adapt to unexpected problem statements just like in a real interview setting.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))]">
                        <h4 className="font-semibold text-[rgb(var(--color-text-primary))] mb-2">Stress Testing</h4>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">Build confidence by solving diverse problems under time pressure.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
