// 페이지 정보 (백엔드 PageInfo와 일치)
export interface PageInfo {
  currentPage: number; // 0-based
  totalPages: number;
  pageSize: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

// 페이지네이션 응답 (백엔드 PagedResponse와 일치)
export interface PageResponse<T> {
  content: T[];
  pageInfo: PageInfo;
}

// AI 캐릭터 목록 응답 (백엔드 characterListResponse와 일치)
export interface CharacterListResponse {
  id: number;
  name: string;
  title: string;
  avatarUrl?: string;
  averageRating: number; // 1-10
  totalSessions: number;
  categories?: string; // 카테고리 (콤마로 구분된 문자열)
  isFavorite: boolean; // 즐겨찾기 여부
}

// AI 캐릭터 상세 응답 (백엔드 CharacterDetailResponse와 일치)
export interface CharacterDetailResponse {
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

// 즐겨찾기 AI 캐릭터 응답 (백엔드 FavoriteCharacterResponse와 일치)
export interface FavoriteCharacterResponse {
  id: number;
  name: string;
  title: string;
  avatarUrl?: string;
  averageRating: number; // 1-10
}

// 별칭 타입 (하위 호환성 유지)
export type Character = CharacterListResponse;
export type CharacterDetail = CharacterDetailResponse;
export type FavoriteCharacter = FavoriteCharacterResponse;
