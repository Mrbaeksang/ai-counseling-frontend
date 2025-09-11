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
      if (!lastPage || !lastPage.pageInfo) return undefined;

      // 마지막 페이지인지 확인
      if (lastPage.pageInfo.isLast) return undefined;

      // 빈 페이지인 경우도 체크
      if (!lastPage.content || lastPage.content.length === 0) return undefined;

      // 다음 페이지 번호 반환 (백엔드는 1부터 시작하는 API를 기대)
      // currentPage는 0-based이므로 +2를 해서 다음 페이지 번호를 만듦
      const currentPage = lastPage.pageInfo.currentPage;
      return currentPage + 2; // 0-based currentPage를 1-based API 페이지로 변환
    },
    initialPageParam: 1, // 백엔드 API는 1부터 시작
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
