// 페이지네이션 응답
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 현재 페이지 번호 (0-based)
  size: number;
  first: boolean;
  last: boolean;
}

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

// 별칭 타입 (하위 호환성 유지)
export type Counselor = CounselorListResponse;
export type CounselorDetail = CounselorDetailResponse;
export type FavoriteCounselor = FavoriteCounselorResponse;
