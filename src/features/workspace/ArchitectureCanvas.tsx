import React, { useCallback, useState, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    type Connection,
    type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '../../components/Button';
import { useAppStore } from '../../store';
import * as evaluationApi from '../../api/evaluation.api';
import { CustomNode } from './CustomNode';

const nodeTypes = {
    custom: CustomNode,
};

// Initial node templates (not used in this version)
// const initialNodes: Node[] = [];

export const ArchitectureCanvas: React.FC = () => {
    const { nodes: storeNodes, edges: storeEdges, setNodes, setEdges, setSelectedNode, currentProblem } = useAppStore();
    const [nodes, setNodesState, onNodesChange] = useNodesState(storeNodes);
    const [edges, setEdgesState, onEdgesChange] = useEdgesState(storeEdges);
    const [evaluating, setEvaluating] = useState(false);

    // History for undo/redo
    const [history, setHistory] = useState<{ nodes: Node[]; edges: any[] }[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Sync with store
    React.useEffect(() => {
        setNodes(nodes as any);
        setEdges(edges as any);
    }, [nodes, edges, setNodes, setEdges]);

    // Save to history when nodes or edges change
    useEffect(() => {
        if (nodes.length > 0 || edges.length > 0) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push({ nodes, edges });
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    }, [nodes, edges]);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                handleRedo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [historyIndex]);

    const onConnect = useCallback(
        (params: Connection) => {
            setEdgesState((eds) => addEdge(params, eds));
        },
        [setEdgesState]
    );

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            setSelectedNode(node as any);
        },
        [setSelectedNode]
    );

    const addNode = (type: string, label: string) => {
        const newNode: Node = {
            id: `${type}-${Date.now()}`,
            type: 'custom',
            position: {
                x: Math.random() * 300 + 100,
                y: Math.random() * 200 + 100,
            },
            data: { label, nodeType: type },
        };
        setNodesState((nds) => [...nds, newNode]);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            setNodesState(prevState.nodes);
            setEdgesState(prevState.edges);
            setHistoryIndex(historyIndex - 1);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setNodesState(nextState.nodes);
            setEdgesState(nextState.edges);
            setHistoryIndex(historyIndex + 1);
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all nodes and connections?')) {
            setNodesState([]);
            setEdgesState([]);
        }
    };

    const handleEvaluate = async () => {
        if (!currentProblem) {
            alert('Please select a problem first');
            return;
        }

        if (nodes.length === 0) {
            alert('Please add at least one component to your design');
            return;
        }

        setEvaluating(true);

        try {
            // First, save the design to get a designId
            const designsApi = await import('../../api/designs.api');
            const savedDesign = await designsApi.saveDesign({
                problemId: currentProblem.id,
                nodes: nodes as any,
                edges: edges as any,
            });

            // Now evaluate with the designId
            const result = await evaluationApi.evaluateDesign({
                designId: savedDesign.id!,
                problemId: currentProblem.id,
            });

            // Feedback will display in FeedbackPanel via store
            console.log('Evaluation result:', result);
            alert('Design evaluated! Check the Feedback panel on the right.');
        } catch (err: any) {
            alert('Failed to evaluate design: ' + (err.message || 'Unknown error'));
        } finally {
            setEvaluating(false);
        }
    };

    return (
        <div className="h-full w-full relative bg-[rgb(var(--color-bg))]">
            {/* Toolbar */}
            <div className="absolute top-4 left-4 z-10 max-w-2xl">
                <div className="bg-[rgb(var(--color-card))] rounded-app shadow-app-lg p-3 space-y-2">
                    {/* Control buttons */}
                    <div className="flex gap-2 pb-2 border-b border-[rgb(var(--color-border))]">
                        <Button size="sm" variant="secondary" onClick={handleUndo} disabled={historyIndex <= 0}>
                            ↶ Undo
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                            ↷ Redo
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleClearAll}>
                            🗑️ Clear All
                        </Button>
                    </div>

                    {/* Node type buttons */}
                    <div className="text-xs font-semibold text-[rgb(var(--color-text-secondary))] mb-1">Components</div>
                    <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="secondary" onClick={() => addNode('client', 'Client')}>+ Client</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('cdn', 'CDN')}>+ CDN</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('apiGateway', 'API Gateway')}>+ API Gateway</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('loadBalancer', 'Load Balancer')}>+ Load Balancer</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('webServer', 'Web Server')}>+ Web Server</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('apiService', 'API Service')}>+ API Service</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('auth', 'Auth Service')}>+ Auth Service</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('database', 'Database')}>+ Database</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('cache', 'Cache')}>+ Cache</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('messageQueue', 'Message Queue')}>+ Message Queue</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('search', 'Search Service')}>+ Search</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('objectStorage', 'Object Storage')}>+ Object Storage</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('notification', 'Notification')}>+ Notification</Button>
                        <Button size="sm" variant="secondary" onClick={() => addNode('analytics', 'Analytics')}>+ Analytics</Button>
                    </div>
                </div>
            </div>

            {/* Evaluate Button */}
            <div className="absolute bottom-4 right-4 z-10">
                <Button onClick={handleEvaluate} disabled={evaluating}>
                    {evaluating ? 'Evaluating...' : 'Evaluate Design'}
                </Button>
            </div>

            {/* React Flow Canvas */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                deleteKeyCode="Delete"
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};
