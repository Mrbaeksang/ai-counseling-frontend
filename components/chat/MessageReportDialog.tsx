import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, RadioButton, Text, TextInput } from 'react-native-paper';
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
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>메시지 신고</Dialog.Title>
        <Dialog.Content>
          {messagePreview ? (
            <Text variant="bodyMedium" style={styles.preview}>
              {`“${messagePreview}”`}
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
          />
        </Dialog.Content>
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
    </Portal>
  );
};

const styles = StyleSheet.create({
  preview: {
    marginBottom: spacing.sm,
  },
  radioItem: {
    paddingHorizontal: 0,
  },
  input: {
    marginTop: spacing.sm,
  },
});
