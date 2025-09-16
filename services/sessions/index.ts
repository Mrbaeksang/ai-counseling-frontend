import api from '../api';
import type {
  MessageItem,
  PagedResponse,
  SendMessageResponse,
  Session,
  StartSessionResponse,
  ToggleBookmarkResponse,
} from './types';

// 새 세션 시작
export const startSession = async (counselorId: number): Promise<StartSessionResponse> => {
  const response = await api.post<StartSessionResponse>(`/sessions`, { counselorId });

  if (!response.data) {
    throw new Error('Failed to start session');
  }

  return response.data;
};

// 메시지 전송 (AI 응답 포함)
export const sendMessage = async (
  sessionId: number,
  content: string,
): Promise<SendMessageResponse> => {
  // AI 응답을 위해 더 긴 타임아웃 설정 (30초)
  const response = await api.post<SendMessageResponse>(
    `/sessions/${sessionId}/messages`,
    { content },
    { timeout: 30000 },
  );

  if (!response.data) {
    throw new Error('Failed to send message');
  }

  return response.data;
};

// 세션 메시지 목록 조회
export const getSessionMessages = async (
  sessionId: number,
  page = 0,
  size = 20,
): Promise<PagedResponse<MessageItem>> => {
  const response = await api.get<PagedResponse<MessageItem>>(`/sessions/${sessionId}/messages`, {
    params: { page, size },
  });

  if (!response.data) {
    throw new Error(`No messages found for session ${sessionId}`);
  }

  return response.data;
};

// 세션 목록 조회 (페이지네이션 및 북마크/종료 필터 지원)
export const getSessions = async (
  page = 1,
  size = 20,
  bookmarked?: boolean,
  isClosed?: boolean,
): Promise<PagedResponse<Session>> => {
  const response = await api.get<PagedResponse<Session>>('/sessions', {
    params: {
      page: page - 1, // 백엔드는 0부터 시작
      size,
      ...(bookmarked !== undefined && { bookmarked }),
      ...(isClosed !== undefined && { isClosed }),
    },
  });

  if (!response.data) {
    throw new Error('No data received from sessions list');
  }

  return response.data;
};

// 단일 세션 정보 조회 (세션 목록에서 특정 세션 찾기)
export const getSessionDetail = async (sessionId: number): Promise<Session | null> => {
  // 세션 목록에서 특정 세션 찾기 (북마크 상태 관계없이)
  const response = await api.get<PagedResponse<Session>>('/sessions', {
    params: { page: 0, size: 100 }, // 충분한 크기로 조회
  });

  if (!response.data || !response.data.content) {
    return null;
  }

  const sessions = response.data.content as Session[];
  return sessions.find((s) => s.sessionId === sessionId) || null;
};

// 세션 북마크 토글
export const toggleSessionBookmark = async (sessionId: number): Promise<ToggleBookmarkResponse> => {
  const response = await api.patch<ToggleBookmarkResponse>(`/sessions/${sessionId}/bookmark`);

  // 백엔드가 data를 반환하지 않을 수 있음
  return response.data || ({ isBookmarked: false } as ToggleBookmarkResponse);
};

// 세션 종료
export const endSession = async (sessionId: number): Promise<void> => {
  await api.delete(`/sessions/${sessionId}`);
};

// 세션 평가
export const rateSession = async (sessionId: number, rating: number, feedback?: string) => {
  const response = await api.post(`/sessions/${sessionId}/rate`, { rating, feedback });

  // 백엔드가 data: null 반환해도 성공 처리
  return response.data || { success: true };
};

// 세션 제목 업데이트
export const updateSessionTitle = async (sessionId: number, title: string) => {
  const response = await api.patch(`/sessions/${sessionId}/title`, { title });

  // 백엔드가 data: null 반환해도 성공 처리
  // resultCode가 S-1이면 성공
  return response.data || { success: true };
};
