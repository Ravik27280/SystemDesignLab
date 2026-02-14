import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useAppStore } from '../store';
import { mockProblems } from '../utils/mockData';

export const ProblemsPage: React.FC = () => {
    const navigate = useNavigate();
    const { problems, setProblems, setCurrentProblem } = useAppStore();

    useEffect(() => {
        // TODO: Replace with API call
        if (problems.length === 0) {
            setProblems(mockProblems);
        }
    }, [problems.length, setProblems]);

    const handleStartProblem = (problem: typeof problems[0]) => {
        setCurrentProblem(problem);
        navigate(`/workspace/${problem.id}`);
    };

    const difficultyVariant = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'success';
            case 'medium':
                return 'warning';
            case 'hard':
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

            <div className="grid gap-4">
                {problems.map((problem) => (
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
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {problem.estimatedTime}
                                    </span>
                                    <span>{problem.category}</span>
                                </div>
                            </div>
                            <Button onClick={() => handleStartProblem(problem)}>
                                Start <ArrowRight className="w-4 h-4 ml-1 inline" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
