import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { spacing } from '@/constants/theme';

interface TitleEditDialogProps {
  visible: boolean;
  title: string;
  onTitleChange: (text: string) => void;
  onSave: () => void;
  onDismiss: () => void;
  isSaving?: boolean;
}

export const TitleEditDialog = React.memo(
  ({
    visible,
    title,
    onTitleChange,
    onSave,
    onDismiss,
    isSaving = false,
  }: TitleEditDialogProps) => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
          <Dialog.Title>대화 제목 수정</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="제목"
              mode="outlined"
              value={title}
              onChangeText={onTitleChange}
              autoFocus
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismiss}>취소</Button>
            <Button
              onPress={onSave}
              mode="contained"
              disabled={!title.trim() || isSaving}
              loading={isSaving}
            >
              저장
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    marginBottom: spacing.sm,
  },
});
