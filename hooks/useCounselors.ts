import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addFavorite,
  getCounselorDetail,
  getCounselors,
  getFavoriteCounselors,
  removeFavorite,
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
export const useFavoriteCounselors = (page = 1, size = 20) => {
  return useQuery({
    queryKey: ['favorites', page, size],
    queryFn: () => getFavoriteCounselors(page, size),
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000,
    retry: 1, // 인증 에러 시 재시도 최소화
  });
};

// 즐겨찾기 추가
export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (counselorId: number) => addFavorite(counselorId),
    onSuccess: (_, counselorId) => {
      // 즐겨찾기 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      // 해당 상담사 상세 정보 업데이트
      queryClient.setQueryData(['counselor', counselorId], (old: CounselorDetail | undefined) => {
        if (!old) return old;
        return { ...old, isFavorite: true };
      });
      toast.show('즐겨찾기에 추가되었습니다', 'success');
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          toast.show('로그인 후 이용해주세요', 'warning');
          return;
        }
      }
      toast.show('즐겨찾기 추가에 실패했습니다', 'error');
    },
  });
};

// 즐겨찾기 제거
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (counselorId: number) => removeFavorite(counselorId),
    onSuccess: (_, counselorId) => {
      // 즐겨찾기 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      // 해당 상담사 상세 정보 업데이트
      queryClient.setQueryData(['counselor', counselorId], (old: CounselorDetail | undefined) => {
        if (!old) return old;
        return { ...old, isFavorite: false };
      });
      toast.show('즐겨찾기에서 제거되었습니다', 'info');
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          toast.show('로그인 후 이용해주세요', 'warning');
          return;
        }
      }
      toast.show('즐겨찾기 제거에 실패했습니다', 'error');
    },
  });
};

// 즐겨찾기 토글
export const useToggleFavorite = () => {
  const addMutation = useAddFavorite();
  const removeMutation = useRemoveFavorite();

  const toggle = (counselorId: number, isFavorite: boolean) => {
    if (isFavorite) {
      removeMutation.mutate(counselorId);
    } else {
      addMutation.mutate(counselorId);
    }
  };

  return {
    toggle,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
};
