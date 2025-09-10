import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { spacing } from '@/constants/theme';

interface ChatHeaderProps {
  title: string;
  onTitleEdit: () => void;
  onBookmarkToggle: () => void;
  onEndSession: () => void;
  isBookmarked: boolean;
}

export const ChatHeader = React.memo(
  ({ title, onTitleEdit, onBookmarkToggle, onEndSession, isBookmarked }: ChatHeaderProps) => {
    return (
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <View style={styles.headerCenter}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title || '새 대화'}
            </Text>
            <TouchableOpacity onPress={onTitleEdit} style={styles.editButton}>
              <IconButton icon="pencil-outline" size={16} />
            </TouchableOpacity>
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
    paddingVertical: spacing.sm,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: spacing.sm,
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
