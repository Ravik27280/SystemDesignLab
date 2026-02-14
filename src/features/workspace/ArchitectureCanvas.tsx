import React, { useCallback, useState } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    type Connection,
    type Edge,
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
    const [evaluationError, setEvaluationError] = useState('');

    // Sync with store
    React.useEffect(() => {
        setNodes(nodes as any);
        setEdges(edges as any);
    }, [nodes, edges, setNodes, setEdges]);

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
        setEvaluationError('');

        try {
            const result = await evaluationApi.evaluateDesign({
                problemId: currentProblem.id,
                nodes: nodes as any,
                edges: edges as any,
            });

            // Feedback will display in FeedbackPanel via store
            console.log('Evaluation result:', result);
            alert('Design evaluated! Check the Feedback panel on the right.');
        } catch (err: any) {
            setEvaluationError(err.message || 'Failed to evaluate design');
            alert('Failed to evaluate design: ' + (err.message || 'Unknown error'));
        } finally {
            setEvaluating(false);
        }
    };

    return (
        <div className="h-full w-full relative bg-[rgb(var(--color-bg))]">
            {/* Toolbar */}
            <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap max-w-md">
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => addNode('loadBalancer', 'Load Balancer')}
                >
                    + Load Balancer
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => addNode('webServer', 'Web Server')}
                >
                    + Web Server
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => addNode('apiService', 'API Service')}
                >
                    + API Service
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => addNode('database', 'Database')}
                >
                    + Database
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => addNode('cache', 'Cache')}
                >
                    + Cache
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => addNode('objectStorage', 'Object Storage')}
                >
                    + Object Storage
                </Button>
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
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};
