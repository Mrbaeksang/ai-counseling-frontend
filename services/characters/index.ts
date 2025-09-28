import api from '../api';
import type {
  CharacterDetailResponse,
  CharacterListResponse,
  FavoriteCharacterResponse,
  PageResponse,
} from './types';

// AI 캐릭터 목록 조회
export const getCharacters = async (
  page = 1, // 백엔드 API는 1부터 시작
  size = 40, // 더 많은 캐릭터 표시
  sort = 'recent', // 기본값을 최신순으로 변경
): Promise<PageResponse<CharacterListResponse>> => {
  const response = await api.get<PageResponse<CharacterListResponse>>('/characters', {
    params: { page, size, sort },
  });

  if (!response.data) {
    throw new Error('No characters data received');
  }

  return response.data;
};

// AI 캐릭터 상세 정보 조회
export const getCharacterDetail = async (characterId: number): Promise<CharacterDetailResponse> => {
  const response = await api.get<CharacterDetailResponse>(`/characters/${characterId}`);

  if (!response.data) {
    throw new Error(`No data received for character ${characterId}`);
  }

  return response.data;
};

// 즐겨찾기 AI 캐릭터 목록 조회
export const getFavoriteCharacters = async (): Promise<FavoriteCharacterResponse[]> => {
  try {
    const response =
      await api.get<PageResponse<FavoriteCharacterResponse>>('/characters/favorites');

    // PagedResponse의 content 필드에서 데이터 추출
    if (!response.data || !response.data.content) {
      return [];
    }

    return response.data.content;
  } catch (error: unknown) {
    // 401 에러는 로그인 필요, 그 외는 빈 배열 반환
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 401) {
        // 인증 에러는 빈 배열 반환 (로그인 전 상태)
        return [];
      }
    }
    // 기타 에러도 빈 배열 반환
    return [];
  }
};

// AI 캐릭터 즐겨찾기 토글
export const toggleCharacterFavorite = async (
  characterId: number,
  isFavorite: boolean,
): Promise<void> => {
  if (isFavorite) {
    // 이미 즐겨찾기한 경우 DELETE로 제거
    await api.delete(`/characters/${characterId}/favorite`);
  } else {
    // 즐겨찾기하지 않은 경우 POST로 추가
    await api.post(`/characters/${characterId}/favorite`);
  }
};
