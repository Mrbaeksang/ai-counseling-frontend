# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native mobile frontend for the AI Counseling App, providing AI-powered philosophical counseling services through an intuitive mobile interface.

## 🔴 Absolute Project Rules (절대 규칙)

### 1. Component Architecture
- **Maximum 200 lines per component (권장), 300 lines (한계)** - 복잡한 화면은 200줄 초과시 분리 검토
- **React.memo() 필수** - 모든 리스트 아이템 컴포넌트
- **No inline styles** - StyleSheet.create() only, no style={{}} 
- **Props 인터페이스 정의** - 모든 컴포넌트에 명확한 타입 정의

### 2. TypeScript Rules  
- **No 'any' types** - 절대 사용 금지, use 'unknown' or proper types
- **Strict null checks** - undefined/null 체크 필수
- **Type imports** - `import type` 사용으로 번들 크기 최적화
- **절대 경로 import** - @/ prefix 사용 (tsconfig.json paths)
- **Error handling** - catch (error: unknown) not catch (_error)

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
│   ├── auth/            # 인증 컴포넌트
│   ├── chat/            # 채팅 UI 컴포넌트
│   │   ├── ChatHeader.tsx
│   │   ├── CustomAvatar.tsx
│   │   ├── RatingDialog.tsx
│   │   └── TitleEditDialog.tsx
│   ├── common/          # 공통 컴포넌트
│   │   ├── Toast.tsx
│   │   └── PremiumButton.tsx
│   ├── counselor/       # 상담사 컴포넌트
│   │   ├── CounselorCard.tsx
│   │   ├── CounselorCardSkeleton.tsx
│   │   ├── FavoriteCounselorCard.tsx
│   │   ├── ProfileHeader.tsx
│   │   ├── CategorySection.tsx
│   │   └── CounselingMethod.tsx
│   └── home/            # 홈 화면 컴포넌트
│       ├── CategoryGrid.tsx
│       ├── CounselorList.tsx
│       ├── FilterChips.tsx
│       └── WelcomeSection.tsx
│
├── hooks/               # Custom React Hooks
│   ├── useCounselors.ts
│   ├── useSessionMessages.ts
│   ├── useSessions.ts
│   ├── useDebounce.ts
│   ├── useSimpleGoogleAuth.tsx
│   └── useKakaoAuth.tsx
│
├── services/           # API 레이어
│   ├── api.ts         # Axios 설정 (인터셉터)
│   ├── auth/          # OAuth & JWT 인증
│   │   ├── index.ts
│   │   └── types.ts
│   ├── counselors/    # 상담사 API
│   │   ├── index.ts
│   │   └── types.ts
│   ├── sessions/      # 세션 API
│   │   ├── index.ts
│   │   └── types.ts
│   └── users/         # 사용자 API
│       ├── index.ts
│       └── types.ts
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
├── assets/            # 정적 리소스
│   ├── counselors/    # 상담사 아바타 이미지
│   ├── fonts/         # Pretendard 폰트
│   └── images/        # 기타 이미지
│
├── types/            # 전역 타입 정의
│   └── icons.ts      # 아이콘 타입
│
└── utils/            # 헬퍼 함수
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
# 개발 서버 (중요: Android는 항상 아래 명령어 사용!)
npx expo run:android    # ⭐ Android 개발시 항상 이것 사용 (npm run android 대신)
npm run ios            # iOS 시뮬레이터
npm start              # 기본 Expo 서버 (거의 사용 안함)

# 코드 품질
npm run lint       # Biome 린팅 + 자동 수정
npx tsc --noEmit   # TypeScript 타입 체크

# 빌드
npx expo prebuild  # 네이티브 코드 생성
npx expo run:android --variant release
```

## 🔗 Backend Integration

### API Endpoints Pattern
- Base URL: `http://localhost:8080/api`
- Auth: `/auth/login`, `/auth/refresh`, `/auth/logout`
- Sessions: `/sessions`, `/sessions/{id}/messages`, `/sessions/{id}/rate`
- Counselors: `/counselors`, `/counselors/{id}`
- Users: `/users/me`, `/users/profile`

### Response Format (RsData)
```typescript
interface RsData<T> {
  resultCode: "S-1" | "F-400" | "F-401" | "F-404" | "F-500";
  msg: string;
  data: T | null;
}
```

### Backend Constants Sync
- Session title: "새 상담" (DEFAULT_SESSION_TITLE)
- Max conversation history: 9 messages
- Rating: 1-10 (0.5 stars = 1 point)
- Pagination: Default 20, Max 100
- Message roles: 'USER', 'AI'

## 📦 Dependencies & Versions

### Core
- **React Native**: 0.76.5 (New Architecture)
- **Expo**: SDK 53 with Expo Router v5
- **React**: 19.0.0
- **TypeScript**: 5.8.3

### Key Libraries
- **UI**: React Native Paper 5.x (MD3), React Native Gifted Chat
- **State**: Zustand 5.x (global), React Query 5.x (server)
- **Navigation**: Expo Router (file-based)
- **API**: Axios with interceptors
- **Auth**: expo-auth-session (OAuth2)

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
8. **catch (_error)** - catch (error: unknown) 사용

## 🔐 Security

- **API Keys** - 환경 변수 사용 (Constants.expoConfig.extra)
- **Token Storage** - AsyncStorage (SecureStore for sensitive data)
- **Deep Linking** - URL 검증 필수
- **Certificate Pinning** - 프로덕션 필수