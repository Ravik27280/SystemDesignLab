import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    type Connection,
    type Node,
    type Edge,
    type NodeChange,
    type EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '../../components/Button';
import { useAppStore } from '../../store';
import * as evaluationApi from '../../api/evaluation.api';
import { CustomNode } from './CustomNode';
import { AnimatedEdge } from './AnimatedEdge.tsx';
import { ComponentPalette } from './ComponentPalette';
import { Play, Square, RotateCcw, RotateCw, Trash2 } from 'lucide-react';

const nodeTypes = {
    custom: CustomNode,
};

const edgeTypes = {
    animated: AnimatedEdge,
};

// Initial node templates (not used in this version)
// const initialNodes: Node[] = [];

export const ArchitectureCanvas: React.FC = () => {
    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        setSelectedNode,
        currentProblem
    } = useAppStore();

    // We don't use useNodesState/useEdgesState anymore because we want 
    // single source of truth from the store to handle updates from ConfigurationPanel

    const [evaluating, setEvaluating] = useState(false);

    // History for undo/redo
    const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Animation state
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
    const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());
    const abortControllerRef = useRef<AbortController | null>(null);

    // Handle nodes change
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes(applyNodeChanges(changes, nodes));
        },
        [nodes, setNodes]
    );

    // Handle edges change
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEdges(applyEdgeChanges(changes, edges));
        },
        [edges, setEdges]
    );

    // Save to history when nodes or edges change (debounced or on interaction end ideal, but here simplistic)
    // To avoid too many history entries during drag, we might miss intermediate states or flood history.
    // For a robust undo/redo, we usually capture history on 'dragEnd' or explicit actions.
    // For now, let's keep it simple: we might need a better trigger than just useEffect on [nodes, edges].
    // But adhering to previous logic:
    useEffect(() => {
        // Only push to history if it's different from current history tip
        if (nodes.length === 0 && edges.length === 0 && history.length === 0) return;

        const lastEntry = history[historyIndex];
        const isSame = lastEntry &&
            JSON.stringify(lastEntry.nodes) === JSON.stringify(nodes) &&
            JSON.stringify(lastEntry.edges) === JSON.stringify(edges);

        if (!isSame) {
            // Using a timeout to debounce history updates could be better, 
            // but let's stick to the minimal change to verify controlled state first.
            // Actually, continuously saving every drag frame to history is bad for performance and user experience.
            // A better approach is to not use useEffect but hook into onNodeDragStop.
            // For now, to minimize refactor risk, I will comment out the automatic effect 
            // and maybe implement a manual snapshot or rely on key events.
            // Or better: Use a simple debounce here.
        }
    }, [nodes, edges]);

    // Re-implementing history with debounce could be complex. 
    // Let's rely on standard actions (add, delete, connect) pushing to history?
    // Or just accept that for MVP, undo/redo might be a bit spammy or we skip fixing it perfectly right now.
    // Let's keep the useEffect but add a check to not run while animating?

    // Actually, simply using the store state is the goal.
    // I will simplify history for now: snapshot only on major actions if possible, 
    // or keep the effect but accept it runs often.

    // Effect to snapshot history
    useEffect(() => {
        if (!isAnimating) {
            const timer = setTimeout(() => {
                const lastEntry = history[historyIndex];
                // Simple check to avoid duplicate states if possible (expensive stringify but ok for MVP size)
                if (!lastEntry || JSON.stringify(lastEntry.nodes) !== JSON.stringify(nodes) || JSON.stringify(lastEntry.edges) !== JSON.stringify(edges)) {
                    const newHistory = history.slice(0, historyIndex + 1);
                    newHistory.push({ nodes, edges });
                    // Limit history size
                    if (newHistory.length > 20) newHistory.shift();
                    setHistory(newHistory);
                    setHistoryIndex(newHistory.length - 1);
                }
            }, 500); // 500ms debounce
            return () => clearTimeout(timer);
        }
    }, [nodes, edges, isAnimating]);


    const onConnect = useCallback(
        (params: Connection) => {
            setEdges(addEdge(params, edges));
        },
        [edges, setEdges]
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
        setNodes([...nodes, newNode]);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            setNodes(prevState.nodes);
            setEdges(prevState.edges);
            setHistoryIndex(historyIndex - 1);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setNodes(nextState.nodes);
            setEdges(nextState.edges);
            setHistoryIndex(historyIndex + 1);
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all nodes and connections?')) {
            setNodes([]);
            setEdges([]);
        }
    };

    // Sleep utility for animation timing with abort check
    const sleep = (ms: number, signal?: AbortSignal) => new Promise((resolve, reject) => {
        if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));

        const timeout = setTimeout(() => resolve(true), ms);

        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        }
    });

    const stopAnimation = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsAnimating(false);
        setActiveNodes(new Set());
        setActiveEdges(new Set());
    };

    // Animate request flow through the architecture
    const animateRequestFlow = async () => {
        // Reset previous animation
        stopAnimation();

        // New abort controller
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setIsAnimating(true);
        setActiveNodes(new Set());
        setActiveEdges(new Set());

        try {
            // Find entry points (client nodes, or any node without incoming edges)
            const entryNodes = nodes.filter(node => {
                const hasIncoming = edges.some(edge => edge.target === node.id);
                return !hasIncoming || node.data.nodeType === 'client';
            });

            if (entryNodes.length === 0 && nodes.length > 0) {
                // If no clear entry point, use first node
                entryNodes.push(nodes[0]);
            }



            // Simulate multiple parallel requests (3 requests)
            const requestCount = 3;
            const promises = [];

            for (let req = 0; req < requestCount; req++) {
                // Slight delay between request starts
                if (req > 0) await sleep(600, signal);

                // Start request animation
                promises.push(traverseFromNode(entryNodes, req, signal));
            }

            // Wait for all animations to complete
            await Promise.all(promises);

            // Wait a bit before clearing
            await sleep(2000, signal);

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Animation stopped by user');
            } else {
                console.error('Animation error:', error);
            }
        } finally {
            if (!signal.aborted) {
                setIsAnimating(false);
                setActiveNodes(new Set());
                setActiveEdges(new Set());
                abortControllerRef.current = null;
            }
        }
    };

    // Traverse from entry nodes through the architecture
    const traverseFromNode = async (startNodes: Node[], requestId: number, signal: AbortSignal) => {
        const visited = new Set<string>();
        const queue: string[] = startNodes.map(n => n.id);

        while (queue.length > 0) {
            if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

            const nodeId = queue.shift()!;

            if (visited.has(nodeId)) continue;
            visited.add(nodeId);

            // Activate node
            setActiveNodes(prev => new Set([...prev, nodeId]));
            await sleep(800, signal);

            // Find outgoing edges
            const outEdges = edges.filter(e => e.source === nodeId);

            // If this is a load balancer, distribute to ONE target (simulate round-robin)
            const currentNode = nodes.find(n => n.id === nodeId);
            if (currentNode?.data.nodeType === 'loadBalancer' && outEdges.length > 1) {
                // Select one edge based on requestId (round-robin simulation)
                const selectedEdge = outEdges[requestId % outEdges.length];

                // Activate selected edge
                setActiveEdges(prev => new Set([...prev, selectedEdge.id]));
                await sleep(600, signal);

                queue.push(selectedEdge.target);
            } else {
                // Normal case: activate all outgoing edges
                for (const edge of outEdges) {
                    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
                    setActiveEdges(prev => new Set([...prev, edge.id]));
                    await sleep(400, signal);
                    queue.push(edge.target);
                }
            }

            // Deactivate node after processing (simulating "passing through")
            // await sleep(600, signal);
            setActiveNodes(prev => {
                const newSet = new Set(prev);
                // Keep active? Or flicker? Let's keep it active for a bit then off
                // newSet.delete(nodeId);
                return newSet;
            });

            // Create a separate "cleanup" task for this node to turn off after delay
            setTimeout(() => {
                if (!signal.aborted) {
                    setActiveNodes(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(nodeId);
                        return newSet;
                    });
                }
            }, 600);
        }
    };

    // Handle dropping nodes from palette
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            // Project the position to canvas coordinates
            // Simple approximation for now as we don't have the react flow instance ref readily available 
            // without wrapping in ReactFlowProvider. 
            // For now, random position around the center or cursor if possible.
            // Ideally we use functionality from `useReactFlow` hook but we are inside the component.
            // Let's just add it at a default position + some random offset
            addNode(type, label);
        },
        [nodes, setNodes] // Updated dependency
    );

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
            animateRequestFlow(); // Don't await, let it run

            // First, save the design to get a designId
            const designsApi = await import('../../api/designs.api');
            const savedDesign = await designsApi.saveDesign({
                problemId: currentProblem.id,
                nodes: nodes as any,
                edges: edges as any,
            });

            // Now evaluate the design with the designId
            const result = await evaluationApi.evaluateDesign({
                designId: savedDesign.id!,
                problemId: currentProblem.id,
            });

            // Update store with feedback
            useAppStore.getState().setFeedback(result);

            // alert('Design evaluated successfully! Check the Feedback panel for results.');
        } catch (error: any) {
            console.error('Evaluation failed:', error);
            alert(`Evaluation failed: ${error.message}`);
            stopAnimation();
        } finally {
            setEvaluating(false);
        }
    };

    return (
        <div className="h-full w-full relative bg-[rgb(var(--color-bg))] flex" onDragOver={onDragOver} onDrop={onDrop}>
            {/* Left Toolbar / Palette */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 pointer-events-none max-h-[calc(100%-2rem)]">
                {/* Control buttons */}
                <div className="bg-[rgb(var(--color-card))] rounded-app shadow-app-lg p-1.5 flex gap-1 pointer-events-auto border border-[rgb(var(--color-border))]">
                    <Button size="icon" variant="ghost" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo">
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleRedo} disabled={historyIndex >= history.length - 1} title="Redo">
                        <RotateCw className="w-4 h-4" />
                    </Button>
                    <div className="w-[1px] bg-[rgb(var(--color-border))] mx-1" />
                    <Button size="icon" variant="ghost" onClick={handleClearAll} title="Clear All" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                {/* Component Palette using the new component */}
                <ComponentPalette onAddNode={addNode} />
            </div>

            {/* Evaluate Button & Stop Controls */}
            <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                {isAnimating && (
                    <Button onClick={stopAnimation} variant="danger" className="shadow-lg animate-in fade-in slide-in-from-bottom-2">
                        <Square className="w-4 h-4 mr-2 fill-current" />
                        Stop Animation
                    </Button>
                )}

                <Button onClick={handleEvaluate} disabled={evaluating} className="shadow-lg">
                    {evaluating ? (
                        <>Processing...</>
                    ) : (
                        <>
                            <Play className="w-4 h-4 mr-2 fill-current" />
                            Evaluate Design
                        </>
                    )}
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
                className="bg-[rgb(var(--color-bg-tertiary))]"
            >
                <Background color="rgb(var(--color-border))" gap={16} />
                <Controls showInteractive={false} className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-app-sm rounded-lg overflow-hidden" />
                <MiniMap position="top-right" className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-app-sm rounded-lg overflow-hidden" zoomable pannable />
            </ReactFlow>
        </div>
    );
};
