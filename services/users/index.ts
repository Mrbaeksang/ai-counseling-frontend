import api from '../api';
import type { NicknameUpdateRequest, UserProfileResponse } from './types';

// 내 프로필 조회
export const getMyProfile = async (): Promise<UserProfileResponse> => {
  const response = await api.get<UserProfileResponse>('/users/me');

  if (!response.data) {
    throw new Error('Failed to fetch user profile');
  }

  return response.data;
};

// 닉네임 변경
export const updateNickname = async (nickname: string): Promise<UserProfileResponse> => {
  // 닉네임 길이 검증 (2-20자)
  if (nickname.length < 2 || nickname.length > 20) {
    throw new Error('닉네임은 2자 이상 20자 이하여야 합니다');
  }

  const request: NicknameUpdateRequest = { nickname };
  const response = await api.patch<UserProfileResponse>('/users/nickname', request);

  if (!response.data) {
    throw new Error('Failed to update nickname');
  }

  return response.data;
};

// 회원 탈퇴
export const deleteAccount = async (): Promise<void> => {
  await api.delete('/users/me');
};
