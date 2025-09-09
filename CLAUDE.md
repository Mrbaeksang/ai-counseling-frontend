# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native mobile frontend for the AI Counseling App, providing AI-powered philosophical counseling services through an intuitive mobile interface.

## Key Libraries and Dependencies

### Core Framework
- **React Native 0.79.5** + **React 19.0.0**
- **Expo ~53.0.22**: Development platform and build tools
- **TypeScript ~5.8.3**: Type safety and better DX

### Navigation & Routing
- **Expo Router ~5.1.5**: File-based routing system

### State Management
- **Zustand ^5.0.8**: Global state management (auth, user preferences)
- **@tanstack/react-query ^5.87.1**: Server state management, caching, and synchronization

### UI Components & Styling
- **React Native Paper ^5.14.5**: Material Design 3 components
- **React Native Gifted Chat ^2.8.1**: Complete chat UI solution
- **@gorhom/bottom-sheet ^5.2.6**: Native bottom sheet component
- **React Native Skeleton Placeholder ^5.2.4**: Loading states
- **React Native Vector Icons ^10.3.0**: Icon library
- **Expo Linear Gradient ~14.1.5**: Gradient backgrounds
- **Lottie React Native 7.2.2**: Animation support

### Forms & Validation
- **React Hook Form ^7.62.0**: Form state management
- **@hookform/resolvers ^5.2.1**: Validation resolvers
- **Zod ^4.1.5**: Schema validation

### Network & API
- **Axios ^1.11.0**: HTTP client with interceptors
- **@react-native-async-storage/async-storage 2.1.2**: Persistent storage

### Authentication
- **@react-native-google-signin/google-signin ^16.0.0**: Google OAuth integration

### Development Tools
- **@biomejs/biome ^2.2.3**: Linting and formatting
- **Husky ^9.1.7**: Git hooks
- **@commitlint**: Commit message linting

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Platform-specific runs
npm run android    # Android emulator
npm run ios        # iOS simulator  
npm run web        # Web browser

# Code quality
npm run lint       # Run Biome linter
npm run format     # Format code with Biome
npm run check      # Run Biome check and fix issues
npx tsc --noEmit   # Run TypeScript type checking
```

## High-Level Architecture

### Project Structure

```
frontend/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with QueryClient, Theme providers
│   ├── index.tsx          # Entry redirect
│   ├── (auth)/           # Authentication stack
│   │   ├── _layout.tsx   # Auth layout
│   │   └── login.tsx     # Login screen with OAuth
│   ├── (tabs)/           # Main tab navigator
│   │   ├── _layout.tsx   # Tab layout
│   │   ├── index.tsx     # Home/counselors screen with categories
│   │   ├── sessions.tsx  # Chat sessions list
│   │   └── profile.tsx   # User profile
│   └── session/
│       └── [id].tsx      # Dynamic chat session screen
├── components/            # Reusable components
│   └── counselor/        # Counselor-related components
│       ├── CounselorCard.tsx
│       ├── CounselorCardSkeleton.tsx
│       └── FavoriteCounselorCard.tsx
├── hooks/                 # Custom React hooks
│   └── useCounselors.ts # React Query hooks for counselors
├── services/             # API layer
│   ├── api.ts           # Axios instance with interceptors
│   ├── auth/            # Auth endpoints
│   ├── counselors/      # Counselor endpoints & types
│   ├── sessions/        # Chat session endpoints
│   └── users/           # User profile endpoints
├── store/                # Global state
│   └── authStore.ts     # Zustand auth store
├── constants/            # App constants
│   └── theme.ts         # Spacing, colors, typography
└── assets/              # Static assets
    └── fonts/           # Pretendard font files
