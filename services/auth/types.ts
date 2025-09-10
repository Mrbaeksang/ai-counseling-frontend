// OAuth 로그인 요청 (백엔드 OAuthLoginRequest와 일치)
export interface OAuthLoginRequest {
  token: string;
}

// 토큰 갱신 요청 (백엔드 RefreshTokenRequest와 일치)
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 인증 응답 (백엔드 AuthResponse와 일치)
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  nickname: string;
}

// OAuth 제공자 타입
export type OAuthProvider = 'GOOGLE' | 'KAKAO' | 'NAVER';
