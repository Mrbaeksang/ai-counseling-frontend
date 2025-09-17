import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// Premium Color Palette
export const colors = {
  // Primary - Premium Purple Gradient
  primary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Accent - Sunset Orange
  accent: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Semantic Colors
  success: {
    light: '#10B981',
    main: '#059669',
    dark: '#047857',
  },
  error: {
    light: '#F87171',
    main: '#EF4444',
    dark: '#DC2626',
  },
  warning: {
    light: '#FCD34D',
    main: '#F59E0B',
    dark: '#D97706',
  },
  info: {
    light: '#60A5FA',
    main: '#3B82F6',
    dark: '#2563EB',
  },

  // Neutral - Premium Grays
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    1000: '#000000',
  },

  // Glass Effect Colors
  glass: {
    white: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(0, 0, 0, 0.1)',
    blur: 'rgba(255, 255, 255, 0.7)',
  },

  // Gradients
  gradients: {
    primary: ['#8B5CF6', '#EC4899'],
    sunset: ['#F97316', '#EC4899'],
    night: ['#6366F1', '#8B5CF6'],
    aurora: ['#10B981', '#3B82F6'],
    premium: ['#FFD700', '#FFA500', '#FF6347'],
  },

  // Brand Colors
  brand: {
    google: '#4285F4',
    googleRed: '#EA4335',
    kakao: '#FEE500',
    kakaoText: '#3C1E1E',
    naver: '#03C75A',
    facebook: '#1877F2',
    apple: '#000000',
  },
};

// Typography Scale
export const typography = {
  // Display
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '700' as const,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },

  // Headline
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },

  // Title
  titleLarge: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500' as const,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
  },

  // Body
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },

  // Label
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
};

// Spacing System (8pt grid)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border Radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

// Shadows (Premium depth)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  premium: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Animation Configs
export const animations = {
  quick: 200,
  normal: 300,
  slow: 500,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  bounce: {
    damping: 10,
    stiffness: 100,
    mass: 0.8,
  },
};

// Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary[600],
    primaryContainer: colors.primary[100],
    secondary: colors.accent[500],
    secondaryContainer: colors.accent[100],
    tertiary: colors.primary[700],
    tertiaryContainer: colors.primary[200],
    surface: colors.neutral[0],
    surfaceVariant: colors.neutral[50],
    surfaceDisabled: colors.neutral[200],
    background: colors.neutral[50],
    error: colors.error.main,
    errorContainer: '#FEE2E2',
    onPrimary: colors.neutral[0],
    onPrimaryContainer: colors.primary[900],
    onSecondary: colors.neutral[0],
    onSecondaryContainer: colors.accent[900],
    onTertiary: colors.neutral[0],
    onTertiaryContainer: colors.primary[900],
    onSurface: colors.neutral[900],
    onSurfaceVariant: colors.neutral[600],
    onSurfaceDisabled: colors.neutral[400],
    onError: colors.neutral[0],
    onErrorContainer: colors.error.dark,
    onBackground: colors.neutral[900],
    outline: colors.neutral[300],
    outlineVariant: colors.neutral[200],
    inverseSurface: colors.neutral[900],
    inverseOnSurface: colors.neutral[0],
    inversePrimary: colors.primary[300],
    shadow: colors.neutral[900],
    scrim: colors.neutral[900],
    backdrop: 'rgba(0, 0, 0, 0.4)',
    elevation: {
      level0: 'transparent',
      level1: colors.neutral[0],
      level2: colors.neutral[0],
      level3: colors.neutral[0],
      level4: colors.neutral[0],
      level5: colors.neutral[0],
    },
  },
  roundness: 12,
};

// Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary[400],
    primaryContainer: colors.primary[800],
    secondary: colors.accent[400],
    secondaryContainer: colors.accent[800],
    tertiary: colors.primary[300],
    tertiaryContainer: colors.primary[700],
    surface: '#1E1F25',
    surfaceVariant: '#2A2D36',
    surfaceDisabled: '#303440',
    background: '#121417',
    error: colors.error.light,
    errorContainer: colors.error.dark,
    onPrimary: colors.primary[900],
    onPrimaryContainer: colors.primary[100],
    onSecondary: colors.accent[900],
    onSecondaryContainer: colors.accent[100],
    onTertiary: colors.primary[900],
    onTertiaryContainer: colors.primary[100],
    onSurface: '#F4F4F5',
    onSurfaceVariant: '#A1A1AA',
    onSurfaceDisabled: '#6B7280',
    onError: colors.error.dark,
    onErrorContainer: colors.error.light,
    onBackground: '#F4F4F5',
    outline: '#3F4451',
    outlineVariant: '#2D3039',
    inverseSurface: '#F4F4F5',
    inverseOnSurface: '#111318',
    inversePrimary: colors.primary[600],
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.55)',
    elevation: {
      level0: 'transparent',
      level1: '#1E1F25',
      level2: '#252830',
      level3: '#2A2D36',
      level4: '#2F323C',
      level5: '#333641',
    },
  },
  roundness: 12,
};

export default lightTheme;
