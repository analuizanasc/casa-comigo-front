import { apiClient } from './client';
import type { AuthResponse, User } from '../types';

export const register = (name: string, email: string, password: string) =>
  apiClient.post<{ message: string; user: User }>('/auth/register', { name, email, password });

export const login = (email: string, password: string) =>
  apiClient.post<AuthResponse>('/auth/login', { email, password });
