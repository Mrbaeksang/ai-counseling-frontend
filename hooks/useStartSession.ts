import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startSession } from '@/services/sessions';
import type { CreateSessionRequest, StartSessionResponse } from '@/services/sessions/types';
import { useToast } from '@/store/toastStore';

export const useStartSession = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation<StartSessionResponse, Error, CreateSessionRequest>({
    mutationFn: ({ counselorId }) => startSession(counselorId),
    onSuccess: () => {
      // 세션 목록 캐시 무효화 - 모든 세션 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ['sessions'] });

      // 특히 진행중 세션 목록 즉시 갱신
      queryClient.invalidateQueries({
        queryKey: ['sessions', 1, 20, undefined, false],
      });
    },
    onError: (_error) => {
      toast.show('세션 시작에 실패했습니다', 'error');
    },
  });
};
