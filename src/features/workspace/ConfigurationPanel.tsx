import React from 'react';
import { Panel } from '../../components/Panel';
import { useAppStore } from '../../store';

export const ConfigurationPanel: React.FC = () => {
    const { selectedNode } = useAppStore();

    if (!selectedNode) {
        return (
            <div className="h-full bg-[rgb(var(--color-surface))]">
                <Panel title="Node Configuration">
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                        Select a node to configure
                    </p>
                </Panel>
            </div>
        );
    }

    return (
        <div className="h-full bg-[rgb(var(--color-surface))]">
            <Panel title="Node Configuration">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                            Node Type
                        </label>
                        <input
                            type="text"
                            value={selectedNode.data.nodeType || selectedNode.type}
                            disabled
                            className="w-full px-3 py-2 text-sm rounded-app bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                            Label
                        </label>
                        <input
                            type="text"
                            value={selectedNode.data.label}
                            className="w-full px-3 py-2 text-sm rounded-app bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))]"
                            placeholder="Node label"
                        />
                    </div>

                    {/* TODO: Add more configuration options based on node type */}
                    <div className="pt-4 border-t border-[rgb(var(--color-border))]">
                        <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                            ℹ️ More configuration options coming soon
                        </p>
                    </div>
                </div>
            </Panel>
        </div>
    );
};
