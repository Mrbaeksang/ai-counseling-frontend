import React from 'react';
import { Dimensions, View } from 'react-native';
import { Bubble, type BubbleProps, type IMessage } from 'react-native-gifted-chat';
import { useTheme } from 'react-native-paper';

export const ChatBubble = React.memo((props: BubbleProps<IMessage>) => {
  const theme = useTheme();
  const { width } = Dimensions.get('window');
  // 상담원 아바타(48) + marginRight(10) + 좌우 패딩(32) = 90px
  const maxBubbleWidth = width - 90;

  return (
    <View style={{ marginBottom: 8 }}>
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: theme.colors.surfaceVariant,
            maxWidth: maxBubbleWidth,
          },
          right: {
            backgroundColor: theme.colors.primary,
          },
        }}
        textStyle={{
          left: {
            color: theme.colors.onSurface,
          },
          right: {
            color: theme.colors.onPrimary,
          },
        }}
      />
    </View>
  );
});
