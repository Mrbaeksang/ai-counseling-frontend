// 세션 목록 아이템
export interface Session {
  id: number;
  counselorId: number;
  counselorName: string;
  messageCount: number;
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
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

// 세션 시작 응답
export interface StartSessionResponse {
  id: number;
  counselorId: number;
  createdAt: string;
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
