# Acme Inventory Portal

An enterprise-grade B2B Inventory Management Single-Page Application (SPA) engineered with **React 19**, **TypeScript 6**, **Vite 8**, **Tailwind CSS v4**, **TanStack Query v5**, **Redux Toolkit**, and **React Router v7**.

Designed for high-volume warehouse and catalog operations, Acme Inventory Portal separates **URL state**, **server cache state**, and **ephemeral client UI state** into clean, deterministic layers with strict architectural boundaries and WCAG 2.1 AA accessibility compliance.

---

## Key Features

### 1. URL-Driven Product Catalog & Deep-Linking
- **Single Source of Truth in URL (`useSearchParams`)**: Search queries (`?q=`), category filters (`?category=`), pagination (`?page=`, `?limit=`), and sorting (`?sortBy=`, `?order=`) are synchronized directly with the browser URL via [`useUrlProductFilters`](src/features/products/hooks/useUrlProductFilters.ts).
- **Debounced Full-Text Search**: 300ms debounced search input ([`useDebouncedValue`](src/shared/hooks/useDebouncedValue.ts)) prevents network request thrashing while keeping the UI immediately responsive and automatically resetting pagination to Page 1 on filter changes.
- **Dynamic Pagination & Windowing**: Configurable page sizes (`10`, `20`, `50`, `100`) and smart page-range windowing with `keepPreviousData` transitions so paging never flashes full-screen loading skeletons.

### 2. Server Cache Synchronization & Optimistic Mutations (TanStack Query v5)
- **Structured Query Keys**: Granular caching keyed by `['products', { q, category, limit, skip, sortBy, order }]` and `['categories']` (1-hour `staleTime`).
- **Slide-Over Edit Product Drawer**: Accessible (`role="dialog"`, `aria-modal="true"`) drawer with focus trapping, `Escape`-key dismissal, stock stepper controls, and real-time field validation via [`useProductForm`](src/features/products/hooks/useProductForm.ts).
- **Direct Cache Patching (`setQueriesData`)**: [`useUpdateProductMutation`](src/features/products/hooks/useUpdateProductMutation.ts) cancels in-flight queries on mutate and patches matching product rows across all cached query pages in memory, preserving DummyJSON's simulated `PUT /products/:id` updates without destructive refetches.

### 3. Multi-Row Batch Selection & Floating Action Dock (Redux Toolkit)
- **Cross-Page Selection Persistence**: [`selectionSlice`](src/features/products/store/selectionSlice.ts) tracks selected product IDs across pagination swaps with `O(1)` `Set`-based lookups and header indeterminate checkbox states (`aria-checked="mixed"`).
- **Floating Batch Action Dock**: Appears dynamically when `selectedProductIds.length > 0`, supporting bulk operations (**Mark Out of Stock**, **Bulk Restock (+50)**, and **Delete Selected**) with parallel mutation execution and automatic cache synchronization.

### 4. Global `Cmd+K` / `Ctrl+K` Command Palette
- **Keyboard-First Navigation**: Global shortcut listener (`Cmd+K` on macOS, `Ctrl+K` on Windows/Linux) toggles the command modal from anywhere in the portal.
- **Quick Actions & Direct Editing**: Instant `ArrowUp` / `ArrowDown` / `Enter` navigation to jump between views (`/dashboard`, `/products`), apply filter presets, or open any product directly inside the Edit Drawer.

### 5. Executive Dashboard & Resilience
- **Real-Time KPI Aggregation**: Computes Total SKU Count, Total Inventory Valuation ($\sum \text{price} \times \text{stock}$), Low Stock Alert Count (`1–20` units), and Out-of-Stock Count (`0` units), plus category distribution bars and a one-click **Low Stock Watchlist**.
- **Error Boundaries & Retry Recovery**: Route-level Error Boundaries integrated with TanStack Query's `useQueryErrorResetBoundary` provide graceful fallback UIs and one-click retry recovery.

---

## Tech Stack & State Architecture

