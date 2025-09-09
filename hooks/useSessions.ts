import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteSession, getSessionDetail, getSessions } from '@/services/sessions';
import { useToast } from '@/store/toastStore';

// 세션 목록 조회
export const useSessions = (page = 1, size = 20) => {
  return useQuery({
    queryKey: ['sessions', page, size],
    queryFn: () => getSessions(page, size),
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000,
  });
};

// 세션 상세 조회
export const useSessionDetail = (id: number) => {
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => getSessionDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 세션 삭제
export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (sessionId: number) => deleteSession(sessionId),
    onSuccess: () => {
      // 세션 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.show('상담 기록이 삭제되었습니다', 'success');
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          toast.show('로그인 후 이용해주세요', 'warning');
          return;
        }
      }
      toast.show('삭제에 실패했습니다', 'error');
    },
  });
};
