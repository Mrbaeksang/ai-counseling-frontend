import api from '../api';
import type {
  CounselorDetailResponse,
  CounselorListResponse,
  FavoriteCounselorResponse,
  PageResponse,
} from './types';

// 상담사 목록 조회
export const getCounselors = async (
  page = 1,
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
  const response = await api.get<FavoriteCounselorResponse[]>('/counselors/favorites');

  if (!response.data) {
    // 즐겨찾기가 없을 수도 있으므로 빈 배열 반환
    return [];
  }

  return response.data;
};

// 상담사 즐겨찾기 토글
export const toggleCounselorFavorite = async (counselorId: number): Promise<void> => {
  await api.post(`/counselors/${counselorId}/favorite`);
};
