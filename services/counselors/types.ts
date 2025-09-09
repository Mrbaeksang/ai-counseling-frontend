// 상담사 목록 응답 타입 (백엔드 CounselorListResponse)
export interface Counselor {
  id: number;
  name: string;
  title: string;
  avatarUrl?: string;
  averageRating: number;
  totalSessions: number;
  description?: string; // 목록에서는 없을 수 있음
  categories?: string; // 카테고리 (콤마로 구분된 문자열)
}

// 상담사 상세 응답 타입
export interface CounselorDetail extends Counselor {
  description: string;
  basePrompt: string;
  isFavorite?: boolean;
  totalSessions: number;
  averageRating: number;
  totalRatings: number; // 평가 수
  recentFeedback?: string[];
}

// 즐겨찾기 상담사 응답 타입 (백엔드 FavoriteCounselorResponse)
export interface FavoriteCounselor {
  id: number;
  name: string;
  title: string;
  avatarUrl?: string;
  averageRating: number;
}

// 세션 평가 타입
export interface CounselorRating {
  id: number;
  counselorId: number;
  sessionId: number;
  userId: number;
  rating: number;
  feedback?: string;
  createdAt: string;
}

// 페이지 정보 타입
export interface PageInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

// API 응답 타입
export interface PagedResponse<T> {
  content: T[];
  pageInfo: PageInfo;
}

export type CounselorsResponse = PagedResponse<Counselor>;
export type FavoritesResponse = PagedResponse<FavoriteCounselor>;
