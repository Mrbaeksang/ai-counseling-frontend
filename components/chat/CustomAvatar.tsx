import React from 'react';
import { Image, type ImageSourcePropType, StyleSheet } from 'react-native';
import type { IMessage } from 'react-native-gifted-chat';

interface CustomAvatarProps {
  currentMessage?: IMessage;
}

export const CustomAvatar = React.memo(({ currentMessage }: CustomAvatarProps) => {
  if (currentMessage?.user?._id === 2) {
    const avatarSource = currentMessage.user.avatar as ImageSourcePropType | undefined;
    if (avatarSource) {
      return <Image source={avatarSource} style={styles.avatar} />;
    }
  }
  return null;
});

const styles = StyleSheet.create({
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#6B46C1',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
