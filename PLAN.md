# Project Plan

## Tech Stack

| Tool                    | What It Does       | Why We’re Using It                                                                                                                           |
| :---------------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vite + React (TS)**   | App core & bundler | Fast local dev server, pure client-side SPA (no Next.js server magic).                                                                       |
| **Tailwind CSS**        | Styling            | Utility-first styling so we don't spend hours wrestling with `.css` files.                                                                   |
| **lucide-react**        | UI Icons           | Clean, lightweight SVG icons for navigation and status badges.                                                                               |
| **react-router-dom**    | Client Routing     | Handles page swaps (`/products`, `/dashboard`) via `<Outlet/>` without browser reloads.                                                      |
| **TanStack Query**      | Server State       | Fetches, caches, and syncs remote data from the API. Handles loading/error states and background refreshes.                                  |
| **Redux Toolkit (RTK)** | Client State       | Handles UI-only state that the backend doesn't own—specifically the array of selected row IDs for batch actions and modal/drawer visibility. |
| **DummyJSON API**       | Backend API        | Free, zero-setup public REST API providing real product data, search, pagination, and fake update/delete endpoints.                          |

## 3. Sprint Roadmap & Execution Milestones

AFTER EVERY COMMIT CHECK THE PLAN.MD FILE AND CHECK THE FINISHED TASK

### Sprint 1: Project Scaffolding, App Shell Layout, and Client Routing

- **Core Objective:** Establish the feature-based folder architecture, configure the persistent B2B application shell (sidebar + top header), and wire up client-side routing between core views.
- **Git Branch:** `feat/sprint-1-app-shell-routing`

#### Tickets

- **TICKET-101: Initialize Feature Folder Structure & Core Dependencies**
  - [x] Install core routing and state packages (`react-router-dom`, `@tanstack/react-query`, `@reduxjs/toolkit`, `react-redux`).
  - [x] Create the base directory hierarchy: `src/app/`, `src/features/products/`, `src/features/dashboard/`, and `src/shared/` (`components/`, `hooks/`, `types/`, `utils/`).
  - [x] Configure path aliases (`@/`) in `tsconfig.app.json` and `vite.config.ts` for clean cross-module imports.
- **TICKET-102: Build Persistent App Shell Layout**
  - [x] Create `AppShell.tsx` in `src/shared/components/layout/` with a fixed left navigation sidebar, sticky top bar, and main scrollable `<Outlet />` workspace.
  - [x] Build `SidebarNav.tsx` using `NavLink` from `react-router-dom` and `lucide-react` icons (`LayoutDashboard`, `Package`), highlighting the active route state.
  - [x] Create `TopHeader.tsx` displaying current page breadcrumbs and a visual trigger button for the future `Cmd+K` search palette.
- **TICKET-103: Configure Client Router & Placeholder Views**
  - [x] Set up `createBrowserRouter` in `src/app/router.tsx` with root `<AppShell />` and child routes for `/dashboard` and `/products`.
  - [x] Configure an index redirect (`/` → `/products`) and a `404` catch-all route (`NotFoundPage.tsx`).
  - [x] Create lightweight placeholder page components (`ProductsPage.tsx`, `DashboardPage.tsx`) adhering to the single-component-per-file rule.

#### Definition of Done (Acceptance Criteria)

- Navigating to `/` automatically redirects the browser URL to `/products` without a full page reload.
- Clicking between "Products" and "Dashboard" in the sidebar updates the URL and swaps the main `<Outlet />` content while keeping the sidebar and header mounted.
- Active sidebar link visually reflects the current route using Tailwind active classes.
- Navigating to an invalid URL (e.g., `/unknown-route`) renders the 404 fallback screen inside the app shell.

---

### Sprint 2: Data Presentation, Table View, and URL-driven Filtering (`useSearchParams`)

- **Core Objective:** Define strict TypeScript contracts for DummyJSON products, render the inventory data table with stock status badges, and synchronize search, category filtering, and pagination directly with URL query parameters.
- **Git Branch:** `feat/sprint-2-table-url-filters`

#### Tickets

- **TICKET-201: Define Product Contracts & API Fetch Client**
  - [x] Create `src/features/products/types.ts` defining `Product`, `ProductsResponse`, and filter parameter interfaces matching the DummyJSON `/products` schema.
  - [x] Implement pure fetch helpers in `src/features/products/api.ts` supporting `limit`, `skip`, `q` (search), and category endpoints (`https://dummyjson.com/products`).
  - [x] Create a custom hook `useUrlProductFilters.ts` wrapping `useSearchParams` to read and update `q`, `category`, `page`, and `sortBy` in the browser URL.
