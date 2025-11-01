import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import MobileAds from 'react-native-google-mobile-ads';
import { configureFonts, PaperProvider } from 'react-native-paper';
import Toast from '@/components/common/Toast';
import { darkTheme, lightTheme } from '@/constants/theme';
import { useAuthCacheManager } from '@/hooks/useAuthCacheManager';
import { initializeAds } from '@/services/ads';
import useThemeStore from '@/store/themeStore';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Pretendard 폰트 설정
const fontConfig = {
  bodyLarge: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  headlineLarge: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  titleLarge: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  displayLarge: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 57,
    fontWeight: '700' as const,
    letterSpacing: -0.25,
    lineHeight: 64,
  },
};

const AuthCacheEffect = () => {
  useAuthCacheManager();
  return null;
};

export default function RootLayout() {
  const { isDark, loadStoredTheme } = useThemeStore();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5분 (hooks에서 사용하는 기본값)
            gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
            retry: 1,
            refetchOnWindowFocus: false, // 포커스 시 자동 refetch 비활성화
          },
        },
      }),
  );

  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('@/assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('@/assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('@/assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('@/assets/fonts/Pretendard-Bold.otf'),
  });

  // 저장된 테마 불러오기
  useEffect(() => {
    loadStoredTheme();
  }, [loadStoredTheme]);

  // AdMob SDK 초기화
  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => {
        initializeAds();
      })
      .catch((_error) => {
        // 에러 발생 시 무시 (프로덕션)
      });
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // 폰트 설정이 포함된 테마 선택
  const theme = isDark
    ? {
        ...darkTheme,
        fonts: configureFonts({ config: fontConfig }),
      }
    : {
        ...lightTheme,
        fonts: configureFonts({ config: fontConfig }),
      };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthCacheEffect />
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.onPrimary,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontFamily: 'Pretendard-Bold',
            },
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="characters/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="session/[id]" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </PaperProvider>
    </QueryClientProvider>
  );
}