```

### Service Layer Architecture

All API communication flows through a centralized Axios instance with intelligent interceptors:

```
services/
├── api.ts              # Axios instance with token management
├── auth/              # Authentication endpoints
├── counselors/        # Counselor management
├── sessions/          # Chat session operations
└── users/             # User profile management
```

**Key Features:**
- Automatic token refresh with queue management
- RsData response wrapper handling
- Retry logic for failed auth requests
- Centralized error handling

### State Management Pattern

**Global State (Zustand v5.0.8):**
- `store/authStore.ts`: Authentication state, tokens, user data
- Persistent storage with AsyncStorage
- Synchronous state updates with async persistence
- Usage example:
```typescript
const { user, login, logout, isAuthenticated } = useAuthStore();
```

**Server State (React Query v5.87.1):**
- `hooks/useCounselors.ts`: Counselor data fetching and mutations
  - `useCounselors()`: Fetch counselor list with pagination
  - `useCounselorDetail()`: Fetch single counselor details
  - `useFavoriteCounselors()`: Fetch favorite counselors
  - `useToggleFavorite()`: Add/remove favorites with optimistic updates
- `hooks/useSessions.ts`: Chat session management (to be implemented)
- Automatic caching with 5-minute stale time
- Background refetching on focus
- Retry logic with exponential backoff
- Usage example:
```typescript
const { data, isLoading, refetch } = useCounselors(page, size, sort);
const { toggle, isLoading } = useToggleFavorite();
```

### API Response Handling

Backend uses RsData wrapper pattern:
```typescript
// Backend response
{
  "resultCode": "S-1",
  "msg": "Success",
  "data": { ... }
}

// Automatically unwrapped by interceptor
response.data = response.data.data
```

### Authentication Flow

1. **OAuth2 + JWT**: Social login (Google, Kakao, Naver) returns JWT tokens
2. **Token Storage**: Access/refresh tokens stored in AsyncStorage
3. **Auto-refresh**: Interceptor handles 401 errors with token refresh
4. **Queue Management**: Pending requests wait during token refresh

## Code Style Configuration

### Biome Configuration
- **Formatting**: 2 spaces, single quotes, trailing commas
- **Line width**: 100 characters
- **JSX**: Double quotes for JSX attributes
- **Linting**: Strict TypeScript, no unused imports/variables
- **Auto-fix**: Pre-commit hook runs `npm run lint --write`

### TypeScript Configuration
- **Strict mode**: Enabled
- **Path aliases**: @/components, @/services, @/hooks, etc.
- **Base URL**: Set to project root

## UI/UX Patterns

### Theme (Material Design 3)
- **Primary**: #6B46C1 (Purple)
- **Secondary**: #9333EA
- **Surface**: White with subtle variants
- **Roundness**: 8px for consistent corners

### Component Library
- React Native Paper 5.x with MD3
- React Native Gifted Chat for messaging UI
- Custom theme configuration in `app/_layout.tsx`

## Environment Variables

Configuration through Expo Constants:
```javascript
// Access in code
Constants.expoConfig?.extra?.apiUrl
```

Default API URL: `http://localhost:8080/api`

## Testing Commands

Currently no test setup. When adding tests:
- Use Jest + React Native Testing Library
- Test API service layers with MSW
- Component testing with render helpers

## Git Hooks (Husky)

Pre-commit hook (`.husky/pre-commit`) automatically:
1. Runs Biome linter with auto-fix (`npm run lint -- --write`)
2. Runs TypeScript type checking (`npx tsc --noEmit`)
3. Stages formatted files (`git add -A`)
4. Blocks commit if any checks fail

## Commit Messages

- Write commit messages in Korean
- DO NOT include AI-generated mentions or credits (no "🤖 Generated with Claude Code" etc.)
- Follow conventional commit format: `type: 설명`
- Example: `feat: 로그인 화면 UI 개선`

## Important Development Guidelines

### Before Committing
ALWAYS run these commands before committing:
```bash
npm run lint       # Fix linting issues
npx tsc --noEmit   # Check TypeScript types
```

### Code Quality Checklist
- ✅ All imports are used and properly imported
- ✅ No `any` types (use proper TypeScript types)
- ✅ No console.log statements in production code
- ✅ All useEffect hooks have proper dependencies
- ✅ React keys are unique and stable (not array indices)

### Common Issues to Avoid
1. **Missing imports**: Always verify all React hooks are imported (useCallback, useEffect, useState, etc.)
2. **Type errors**: Run `npx tsc --noEmit` to catch type errors before commit
3. **Unused variables**: Remove or prefix with underscore if intentionally unused
4. **Encoding issues**: Ensure all files are UTF-8 encoded