import apiClient from './client';
import type { FlowNode, FlowEdge, FeedbackResult } from '../types';

export interface EvaluationRequest {
    problemId: string;
    nodes: FlowNode[];
    edges: FlowEdge[];
}

export interface EvaluationResponse {
    success: boolean;
    data: {
        evaluation: FeedbackResult;
    };
    message: string;
}

/**
 * Evaluate a design using AI (currently mock responses from backend)
 */
export const evaluateDesign = async (data: EvaluationRequest): Promise<FeedbackResult> => {
    const response = await apiClient.post<EvaluationResponse>('/evaluate', data);
    return response.data.data.evaluation;
};
