import { apiClient } from './client';
import type { Invitation } from '../types';

export const listInvitations = () =>
  apiClient.get<Invitation[]>('/invitations');

export const acceptInvitation = (id: string) =>
  apiClient.post<{ message: string; house_id: string; house_name: string; role: string }>(
    `/invitations/${id}/accept`
  );

export const rejectInvitation = (id: string) =>
  apiClient.post<{ message: string }>(`/invitations/${id}/reject`);
