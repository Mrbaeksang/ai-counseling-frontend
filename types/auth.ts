// OAuth Provider 타입
export enum AuthProvider {
  GOOGLE = 'GOOGLE',
  KAKAO = 'KAKAO',
}

// Auth Provider 타입 가드
export const isValidAuthProvider = (provider: unknown): provider is AuthProvider => {
  return (
    typeof provider === 'string' && Object.values(AuthProvider).includes(provider as AuthProvider)
  );
};
