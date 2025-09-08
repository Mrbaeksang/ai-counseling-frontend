import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

interface User {
  userId: number;
  email: string;
  nickname: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (response: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  nickname: string;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (response: AuthResponse) => {
    const { accessToken, refreshToken, userId, email, nickname } = response;
    
    // AsyncStorage에 토큰 저장
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
      ['user', JSON.stringify({ userId, email, nickname })],
    ]);

    // 스토어 업데이트
    set({
      user: { userId, email, nickname },
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    // AsyncStorage에서 모든 인증 정보 삭제
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    
    // 스토어 초기화
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  loadStoredAuth: async () => {
    try {
      const [[, accessToken], [, refreshToken], [, userStr]] = await AsyncStorage.multiGet([
        'accessToken',
        'refreshToken',
        'user',
      ]);

      if (accessToken && refreshToken && userStr) {
        const user = JSON.parse(userStr);
        
        // 토큰 유효성 검증 (옵션)
        // TODO: /api/auth/verify 엔드포인트 호출하여 토큰 검증
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      set({ isLoading: false });
    }
  },

  updateUser: (updatedUser: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      
      const newUser = { ...state.user, ...updatedUser };
      
      // AsyncStorage도 업데이트
      AsyncStorage.setItem('user', JSON.stringify(newUser));
      
      return { user: newUser };
    });
  },
}));

export default useAuthStore;