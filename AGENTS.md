# Repository Guidelines

## Project Structure & Module Organization
The Expo Router entry point lives in `app/`, with route groups such as `(auth)` for authentication screens, `(tabs)` for primary navigation, and feature folders like `characters/` and `session/`. Shared UI primitives sit in `components/`, state is centralized under `store/`, domain constants in `constants/`, API clients under `services/`, custom hooks in `hooks/`, TypeScript contracts in `types/`, and reusable helpers in `utils/`. Static assets (fonts, images, lottie files) belong in `assets/`, while native configuration resides in `android/`. Environment templates and examples are kept in `.env.example` alongside deployment variants.

## Build, Test, and Development Commands
- `npm run start`: Launch the Expo development server for local iteration (supports native and web targets).
- `npm run android` / `npm run ios`: Produce platform builds through Expo run commands; ensure simulators/emulators are available.
- `npm run web`: Start the Expo server targeting the web runtime.
- `npm run lint`: Execute Biome lint rules across the workspace.
- `npm run check`: Apply lint auto-fixes where possible.
- `npm run format`: Format the codebase with Biome.
- `npm run typecheck`: Run `tsc --noEmit` to validate types. Husky installs automatically via `npm install` to wire the pre-commit hook.

## Coding Style & Naming Conventions
Biome enforces 2-space indentation, LF endings, single quotes, trailing commas, and required semicolons. Prefer TypeScript throughout; colocate types with feature code or place shared definitions in `types/`. Name React components and files with PascalCase (e.g., `SessionScreen.tsx`), hooks with a `use` prefix, and Zustand stores with `useXYZStore`. Use double quotes in JSX per formatter defaults and keep module exports focused on a single component per file.

## Testing Guidelines
An automated test harness has not been set up yet. For new features, capture manual verification steps in the PR and, when adding test tooling (e.g., React Native Testing Library), place specs next to the component (`Component.test.tsx`) or within a `__tests__/` folder. Aim for coverage of routing logic, hooks, and API clients; include edge cases for authentication flows and cache resets.

## Commit & Pull Request Guidelines
Follow Conventional Commit prefixes (`feat`, `fix`, `chore`, `refactor`, etc.) to keep history searchable, mirroring existing messages such as `feat: 캐릭터 전환 및 사용자별 캐시 초기화`. Each PR should link related issues, summarize user-facing changes, note environment impacts, and attach screenshots or screen recordings for UI updates. Confirm lint and typecheck status before requesting review, and call out any follow-up tasks explicitly.

## Security & Configuration Tips
Store secrets in `.env` files that mirror `.env.example`; never commit production credentials. Use Expo's secure storage for tokens and keep device build variants aligned with `eas.json`. When debugging, avoid logging sensitive user content and remove temporary analytics or test toggles prior to merging.
