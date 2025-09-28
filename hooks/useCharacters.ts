import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCharacterDetail,
  getCharacters,
  getFavoriteCharacters,
  toggleCharacterFavorite,
} from '@/services/characters';
import type {
  Character,
  CharacterDetail,
  FavoriteCharacter,
  PageResponse,
} from '@/services/characters/types';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/store/toastStore';

// AI 캐릭터 목록 조회
export const useCharacters = (page = 1, size = 40, sort = 'recent') => {
  return useQuery({
    queryKey: ['characters', page, size, sort],
    queryFn: () => getCharacters(page, size, sort),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
  });
};

// AI 캐릭터 상세 조회
export const useCharacterDetail = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacterDetail(id),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 즐겨찾기 목록 조회
export const useFavoriteCharacters = () => {
  const userId = useAuthStore((state) => state.user?.userId);
  const favoritesKey = ['favorites', userId ?? 'guest'] as const;

  return useQuery({
    queryKey: favoritesKey,
    queryFn: () => getFavoriteCharacters(),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000,
    retry: 1, // 인증 에러 시 재시도 최소화
  });
};

// 즐겨찾기 토글 (단일 함수로 통합)
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const userId = useAuthStore((state) => state.user?.userId);
  const favoritesKey = ['favorites', userId ?? 'guest'] as const;

  return useMutation({
    mutationFn: async ({
      characterId,
      isFavorite,
    }: {
      characterId: number;
      isFavorite: boolean;
    }) => {
      if (!userId) {
        throw new Error('AUTH_REQUIRED');
      }
      return toggleCharacterFavorite(characterId, isFavorite);
    },
    onSuccess: (_, { characterId, isFavorite }) => {
      let updatedCharacter: Character | undefined;

      // 무한 스크롤 데이터 업데이트
      queryClient.setQueriesData<InfiniteData<PageResponse<Character>>>(
        { queryKey: ['characters', 'infinite'] },
        (old) => {
          if (!old) return old;

          const pages = old.pages.map((page) => {
            if (!page?.content) return page;

            const content = page.content.map((character) => {
              if (character.id === characterId) {
                const next = { ...character, isFavorite: !isFavorite };
                updatedCharacter = next;
                return next;
              }
              return character;
            });

            return { ...page, content };
          });

          return { ...old, pages };
        },
      );

      // 일반 목록 캐시 업데이트
      queryClient.setQueriesData<PageResponse<Character>>({ queryKey: ['characters'] }, (old) => {
        if (!old?.content) return old;

        const content = old.content.map((character) =>
          character.id === characterId ? { ...character, isFavorite: !isFavorite } : character,
        );

        return { ...old, content };
      });

      // 캐릭터 상세 데이터 업데이트
      queryClient.setQueryData(['character', characterId], (old: CharacterDetail | undefined) => {
        if (!old) return old;
        return { ...old, isFavorite: !isFavorite };
      });

      // 즐겨찾기 목록 캐시 조정 (즉시 반영)
      queryClient.setQueryData<FavoriteCharacter[] | undefined>(favoritesKey, (old) => {
        if (!old) return old;

        if (isFavorite) {
          // 즐겨찾기 해제
          return old.filter((item) => item.id !== characterId);
        }

        if (!updatedCharacter) return old;
        if (old.some((item) => item.id === characterId)) return old;

        const { id, name, title, avatarUrl, averageRating } = updatedCharacter;
        const nextFavorite: FavoriteCharacter = { id, name, title, avatarUrl, averageRating };
        return [nextFavorite, ...old];
      });

      toast.show(
        isFavorite ? '즐겨찾기에서 제거되었습니다' : '즐겨찾기에 추가되었습니다',
        'success',
      );
    },
    onError: (error: unknown) => {
      if (error instanceof Error && error.message === 'AUTH_REQUIRED') {
        toast.show('로그인 후 이용해주세요', 'warning');
        return;
      }

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
