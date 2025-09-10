// 세션 목록 아이템 (백엔드 SessionListResponse와 일치)
export interface Session {
  sessionId: number;
  counselorId: number;
  title: string;
  counselorName: string;
  lastMessageAt: string;
  isBookmarked: boolean;
  avatarUrl?: string;
}

// 세션 상세
export interface SessionDetail extends Session {
  messages: Message[];
  counselorTitle?: string;
  counselorAvatarUrl?: string;
}

// 메시지
export interface Message {
  id: number;
  sessionId: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

// 메시지 전송 요청
export interface SendMessageRequest {
  content: string;
}

// 메시지 전송 응답
export interface SendMessageResponse {
  userMessage: string;
  aiMessage: string;
  sessionTitle?: string;
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

// 페이지네이션 응답
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
