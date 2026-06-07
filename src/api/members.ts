import { apiClient } from './client';
import type { Member, Role, WeightsSummary } from '../types';

export const listMembers = (houseId: string) =>
  apiClient.get<Member[]>(`/houses/${houseId}/members`);

export const inviteMember = (houseId: string, email: string) =>
  apiClient.post(`/houses/${houseId}/members/invite`, { email });

export const getWeights = (houseId: string) =>
  apiClient.get<WeightsSummary>(`/houses/${houseId}/members/weights`);

export const updateRole = (houseId: string, userId: string, role: Role) =>
  apiClient.put<{ message: string }>(`/houses/${houseId}/members/${userId}/role`, { role });

export const updateWeight = (houseId: string, userId: string, weight_percentage: number) =>
  apiClient.put<{ message: string; total_weight: number; warning?: string }>(
    `/houses/${houseId}/members/${userId}/weight`,
    { weight_percentage }
  );

export const updateAvailability = (houseId: string, userId: string, weekly_availability_hours: number) =>
  apiClient.put<{ message: string }>(`/houses/${houseId}/members/${userId}/availability`, {
    weekly_availability_hours,
  });

export const removeMember = (houseId: string, userId: string) =>
  apiClient.delete<{ message: string }>(`/houses/${houseId}/members/${userId}`);
