const config = {
  name: '마인드톡',
  slug: 'mindtalk',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  scheme: 'mindtalk',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.mindtalk.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.mindtalk.app',
    versionCode: 9,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '2.0.0',
        },
      },
    ],
    [
      '@react-native-seoul/kakao-login',
      {
        kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_APP_KEY || '3f2780313ff60baebc2ca422250a417a',
        iosUrlScheme: `kakao${process.env.EXPO_PUBLIC_KAKAO_APP_KEY || '3f2780313ff60baebc2ca422250a417a'}`,
      },
    ],
  ],
  extra: {
    router: {},
    eas: {
      projectId: '6dac6037-b59d-4bb0-975f-d1e97ffc4361',
    },
    apiUrl: process.env.EXPO_PUBLIC_API_BASE_URL
      ? `${process.env.EXPO_PUBLIC_API_BASE_URL}/api`
      : 'https://ai-counseling-backend-production.up.railway.app/api',
    isReviewMode: process.env.EXPO_PUBLIC_REVIEW_MODE === 'true',
  },
};

export default config;
