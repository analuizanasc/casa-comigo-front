import { apiClient } from './client';
import type { Task, TaskDetail, EffortLevel, Frequency, FrequencyUnit } from '../types';

export const listTasks = (houseId: string) =>
  apiClient.get<Task[]>(`/houses/${houseId}/catalog`);

export const createTask = (houseId: string, data: {
  name: string;
  description?: string;
  frequency?: Frequency;
  frequency_count?: number;
  frequency_unit?: FrequencyUnit;
  duration_minutes?: number;
  effort_level: EffortLevel;
  room?: string;
}) => apiClient.post<TaskDetail>(`/houses/${houseId}/catalog`, data);

export const getTask = (houseId: string, taskId: string) =>
  apiClient.get<TaskDetail>(`/houses/${houseId}/catalog/${taskId}`);

export const updateTask = (houseId: string, taskId: string, data: {
  name: string;
  description?: string;
  frequency?: Frequency;
  frequency_count?: number;
  frequency_unit?: FrequencyUnit;
  duration_minutes?: number;
  effort_level: EffortLevel;
  room?: string;
}) => apiClient.put<TaskDetail>(`/houses/${houseId}/catalog/${taskId}`, data);

export const deleteTask = (houseId: string, taskId: string) =>
  apiClient.delete<{ message: string }>(`/houses/${houseId}/catalog/${taskId}`);

export const addDependency = (houseId: string, taskId: string, depends_on_task_id: string) =>
  apiClient.post<{ message: string }>(`/houses/${houseId}/catalog/${taskId}/dependencies`, {
    depends_on_task_id,
  });

export const removeDependency = (houseId: string, taskId: string, dependsOnId: string) =>
  apiClient.delete<{ message: string }>(
    `/houses/${houseId}/catalog/${taskId}/dependencies/${dependsOnId}`
  );
