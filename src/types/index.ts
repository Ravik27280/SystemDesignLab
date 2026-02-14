// Global type definitions for SystemDesignLab

export interface User {
    id: string;
    name: string;
    email: string;
    plan: 'free' | 'pro';
    avatar?: string;
}

export interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    requirements: string[];
    estimatedTime: string;
    category: string;
}

export interface Design {
    id: string;
    problemId: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    nodes: FlowNode[];
    edges: FlowEdge[];
    feedback?: FeedbackResult;
}

export interface FlowNode {
    id: string;
    type?: string; // Optional to match React Flow's Node type
    position: { x: number; y: number };
    data: NodeData;
}

export interface NodeData {
    label?: string; // Optional for React Flow compatibility
    nodeType?: string;
    config?: NodeConfig;
    [key: string]: unknown; // Index signature for React Flow compatibility
}

export interface NodeConfig {
    replicationFactor?: number;
    storage?: string;
    caching?: boolean;
    [key: string]: string | number | boolean | undefined;
}

export interface FlowEdge {
    id: string;
    source: string;
    target: string;
    type?: string;
}

export interface FeedbackResult {
    score: number;
    strengths: string[];
    warnings: string[];
    errors: string[];
    suggestions: string[];
}

export type Theme = 'light' | 'dark';
