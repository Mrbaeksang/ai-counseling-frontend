import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Bubble, type BubbleProps } from 'react-native-gifted-chat';
import { IconButton, useTheme } from 'react-native-paper';
import type { ChatMessage } from './types';

interface ChatBubbleProps extends BubbleProps<ChatMessage> {
  onPressAction?: (message: ChatMessage) => void;
}

export const ChatBubble = React.memo(({ onPressAction, ...props }: ChatBubbleProps) => {
  const theme = useTheme();
  const { width } = Dimensions.get('window');
  const maxBubbleWidth = width - 90;
  const isLeft = props.position === 'left';
  const currentMessage = props.currentMessage;
  const showActionButton = isLeft && !!onPressAction && !!currentMessage;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.bubbleContainer,
          { maxWidth: maxBubbleWidth, paddingRight: showActionButton ? 28 : 0 },
        ]}
      >
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
        {showActionButton ? (
          <IconButton
            icon="dots-vertical"
            size={16}
            style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
            iconColor={theme.colors.onSurfaceVariant}
            onPress={() => {
              if (currentMessage) {
                onPressAction(currentMessage);
              }
            }}
          />
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  bubbleContainer: {
    position: 'relative',
  },
  actionButton: {
    position: 'absolute',
    top: -10,
    right: -6,
    elevation: 0,
    width: 28,
    height: 28,
  },
});
