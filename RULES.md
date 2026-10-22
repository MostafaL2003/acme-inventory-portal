---
trigger: always_on
---

# React 18 + TypeScript Architecture Rules

## Feature-Based Folder Structure
- Organize code by feature, not by file type: `src/features/<feature-name>/`.
- Each feature folder may contain: `components/`, `hooks/`, `types.ts`, `api.ts`, `utils.ts`, and an `index.ts` barrel.
- Import from other features only through their `index.ts` public API — never reach into another feature's internals.
- Put truly shared, feature-agnostic code in `src/shared/` (`components/`, `hooks/`, `utils/`, `types/`).
- Keep `src/app/` (or `App.tsx`) limited to providers, routing, and layout composition.

## One Primary Component Per File
- Each `.tsx` file exports exactly one primary component; the file name matches it (`ProductCard.tsx` → `ProductCard`).
- Small, private helper components used only by that component are allowed in the same file but must not be exported.
- Use PascalCase for component files and camelCase prefixed with `use` for hook files (`useInventory.ts`).
- Prefer named function components with typed props (`type ProductCardProps = { ... }`); avoid `React.FC`.

## Separate Heavy Logic into Custom Hooks
- Components handle rendering and event wiring only.
- Move data fetching, derived/filtered state, complex `useEffect` logic, form handling, and business rules into custom hooks.
- Extract a hook when a component has more than ~3 related `useState`/`useEffect` calls or non-trivial computation.
- Hooks must have explicit TypeScript return types and live in the feature's `hooks/` folder (or `src/shared/hooks/` if reused across features).
- Keep pure, non-React logic in plain `utils.ts` functions so it can be unit tested without rendering.

## File Size Limit
- Keep every file under 200 lines.
- When a file approaches the limit, split it: extract subcomponents, move logic into hooks, or move constants/types into separate files.
- Large static data (mock data, config objects) belongs in its own `*.data.ts` or `constants.ts` file.
