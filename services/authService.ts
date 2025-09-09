import { AxiosError } from 'axios';
import useAuthStore from '@/store/authStore';
import api from './api';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  nickname: string;
}

class AuthService {
  // Google OAuth 로그인
  async googleLogin(idToken: string): Promise<void> {
    try {
      const response = await api.post<AuthResponse>('/auth/login/google', {
        token: idToken,
      });

      // Zustand store에 저장 (AsyncStorage 저장 포함)
      await useAuthStore.getState().login(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Google 인증에 실패했습니다.');
        }
      }
      throw new Error('로그인 중 오류가 발생했습니다.');
    }
  }

  // Kakao OAuth 로그인
  async kakaoLogin(accessToken: string): Promise<void> {
    try {
      const response = await api.post<AuthResponse>('/auth/login/kakao', {
        token: accessToken,
      });

      await useAuthStore.getState().login(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('카카오 인증에 실패했습니다.');
        }
      }
      throw new Error('로그인 중 오류가 발생했습니다.');
    }
  }

  // Naver OAuth 로그인
  async naverLogin(accessToken: string): Promise<void> {
    try {
      const response = await api.post<AuthResponse>('/auth/login/naver', {
        token: accessToken,
      });

      await useAuthStore.getState().login(response.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new Error('네이버 인증에 실패했습니다.');
      }
      throw new Error('로그인 중 오류가 발생했습니다.');
    }
  }

  // 토큰 저장
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await useAuthStore.getState().setTokens(accessToken, refreshToken);
  }

  // 로그아웃
  async logout(): Promise<void> {
    try {
      // 백엔드 로그아웃은 따로 없음 (JWT 방식)
      await useAuthStore.getState().logout();
    } catch (_error) {
      // 실패해도 로컬 로그아웃 진행
      await useAuthStore.getState().logout();
    }
  }

  // 내 정보 조회
  async getMyProfile() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (_error) {
      throw new Error('프로필 조회에 실패했습니다.');
    }
  }

  // 닉네임 변경
  async updateNickname(nickname: string) {
    try {
      const response = await api.patch('/users/nickname', { nickname });
      return response.data;
    } catch (_error) {
      throw new Error('닉네임 변경에 실패했습니다.');
    }
  }
}

export default new AuthService();
