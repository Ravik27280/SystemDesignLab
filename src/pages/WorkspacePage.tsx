import React from 'react';
import { useParams } from 'react-router-dom';
import { WorkspaceLayout } from '../features/workspace/WorkspaceLayout';
import { RequirementsPanel } from '../features/workspace/RequirementsPanel';
import { ArchitectureCanvas } from '../features/workspace/ArchitectureCanvas';
import { ConfigurationPanel } from '../features/workspace/ConfigurationPanel';
import { FeedbackPanel } from '../features/workspace/FeedbackPanel';
import { useAppStore } from '../store';
import * as designsApi from '../api/designs.api';

export const WorkspacePage: React.FC = () => {
    const { problemId } = useParams<{ problemId: string }>();
    const { currentProblem, problems, setNodes, setEdges } = useAppStore();
    const [isLoadingDesign, setIsLoadingDesign] = React.useState(true);

    // Load problem if not already loaded
    React.useEffect(() => {
        if (problemId && !currentProblem) {
            const problem = problems.find((p) => p.id === problemId);
            if (problem) {
                useAppStore.getState().setCurrentProblem(problem);
            }
        }
    }, [problemId, currentProblem, problems]);

    // Load existing design for this problem (if any)
    React.useEffect(() => {
        const loadDesign = async () => {
            if (!problemId) return;

            try {
                // Clear any previous feedback/state immediately
                useAppStore.getState().setFeedback(null);
                setNodes([]);
                setEdges([]);

                setIsLoadingDesign(true);
                const existingDesign = await designsApi.getDesignByProblemId(problemId);

                if (existingDesign) {
                    // Load existing design into canvas
                    setNodes(existingDesign.nodes);
                    setEdges(existingDesign.edges);
                    console.log('✅ Loaded existing design:', existingDesign);

                    // Load feedback if available
                    if (existingDesign.feedback) {
                        useAppStore.getState().setFeedback(existingDesign.feedback);
                    }
                } else {
                    // No existing design - start with empty canvas
                    console.log('ℹ️ No existing design found, starting fresh');
                }
            } catch (error) {
                console.error('❌ Error loading design:', error);
                // Start with empty canvas on error
                setNodes([]);
                setEdges([]);
                useAppStore.getState().setFeedback(null);
            } finally {
                setIsLoadingDesign(false);
            }
        };

        loadDesign();
    }, [problemId, setNodes, setEdges]);

    if (!currentProblem) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-[rgb(var(--color-text-secondary))]">Loading problem...</p>
            </div>
        );
    }

    if (isLoadingDesign) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-[rgb(var(--color-text-secondary))]">Loading workspace...</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[rgb(var(--color-bg))] transition-theme">
            <WorkspaceLayout
                left={<RequirementsPanel problem={currentProblem} />}
                center={<ArchitectureCanvas />}
                right={<ConfigurationPanel />}
                bottom={<FeedbackPanel />}
            />
        </div>
    );
};
