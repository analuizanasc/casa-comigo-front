import { apiClient } from './client';
import type { Assignment, DistributionResult, ReassignConfirmation } from '../types';

export const distribute = (
  houseId: string,
  data: { period_start: string; period_end: string; period_label?: string }
) => apiClient.post<DistributionResult>(`/houses/${houseId}/schedule/distribute`, data);

export const getSchedule = (
  houseId: string,
  params?: { date_from?: string; date_to?: string; assigned_to?: string }
) => apiClient.get<Assignment[]>(`/houses/${houseId}/schedule`, { params });

export const getAssignment = (houseId: string, assignmentId: string) =>
  apiClient.get<Assignment>(`/houses/${houseId}/schedule/${assignmentId}`);

export const reassignTask = (
  houseId: string,
  assignmentId: string,
  data: { assigned_to: string; force?: boolean; move_group?: boolean }
) =>
  apiClient.put<(Assignment & { warning?: string }) | ReassignConfirmation>(
    `/houses/${houseId}/schedule/${assignmentId}/reassign`,
    data
  );

export const completeTask = (houseId: string, assignmentId: string, completion_notes?: string) =>
  apiClient.patch<Assignment>(`/houses/${houseId}/schedule/${assignmentId}/complete`, {
    completion_notes,
  });

export const reportImpediment = (houseId: string, assignmentId: string) =>
  apiClient.patch<{ message: string; new_assignment: Assignment }>(
    `/houses/${houseId}/schedule/${assignmentId}/impediment`
  );
