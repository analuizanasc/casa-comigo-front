import { apiClient } from './client';
import type { Preference, PreferenceLevel } from '../types';

export const listPreferences = (houseId: string) =>
  apiClient.get<Preference[]>(`/houses/${houseId}/preferences`);

export const setPreference = (
  houseId: string,
  taskId: string,
  data: { preference_level: PreferenceLevel; has_physical_limitation?: boolean }
) => apiClient.put(`/houses/${houseId}/preferences/${taskId}`, data);

export const getMemberPreferences = (houseId: string, userId: string) =>
  apiClient.get(`/houses/${houseId}/preferences/member/${userId}`);
