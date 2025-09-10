import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';
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
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
          <Dialog.Title>상담은 어떠셨나요?</Dialog.Title>
          <Dialog.Content>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity key={rating} onPress={() => onRatingSelect(rating)}>
                  <Text style={[styles.star, selectedRating >= rating && styles.starSelected]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              label="피드백 (선택사항)"
              mode="outlined"
              multiline
              numberOfLines={3}
              value={feedback}
              onChangeText={onFeedbackChange}
              style={styles.feedbackInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismiss}>나중에</Button>
            <Button
              onPress={onSubmit}
              mode="contained"
              disabled={selectedRating === 0 || isSubmitting}
              loading={isSubmitting}
            >
              평가하기
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  star: {
    fontSize: 32,
    color: '#D1D5DB',
    marginHorizontal: spacing.xs,
  },
  starSelected: {
    color: '#F59E0B',
  },
  feedbackInput: {
    marginTop: spacing.md,
  },
});
