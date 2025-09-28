import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface User {
  userId: number;
  email: string;
  nickname: string;
  name?: string; // nickname 별칭
  profileImageUrl?: string; // 사용자 프로필 이미지
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
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl?: string;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (response: AuthResponse) => {
    const { accessToken, refreshToken, userId, email, nickname, profileImageUrl } = response;

    const user = { userId, email, nickname, profileImageUrl };

    // AsyncStorage에 토큰 저장
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
      ['user', JSON.stringify(user)],
    ]);

    // 스토어 업데이트
    set({
      user,
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
      const items = await AsyncStorage.multiGet(['accessToken', 'refreshToken', 'user']);

      const findItem = (key: string) => items.find((item) => item[0] === key)?.[1] ?? null;

      const accessToken = findItem('accessToken');
      const refreshToken = findItem('refreshToken');
      const userStr = findItem('user');

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
    } catch {
      // 에러 발생 시 로딩 상태만 업데이트
      set({ isLoading: false });
    }
  },

  updateUser: (updatedUser: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;

      const newUser = { ...state.user, ...updatedUser };

      // AsyncStorage도 업데이트 (비동기 에러 처리)
      AsyncStorage.setItem('user', JSON.stringify(newUser)).catch(() => {
        // 로컬 저장 실패 시에도 앱은 계속 동작
        // 프로덕션에서는 에러 모니터링 서비스로 전송
      });

      return { user: newUser };
    });
  },

  setTokens: async (accessToken: string, refreshToken: string) => {
    // AsyncStorage에 토큰 저장
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
    ]);

    // 스토어 업데이트
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },
}));

export default useAuthStore;