- **TICKET-202: Build Inventory Data Table & Status Cells**
  - [x] Create `ProductTable.tsx` rendering columns: SKU/ID, Thumbnail + Title, Category, Price, Stock Level, and Status Badge.
  - [x] Build `StockStatusBadge.tsx` in `src/features/products/components/` computing status from stock count (`In Stock > 20`, `Low Stock 1–20`, `Out of Stock === 0`).
  - [x] Create `ProductTableSkeleton.tsx` and `EmptyProductsState.tsx` to handle loading and zero-result search states cleanly.
- **TICKET-203: Implement Filter Toolbar & Debounced URL Search**
  - [x] Build ProductFilterToolbar.tsx with search input (q), dynamic category dropdown, placeholder filter dropdowns (status/warehouse/price/stock), and "Reset Filters" action. 
  - [x] Create `useDebouncedValue.ts` in `src/shared/hooks/` (300ms delay) so typing in the search bar updates `?q=` in the URL without spamming network requests on every keystroke.
  - [x] Reset pagination parameter `page=1` automatically whenever `q` or `category` changes.
- **TICKET-204: Build URL-Synced Pagination Controls**
  - [x] Create `PaginationBar.tsx` displaying current item range (`Showing 1–20 of 194`) and Previous/Next page buttons.
  - [x] Wire pagination clicks to update `?page=` in `useSearchParams` and compute `skip = (page - 1) * limit`.

#### Definition of Done (Acceptance Criteria)

- Products table renders live data from DummyJSON with formatted currency (`$XX.XX`) and color-coded stock badges.
- Typing in the search box or selecting a category updates the browser URL query string (e.g., `/products?q=phone&category=smartphones&page=1`).
- Refreshing the browser tab or pasting a filtered URL restores the exact search input, selected category, and table page.
- Clicking "Reset Filters" clears all URL search params and restores the default unfiltered list.

---

### Sprint 3: Server Cache Migration (TanStack Query) and Edit Product Drawer (`useMutation`)

- **Core Objective:** Migrate data fetching to TanStack Query v5 for caching and background synchronization, and implement a slide-over Edit Drawer that mutates product data and updates the client cache.
- **Git Branch:** `feat/sprint-3-react-query-edit-drawer`

#### Tickets

- **TICKET-301: Configure QueryClient & Migrate Product Queries**
  - [x] Initialize `QueryClientProvider` in `src/app/providers.tsx` with sensible defaults (`staleTime: 60_000`, `refetchOnWindowFocus: false`).
  - [x] Create `useProductsQuery.ts` and `useCategoriesQuery.ts` in `src/features/products/hooks/` using structured query keys (`['products', { q, category, page }]`).
  - [x] Enable `placeholderData: keepPreviousData` on `useProductsQuery` so pagination and filter transitions do not flash full-screen loading skeletons.
- **TICKET-302: Build Slide-Over Edit Product Drawer UI**
  - [ ] Create `EditProductDrawer.tsx` with a backdrop overlay, Escape-key close handler, and controlled form fields for `title`, `price`, `stock`, and `category`.
  - [ ] Extract form state and field validation (non-negative price, integer stock `>= 0`, required title) into a dedicated `useProductForm.ts` hook.
- **TICKET-303: Implement Optimistic/Cache-Synced `useMutation`**
  - [ ] Create `useUpdateProductMutation.ts` calling `PUT https://dummyjson.com/products/:id`.
  - [ ] Use `queryClient.setQueriesData` in `onSuccess` (or `onMutate` optimistic update with rollback) so edited product rows immediately reflect changes in the table without losing DummyJSON's simulated state.
  - [ ] Display inline saving spinner on the submit button and a dismissible feedback banner/toast upon mutation completion or failure.

#### Definition of Done (Acceptance Criteria)

- Navigating back and forth between already-visited pagination pages serves cached data instantaneously without showing loading skeletons.
- Clicking "Edit" on any product row opens the slide-over drawer pre-populated with that product's exact details.
- Submitting valid changes sends a `PUT` request to DummyJSON, closes the drawer, and immediately updates the row's title, price, stock count, and status badge in the table.
- Submitting invalid values (e.g., negative price or empty title) blocks the network request and shows field-level validation messages.

---

### Sprint 4: Redux Toolkit Batch Selection Dock and Global `Cmd+K` Command Palette

- **Core Objective:** Configure Redux Toolkit for cross-component UI state, enabling multi-row batch actions via a floating action dock and a keyboard-driven `Cmd+K` / `Ctrl+K` command palette.
- **Git Branch:** `feat/sprint-4-rtk-batch-dock-cmdk`

#### Tickets

