import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Text, TextInput } from 'react-native-paper';
import { BlurredDialog } from '@/components/common/BlurredDialog';
import { StarRating } from '@/components/common/StarRating';
import { spacing } from '@/constants/theme';

interface RatingDialogProps {
  visible: boolean;
  selectedRating: number;
  feedback: string;
  onRatingSelect: (rating: number) => void;
  onFeedbackChange: (text: string) => void;
  onSubmit: () => void;
  onDismiss: () => void;
  isSubmitting?: boolean;
}

export const RatingDialog = React.memo(
  ({
    visible,
    selectedRating,
    feedback,
    onRatingSelect,
    onFeedbackChange,
    onSubmit,
    onDismiss,
    isSubmitting = false,
  }: RatingDialogProps) => {
    const getRatingText = () => {
      if (selectedRating === 0) return '별점을 선택해주세요';
      if (selectedRating <= 1) return '아쉬웠어요';
      if (selectedRating <= 2) return '별로였어요';
      if (selectedRating <= 3) return '보통이었어요';
      if (selectedRating <= 4) return '좋았어요';
      return '최고였어요!';
    };

    return (
      <BlurredDialog visible={visible} onDismiss={onDismiss} intensity={90} tint="dark">
        <Dialog.Title>상담은 어떠셨나요?</Dialog.Title>
        <Dialog.Content>
          <View style={styles.starsContainer}>
            <StarRating rating={selectedRating} onRatingChange={onRatingSelect} />
          </View>

          <Text style={styles.ratingText}>{getRatingText()}</Text>

          <TextInput
            label="상담에 대한 의견 (선택사항)"
            mode="outlined"
            multiline
            numberOfLines={3}
            value={feedback}
            onChangeText={onFeedbackChange}
            style={styles.feedbackInput}
            placeholder="어떤 점이 좋았는지, 개선할 점은 무엇인지 알려주세요"
            outlineColor="#E5E7EB"
            activeOutlineColor="#6B46C1"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor="#6B7280">
            나중에
          </Button>
          <Button
            onPress={onSubmit}
            mode="contained"
            disabled={isSubmitting}
            loading={isSubmitting}
            buttonColor="#6B46C1"
          >
            평가 완료
          </Button>
        </Dialog.Actions>
      </BlurredDialog>
    );
  },
);

const styles = StyleSheet.create({
  starsContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Pretendard-Medium',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    paddingVertical: spacing.xs, // 텍스트 잘림 방지
    minHeight: 24, // 최소 높이 보장
  },
  feedbackInput: {
    marginTop: spacing.sm,
    backgroundColor: '#FFFFFF',
  },
});
