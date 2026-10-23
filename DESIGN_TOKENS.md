# Acme Ops Visual Design Spec

## 1. Structural Shell Dimensions
- **Left Sidebar:** Fixed width `w-64` (`256px`), background `#0f172a` (`bg-slate-900`), text `#94a3b8` (`text-slate-400`), active link `#2563eb` (`bg-blue-600 text-white font-medium rounded-lg`).
- **Top Navbar:** Fixed height `h-16` (`64px`), background `#ffffff` (`bg-white`), bottom border `border-b border-slate-200`, horizontal padding `px-6`.
- **Main Content Area:** `flex-1 overflow-y-auto bg-slate-50 p-6`.
- **Slide-Over Edit Drawer:** Fixed right panel `w-[440px] bg-white h-full shadow-2xl border-l border-slate-200 z-50`.
- **Floating Batch Action Dock:** `fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl border border-slate-700 z-40`.

## 2. Component Token Recipes
- **Primary Button:** `bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition-colors`
- **Secondary Button:** `bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm px-4 py-2 rounded-lg border border-slate-300 shadow-sm transition-colors`
- **Table Container:** `bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden`
- **Table Header (`thead`):** `bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500`
- **Table Row (`tr`):** `border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-sm text-slate-700`
- **Selected Table Row:** `bg-blue-50/60 hover:bg-blue-50`

## 3. Stock Status Pill Badges
- **In Stock (`stock >= 30`):** `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200`
- **Low Stock (`stock 1..29`):** `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200`
- **Out of Stock (`stock === 0`):** `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200`

