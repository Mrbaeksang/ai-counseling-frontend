import { useInfiniteQuery } from '@tanstack/react-query';
import { getCounselors } from '@/services/counselors';
import type { Counselor, PageResponse } from '@/services/counselors/types';

export const useInfiniteCounselors = (
  size = 20,
  sort: 'recent' | 'popular' | 'rating' = 'popular',
) => {
  return useInfiniteQuery<PageResponse<Counselor>>({
    queryKey: ['counselors', 'infinite', size, sort],
    queryFn: ({ pageParam = 1 }) => getCounselors(pageParam as number, size, sort),
    getNextPageParam: (lastPage) => {
      // 백엔드 페이지네이션 정보 활용
      if (!lastPage || lastPage.last) return undefined;
      // number가 undefined인 경우 체크
      const currentPage = lastPage.number ?? 0;
      return currentPage + 2; // 백엔드는 0부터 시작, API 호출은 1부터
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