- **TICKET-401: Setup Redux Store & UI Slices**
  - [ ] Configure the Redux store in `src/app/store.ts` and export typed hooks (`useAppDispatch`, `useAppSelector`) in `src/shared/hooks/useRedux.ts`.
  - [ ] Create `selectionSlice.ts` in `src/features/products/store/` managing `selectedProductIds: number[]` with actions: `toggleSelectId`, `selectAllIds`, and `clearSelection`.
  - [ ] Create `uiSlice.ts` in `src/shared/store/` managing global modal/drawer states (`isCommandPaletteOpen`, `activeEditProductId`).
- **TICKET-402: Wire Multi-Row Table Selection**
  - [ ] Add header "Select All on Page" checkbox (supporting indeterminate state) and per-row checkboxes to `ProductTable.tsx`.
  - [ ] Highlight selected table rows with a subtle Tailwind accent background and keep selection intact across pagination swaps.
- **TICKET-403: Build Floating Batch Selection Dock & Bulk Actions**
  - [ ] Create `BatchSelectionDock.tsx` anchored to the bottom of the viewport whenever `selectedProductIds.length > 0`.
  - [ ] Implement batch actions: "Mark Out of Stock" (`stock: 0`), "Bulk Restock (+50)", and "Delete Selected" using parallel DummyJSON mutation calls and updating the TanStack Query cache.
  - [ ] Include a "Clear Selection" button and automatic selection reset after a batch operation succeeds.
- **TICKET-404: Implement Global `Cmd+K` / `Ctrl+K` Command Palette**
  - [ ] Create `useCommandPaletteShortcut.ts` listening for `keydown` (`(e.metaKey || e.ctrlKey) && e.key === 'k'`) to toggle `isCommandPaletteOpen`.
  - [ ] Build `CommandPaletteModal.tsx` with instant keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`) to jump to routes (`/dashboard`, `/products`), filter quick presets (e.g., "Filter: Low Stock"), or open a searched product directly in the Edit Drawer.

#### Definition of Done (Acceptance Criteria)

- Checking individual rows or the header "Select All" checkbox reveals the floating bottom Batch Action Dock showing the exact count of selected items.
- Executing "Mark Out of Stock" or "Delete Selected" from the dock updates all affected rows in the TanStack Query table cache and clears the selection dock.
- Pressing `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux) from anywhere in the app opens the Command Palette modal and focuses the search input.
- Selecting a command with the keyboard (`ArrowDown` + `Enter`) executes the navigation or action and closes the modal.

---

### Sprint 5: Dashboard Metrics View, Error Boundaries, and Production Hardening

- **Core Objective:** Build the executive Dashboard KPI view powered by aggregated product data, wrap routes in resilient Error Boundaries, and enforce all codebase quality constraints (`< 200` lines per file, strict TypeScript build).
- **Git Branch:** `feat/sprint-5-dashboard-hardening`

#### Tickets

- **TICKET-501: Build Dashboard KPI Cards & Inventory Breakdown**
  - [ ] Create `useInventoryMetrics.ts` in `src/features/dashboard/hooks/` computing derived KPIs from product data: Total SKU Count, Total Inventory Valuation ($\sum \text{price} \times \text{stock}$), Low Stock Alert Count, and Out-of-Stock Count.
  - [ ] Build `MetricStatCard.tsx` and `CategoryBreakdownList.tsx` (using pure Tailwind progress bars for category distribution and stock health).
  - [ ] Add a "Low Stock Watchlist" table widget on `/dashboard` with one-click action to open the item in the Edit Drawer or jump to `/products?category=...`.
- **TICKET-502: Add Route Error Boundaries & Retry Recovery**
  - [ ] Build `AppErrorBoundary.tsx` and React Router `errorElement` (`RouteErrorFallback.tsx`) in `src/shared/components/feedback/`.
  - [ ] Integrate `useQueryErrorResetBoundary` from TanStack Query so clicking "Try Again" in the error UI resets failed queries and re-fetches cleanly.
- **TICKET-503: Codebase Audit, Rule Enforcement & Build Verification**
  - [ ] Audit every file in `src/` to verify strict adherence to project rules: feature-based encapsulation, single primary component per `.tsx` file, and every file strictly under 200 lines.
  - [ ] Verify keyboard accessibility (`aria-label` on icon buttons, focus trapping in Drawer and `Cmd+K` modal).
  - [ ] Run `npm run lint` and `npm run build` (`tsc -b && vite build`) and resolve all TypeScript or linter warnings.

#### Definition of Done (Acceptance Criteria)

- Navigating to `/dashboard` displays real-time KPI cards and category distribution bars derived from the cached product dataset; editing a product's stock/price in `/products` immediately reflects in `/dashboard` totals.
- Simulating a failed API request (e.g., offline mode or blocked endpoint in DevTools Network tab) renders the custom Error Boundary fallback with a working "Retry" button instead of a blank white screen.
- Every file in `src/` is under 200 lines of code and exports only one primary component where applicable.
- `npm run lint` and `npm run build` pass with zero errors and zero warnings.
