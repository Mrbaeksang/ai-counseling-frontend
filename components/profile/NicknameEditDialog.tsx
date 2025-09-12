import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, HelperText, Portal, TextInput } from 'react-native-paper';

interface NicknameEditDialogProps {
  visible: boolean;
  currentNickname: string;
  onDismiss: () => void;
  onConfirm: (nickname: string) => Promise<void>;
}

export const NicknameEditDialog = React.memo(
  ({ visible, currentNickname, onDismiss, onConfirm }: NicknameEditDialogProps) => {
    const [nickname, setNickname] = useState(currentNickname);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateNickname = useCallback(
      (text: string): string => {
        if (text.length < 2) return '닉네임은 2자 이상이어야 합니다';
        if (text.length > 20) return '닉네임은 20자 이하여야 합니다';
        if (text === currentNickname) return '현재 닉네임과 동일합니다';
        return '';
      },
      [currentNickname],
    );

    const handleTextChange = useCallback(
      (text: string) => {
        setNickname(text);
        setError(validateNickname(text));
      },
      [validateNickname],
    );

    const handleConfirm = useCallback(async () => {
      const validationError = validateNickname(nickname);
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(true);
      try {
        await onConfirm(nickname);
        onDismiss();
      } catch (_err) {
        setError('닉네임 변경에 실패했습니다');
      } finally {
        setLoading(false);
      }
    }, [nickname, validateNickname, onConfirm, onDismiss]);

    const handleDismiss = useCallback(() => {
      setNickname(currentNickname);
      setError('');
      onDismiss();
    }, [currentNickname, onDismiss]);

    const styles = StyleSheet.create({
      dialogContent: {
        paddingHorizontal: 20,
      },
      input: {
        marginTop: 8,
      },
      actions: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 8,
      },
      button: {
        minWidth: 80,
      },
    });

    return (
      <Portal>
        <Dialog visible={visible} onDismiss={handleDismiss}>
          <Dialog.Title>닉네임 변경</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <TextInput
              label="새 닉네임"
              value={nickname}
              onChangeText={handleTextChange}
              mode="outlined"
              style={styles.input}
              maxLength={20}
              autoFocus
              error={!!error}
            />
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          </Dialog.Content>
          <Dialog.Actions style={styles.actions}>
            <Button onPress={handleDismiss} disabled={loading} compact style={styles.button}>
              취소
            </Button>
            <Button
              onPress={handleConfirm}
              loading={loading}
              disabled={!!error || loading}
              mode="contained"
              compact
              style={styles.button}
            >
              변경
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  },
);
