import * as Linking from 'expo-linking';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, spacing } from '@/constants/theme';

export const FooterSection = React.memo(() => {
  const openTerms = useCallback(async () => {
    try {
      await Linking.openURL('https://mrbaeksang.github.io/dr-mind-legal/terms-of-service.html');
    } catch (_error) {
      // 에러 처리는 조용히 함 (로그인 화면에서는 토스트 없이)
    }
  }, []);

  const openPrivacy = useCallback(async () => {
    try {
      await Linking.openURL('https://mrbaeksang.github.io/dr-mind-legal/privacy-policy.html');
    } catch (_error) {
      // 에러 처리는 조용히 함 (로그인 화면에서는 토스트 없이)
    }
  }, []);

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        계속 진행 시
        <TouchableOpacity onPress={openTerms}>
          <Text style={styles.footerLink}>서비스 이용약관</Text>
        </TouchableOpacity>{' '}
        및{'\n'}
        <TouchableOpacity onPress={openPrivacy}>
          <Text style={styles.footerLink}>개인정보처리방침</Text>
        </TouchableOpacity>
        에 동의하게 됩니다
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xl,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#1F2937',
    fontFamily: 'Pretendard-SemiBold',
    textDecorationLine: 'underline',
  },
});
