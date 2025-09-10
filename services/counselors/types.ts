// 상담사 목록 응답 (백엔드 CounselorListResponse와 일치)
export interface CounselorListResponse {
  id: number;
  name: string;
  title: string;
  avatarUrl?: string;
  averageRating: number; // 1-10
  totalSessions: number;
  categories?: string; // 카테고리 (콤마로 구분된 문자열)
  isFavorite: boolean; // 즐겨찾기 여부
}

// 상담사 상세 응답 (백엔드 CounselorDetailResponse와 일치)
export interface CounselorDetailResponse {
  id: number;
  name: string;
  title: string;
  avatarUrl?: string;
  averageRating: number; // 1-10
  totalSessions: number;
  description?: string;
  totalRatings: number;
  isFavorite: boolean;
  categories?: string; // 카테고리 (콤마로 구분된 문자열)
}

// 즐겨찾기 상담사 응답 (백엔드 FavoriteCounselorResponse와 일치)
export interface FavoriteCounselorResponse {
  id: number;
  name: string;
  title: string;
  avatarUrl?: string;
  averageRating: number; // 1-10
}

// 페이지네이션 응답 (sessions/types.ts의 PageResponse 재사용)
export type { PageResponse } from '../sessions/types';

// 별칭 타입 (하위 호환성 유지)
export type Counselor = CounselorListResponse;
export type CounselorDetail = CounselorDetailResponse;
export type FavoriteCounselor = FavoriteCounselorResponse;
