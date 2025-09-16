import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  isLoading: boolean;

  // Actions
  setTheme: (mode: ThemeMode) => Promise<void>;
  loadStoredTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}

// 시스템 테마 감지
const getSystemTheme = (): boolean => {
  return Appearance.getColorScheme() === 'dark';
};

// 실제 다크 모드 상태 계산
const calculateIsDark = (mode: ThemeMode): boolean => {
  switch (mode) {
    case 'dark':
      return true;
    case 'light':
      return false;
    case 'system':
      return getSystemTheme();
    default:
      return false;
  }
};

const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  isDark: getSystemTheme(),
  isLoading: true,

  setTheme: async (mode: ThemeMode) => {
    const isDark = calculateIsDark(mode);

    // AsyncStorage에 저장
    await AsyncStorage.setItem('themeMode', mode);

    // 스토어 업데이트
    set({
      mode,
      isDark,
      isLoading: false,
    });
  },

  loadStoredTheme: async () => {
    try {
      const storedMode = await AsyncStorage.getItem('themeMode');
      const mode = (storedMode as ThemeMode) || 'system';
      const isDark = calculateIsDark(mode);

      set({
        mode,
        isDark,
        isLoading: false,
      });
    } catch {
      // 에러 발생 시 기본값 사용
      set({
        mode: 'system',
        isDark: getSystemTheme(),
        isLoading: false,
      });
    }
  },

  toggleTheme: async () => {
    const { mode } = get();
    let newMode: ThemeMode;

    // 라이트 → 다크 → 시스템 순환
    switch (mode) {
      case 'light':
        newMode = 'dark';
        break;
      case 'dark':
        newMode = 'system';
        break;
      case 'system':
        newMode = 'light';
        break;
      default:
        newMode = 'system';
    }

    await get().setTheme(newMode);
  },
}));

// 시스템 테마 변경 감지 - 리스너를 저장하여 cleanup 가능하게
let appearanceListener: { remove: () => void } | null = null;

const setupAppearanceListener = () => {
  // 기존 리스너 제거
  if (appearanceListener) {
    appearanceListener.remove();
  }

  // 새 리스너 등록
  appearanceListener = Appearance.addChangeListener(() => {
    const { mode, setTheme } = useThemeStore.getState();
    if (mode === 'system') {
      // 시스템 모드일 때만 자동 업데이트
      setTheme('system');
    }
  });
};

// 초기 설정
setupAppearanceListener();

// cleanup 함수 export
export const cleanupThemeListener = () => {
  if (appearanceListener) {
    appearanceListener.remove();
    appearanceListener = null;
  }
};

export default useThemeStore;
