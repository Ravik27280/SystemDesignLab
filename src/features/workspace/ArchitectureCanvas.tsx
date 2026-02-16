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
import { AnimatedEdge } from './AnimatedEdge.tsx';

const nodeTypes = {
    custom: CustomNode,
};

const edgeTypes = {
    animated: AnimatedEdge,
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

    // Animation state
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
    const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());

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

    // Sleep utility for animation timing
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Animate request flow through the architecture
    const animateRequestFlow = async () => {
        setIsAnimating(true);
        setActiveNodes(new Set());
        setActiveEdges(new Set());

        // Find entry points (client nodes, or any node without incoming edges)
        const entryNodes = nodes.filter(node => {
            const hasIncoming = edges.some(edge => edge.target === node.id);
            return !hasIncoming || node.data.nodeType === 'client';
        });

        if (entryNodes.length === 0 && nodes.length > 0) {
            // If no clear entry point, use first node
            entryNodes.push(nodes[0]);
        }

        // Find load balancer nodes
        const loadBalancers = nodes.filter(n => n.data.nodeType === 'loadBalancer');
        console.log('Load balancers found:', loadBalancers.length);

        // Simulate multiple parallel requests (3 requests)
        const requestCount = 3;

        for (let req = 0; req < requestCount; req++) {
            // Slight delay between request starts
            if (req > 0) await sleep(600);

            // Start request animation (don't await - run in parallel)
            traverseFromNode(entryNodes, loadBalancers, req);
        }

        // Wait for all animations to complete
        await sleep(5000);

        setIsAnimating(false);
        setActiveNodes(new Set());
        setActiveEdges(new Set());
    };

    // Traverse from entry nodes through the architecture
    const traverseFromNode = async (startNodes: Node[], loadBalancers: Node[], requestId: number) => {
        const visited = new Set<string>();
        const queue: string[] = startNodes.map(n => n.id);

        while (queue.length > 0) {
            const nodeId = queue.shift()!;

            if (visited.has(nodeId)) continue;
            visited.add(nodeId);

            // Activate node
            setActiveNodes(prev => new Set([...prev, nodeId]));
            await sleep(800);

            // Find outgoing edges
            const outEdges = edges.filter(e => e.source === nodeId);

            // If this is a load balancer, distribute to ONE target (simulate round-robin)
            const currentNode = nodes.find(n => n.id === nodeId);
            if (currentNode?.data.nodeType === 'loadBalancer' && outEdges.length > 1) {
                // Select one edge based on requestId (round-robin simulation)
                const selectedEdge = outEdges[requestId % outEdges.length];

                // Activate selected edge
                setActiveEdges(prev => new Set([...prev, selectedEdge.id]));
                await sleep(600);

                queue.push(selectedEdge.target);
            } else {
                // Normal case: activate all outgoing edges
                for (const edge of outEdges) {
                    setActiveEdges(prev => new Set([...prev, edge.id]));
                    await sleep(400);
                    queue.push(edge.target);
                }
            }

            // Deactivate node after processing
            await sleep(600);
            setActiveNodes(prev => {
                const newSet = new Set(prev);
                newSet.delete(nodeId);
                return newSet;
            });
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
            // Start flow animation
            const animationPromise = animateRequestFlow();

            // First, save the design to get a designId
            const designsApi = await import('../../api/designs.api');
            const savedDesign = await designsApi.saveDesign({
                problemId: currentProblem.id,
                nodes: nodes as any,
                edges: edges as any,
            });

            // Now evaluate the design with the designId
            await evaluationApi.evaluateDesign({
                designId: savedDesign.id!,
                problemId: currentProblem.id,
            });

            // Wait for animation to complete
            await animationPromise;

            alert('Design evaluated successfully! Check the Feedback panel for results.');
        } catch (error: any) {
            console.error('Evaluation failed:', error);
            alert(`Evaluation failed: ${error.message}`);
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
                nodes={nodes.map(node => ({
                    ...node,
                    data: { ...node.data, isActive: activeNodes.has(node.id) }
                }))}
                edges={edges.map(edge => ({
                    ...edge,
                    type: 'animated',
                    data: { isActive: activeEdges.has(edge.id) }
                }))}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
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
