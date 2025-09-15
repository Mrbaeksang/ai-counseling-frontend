import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing } from '@/constants/theme';

interface SessionTabsProps {
  tabIndex: string;
  onTabChange: (index: string) => void;
}

export const SessionTabs = React.memo(({ tabIndex, onTabChange }: SessionTabsProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleSection}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="clipboard-text-multiple" size={20} color="#6B46C1" />
        </View>
        <View>
          <Text style={styles.title}>상담내역</Text>
          <Text style={styles.subtitle}>최근 상담 기록을 확인하세요</Text>
        </View>
      </View>

      <View style={styles.chipsWrapper}>
        <View style={styles.chipsContainer}>
          <Pressable
            style={[styles.chip, tabIndex === '0' && styles.chipActive]}
            onPress={() => onTabChange('0')}
            accessibilityRole="tab"
          >
            <MaterialCommunityIcons
              name="chat-processing"
              size={14}
              color={tabIndex === '0' ? '#FFFFFF' : '#6B7280'}
            />
            <Text style={[styles.chipText, tabIndex === '0' && styles.chipTextActive]}>진행중</Text>
          </Pressable>

          <Pressable
            style={[styles.chip, tabIndex === '1' && styles.chipActive]}
            onPress={() => onTabChange('1')}
            accessibilityRole="tab"
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={14}
              color={tabIndex === '1' ? '#FFFFFF' : '#6B7280'}
            />
            <Text style={[styles.chipText, tabIndex === '1' && styles.chipTextActive]}>종료됨</Text>
          </Pressable>

          <Pressable
            style={[styles.chip, tabIndex === '2' && styles.chipActive]}
            onPress={() => onTabChange('2')}
            accessibilityRole="tab"
          >
            <MaterialCommunityIcons
              name="star"
              size={14}
              color={tabIndex === '2' ? '#FFFFFF' : '#6B7280'}
            />
            <Text style={[styles.chipText, tabIndex === '2' && styles.chipTextActive]}>북마크</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  chipsWrapper: {
    marginLeft: -spacing.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#6B46C1',
    borderColor: '#6B46C1',
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
