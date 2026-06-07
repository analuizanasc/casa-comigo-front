import { apiClient } from './client';
import type { House, HouseSummary } from '../types';

export const createHouse = (name: string) =>
  apiClient.post<House>('/houses', { name });

export const getMyHouses = () =>
  apiClient.get<HouseSummary[]>('/houses/me');

export const joinHouse = (invite_code: string) =>
  apiClient.post<House>('/houses/join', { invite_code });

export const getHouse = (houseId: string) =>
  apiClient.get<House>(`/houses/${houseId}`);

export const updateTolerance = (houseId: string, tolerance_percentage: number) =>
  apiClient.patch<{ message: string }>(`/houses/${houseId}/tolerance`, { tolerance_percentage });
