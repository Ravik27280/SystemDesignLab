import React from 'react';
import { Panel } from '../../components/Panel';
import type { Problem } from '../../types';

interface RequirementsPanelProps {
    problem: Problem;
}

export const RequirementsPanel: React.FC<RequirementsPanelProps> = ({ problem }) => {
    return (
        <div className="h-full bg-[rgb(var(--color-surface))]">
            <Panel title="Requirements">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                            {problem.title}
                        </h3>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                            {problem.description}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                            Key Requirements:
                        </h4>
                        <ul className="space-y-2">
                            {problem.requirements.map((req, idx) => (
                                <li
                                    key={idx}
                                    className="text-sm text-[rgb(var(--color-text-secondary))] flex items-start gap-2"
                                >
                                    <span className="text-[rgb(var(--color-primary))]">•</span>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Panel>
        </div>
    );
};
