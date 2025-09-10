// 사용자 프로필 응답 (백엔드 UserProfileResponse와 일치)
export interface UserProfileResponse {
  email: string;
  nickname: string;
  profileImageUrl?: string;
  authProvider: string; // GOOGLE, KAKAO, NAVER
  memberSince: string; // LocalDate (YYYY-MM-DD)
}

// 닉네임 변경 요청 (백엔드 NicknameUpdateRequest와 일치)
export interface NicknameUpdateRequest {
  nickname: string; // 2-20자
}
