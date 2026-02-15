import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useAppStore } from '../store';
import * as problemsApi from '../api/problems.api';

export const ProblemsPage: React.FC = () => {
    const navigate = useNavigate();
    const { problems, setProblems, setCurrentProblem } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProblems = async () => {
            if (problems.length > 0) return; // Already loaded

            setLoading(true);
            setError('');

            try {
                const data = await problemsApi.getProblems();
                setProblems(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load problems');
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, [problems.length, setProblems]);

    const handleStartProblem = (problem: typeof problems[0]) => {
        setCurrentProblem(problem);
        navigate(`/workspace/${problem.id}`);
    };

    const difficultyVariant = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'success';
            case 'Medium':
                return 'warning';
            case 'Hard':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                    System Design Problems
                </h2>
                <p className="text-[rgb(var(--color-text-secondary))]">
                    Practice with real-world system design challenges
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-[rgb(var(--color-primary))] animate-spin mb-4" />
                    <p className="text-[rgb(var(--color-text-secondary))]">Loading problems...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-app mb-4">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-red-500 font-medium">Failed to load problems</p>
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {/* Problems List */}
            {!loading && !error && (
                <div className="grid gap-4">
                    {problems.length === 0 ? (
                        <p className="text-center text-[rgb(var(--color-text-secondary))] py-12">
                            No problems available. Contact your administrator.
                        </p>
                    ) : (
                        problems.map((problem) => (
                            <Card key={problem.id}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                                                {problem.title}
                                            </h3>
                                            <Badge variant={difficultyVariant(problem.difficulty)}>
                                                {problem.difficulty}
                                            </Badge>
                                        </div>
                                        <p className="text-[rgb(var(--color-text-secondary))] mb-4">
                                            {problem.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-[rgb(var(--color-text-secondary))]">
                                            <span>
                                                {problem.functionalRequirements.length + problem.nonFunctionalRequirements.length} requirements
                                            </span>
                                            {problem.isPro && (
                                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-xs font-medium">
                                                    PRO
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button onClick={() => handleStartProblem(problem)}>
                                        Start <ArrowRight className="w-4 h-4 ml-1 inline" />
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
