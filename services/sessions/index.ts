import api from '../api';
import type { PageResponse, Session, SessionDetail, StartSessionResponse } from './types';

// 새 세션 시작
export const startSession = async (counselorId: number): Promise<StartSessionResponse> => {
  const response = await api.post(`/sessions/start`, { counselorId });
  return response.data;
};

// 메시지 전송
export const sendMessage = async (sessionId: number, content: string) => {
  const response = await api.post(`/sessions/${sessionId}/messages`, { content });
  return response.data;
};

// 세션 목록 조회 (페이지네이션 지원)
export const getSessions = async (page = 1, size = 20): Promise<PageResponse<Session>> => {
  const response = await api.get('/sessions', {
    params: { page: page - 1, size }, // 백엔드는 0부터 시작
  });
  return response.data;
};

// 특정 세션 조회
export const getSession = async (sessionId: number) => {
  const response = await api.get(`/sessions/${sessionId}`);
  return response.data;
};

// 세션 상세 조회 (메시지 포함)
export const getSessionDetail = async (sessionId: number): Promise<SessionDetail> => {
  const response = await api.get(`/sessions/${sessionId}/detail`);
  return response.data;
};

// 세션 삭제
export const deleteSession = async (sessionId: number): Promise<void> => {
  await api.delete(`/sessions/${sessionId}`);
};

// 세션 종료
export const endSession = async (sessionId: number) => {
  const response = await api.post(`/sessions/${sessionId}/end`);
  return response.data;
};
