import apiClient from './client';
import type { FeedbackResult } from '../types';

export interface EvaluationRequest {
    designId: string;
    problemId: string;
}

export interface EvaluationResponse {
    success: boolean;
    data: FeedbackResult;
    message: string;
}

/**
 * Evaluate a design using AI (currently mock responses from backend)
 */
export const evaluateDesign = async (data: EvaluationRequest): Promise<FeedbackResult> => {
    const response = await apiClient.post<EvaluationResponse>('/evaluate', data);
    return response.data.data;
};
