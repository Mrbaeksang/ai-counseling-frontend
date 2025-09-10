import api from '../api';
import type { AuthResponse, OAuthLoginRequest, RefreshTokenRequest } from './types';

// Google 로그인
export const loginWithGoogle = async (token: string): Promise<AuthResponse> => {
  const request: OAuthLoginRequest = { token };
  const response = await api.post('/auth/login/google', request);
  return response.data;
};

// Kakao 로그인
export const loginWithKakao = async (token: string): Promise<AuthResponse> => {
  const request: OAuthLoginRequest = { token };
  const response = await api.post('/auth/login/kakao', request);
  return response.data;
};

// Naver 로그인
export const loginWithNaver = async (token: string): Promise<AuthResponse> => {
  const request: OAuthLoginRequest = { token };
  const response = await api.post('/auth/login/naver', request);
  return response.data;
};

// 토큰 갱신
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const request: RefreshTokenRequest = { refreshToken };
  const response = await api.post('/auth/refresh', request);
  return response.data;
};
