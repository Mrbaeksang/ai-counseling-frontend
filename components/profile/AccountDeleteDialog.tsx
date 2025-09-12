import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

interface AccountDeleteDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => Promise<void>;
}

export const AccountDeleteDialog = React.memo(
  ({ visible, onDismiss, onConfirm }: AccountDeleteDialogProps) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = useCallback(async () => {
      setLoading(true);
      try {
        await onConfirm();
      } catch (error: unknown) {
        // 에러는 상위에서 처리
        console.error('Account deletion error:', error);
      } finally {
        setLoading(false);
      }
    }, [onConfirm]);

    const styles = StyleSheet.create({
      dialogContent: {
        paddingHorizontal: 20,
      },
      warningText: {
        color: '#DC2626',
        marginBottom: 8,
        fontWeight: '600',
      },
      warningList: {
        color: '#7F1D1D',
        marginLeft: 8,
        marginBottom: 12,
        lineHeight: 24,
      },
      finalWarning: {
        color: '#EF4444',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 16,
      },
      actions: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 8,
      },
      button: {
        minWidth: 100,
      },
      deleteButton: {
        borderColor: '#FCA5A5', // 연한 빨간색 테두리
        minWidth: 100,
      },
    });

    return (
      <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
          <Dialog.Title>회원 탈퇴</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <Text style={styles.warningText}>
              ⚠️ 주의: 회원 탈퇴 시 다음 데이터가 모두 삭제됩니다:
            </Text>

            <Text style={styles.warningList}>
              • 모든 상담 내역{'\n'}• 상담사와의 대화 기록{'\n'}• 개인 설정 및 선호도{'\n'}•
              북마크한 세션들
            </Text>

            <Text style={styles.finalWarning}>⚠️ 이 작업은 되돌릴 수 없습니다!</Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.actions}>
            <Button
              onPress={onDismiss}
              disabled={loading}
              mode="contained"
              buttonColor="#6B46C1"
              compact
              style={styles.button}
            >
              아니요
            </Button>
            <Button
              onPress={handleConfirm}
              loading={loading}
              disabled={loading}
              mode="outlined"
              textColor="#DC2626"
              compact
              style={styles.deleteButton}
            >
              탈퇴하기
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  },
);
