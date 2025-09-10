import api from '../api';
import type {
  CounselorDetailResponse,
  CounselorListResponse,
  FavoriteCounselorResponse,
  PageResponse,
} from './types';

// 상담사 목록 조회 (백엔드는 페이지가 1부터 시작)
export const getCounselors = async (
  page = 1,
  size = 20,
  sort = 'popular',
): Promise<PageResponse<CounselorListResponse>> => {
  const response = await api.get('/counselors', {
    params: { page, size, sort },
  });
  return response.data;
};

// 상담사 상세 조회
export const getCounselorDetail = async (id: number): Promise<CounselorDetailResponse> => {
  const response = await api.get(`/counselors/${id}`);
  return response.data;
};

// 즐겨찾기 목록 조회 (백엔드는 페이지가 1부터 시작)
export const getFavoriteCounselors = async (
  page = 1,
  size = 20,
): Promise<PageResponse<FavoriteCounselorResponse>> => {
  const response = await api.get('/counselors/favorites', {
    params: { page, size },
  });
  return response.data;
};

// 즐겨찾기 추가
export const addFavorite = async (counselorId: number): Promise<void> => {
  await api.post(`/counselors/${counselorId}/favorite`);
  // 백엔드가 문자열만 반환하므로 void로 처리
};

// 즐겨찾기 제거
export const removeFavorite = async (counselorId: number): Promise<void> => {
  await api.delete(`/counselors/${counselorId}/favorite`);
  // 백엔드가 문자열만 반환하므로 void로 처리
};
