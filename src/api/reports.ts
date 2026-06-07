import { apiClient } from './client';
import type { PerformanceReport, BalanceReport } from '../types';

export const getPerformanceReport = (
  houseId: string,
  params?: { date_from?: string; date_to?: string }
) => apiClient.get<PerformanceReport>(`/houses/${houseId}/reports/performance`, { params });

export const getBalanceReport = (houseId: string) =>
  apiClient.get<BalanceReport>(`/houses/${houseId}/reports/balance`);
