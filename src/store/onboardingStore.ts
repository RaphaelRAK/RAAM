/**
 * Store Zustand pour l'onboarding
 */

import { create } from 'zustand';
import { isOnboardingCompleted } from '@/services/onboarding';

interface OnboardingState {
  isCompleted: boolean;
  isLoading: boolean;
  checkOnboarding: () => Promise<void>;
  setCompleted: (completed: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isCompleted: false,
  isLoading: true,
  checkOnboarding: async () => {
    set({ isLoading: true });
    try {
      const completed = await isOnboardingCompleted();
      set({ isCompleted: completed, isLoading: false });
    } catch (error) {
      console.error('Error checking onboarding:', error);
      set({ isCompleted: false, isLoading: false });
    }
  },
  setCompleted: (completed: boolean) => {
    set({ isCompleted: completed });
  },
}));

