import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  endSession,
  rateSession,
  toggleSessionBookmark,
  updateSessionTitle,
} from '@/services/sessions';
import type { Session } from '@/services/sessions/types';
import { useToast } from '@/store/toastStore';

interface UseSessionActionsProps {
  sessionId: number;
  sessionInfo: Session | null;
  counselorId?: number;
}

export const useSessionActions = ({
  sessionId,
  sessionInfo,
  counselorId,
}: UseSessionActionsProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Dialog states
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showTitleDialog, setShowTitleDialog] = useState(false);

  // Rating states
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  // Title state
  const [newTitle, setNewTitle] = useState('');

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: () => toggleSessionBookmark(sessionId),
    onSuccess: (data) => {
      toast.show(
        data.isBookmarked ? '북마크에 추가되었습니다' : '북마크가 해제되었습니다',
        'success',
      );
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: () => {
      toast.show('북마크 처리에 실패했습니다', 'error');
    },
  });

  // End session mutation
  const endSessionMutation = useMutation({
    mutationFn: () => endSession(sessionId),
    onSuccess: () => {
      setShowEndDialog(false);
      setShowRatingDialog(true);

      // 세션 목록 캐시 즉시 무효화
      queryClient.invalidateQueries({ queryKey: ['sessions'] });

      // 특히 진행중/종료됨 탭 갱신
      queryClient.invalidateQueries({
        queryKey: ['sessions', 1, 20, undefined, false], // 진행중
      });
      queryClient.invalidateQueries({
        queryKey: ['sessions', 1, 20, undefined, true], // 종료됨
      });
    },
    onError: () => {
      toast.show('세션 종료에 실패했습니다', 'error');
      setShowEndDialog(false);
    },
  });

  // Rate session mutation
  const rateMutation = useMutation({
    mutationFn: () => {
      const backendRating = Math.round(rating * 2); // Convert 0.5-5 to 1-10
      return rateSession(sessionId, backendRating, feedback);
    },
    onSuccess: () => {
      toast.show('평가가 완료되었습니다', 'success');
      setShowRatingDialog(false);

      // Invalidate queries for immediate update
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      if (counselorId) {
        queryClient.invalidateQueries({ queryKey: ['counselor', counselorId] });
        queryClient.invalidateQueries({ queryKey: ['counselors'] });
      }

      router.back();
    },
    onError: () => {
      toast.show('평가 제출에 실패했습니다', 'error');
    },
  });

  // Update title mutation
  const updateTitleMutation = useMutation({
    mutationFn: (title: string) => updateSessionTitle(sessionId, title),
    onSuccess: () => {
      toast.show('제목이 변경되었습니다', 'success');
      setShowTitleDialog(false);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: () => {
      toast.show('제목 변경에 실패했습니다', 'error');
    },
  });

  const handleBookmarkToggle = useCallback(() => {
    bookmarkMutation.mutate();
  }, [bookmarkMutation]);

  const handleEndSession = useCallback(() => {
    setShowEndDialog(true);
  }, []);

  const confirmEndSession = useCallback(() => {
    endSessionMutation.mutate();
  }, [endSessionMutation]);

  const handleRatingSubmit = useCallback(() => {
    if (rating === 0) {
      toast.show('별점을 선택해주세요', 'error');
      return;
    }
    rateMutation.mutate();
  }, [rating, rateMutation, toast]);

  const handleTitleEdit = useCallback(
    (currentTitle?: string) => {
      setNewTitle((prevTitle) => {
        if (sessionInfo?.title) {
          return sessionInfo.title;
        }
        if (currentTitle?.trim()) {
          return currentTitle;
        }
        return prevTitle || '새 상담';
      });
      setShowTitleDialog(true);
    },
    [sessionInfo?.title],
  );

  const handleTitleUpdate = useCallback(() => {
    if (!newTitle.trim()) {
      toast.show('제목을 입력해주세요', 'error');
      return;
    }
    updateTitleMutation.mutate(newTitle);
  }, [newTitle, updateTitleMutation, toast]);

  return {
    // States
    showEndDialog,
    showRatingDialog,
    showTitleDialog,
    rating,
    feedback,
    newTitle,

    // Setters
    setShowEndDialog,
    setShowRatingDialog,
    setShowTitleDialog,
    setRating,
    setFeedback,
    setNewTitle,

    // Handlers
    handleBookmarkToggle,
    handleEndSession,
    confirmEndSession,
    handleRatingSubmit,
    handleTitleEdit,
    handleTitleUpdate,

    // Loading states
    isBookmarking: bookmarkMutation.isPending,
    isEndingSession: endSessionMutation.isPending,
    isSubmittingRating: rateMutation.isPending,
    isUpdatingTitle: updateTitleMutation.isPending,
  };
};
