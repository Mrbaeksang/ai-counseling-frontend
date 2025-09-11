// 세션 목록 아이템 (백엔드 SessionListResponse와 일치)
export interface Session {
  sessionId: number;
  counselorId: number;
  title: string;
  counselorName: string;
  lastMessageAt: string;
  isBookmarked: boolean;
  avatarUrl?: string;
  closedAt?: string;
}

// 세션 시작 요청 (백엔드 CreateSessionRequest와 일치)
export interface CreateSessionRequest {
  counselorId: number;
}

// 메시지 전송 요청 (백엔드 SendMessageRequest와 일치)
export interface SendMessageRequest {
  content: string;
}

// 세션 제목 수정 요청 (백엔드 UpdateSessionTitleRequest와 일치)
export interface UpdateSessionTitleRequest {
  title: string;
}

// 세션 평가 요청 (백엔드 RateSessionRequest와 일치)
export interface RateSessionRequest {
  rating: number; // 1-10 (별 반개 단위)
  feedback?: string; // 선택적 피드백
}

// 메시지 전송 응답
export interface SendMessageResponse {
  userMessage: string;
  aiMessage: string;
  sessionTitle?: string;
  isSessionEnded?: boolean; // 세션 자동 종료 여부
}

// 메시지 목록 아이템 (백엔드 MessageItem과 일치)
export interface MessageItem {
  content: string;
  senderType: 'USER' | 'AI'; // 백엔드는 senderType 사용
}

// 세션 시작 응답 (백엔드 CreateSessionResponse와 일치)
export interface StartSessionResponse {
  sessionId: number;
  counselorId: number;
  counselorName: string;
  title: string;
  avatarUrl?: string;
}

// 북마크 토글 응답
export interface ToggleBookmarkResponse {
  sessionId: number;
  isBookmarked: boolean;
}

// 페이지 정보 (백엔드 PageInfo와 일치)
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

// 페이지네이션 응답 (백엔드 PagedResponse와 일치)
export interface PagedResponse<T> {
  content: T[];
  pageInfo: PageInfo;
}

// 기존 PageResponse는 호환성을 위해 유지 (deprecated)
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
