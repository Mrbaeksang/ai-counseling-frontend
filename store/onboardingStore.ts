import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  isLoading: boolean;

  // Actions
  completeOnboarding: () => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const ONBOARDING_KEY = 'hasSeenOnboarding';

const useOnboardingStore = create<OnboardingState>((set) => ({
  hasSeenOnboarding: false,
  isLoading: true,

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    set({ hasSeenOnboarding: true });
  },

  checkOnboardingStatus: async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
      set({
        hasSeenOnboarding: hasSeenOnboarding === 'true',
        isLoading: false,
      });
    } catch (_error: unknown) {
      set({ isLoading: false });
    }
  },

  resetOnboarding: async () => {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    set({ hasSeenOnboarding: false });
  },
}));

export default useOnboardingStore;