| Layer | Technology | Responsibility |
| :--- | :--- | :--- |
| **Core & Bundler** | React 19 + TypeScript 6 + Vite 8 | Fast HMR, strict type checking, zero-overhead client SPA bundle |
| **Styling & Icons** | Tailwind CSS v4 + `lucide-react` | Utility-first B2B design system, status badges, and accessible focus states |
| **Client Routing** | React Router v7 (`createBrowserRouter`) | Persistent `AppShell` layout (`SidebarNav` + `TopHeader`) and URL search param state |
| **Server State** | TanStack Query v5 | Remote data fetching, caching, background synchronization, and `PUT`/`DELETE` mutations |
| **Client UI State** | Redux Toolkit + React-Redux v9 | Cross-component row selection (`selectionSlice`) and global modal/drawer visibility (`uiSlice`) |
| **Linter** | Oxlint | Ultra-fast static analysis enforcing React hooks and Fast Refresh rules |
| **Backend API** | [DummyJSON Products REST API](https://dummyjson.com/docs/products) | Paginated product catalog, search, category filtering, and simulated mutations |

---

## Project Structure

The codebase enforces a strict **feature-based modular architecture** where every file is capped at **under 200 lines of code** and exports a single primary component or hook:

```text
src/
├── app/                          # Application root, router, QueryClient, and Redux store
│   ├── providers.tsx             # Redux <Provider> + TanStack <QueryClientProvider>
│   ├── queryClient.ts            # Global QueryClient configuration (staleTime: 60s)
│   ├── router.tsx                # createBrowserRouter routes (/products, /dashboard, 404)
│   └── store.ts                  # Redux Toolkit configureStore (selection & ui slices)
├── features/
│   ├── dashboard/                # Executive KPI cards, category breakdown, low-stock watchlist
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   └── products/                 # Product catalog feature module
│       ├── components/
│       │   ├── EditProductDrawer.tsx
│       │   ├── EmptyProductsState.tsx
│       │   ├── PaginationBar.tsx
│       │   ├── ProductFilterToolbar.tsx
│       │   ├── ProductRow.tsx
│       │   ├── ProductsPage.tsx
│       │   ├── ProductTable.tsx
│       │   ├── ProductTableSkeleton.tsx
│       │   └── StockStatusBadge.tsx
│       ├── hooks/
│       │   ├── useCategoriesQuery.ts
│       │   ├── useProductForm.ts
│       │   ├── useProductsByCategoryQuery.ts
│       │   ├── useProductsQuery.ts
│       │   ├── useUpdateProductMutation.ts
│       │   └── useUrlProductFilters.ts
│       ├── store/
│       │   └── selectionSlice.ts
│       ├── api.ts                # Runtime-validated fetch helpers with AbortSignal support
│       ├── constants.ts
│       ├── types.ts
│       └── index.ts
└── shared/                       # Cross-feature UI primitives, layout, hooks, and global UI slice
    ├── components/
    │   ├── feedback/
    │   │   ├── FeedbackToast.tsx
    │   │   └── NotFoundPage.tsx
    │   └── layout/
    │       ├── AppShell.tsx
    │       ├── SidebarNav.tsx
    │       └── TopHeader.tsx
    ├── hooks/
    │   ├── useDebouncedValue.ts
    │   └── useRedux.ts           # Typed useAppDispatch & useAppSelector hooks
    └── store/
        └── uiSlice.ts            # Global isCommandPaletteOpen & activeEditProductId state
```

---

## Getting Started

### Prerequisites
- **Node.js** `>= 20.x`
- **npm** `>= 10.x`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/MostafaL2003/acme-inventory-portal.git
cd acme-inventory-portal
npm install
```

### 2. Environment Variables
Create a `.env` file in the project root (optional—defaults to `https://dummyjson.com` if omitted):
```env
VITE_API_BASE_URL=https://dummyjson.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. Navigating to `/` automatically redirects to `/products`.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite local development server with HMR |
| `npm run lint` | Runs `oxlint` across all TypeScript and React files |
| `npm run build` | Runs strict TypeScript project build (`tsc -b`) and bundles for production (`vite build`) |
| `npm run preview` | Locally previews the production `dist/` build |

---

## Engineering & Quality Standards

- **Strict Type Safety**: Zero `any` types and runtime schema type guards (`isProduct`, `isProductsResponse`, `isStringArray`) at the API boundary.
- **Performance Optimization**: Memoized `O(1)` `Set` selection lookups, stabilized callback references (`useCallback`), and targeted React Query cache updates that preserve referential identity across unaffected pages.
- **Accessibility (WCAG 2.1 AA)**: Semantic table headers (`scope="col"`, `aria-busy`, `aria-checked="mixed"`), modal focus trapping (`role="dialog"`, `aria-modal="true"`), and field-level error announcements (`aria-invalid`, `aria-describedby`, `role="alert"`).
- **Modularity**: Every source file is strictly maintained under 200 lines with a single primary responsibility.

