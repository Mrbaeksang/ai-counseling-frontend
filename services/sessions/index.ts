import api from '../api';
import type {
  MessageItem,
  PageResponse,
  SendMessageResponse,
  Session,
  StartSessionResponse,
  ToggleBookmarkResponse,
} from './types';

// 새 세션 시작
export const startSession = async (counselorId: number): Promise<StartSessionResponse> => {
  const response = await api.post(`/sessions`, { counselorId });
  return response.data;
};

// 메시지 전송 (AI 응답 포함)
export const sendMessage = async (
  sessionId: number,
  content: string,
): Promise<SendMessageResponse> => {
  const response = await api.post(`/sessions/${sessionId}/messages`, { content });
  return response.data;
};

// 세션 메시지 목록 조회
export const getSessionMessages = async (
  sessionId: number,
  page = 0,
  size = 20,
): Promise<PageResponse<MessageItem>> => {
  const response = await api.get(`/sessions/${sessionId}/messages`, {
    params: { page, size },
  });
  return response.data;
};

// 세션 목록 조회 (페이지네이션 지원)
export const getSessions = async (page = 1, size = 20): Promise<PageResponse<Session>> => {
  const response = await api.get('/sessions', {
    params: { page: page - 1, size }, // 백엔드는 0부터 시작
  });
  return response.data;
};

// 단일 세션 정보 조회 (세션 목록에서 특정 세션 찾기)
export const getSessionDetail = async (sessionId: number): Promise<Session | null> => {
  // 세션 목록에서 특정 세션 찾기 (북마크 상태 관계없이)
  const response = await api.get('/sessions', {
    params: { page: 0, size: 100 }, // 충분한 크기로 조회
  });

  const sessions = response.data.content as Session[];
  return sessions.find((s) => s.sessionId === sessionId) || null;
};

// 세션 북마크 토글
export const toggleSessionBookmark = async (sessionId: number): Promise<ToggleBookmarkResponse> => {
  const response = await api.patch(`/sessions/${sessionId}/bookmark`);
  return response.data;
};

// 세션 종료
export const endSession = async (sessionId: number): Promise<void> => {
  await api.delete(`/sessions/${sessionId}`);
};

// 세션 평가
export const rateSession = async (sessionId: number, rating: number, feedback?: string) => {
  const response = await api.post(`/sessions/${sessionId}/rate`, { rating, feedback });
  return response.data;
};

// 세션 제목 업데이트
export const updateSessionTitle = async (sessionId: number, title: string) => {
  const response = await api.patch(`/sessions/${sessionId}/title`, { title });
  return response.data;
};
