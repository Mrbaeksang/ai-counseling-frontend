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

// OAuth 제공자 타입 (union type으로 엄격하게 정의)
export const AUTH_PROVIDERS = {
  GOOGLE: 'GOOGLE',
  KAKAO: 'KAKAO',
  NAVER: 'NAVER',
} as const;

export type OAuthProvider = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];
