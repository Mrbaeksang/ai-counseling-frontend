import api from '../api';
import type { AuthResponse, OAuthLoginRequest, RefreshTokenRequest } from './types';

// Google 로그인
export const loginWithGoogle = async (token: string): Promise<AuthResponse> => {
  const request: OAuthLoginRequest = { token };
  const response = await api.post<AuthResponse>('/auth/login/google', request);

  if (!response.data) {
    throw new Error('No data received from Google login');
  }

  return response.data;
};

// Kakao 로그인
export const loginWithKakao = async (token: string): Promise<AuthResponse> => {
  const request: OAuthLoginRequest = { token };
  const response = await api.post<AuthResponse>('/auth/login/kakao', request);

  if (!response.data) {
    throw new Error('No data received from Kakao login');
  }

  return response.data;
};

// Naver 로그인
export const loginWithNaver = async (token: string): Promise<AuthResponse> => {
  const request: OAuthLoginRequest = { token };
  const response = await api.post<AuthResponse>('/auth/login/naver', request);

  if (!response.data) {
    throw new Error('No data received from Naver login');
  }

  return response.data;
};

// 토큰 갱신
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const request: RefreshTokenRequest = { refreshToken };
  const response = await api.post<AuthResponse>('/auth/refresh', request);

  if (!response.data) {
    throw new Error('No data received from token refresh');
  }

  return response.data;
};
