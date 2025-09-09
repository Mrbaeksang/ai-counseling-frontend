import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, spacing } from '@/constants/theme';

export const FooterSection = React.memo(() => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        계속 진행 시<Text style={styles.footerLink}>서비스 이용약관</Text> 및{'\n'}
        <Text style={styles.footerLink}>개인정보처리방침</Text>에 동의하게 됩니다
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
