import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCounselorDetail,
  getCounselors,
  getFavoriteCounselors,
  toggleCounselorFavorite,
} from '@/services/counselors';
import type { CounselorDetail } from '@/services/counselors/types';
import { useToast } from '@/store/toastStore';

// 상담사 목록 조회
export const useCounselors = (page = 1, size = 20, sort = 'popular') => {
  return useQuery({
    queryKey: ['counselors', page, size, sort],
    queryFn: () => getCounselors(page, size, sort),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
  });
};

// 상담사 상세 조회
export const useCounselorDetail = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['counselor', id],
    queryFn: () => getCounselorDetail(id),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 즐겨찾기 목록 조회
export const useFavoriteCounselors = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => getFavoriteCounselors(),
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000,
    retry: 1, // 인증 에러 시 재시도 최소화
  });
};

// 즐겨찾기 토글 (단일 함수로 통합)
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ counselorId, isFavorite }: { counselorId: number; isFavorite: boolean }) =>
      toggleCounselorFavorite(counselorId, isFavorite),
    onSuccess: (_, { counselorId, isFavorite }) => {
      // 즐겨찾기 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      // 상담사 목록 새로고침 (isFavorite 상태 반영)
      queryClient.invalidateQueries({ queryKey: ['counselors'] });
      // 해당 상담사 상세 정보 업데이트
      queryClient.setQueryData(['counselor', counselorId], (old: CounselorDetail | undefined) => {
        if (!old) return old;
        return { ...old, isFavorite: !isFavorite };
      });
      toast.show(
        isFavorite ? '즐겨찾기에서 제거되었습니다' : '즐겨찾기에 추가되었습니다',
        'success',
      );
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          toast.show('로그인 후 이용해주세요', 'warning');
          return;
        }
      }
      toast.show('즐겨찾기 처리에 실패했습니다', 'error');
    },
  });
};
