import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <Dialog.ScrollArea style={styles.scrollArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Dialog.Title>대화은 어떠셨나요?</Dialog.Title>
              <View style={styles.dialogContent}>
                <View style={styles.starsContainer}>
                  <StarRating rating={selectedRating} onRatingChange={onRatingSelect} />
                </View>

                <Text style={styles.ratingText}>{getRatingText()}</Text>

                <TextInput
                  label="대화에 대한 의견 (선택사항)"
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  value={feedback}
                  onChangeText={onFeedbackChange}
                  style={styles.feedbackInput}
                  placeholder="어떤 점이 좋았는지, 개선할 점은 무엇인지 알려주세요"
                  outlineColor="#E5E7EB"
                  activeOutlineColor="#6B46C1"
                  autoCorrect={false}
                  autoComplete="off"
                  autoCapitalize="none"
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions style={styles.actions}>
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
        </KeyboardAvoidingView>
      </BlurredDialog>
    );
  },
);

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollArea: {
    paddingHorizontal: 0,
    maxHeight: 350,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.md,
  },
  dialogContent: {
    paddingHorizontal: spacing.lg,
  },
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
    paddingVertical: spacing.xs,
    minHeight: 24,
  },
  feedbackInput: {
    marginTop: spacing.sm,
    backgroundColor: '#FFFFFF',
    minHeight: 80,
  },
  actions: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});
