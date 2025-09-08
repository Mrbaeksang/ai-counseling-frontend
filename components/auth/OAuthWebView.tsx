import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, SafeAreaView, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import WebView, { type WebViewNavigation } from 'react-native-webview';
import { colors, spacing } from '@/constants/theme';
import authService from '@/services/authService';

interface OAuthWebViewProps {
  visible: boolean;
  onClose: () => void;
  provider: 'google' | 'kakao' | 'naver';
}

export const OAuthWebView = ({ visible, onClose, provider }: OAuthWebViewProps) => {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);

  // OAuth URL을 한 번만 생성하도록 useMemo 사용
  const oauthUrl = useMemo(() => {
    if (!visible) return '';

    // 모바일에서는 직접 Google OAuth URL 생성
    if (provider === 'google') {
      const clientId = '470745173996-2m81qutdnesqnqprc55n8cce7lrr7hm5.apps.googleusercontent.com';
      const redirectUri = encodeURIComponent('http://localhost:8080/login/oauth2/code/google');
      const scope = encodeURIComponent('openid profile email');
      const state = Math.random().toString(36).substring(7);

      const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=${scope}&` +
        `state=${state}`;
      return googleAuthUrl;
    }

    // 다른 provider는 기존 방식
    const baseUrl =
      Constants.expoConfig?.extra?.apiUrl?.replace('/api', '') || 'http://localhost:8080';
    const url = `${baseUrl}/oauth2/authorization/${provider}`;
    return url;
  }, [visible, provider]);

  // visible이 false면 아무것도 렌더링하지 않음
  if (!visible) {
    return null;
  }

  // 디버깅용: WebView 로드 상태 확인
  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = (syntheticEvent: { nativeEvent: { code?: number } }) => {
    const { nativeEvent } = syntheticEvent;

    // 에러 발생 시 대체 처리
    if (nativeEvent.code === -6 || nativeEvent.code === -8) {
      // 5초 후 재시도
      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.reload();
        }
      }, 5000);
    }
  };

  // WebView 네비게이션 변경 감지
  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState;

    // Google OAuth 콜백 처리 (localhost로 리다이렉트되는 경우)
    if (url.includes('localhost:8080/login/oauth2/code/google')) {
      // URL에서 authorization code 추출
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (code) {
        // 백엔드 IP로 콜백 URL 재구성
        const baseUrl =
          Constants.expoConfig?.extra?.apiUrl?.replace('/api', '') || 'http://localhost:8080';
        const backendCallback = `${baseUrl}/login/oauth2/code/google?code=${code}&state=${state}`;

        // 백엔드로 리다이렉트
        webViewRef.current?.injectJavaScript(`window.location.href = '${backendCallback}';`);
        return;
      }
    }

    // Expo 딥링크 콜백 처리
    if (url.includes('exp://') || url.includes('drmind://')) {
      // URL에서 토큰 추출
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');

      if (accessToken && refreshToken) {
        // 토큰 저장
        await authService.saveTokens(accessToken, refreshToken);

        // 모달 닫고 메인 화면으로 이동
        onClose();
        router.replace('/(tabs)');
      }
    }

    // 에러 처리
    if (url.includes('/oauth2/error')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const _errorMessage = urlParams.get('message');
      onClose();
    }
  };

  const getProviderName = () => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'kakao':
        return '카카오';
      case 'naver':
        return '네이버';
      default:
        return provider;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{getProviderName()} 로그인</Text>
          <IconButton icon="close" size={24} onPress={onClose} style={styles.closeButton} />
        </View>

        {/* WebView */}
        <WebView
          ref={webViewRef}
          source={{ uri: oauthUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          originWhitelist={['*']}
          mixedContentMode="compatibility"
          userAgent="Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
          style={styles.webView}
        />

        {/* 로딩 인디케이터 */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    position: 'absolute',
    right: spacing.sm,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
