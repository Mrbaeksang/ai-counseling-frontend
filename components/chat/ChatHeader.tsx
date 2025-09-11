import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { getCounselorImage } from '@/constants/counselorImages';
import { spacing } from '@/constants/theme';

interface ChatHeaderProps {
  title: string;
  counselorName?: string;
  counselorAvatar?: string;
  onTitleEdit: () => void;
  onBookmarkToggle: () => void;
  onEndSession: () => void;
  isBookmarked: boolean;
}

export const ChatHeader = React.memo(
  ({
    title,
    counselorName,
    counselorAvatar,
    onTitleEdit,
    onBookmarkToggle,
    onEndSession,
    isBookmarked,
  }: ChatHeaderProps) => {
    const avatarSource = counselorAvatar ? getCounselorImage(counselorAvatar) : null;

    return (
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <View style={styles.headerCenter}>
          <View style={styles.counselorInfo}>
            {avatarSource && <Image source={avatarSource} style={styles.avatar} />}
            <View style={styles.textContainer}>
              {counselorName && <Text style={styles.counselorName}>{counselorName} 상담사</Text>}
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {title || '새 대화'}
                </Text>
                <TouchableOpacity onPress={onTitleEdit} style={styles.editButton}>
                  <IconButton icon="pencil-outline" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <IconButton
            icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            onPress={onBookmarkToggle}
          />
          <IconButton icon="exit-to-app" size={24} onPress={onEndSession} />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  counselorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#6B46C1',
  },
  textContainer: {
    flex: 1,
  },
  counselorName: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#6B46C1',
    marginBottom: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#111827',
    maxWidth: '80%',
  },
  editButton: {
    marginLeft: -8,
  },
  headerActions: {
    flexDirection: 'row',
  },
});
