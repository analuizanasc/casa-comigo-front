import { apiClient } from './client';
import type { AppNotification } from '../types';

export const listNotifications = () =>
  apiClient.get<AppNotification[]>('/notifications');

export const markAllRead = () =>
  apiClient.patch<{ message: string }>('/notifications/read-all');

export const markRead = (id: string) =>
  apiClient.patch<{ message: string }>(`/notifications/${id}/read`);
