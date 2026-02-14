import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database, HardDrive, Server, Cloud, Zap, Globe } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
    loadBalancer: Zap,
    webServer: Globe,
    apiService: Server,
    database: Database,
    cache: HardDrive,
    objectStorage: Cloud,
};

const colorMap: Record<string, string> = {
    loadBalancer: '#3B82F6',
    webServer: '#10B981',
    apiService: '#8B5CF6',
    database: '#F59E0B',
    cache: '#EC4899',
    objectStorage: '#06B6D4',
};

export const CustomNode: React.FC<{ data: { label: string; nodeType: string } }> = ({ data }) => {
    const Icon = iconMap[data.nodeType] || Server;
    const color = colorMap[data.nodeType] || '#3B82F6';

    return (
        <div
            className="px-4 py-3 rounded-app shadow-app-lg border-2 bg-[rgb(var(--color-card))] min-w-[140px]"
            style={{ borderColor: color }}
        >
            <Handle type="target" position={Position.Top} />
            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" style={{ color }} />
                <div className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    {data.label}
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};
