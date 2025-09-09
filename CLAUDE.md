# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native mobile frontend for the AI Counseling App, providing AI-powered philosophical counseling services through an intuitive mobile interface.

## 🔴 Absolute Project Rules (절대 규칙)

### 1. Component Architecture
- **Maximum 200 lines per component (권장), 300 lines (한계)** - 복잡한 화면은 200줄 초과시 분리 검토
- **React.memo() 필수** - 모든 리스트 아이템 컴포넌트
- **컴포넌트 내부 스타일** - StyleSheet.create() 사용, 별도 파일 금지
- **Props 인터페이스 정의** - 모든 컴포넌트에 명확한 타입 정의

### 2. TypeScript Rules
- **No 'any' types** - 절대 사용 금지
- **Strict null checks** - undefined/null 체크 필수
- **Type imports** - `import type` 사용으로 번들 크기 최적화
- **절대 경로 import** - @/ prefix 사용 (tsconfig.json paths)

### 3. State Management Pattern
- **Zustand** - 전역 상태 (auth, toast, user preferences)
  - AsyncStorage와 연동하여 영속성 보장
  - 동기적 상태 업데이트 + 비동기 영속화
- **React Query (TanStack Query)** - 서버 상태
  - staleTime: 5분 기본값
  - gcTime: 10분 기본값  
  - 낙관적 업데이트 패턴 사용
- **No prop drilling** - 3단계 이상 전달 금지

### 4. API Communication Rules
- **Centralized Axios instance** - services/api.ts
- **Auto token refresh** - 401 에러시 자동 재시도
- **RsData wrapper handling** - 백엔드 응답 자동 언래핑
- **Error boundaries** - API 에러 전파 방지
- **Request queue** - 토큰 갱신 중 요청 대기열 관리

### 5. React Native Specific
- **FlatList for lists** - ScrollView 대신 사용 (성능)
- **KeyboardAvoidingView** - 키보드 처리 필수
- **Platform.OS checks** - iOS/Android 분기 처리
- **SafeAreaView** - 노치/상태바 영역 처리
- **Dimensions API** - 반응형 레이아웃

### 6. Performance Optimization
- **useCallback** - 모든 이벤트 핸들러
- **useMemo** - 계산 비용이 높은 연산
- **React.memo** - 모든 리스트 아이템
- **Lazy loading** - 화면 단위 코드 스플리팅
- **Image optimization** - expo-image 사용

### 7. Code Quality Requirements
```bash
# 커밋 전 필수 실행
npm run lint       # Biome 린팅
npx tsc --noEmit   # TypeScript 타입 체크
```

## 📁 Project Structure

```
frontend/
├── app/                    # Expo Router (파일 기반 라우팅)
│   ├── _layout.tsx        # Root layout (Provider 설정)
│   ├── index.tsx          # Entry redirect
│   ├── (auth)/           # 인증 그룹 (URL 미노출)
│   │   ├── _layout.tsx   # Stack navigator
│   │   └── login.tsx     # OAuth 로그인
│   ├── (tabs)/           # 탭 네비게이터
│   │   ├── _layout.tsx   # Tab layout
│   │   ├── index.tsx     # 홈/상담사 목록
│   │   ├── sessions.tsx  # 상담 내역
│   │   └── profile.tsx   # 마이페이지
│   ├── counselors/       # 상담사 관련
│   │   └── [id].tsx     # 상담사 상세 (동적)
│   └── session/
│       └── [id].tsx      # 채팅 세션 (동적)
│
├── components/           # 재사용 컴포넌트
│   ├── common/          # 공통 컴포넌트
│   │   ├── Toast.tsx
│   │   └── PremiumButton.tsx
│   ├── home/            # 홈 화면 컴포넌트
│   │   ├── CategoryGrid.tsx
│   │   ├── CounselorList.tsx
│   │   ├── FilterChips.tsx
│   │   └── WelcomeSection.tsx
│   ├── counselor/       # 상담사 컴포넌트
│   │   ├── CounselorCard.tsx
│   │   ├── CounselorCardSkeleton.tsx
│   │   ├── FavoriteCounselorCard.tsx
│   │   ├── ProfileHeader.tsx
│   │   ├── CategorySection.tsx
│   │   └── CounselingMethod.tsx
│   └── auth/            # 인증 컴포넌트
│
├── hooks/               # Custom React Hooks
│   ├── useCounselors.ts # React Query hooks
│   ├── useSessions.ts
│   ├── useDebounce.ts
│   ├── useSimpleGoogleAuth.tsx
│   └── useKakaoAuth.tsx
│
├── services/           # API 레이어
│   ├── api.ts         # Axios 설정 (인터셉터)
│   ├── authService.ts # 인증 서비스
│   ├── auth/          # OAuth 관련
│   ├── counselors/    # 상담사 API
│   │   ├── index.ts
│   │   └── types.ts
│   ├── sessions/      # 세션 API
│   └── users/         # 사용자 API
│
├── store/             # Zustand 스토어
│   ├── authStore.ts   # 인증 상태
│   └── toastStore.ts  # 토스트 알림
│
├── constants/         # 상수 정의
│   ├── theme.ts       # 디자인 토큰
│   ├── counselorImages.ts
│   └── counselingMethods.ts
│
└── types/            # 전역 타입 정의
    └── icons.ts      # 아이콘 타입
```

