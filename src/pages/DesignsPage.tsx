import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Calendar, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppStore } from '../store';
import * as designsApi from '../api/designs.api';
import type { Design } from '../types';

export const DesignsPage: React.FC = () => {
    const navigate = useNavigate();
    const { problems, setProblems, setCurrentProblem } = useAppStore();
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userDesigns, problemsData] = await Promise.all([
                    designsApi.getUserDesigns(),
                    // Ideally check if problems are loaded, but fine to refetch or check store
                    useAppStore.getState().problems.length > 0
                        ? Promise.resolve(useAppStore.getState().problems)
                        : import('../api/problems.api').then(m => m.getProblems())
                ]);

                if (useAppStore.getState().problems.length === 0) {
                    setProblems(problemsData);
                }

                // Sort by last updated
                setDesigns(userDesigns.sort((a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                ));
            } catch (err: any) {
                setError(err.message || 'Failed to load designs');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setProblems]);

    const handleOpenDesign = (design: Design) => {
        const problem = problems.find(p => p.id === design.problemId);
        if (problem) {
            setCurrentProblem(problem);
            navigate(`/workspace/${problem.id}`);
        } else {
            // Fallback if problem not found (shouldn't happen)
            navigate(`/workspace/${design.problemId}`);
        }
    };

    const getProblemTitle = (problemId: string) => {
        return problems.find(p => p.id === problemId)?.title || 'Unknown Problem';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                    My Designs
                </h2>
                <p className="text-[rgb(var(--color-text-secondary))]">
                    Manage and revisit your system architecture designs
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-[rgb(var(--color-primary))] animate-spin mb-4" />
                    <p className="text-[rgb(var(--color-text-secondary))]">Loading your designs...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-app mb-4">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-red-500 font-medium">Failed to load designs</p>
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {/* Designs Grid */}
            {!loading && !error && (
                <>
                    {designs.length === 0 ? (
                        <div className="text-center py-16 bg-[rgb(var(--color-bg-secondary))] rounded-xl border border-[rgb(var(--color-border))] border-dashed">
                            <div className="inline-flex items-center justify-center p-4 bg-[rgb(var(--color-surface))] rounded-full mb-4 shadow-sm">
                                <Layout className="w-8 h-8 text-[rgb(var(--color-text-tertiary))]" />
                            </div>
                            <h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))] mb-2">No designs yet</h3>
                            <p className="text-[rgb(var(--color-text-secondary))] max-w-sm mx-auto mb-6">
                                Start solving system design problems to create your first architecture diagram.
                            </p>
                            <Button onClick={() => navigate('/problems')}>
                                Browse Problems
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {designs.map((design) => (
                                <Card key={design.id} className="flex flex-col h-full group hover:border-violet-500/30 transition-all hover:-translate-y-1">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-2 bg-violet-500/10 rounded-lg text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                                                <Layout className="w-5 h-5" />
                                            </div>
                                            {design.feedback && (
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${design.feedback.score >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                                                    design.feedback.score >= 60 ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-rose-500/10 text-rose-500'
                                                    }`}>
                                                    Score: {design.feedback.score}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-2 line-clamp-1">
                                            {design.name || getProblemTitle(design.problemId)}
                                        </h3>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-xs text-[rgb(var(--color-text-secondary))]">
                                                <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                                                Updated {formatDate(design.updatedAt)}
                                            </div>
                                            <div className="text-xs text-[rgb(var(--color-text-tertiary))]">
                                                {design.nodes.length} nodes • {design.edges.length} connections
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-auto border-t border-[rgb(var(--color-border))] flex items-center justify-between gap-3">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full justify-center group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 group-hover:text-violet-600 dark:group-hover:text-violet-400"
                                            onClick={() => handleOpenDesign(design)}
                                        >
                                            Open Design <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
