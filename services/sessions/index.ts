import api from '../api';

// 새 세션 시작
export const startSession = async (counselorId: number) => {
  const response = await api.post(`/sessions/start`, { counselorId });
  return response.data;
};

// 메시지 전송
export const sendMessage = async (sessionId: number, content: string) => {
  const response = await api.post(`/sessions/${sessionId}/messages`, { content });
  return response.data;
};

// 세션 목록 조회
export const getSessions = async () => {
  const response = await api.get('/sessions');
  return response.data;
};

// 특정 세션 조회
export const getSession = async (sessionId: number) => {
  const response = await api.get(`/sessions/${sessionId}`);
  return response.data;
};

// 세션 종료
export const endSession = async (sessionId: number) => {
  const response = await api.post(`/sessions/${sessionId}/end`);
  return response.data;
};
