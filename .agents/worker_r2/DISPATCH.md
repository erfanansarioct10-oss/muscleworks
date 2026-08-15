## 2026-08-15T09:22:24Z

You are Worker R2 (teamwork_preview_worker) responsible for Milestone R2: Catalog, Search, Filtering & Accessibility Fixes.

Working Directory: c:\nooridigital_assets\my-projects\muscleworks\.agents\worker_r2
Original Request Reference: c:\nooridigital_assets\my-projects\muscleworks\.agents\ORIGINAL_REQUEST.md
Audit Analysis Reference: c:\nooridigital_assets\my-projects\muscleworks\.agents\reviewer_1\analysis.md
Codebase Root: c:\nooridigital_assets\my-projects\muscleworks

Assigned Findings to Remediate:
1. CRIT-03: Non-semantic filter controls lacking keyboard accessibility & ARIA
   - Files: `src/components/catalog/catalog-filters.tsx`, `src/components/catalog/active-filters.tsx`
   - Convert filter tags to native controls with accessible labels, keyboard focus rings, touch targets (>=44px), and proper accessibility semantics.
2. MAJ-09: Search Enter-key navigation failure & debounce spinner delay
   - Files: `src/components/catalog/search-bar.tsx`, `src/components/catalog/search-modal.tsx`
   - Handle Enter key navigation to `/products?search=${encodeURIComponent(query)}` (or `/catalog?search=...`); ensure accessible names on search inputs and optimize spinner states.
3. MAJ-12: Concurrent Promise race condition in search index initialization
   - File: `src/lib/search.ts`
   - Implement a cached initialization Promise singleton (`fuseInitPromise`) so concurrent requests await the same initialization.
4. MIN-06: Cumulative Layout Shift (CLS) on `StoreHoursCard` empty state
   - File: `src/components/location/store-hours-card.tsx`
   - Render predictable SSR initial state or props (`initialOpeningHours`, `initialContacts`) to prevent layout flashing.
5. MIN-07: Midnight `hourCycle: 'h23'` runtime ambiguity in `Intl.DateTimeFormat`
   - File: `src/lib/data/store.ts`
   - Ensure `hourCycle: 'h23'` is explicitly passed in `Intl.DateTimeFormat`.

Exclusive File Ownership:
- `src/components/catalog/catalog-filters.tsx`
- `src/components/catalog/active-filters.tsx`
- `src/components/catalog/search-bar.tsx`
- `src/components/catalog/search-modal.tsx`
- `src/lib/search.ts`
- `src/components/location/store-hours-card.tsx`
- `src/lib/data/store.ts`
