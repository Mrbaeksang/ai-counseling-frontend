# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native mobile frontend for the AI Counseling App, providing AI-powered philosophical counseling services through an intuitive mobile interface.

## 🔴 Absolute Project Rules

### Component Modularization
- **Maximum 100 lines per component** - Split larger components immediately
- **React.memo() is mandatory** for all list item components
- **No separate styles folder** - Styles must be inside each component
- **No 'any' types** - Always use proper TypeScript types

### State Management Pattern
- **Zustand for global state** (auth, toast, user preferences)
- **React Query for server state** (API data fetching/caching)
- **No prop drilling** - Use stores or context for shared state

### Code Quality Requirements
```bash
# MUST run before every commit:
npm run lint       # Fix linting issues  
npx tsc --noEmit   # Check TypeScript types
```

## Current Project Structure

```
frontend/
├── app/                    # Expo Router screens (file-based routing)
│   ├── (auth)/            # Auth stack
│   ├── (tabs)/            # Main tab navigator  
│   └── session/[id].tsx   # Dynamic routes
├── components/            # Modularized components
│   ├── home/             # Home screen components
│   │   ├── CategoryGrid.tsx
│   │   ├── CounselorList.tsx
│   │   ├── FilterChips.tsx
│   │   └── WelcomeSection.tsx
│   └── counselor/        # Counselor detail components
│       ├── CategorySection.tsx
│       ├── CounselingMethod.tsx
│       └── ProfileHeader.tsx
├── hooks/                # Custom React hooks
├── services/            # API layer (Axios + interceptors)
├── store/              # Zustand stores
│   ├── authStore.ts   # Auth state
│   └── toastStore.ts  # Toast notifications
└── constants/         # Shared constants
    ├── counselorImages.ts
    └── counselingMethods.ts
```

## Development Commands

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run lint       # Fix linting issues
npx tsc --noEmit   # TypeScript check
```

## Essential Patterns

### API Response Handling
- Backend returns RsData wrapper: `{ resultCode, msg, data }`
- Axios interceptor auto-unwraps: `response.data = response.data.data`
- Auto token refresh on 401 errors

### Component Example
```typescript
// MUST use React.memo for list items
export const CounselorCard = React.memo(({ counselor, onPress }: Props) => {
  // Styles MUST be inside component
  const styles = StyleSheet.create({
    container: { ... }
  });
  
  return <View style={styles.container}>...</View>;
});
```

### Commit Rules
- Korean commit messages only
- Format: `type: 설명` (e.g., `feat: 상담사 목록 필터 추가`)
- NO AI-generated credits