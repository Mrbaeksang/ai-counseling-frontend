import api from '../api';
import type { NicknameUpdateRequest, UserProfileResponse } from './types';

// 내 프로필 조회
export const getMyProfile = async (): Promise<UserProfileResponse> => {
  const response = await api.get('/users/me');
  return response.data;
};

// 닉네임 변경
export const updateNickname = async (nickname: string): Promise<UserProfileResponse> => {
  const request: NicknameUpdateRequest = { nickname };
  const response = await api.patch('/users/nickname', request);
  return response.data;
};

// 회원 탈퇴
export const deleteAccount = async (): Promise<void> => {
  await api.delete('/users/me');
};
