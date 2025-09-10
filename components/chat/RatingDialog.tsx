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
    const renderStars = () => {
      const stars = [];

      for (let i = 1; i <= 5; i++) {
        const isFullFilled = selectedRating >= i;
        const isHalfFilled = selectedRating === i - 0.5;

        stars.push(
          <View key={i} style={styles.starWrapper}>
            {/* 빈 별 (배경) */}
            <Text style={[styles.starBase, styles.starEmpty]}>★</Text>

            {/* 채워진 부분 (오버레이) */}
            <View style={styles.starOverlay}>
              {/* 왼쪽 반개 */}
              <TouchableOpacity
                style={styles.halfStarTouchLeft}
                onPress={() => onRatingSelect(i - 0.5)}
                activeOpacity={0.7}
              >
                {(isHalfFilled || isFullFilled) && (
                  <View style={styles.halfStarLeftFill}>
                    <Text style={[styles.star, styles.starFilled]}>★</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* 오른쪽 반개 */}
              <TouchableOpacity
                style={styles.halfStarTouchRight}
                onPress={() => onRatingSelect(i)}
                activeOpacity={0.7}
              >
                {isFullFilled && (
                  <View style={styles.halfStarRightFill}>
                    <Text style={[styles.star, styles.starFilled, styles.starRightAlign]}>★</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>,
        );
      }

      return stars;
    };

    const getRatingText = () => {
      if (selectedRating === 0) return '별점을 선택해주세요';
      if (selectedRating <= 1) return '아쉬웠어요';
      if (selectedRating <= 2) return '별로였어요';
      if (selectedRating <= 3) return '보통이었어요';
      if (selectedRating <= 4) return '좋았어요';
      return '최고였어요!';
    };

    return (
      <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
          <Dialog.Title>상담은 어떠셨나요?</Dialog.Title>
          <Dialog.Content>
            <View style={styles.starsContainer}>{renderStars()}</View>

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
        </Dialog>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm, // 터치 영역 확보
  },
  starWrapper: {
    position: 'relative',
    width: 48,
    height: 48,
    marginHorizontal: spacing.xs / 2,
  },
  starBase: {
    position: 'absolute',
    fontSize: 48,
    width: 48,
    textAlign: 'center',
    lineHeight: 48,
  },
  starOverlay: {
    position: 'absolute',
    flexDirection: 'row',
    width: 48,
    height: 48,
  },
  halfStarTouchLeft: {
    width: 24,
    height: 48,
  },
  halfStarTouchRight: {
    width: 24,
    height: 48,
  },
  halfStarLeftFill: {
    position: 'absolute',
    width: 24,
    height: 48,
    overflow: 'hidden',
  },
  halfStarRightFill: {
    position: 'absolute',
    width: 24,
    height: 48,
    overflow: 'hidden',
  },
  star: {
    fontSize: 48,
    width: 48,
    textAlign: 'center',
    lineHeight: 48,
  },
  starRightAlign: {
    marginLeft: -24,
  },
  starEmpty: {
    color: '#E5E7EB',
  },
  starFilled: {
    color: '#F59E0B',
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
