import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, RadioButton, Text, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/constants/theme';
import type { MessageReportReason, MessageReportRequest } from '@/services/sessions/types';

interface MessageReportDialogProps {
  visible: boolean;
  messagePreview?: string;
  onSubmit: (payload: MessageReportRequest) => void;
  onDismiss: () => void;
  isSubmitting?: boolean;
}

const reasonOptions: { label: string; value: MessageReportReason }[] = [
  { label: '괴롭힘 / 폭력', value: 'HARASSMENT' },
  { label: '자해 / 자살 조장', value: 'SELF_HARM' },
  { label: '혐오 표현', value: 'HATE_SPEECH' },
  { label: '허위 정보', value: 'MISINFORMATION' },
  { label: '스팸 / 광고', value: 'SPAM' },
  { label: '기타', value: 'OTHER' },
];

export const MessageReportDialog: React.FC<MessageReportDialogProps> = ({
  visible,
  messagePreview,
  onSubmit,
  onDismiss,
  isSubmitting = false,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedReason, setSelectedReason] = useState<MessageReportReason>('SPAM');
  const [detail, setDetail] = useState('');

  useEffect(() => {
    if (!visible) {
      setSelectedReason('SPAM');
      setDetail('');
    }
  }, [visible]);

  const trimmedDetail = useMemo(() => detail.trim(), [detail]);

  const handleSubmit = () => {
    if (!selectedReason) {
      return;
    }
    onSubmit({
      reasonCode: selectedReason,
      detail: trimmedDetail.length > 0 ? trimmedDetail : undefined,
    });
  };

  return (
    <Portal>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
            <Dialog.ScrollArea style={styles.scrollArea}>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Dialog.Title>메시지 신고</Dialog.Title>
                <View style={styles.dialogContent}>
                  {messagePreview ? (
                    <Text variant="bodyMedium" style={styles.preview} numberOfLines={3}>
                      {`"${messagePreview.slice(0, 100)}${
                        messagePreview.length > 100 ? '...' : ''
                      }"`}
                    </Text>
                  ) : null}

                  <RadioButton.Group
                    onValueChange={(value) => setSelectedReason(value as MessageReportReason)}
                    value={selectedReason}
                  >
                    {reasonOptions.map((option) => (
                      <RadioButton.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        position="leading"
                        style={styles.radioItem}
                        labelStyle={styles.radioLabel}
                      />
                    ))}
                  </RadioButton.Group>

                  <TextInput
                    label="추가 설명 (선택)"
                    mode="outlined"
                    value={detail}
                    onChangeText={setDetail}
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                    placeholder="신고 사유를 구체적으로 알려주세요"
                    autoCorrect={false}
                    autoComplete="off"
                  />
                </View>
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={onDismiss}>취소</Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={!selectedReason || isSubmitting}
                loading={isSubmitting}
              >
                신고하기
              </Button>
            </Dialog.Actions>
          </Dialog>
        </View>
      </KeyboardAvoidingView>
    </Portal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  dialog: {
    maxHeight: '80%',
    marginHorizontal: 0,
  },
  scrollArea: {
    paddingHorizontal: 0,
    maxHeight: 400,
  },
  scrollContent: {
    flexGrow: 1,
  },
  dialogContent: {
    paddingHorizontal: spacing.lg,
  },
  preview: {
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  radioItem: {
    paddingHorizontal: 0,
    paddingVertical: spacing.xs,
  },
  radioLabel: {
    fontSize: 14,
  },
  input: {
    marginTop: spacing.sm,
  },
});