## 🎨 UI/UX Guidelines

### Material Design 3 Theme
```typescript
const theme = {
  colors: {
    primary: '#6B46C1',      // Purple
    secondary: '#9333EA',    // Light Purple
    surface: '#FFFFFF',      // White
    surfaceVariant: '#F3F4F6',
    error: '#EF4444',
    success: '#10B981',
  },
  roundness: 8,              // Border radius
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32
  }
}
```

### Component Patterns

#### List Item with React.memo
```typescript
export const CounselorCard = React.memo(({ 
  counselor, 
  onPress,
  isFavorite 
}: Props) => {
  const handlePress = useCallback(() => {
    onPress(counselor.id);
  }, [counselor.id, onPress]);

  const styles = StyleSheet.create({
    container: { padding: spacing.md }
  });

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        {/* content */}
      </View>
    </TouchableOpacity>
  );
});
```

#### API Hook Pattern
```typescript
export const useCounselors = (page = 1, size = 20) => {
  return useQuery({
    queryKey: ['counselors', page, size],
    queryFn: () => getCounselors(page, size),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
```

#### Zustand Store Pattern
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (data) => {
    await AsyncStorage.setItem('token', data.token);
    set({ user: data.user, isAuthenticated: true });
  },
  logout: async () => {
    await AsyncStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
}));
```

## 🚀 Development Commands

```bash
# 개발 서버
npm start          # Expo 개발 서버
npm run android    # Android 에뮬레이터
npm run ios        # iOS 시뮬레이터

# 코드 품질
npm run lint       # Biome 린팅 + 자동 수정
npx tsc --noEmit   # TypeScript 타입 체크

# 빌드
npx expo prebuild  # 네이티브 코드 생성
npx expo run:android --variant release
```

## 🔍 Debugging

### React Native Debugger
- Flipper 사용 권장
- Chrome DevTools 대체 가능
- React Query Devtools 통합

### Error Boundaries
```typescript
// 모든 화면 컴포넌트에 ErrorBoundary 적용
<ErrorBoundary fallback={<ErrorFallback />}>
  <ScreenComponent />
</ErrorBoundary>
```

## 📝 Commit Convention

```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
style: 스타일 변경
docs: 문서 수정
test: 테스트 추가
chore: 빌드, 설정 변경
```

**중요**: 
- 한국어 커밋 메시지 사용
- AI 생성 표시 금지 (no "🤖 Generated with Claude")

## ⚠️ Common Pitfalls to Avoid

1. **ScrollView 내부 FlatList** - 성능 문제 발생
2. **인라인 스타일 객체** - 리렌더링마다 재생성
3. **익명 함수 props** - useCallback 미사용
4. **동기적 AsyncStorage** - await 누락
5. **Platform 분기 미처리** - iOS/Android 차이
6. **키보드 처리 누락** - KeyboardAvoidingView 미사용
7. **안전 영역 미처리** - SafeAreaView 누락

## 🔐 Security

- **API Keys** - 환경 변수 사용 (Constants.expoConfig.extra)
- **Token Storage** - AsyncStorage (SecureStore for sensitive data)
- **Deep Linking** - URL 검증 필수
- **Certificate Pinning** - 프로덕션 필수