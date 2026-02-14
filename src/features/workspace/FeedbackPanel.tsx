import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { Panel } from '../../components/Panel';

// Mock feedback data - will be replaced with actual AI feedback
const mockFeedback = {
    strengths: ['Efficient use of caching layer.'],
    warnings: ['Database is a single point of failure.'],
    errors: ['Lack of load balancing for uploads.'],
};

export const FeedbackPanel: React.FC = () => {
    return (
        <div className="h-full bg-[rgb(var(--color-surface))]">
            <Panel
                title="AI Feedback"
                headerAction={
                    <div className="flex items-center gap-1 text-xs text-[rgb(var(--color-text-secondary))]">
                        <Sparkles className="w-4 h-4" />
                        <span>Powered by AI</span>
                    </div>
                }
            >
                <div className="space-y-4">
                    {/* Strengths */}
                    {mockFeedback.strengths.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-[rgb(var(--color-success))]" />
                                <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">Strengths</h4>
                            </div>
                            <ul className="space-y-2">
                                {mockFeedback.strengths.map((strength, idx) => (
                                    <li
                                        key={idx}
                                        className="text-sm text-[rgb(var(--color-text-secondary))] flex items-start gap-2"
                                    >
                                        <span className="text-[rgb(var(--color-success))]">✓</span>
                                        {strength}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Warnings */}
                    {mockFeedback.warnings.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-[rgb(var(--color-warning))]" />
                                <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">Warnings</h4>
                            </div>
                            <ul className="space-y-2">
                                {mockFeedback.warnings.map((warning, idx) => (
                                    <li
                                        key={idx}
                                        className="text-sm text-[rgb(var(--color-text-secondary))] flex items-start gap-2"
                                    >
                                        <span className="text-[rgb(var(--color-warning))]">⚠</span>
                                        {warning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Errors */}
                    {mockFeedback.errors.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle className="w-5 h-5 text-[rgb(var(--color-error))]" />
                                <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">Issues</h4>
                            </div>
                            <ul className="space-y-2">
                                {mockFeedback.errors.map((error, idx) => (
                                    <li
                                        key={idx}
                                        className="text-sm text-[rgb(var(--color-text-secondary))] flex items-start gap-2"
                                    >
                                        <span className="text-[rgb(var(--color-error))]">✕</span>
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </Panel>
        </div>
    );
};
