import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import {
    Database, HardDrive, Server, Cloud, Zap, Globe,
    Shield, Bell, BarChart3, Search, MessageSquare, Smartphone, Network, X
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
    client: Smartphone,
    cdn: Network,
    apiGateway: Globe,
    loadBalancer: Zap,
    webServer: Globe,
    apiService: Server,
    auth: Shield,
    database: Database,
    cache: HardDrive,
    messageQueue: MessageSquare,
    search: Search,
    objectStorage: Cloud,
    notification: Bell,
    analytics: BarChart3,
};

const colorMap: Record<string, string> = {
    client: '#14B8A6',
    cdn: '#8B5CF6',
    apiGateway: '#06B6D4',
    loadBalancer: '#3B82F6',
    webServer: '#10B981',
    apiService: '#8B5CF6',
    auth: '#F59E0B',
    database: '#F59E0B',
    cache: '#EC4899',
    messageQueue: '#6366F1',
    search: '#EF4444',
    objectStorage: '#06B6D4',
    notification: '#F97316',
    analytics: '#A855F7',
};

export const CustomNode: React.FC<{ data: { label: string; nodeType: string }; id: string }> = ({ data, id }) => {
    const Icon = iconMap[data.nodeType] || Server;
    const color = colorMap[data.nodeType] || '#3B82F6';
    const [isHovered, setIsHovered] = useState(false);
    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Remove the node
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        // Remove connected edges
        setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
    };

    return (
        <div
            className="px-4 py-3 rounded-app shadow-app-lg border-2 bg-[rgb(var(--color-card))] min-w-[140px] relative"
            style={{ borderColor: color }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Delete button */}
            {isHovered && (
                <button
                    onClick={handleDelete}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                    title="Delete node"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* Top handle */}
            <Handle type="target" position={Position.Top} id="top" />

            {/* Left handle */}
            <Handle
                type="target"
                position={Position.Left}
                id="left-target"
                style={{ top: '30%' }}
            />
            <Handle
                type="source"
                position={Position.Left}
                id="left-source"
                style={{ top: '70%' }}
            />

            {/* Right handle */}
            <Handle
                type="target"
                position={Position.Right}
                id="right-target"
                style={{ top: '30%' }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="right-source"
                style={{ top: '70%' }}
            />

            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" style={{ color }} />
                <div className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    {data.label}
                </div>
            </div>

            {/* Bottom handle */}
            <Handle type="source" position={Position.Bottom} id="bottom" />
        </div>
    );
};
