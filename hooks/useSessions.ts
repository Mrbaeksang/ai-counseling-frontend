import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/common/Toast';
import { deleteSession, getSessionDetail, getSessions } from '@/services/sessions';

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

  return useMutation({
    mutationFn: (sessionId: number) => deleteSession(sessionId),
    onSuccess: () => {
      // 세션 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('상담 기록이 삭제되었습니다');
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          toast.warning('로그인 후 이용해주세요');
          return;
        }
      }
      toast.error('삭제에 실패했습니다');
    },
  });
};
