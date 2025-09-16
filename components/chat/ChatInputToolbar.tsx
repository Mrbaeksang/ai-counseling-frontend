import React from 'react';
import { StyleSheet } from 'react-native';
import { type IMessage, InputToolbar, type InputToolbarProps } from 'react-native-gifted-chat';
import { useTheme } from 'react-native-paper';

export const ChatInputToolbar = React.memo((props: InputToolbarProps<IMessage>) => {
  const theme = useTheme();

  return (
    <InputToolbar
      {...props}
      containerStyle={[
        styles.inputToolbar,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
        },
      ]}
    />
  );
});

const styles = StyleSheet.create({
  inputToolbar: {
    borderTopWidth: 1,
  },
});
