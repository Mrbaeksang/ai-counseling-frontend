import api from '../api';
import type {
  CounselorDetailResponse,
  CounselorListResponse,
  FavoriteCounselorResponse,
  PageResponse,
} from './types';

// 상담사 목록 조회
export const getCounselors = async (
  page = 1, // 백엔드 API는 1부터 시작
  size = 20,
  sort = 'popular',
): Promise<PageResponse<CounselorListResponse>> => {
  const response = await api.get<PageResponse<CounselorListResponse>>('/counselors', {
    params: { page, size, sort },
  });

  if (!response.data) {
    throw new Error('No counselors data received');
  }

  return response.data;
};

// 상담사 상세 정보 조회
export const getCounselorDetail = async (counselorId: number): Promise<CounselorDetailResponse> => {
  const response = await api.get<CounselorDetailResponse>(`/counselors/${counselorId}`);

  if (!response.data) {
    throw new Error(`No data received for counselor ${counselorId}`);
  }

  return response.data;
};

// 즐겨찾기 상담사 목록 조회
export const getFavoriteCounselors = async (): Promise<FavoriteCounselorResponse[]> => {
  try {
    const response =
      await api.get<PageResponse<FavoriteCounselorResponse>>('/counselors/favorites');

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

// 상담사 즐겨찾기 토글
export const toggleCounselorFavorite = async (
  counselorId: number,
  isFavorite: boolean,
): Promise<void> => {
  if (isFavorite) {
    // 이미 즐겨찾기한 경우 DELETE로 제거
    await api.delete(`/counselors/${counselorId}/favorite`);
  } else {
    // 즐겨찾기하지 않은 경우 POST로 추가
    await api.post(`/counselors/${counselorId}/favorite`);
  }
};
