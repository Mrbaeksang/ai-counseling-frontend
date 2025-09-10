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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
});
