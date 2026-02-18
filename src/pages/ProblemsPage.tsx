import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, FlaskConical, Circle, Lock } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useAppStore } from '../store';
import * as problemsApi from '../api/problems.api';
import * as designsApi from '../api/designs.api';
import type { Design } from '../types';

export const ProblemsPage: React.FC = () => {
    const navigate = useNavigate();
    const { problems, setProblems, setCurrentProblem, user } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userDesigns, setUserDesigns] = useState<Design[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');

            try {
                // Fetch problems if not already loaded
                if (problems.length === 0) {
                    const problemsData = await problemsApi.getProblems();
                    setProblems(problemsData);
                }

                // Fetch user designs for progress tracking
                if (user) {
                    const designsData = await designsApi.getUserDesigns();
                    setUserDesigns(designsData);
                }

            } catch (err: any) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [problems.length, setProblems, user]);

    const handleStartProblem = (problem: typeof problems[0]) => {
        const isProProblem = problem.isPro;
        const isUserPro = user?.role === 'pro';

        if (isProProblem && !isUserPro) {
            navigate('/pricing');
            return;
        }

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

    const getProblemStatus = (problemId: string) => {
        const design = userDesigns.find(d => d.problemId === problemId);
        if (!design) return 'new';

        // If it has feedback with a good score, consider it complete
        if (design.feedback && design.feedback.score >= 70) return 'completed';

        return 'in-progress';
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                    System Design Problems
                </h2>
                <p className="text-[rgb(var(--color-text-secondary))]">
                    Practice with real-world system design challenges. Track your progress and get AI feedback.
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
                        <p className="text-sm text-red-500 font-medium">Failed to load data</p>
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
                        problems.map((problem) => {
                            const status = getProblemStatus(problem.id);
                            const isLocked = problem.isPro && user?.role !== 'pro';

                            return (
                                <Card key={problem.id} className={`transition-all hover:border-[rgb(var(--color-primary))]/50 group relative overflow-hidden ${isLocked ? 'opacity-75' : ''}`}>
                                    {/* Status Stripe */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${status === 'completed' ? 'bg-emerald-500' :
                                        status === 'in-progress' ? 'bg-amber-500' :
                                            'bg-transparent'
                                        }`} />

                                    <div className="flex items-start justify-between pl-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] group-hover:text-[rgb(var(--color-primary))] transition-colors">
                                                    {problem.title}
                                                </h3>
                                                <Badge variant={difficultyVariant(problem.difficulty)}>
                                                    {problem.difficulty}
                                                </Badge>

                                                {/* Status Badge */}
                                                {status === 'completed' && (
                                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Completed
                                                    </div>
                                                )}
                                                {status === 'in-progress' && (
                                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium">
                                                        <FlaskConical className="w-3 h-3" />
                                                        In Progress
                                                    </div>
                                                )}
                                                {/* Pro Badge */}
                                                {problem.isPro && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 rounded text-xs font-bold border border-amber-500/20">
                                                        {isLocked && <Lock className="w-3 h-3" />}
                                                        PRO
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[rgb(var(--color-text-secondary))] mb-4 line-clamp-2">
                                                {problem.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-[rgb(var(--color-text-secondary))]">
                                                <span className="flex items-center gap-1.5">
                                                    <Circle className="w-2 h-2 fill-current opacity-50" />
                                                    {problem.functionalRequirements.length + problem.nonFunctionalRequirements.length} requirements
                                                </span>
                                                {problem.scale && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Circle className="w-2 h-2 fill-current opacity-50" />
                                                        System Scale Design
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Button
                                                onClick={() => handleStartProblem(problem)}
                                                className="group-hover:translate-x-1 transition-transform"
                                                variant={isLocked ? 'secondary' : 'primary'}
                                            >
                                                {isLocked ? (
                                                    <>Unlock Challenge <Lock className="w-4 h-4 ml-1 inline" /></>
                                                ) : (
                                                    <>{status === 'new' ? 'Start Challenge' : 'Continue'} <ArrowRight className="w-4 h-4 ml-1 inline" /></>
                                                )}
                                            </Button>
                                            {status !== 'new' && (
                                                <span className="text-xs text-[rgb(var(--color-text-tertiary))]">
                                                    Last updated recently
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
