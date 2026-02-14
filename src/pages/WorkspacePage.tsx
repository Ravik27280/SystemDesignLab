import React from 'react';
import { useParams } from 'react-router-dom';
import { WorkspaceLayout } from '../features/workspace/WorkspaceLayout';
import { RequirementsPanel } from '../features/workspace/RequirementsPanel';
import { ArchitectureCanvas } from '../features/workspace/ArchitectureCanvas';
import { ConfigurationPanel } from '../features/workspace/ConfigurationPanel';
import { FeedbackPanel } from '../features/workspace/FeedbackPanel';
import { useAppStore } from '../store';

export const WorkspacePage: React.FC = () => {
    const { problemId } = useParams<{ problemId: string }>();
    const { currentProblem, problems } = useAppStore();

    // Load problem if not already loaded
    React.useEffect(() => {
        if (problemId && !currentProblem) {
            const problem = problems.find((p) => p.id === problemId);
            if (problem) {
                useAppStore.getState().setCurrentProblem(problem);
            }
        }
    }, [problemId, currentProblem, problems]);

    if (!currentProblem) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-[rgb(var(--color-text-secondary))]">Loading problem...</p>
            </div>
        );
    }

    return (
        <WorkspaceLayout
            left={<RequirementsPanel problem={currentProblem} />}
            center={<ArchitectureCanvas />}
            right={<ConfigurationPanel />}
            bottom={<FeedbackPanel />}
        />
    );
};
