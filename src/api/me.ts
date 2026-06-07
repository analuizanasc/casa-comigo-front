import { apiClient } from './client';
import type { OnboardingStatus } from '../types';

export const getOnboarding = () =>
  apiClient.get<OnboardingStatus>('/me/onboarding');

export const advanceOnboarding = () =>
  apiClient.patch<OnboardingStatus>('/me/onboarding');
