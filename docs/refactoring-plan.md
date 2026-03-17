# Refactoring Plan: Code Reduction and Maintainability

This document outlines a plan to refactor the codebase to reduce overall code size, improve readability, and increase maintainability. The focus is primarily on the React components within the `app/components/learn/` directory.

## 1. Eliminate Inline Styles using Tailwind CSS

**Problem:** Many components (e.g., `ConversationQuiz.tsx`, `GrammarQuiz.tsx`) heavily rely on inline styles for layout, colors, typography, and spacing. This leads to massive component files and poor code readability.
**Solution:**
- Migrate all inline styles to Tailwind CSS utility classes.
- Examples:
  - Change `style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}` to `className="flex flex-col gap-3"`.
  - Use Tailwind's arbitrary values for custom colors if they are not part of the standard theme, e.g., `text-[#78b4e0]` or extend the Tailwind theme in `tailwind.config.ts`.
- **Expected Impact:** Significant reduction in JSX size and improved visual consistency.

## 2. Extract Reusable UI Components

**Problem:** Repeated UI patterns exist across different quiz types (e.g., progress bars, feedback banners, buttons, card layouts).
**Solution:**
- Create a `ui` folder within `components` (e.g., `app/components/ui/`).
- Extract the following into reusable components:
  - `ProgressBar`: Extracts the `<div className="progress-track">...</div>` logic.
  - `FeedbackBanner`: A unified component for displaying correct/incorrect answers with explanations, replacing the duplicated conditional rendering logic across quizzes.
  - `QuizCard`: A wrapper component providing consistent padding, background, and borders for question containers.
- **Expected Impact:** Promotes code reuse and ensures UI consistency across the application.

## 3. Extract Shared Quiz Logic into Custom Hooks

**Problem:** The state management for quizzes (managing `index`, `done`, `score`, and handling `next`/`retry` actions) is duplicated across `ConversationQuiz.tsx`, `GrammarQuiz.tsx`, and potentially other quiz types.
**Solution:**
- Create a custom hook `useQuizLogic` in `app/hooks/useQuizLogic.ts`.
- The hook will manage the common state (`index`, `score`, `done`) and provide standard handler functions (`handleNext`, `handleRetry`).
```typescript
// Example hook structure:
function useQuizLogic<T>(items: T[]) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState({ know: 0, unknown: 0 });

  // Reset effect when items change...
  // handleNext logic...
  // handleRetry logic...

  return { index, done, score, currentItem: items[index], handleNext, handleRetry };
}
```
- **Expected Impact:** Centralizes quiz flow logic, making components purely focused on presentation.

## 4. Centralize Constants and Types

**Problem:** Types (e.g., `ConversationItem`, `Choice`) and constants (like `ROLE_COLOR`) are defined inline within component files.
**Solution:**
- Create a `types` directory (e.g., `app/types/`) and move interfaces there.
- Create a `constants` directory (e.g., `app/constants/`) and extract configuration data like `ROLE_COLOR` and standard theme color maps.
- **Expected Impact:** Cleans up component files and makes shared types accessible across the codebase.

## Execution Strategy

1. **Phase 1: Types and Hooks** - Extract interfaces and create the `useQuizLogic` hook. Apply the hook to existing quiz components to ensure logical parity.
2. **Phase 2: UI Component Extraction** - Build the foundational UI components (`ProgressBar`, `FeedbackBanner`, etc.) and substitute them in the existing code.
3. **Phase 3: Tailwind Migration** - Iteratively replace inline styles with Tailwind utility classes component by component.
4. **Phase 4: Testing** - Thoroughly test all quiz flows to verify that functionality and styling remain consistent.