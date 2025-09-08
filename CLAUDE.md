# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native mobile frontend for the AI Counseling App, providing AI-powered philosophical counseling services through an intuitive mobile interface.

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
```

## High-Level Architecture

### Navigation Structure (Expo Router)

The app uses file-based routing with Expo Router v5:

```
app/
├── _layout.tsx           # Root layout with providers
├── index.tsx            # Entry redirect
├── (auth)/             # Authentication stack
│   ├── _layout.tsx     # Auth layout
│   └── login.tsx       # Login screen
├── (tabs)/             # Main tab navigator
│   ├── _layout.tsx     # Tab layout
│   ├── index.tsx       # Home/counselors screen
│   ├── sessions.tsx    # Chat sessions list
│   └── profile.tsx     # User profile
└── session/
    └── [id].tsx        # Dynamic chat session screen
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

**Global State (Zustand):**
- `store/authStore.ts`: Authentication state, tokens, user data
- Persistent storage with AsyncStorage
- Synchronous state updates with async persistence

**Server State (React Query):**
- Caching and synchronization
- Optimistic updates
- Background refetching

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

## Git Hooks

Pre-commit hook automatically:
1. Runs Biome linter with auto-fix
2. Stages formatted files
3. Ensures code quality before commit