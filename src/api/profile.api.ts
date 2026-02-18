import apiClient from './client';
import type { User } from '../types';

interface UpdateProfileRequest {
    name: string;
}

export interface UserStats {
    designsCount: number;
    problemsSolved: number;
    averageScore: number;
}

export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<{ success: boolean; data: User }>('/auth/profile', data);
    return response.data.data;
};

export const upgradeToPro = async (): Promise<User> => {
    const response = await apiClient.post<{ success: boolean; data: User }>('/auth/upgrade');
    return response.data.data;
};

export const getUserStats = async (): Promise<UserStats> => {
    const response = await apiClient.get<{ success: boolean; data: UserStats }>('/auth/stats');
    return response.data.data;
};
