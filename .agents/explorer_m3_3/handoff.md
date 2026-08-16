# Milestone 3 Forensic Investigation Report: Touch Targets, ARIA Attributes & Interaction States

**Target Directory:** `c:\nooridigital_assets\my-projects\muscleworks`  
**Investigator:** Explorer M3-3  
**Milestone:** Milestone 3 (LOW-01, LOW-02, LOW-03, LOW-04, LOW-09)  
**Date:** August 15, 2026  

---

## 1. Observation

Direct static AST and code inspection across all relevant components revealed the following findings:

### 1.1 Touch Target Deficiencies (LOW-01 & LOW-10)

1. **`src/components/home/featured-products-section.tsx:180`**
   - **Verbatim Code:**
     ```tsx
     className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-200 active:scale-95 min-h-[44px] sm:min-h-[48px] ${banner.buttonClass}`}
     ```
   - **Observed Deficiency:** The primary WhatsApp conversion CTA specifies `min-h-[44px] sm:min-h-[48px]`. On mobile viewport screens (<640px), the button renders with a 44px height rather than the mandatory $\ge 48\text{px}$ minimum height prescribed by Project Directive Invariant 5.

2. **`src/components/layout/footer.tsx:265-273`**
   - **Verbatim Code:**
     ```tsx
     {LEGAL_LINKS.map((legal) => (
       <Link
         key={legal.href}
         href={legal.href}
         className="inline-flex py-1 items-center transition-colors hover:text-foreground"
       >
         {legal.label}
       </Link>
     ))}
     ```
   - **Observed Deficiency:** Footer legal and policy links (`/authenticity`, `/shipping`, `/returns`, `/privacy`, `/terms`) specify `py-1`, producing a touch target height of ~24px on mobile touchscreens, violating WCAG 2.1 SC 2.5.8 Target Size Minimum ($\ge 44\text{px}$).

3. **`src/components/catalog/search-modal.tsx:240-247`**
   - **Verbatim Code:**
     ```tsx
     <button
       type="button"
       onClick={handleClearHistory}
       className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none"
     >
       <Trash2 className="h-3 w-3" />
       <span>Clear</span>
     </button>
     ```
   - **Observed Deficiency:** The "Clear" button for recent searches history lacks minimum touch target bounds, rendering at ~20px height on mobile screens.

4. **`src/components/home/customer-reviews-section.tsx:128-144`**
   - **Status Check:** Already remediated to `<button type="button" onClick={() => scrollToCard(i)} className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900" aria-label={`Go to review ${i + 1}`} aria-current={activeIndex === i ? "true" : undefined}><span className="... w-2.5 h-2.5 ..."/></button>`. Compliant.

---

### 1.2 ARIA Attributes & Form Accessibility (LOW-02 & LOW-03)

1. **`src/components/catalog/brand-filter.tsx:109-114`**
   - **Verbatim Code:**
     ```tsx
     <input
       type="checkbox"
       checked={isChecked}
       onChange={() => onToggleBrand?.(brand.slug)}
       className="sr-only"
     />
     ```
   - **Observed Deficiency:** Hidden filter checkbox lacks an explicit `aria-label={`Filter by brand ${brand.name}`}` compared to `catalog-filters.tsx:220`. Adding explicit `aria-label` prevents ambiguity in virtual screen reader cursor navigation.

2. **`src/components/forms/inquiry-form.tsx` & `src/components/forms/contact-form.tsx`**
   - **Status Check:** Both form components already implement:
     - Explicit `<label htmlFor="...">` matching input `id`
     - Required field markers `<span className="text-destructive">*</span>`
     - Accessible validation feedback with `aria-invalid` and `aria-describedby`
     - Custom radio buttons with `role="radiogroup"`, `aria-labelledby`, `role="radio"`, and `aria-checked`
     - Honeypot fields isolated with `tabIndex={-1}`, `aria-hidden="true"`, `autoComplete="nope"`.
     - Compliant with WCAG 2.1 AA.

---

### 1.3 React 19 Concurrent Transitions & Search Modal Interaction (LOW-07 / LOW-09)

1. **`src/components/catalog/search-modal.tsx:64, 110-149`**
   - **Verbatim Code:**
     ```tsx
     const [results, setResults] = React.useState<SearchResult[]>([]);
     ...
     const timer = setTimeout(async () => {
       setIsLoading(true);
       try {
         const res = await searchProducts(trimmed, 8);
         if (cancelled) return;
         setResults(res);
       } catch (err) {
         if (cancelled) return;
         console.error("Search modal query error:", err);
         setResults([]);
       } finally {
         if (!cancelled) {
           setIsLoading(false);
         }
       }
     }, 150);
     ```
   - **Observed Deficiency:** In React 19, typing in the search input is an urgent update, while rendering matching product cards is a non-urgent transition. Calling `setResults(res)` directly without wrapping in `React.startTransition()` can block the main JavaScript thread on low-end mobile CPUs during rapid typing against fuzzy index matches.

2. **`src/components/catalog/search-modal.tsx:78-80` (Dialog Focus Trap & Timing)**
   - **Verbatim Code:**
     ```tsx
     if (open) {
       setRecentSearches(getRecentSearches());
       focusTimerRef.current = setTimeout(() => inputRef.current?.focus(), 100);
     }
     ```
   - **Observed Deficiency:** Uses a manual `setTimeout(..., 100)` focus delay rather than Radix Dialog's canonical `onOpenAutoFocus` callback on `DialogContent`.

---

### 1.4 Button Contrast & Focus States (LOW-04)

1. **`src/components/ui/button.tsx:6-48` & `src/app/globals.css:37`**
   - **Observation:**
     - Base button class applies `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`.
     - `--color-ring` is `#0b0b0b` (Jet Black), providing a 21:1 contrast ratio against `#ffffff` and 18.5:1 against `--color-background` (`#fcfcfc`), well above the WCAG AA 3:1 non-text focus ring contrast threshold.
     - Button size variants (`default`: `h-11`, `sm`: `h-11`, `icon`: `h-11 w-11`, `lg`: `h-12`, `xl`: `h-14`) enforce $\ge 44\text{px}$ standard and $\ge 48\text{px}$ CTA heights.
     - `whatsapp` button variant enforces `min-h-12 min-w-12` (48x48px).

---

## 2. Logic Chain

1. **Touch Target Rule Evaluation:**
   - Project Directives (Invariant 5) dictate: Standard interactive elements $\ge 44\text{px}\times 44\text{px}$; primary conversion CTAs (WhatsApp orders / Phone call triggers) $\ge 48\text{px}\times 48\text{px}$.
   - `featured-products-section.tsx:180` uses `min-h-[44px]` on mobile (<640px) for WhatsApp ordering. Upgrading to `min-h-[48px]` ensures strict compliance across all viewports.
   - `footer.tsx:269` uses `py-1` on legal links. Adding `min-h-[44px] items-center py-2 px-1` provides the necessary 44px tap clearance without altering desktop layout.
   - `search-modal.tsx:240` uses unconstrained text for history clearing. Adding `min-h-[44px] min-w-[44px]` ensures thumb accessibility.

2. **ARIA & Assistive Tech Accessibility:**
   - In `brand-filter.tsx`, adding `aria-label={`Filter by brand ${brand.name}`}` on the checkbox ensures screen reader virtual cursors announce the action explicitly, harmonizing with `catalog-filters.tsx:220`.
   - In `search-modal.tsx`, adding `role="searchbox"`, `aria-autocomplete="list"`, `aria-controls="search-results-list"`, and `aria-expanded={results.length > 0}` completes the WAI-ARIA Combobox / Searchbox pattern.

3. **React 19 Concurrent Transitions:**
   - In React 19, wrapping non-urgent async state dispatches (`setResults(res)`) inside `React.startTransition(() => { setResults(res); })` allows the React concurrent reconciler to interrupt search rendering if the user types another character immediately, preventing input jank.
   - Replacing `focusTimerRef` and `setTimeout(..., 100)` with `onOpenAutoFocus={(e) => { e.preventDefault(); inputRef.current?.focus(); }}` on `DialogContent` removes arbitrary timer races and ensures focus is trapped cleanly upon dialog opening.

---

## 3. Caveats

1. **No caveats.** All findings are localized to client leaf UI components and presentation templates without touching data contracts, server actions, or backend secrets.
2. Changes are non-breaking and preserve existing visual designs.

---

## 4. Conclusion & Concrete Remediation Plan

The following copy-paste ready diffs provide the complete implementation plan for Milestone 3:

### File 1: `src/components/home/featured-products-section.tsx`
```diff
--- a/src/components/home/featured-products-section.tsx
+++ b/src/components/home/featured-products-section.tsx
@@ -177,7 +177,7 @@ export function FeaturedProductsSection() {
                     <a
                       href={whatsappUrl}
                       target="_blank"
                       rel="noopener noreferrer"
-                      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-200 active:scale-95 min-h-[44px] sm:min-h-[48px] ${banner.buttonClass}`}
+                      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-200 active:scale-95 min-h-[48px] ${banner.buttonClass}`}
                       aria-label={`Order ${banner.title} via WhatsApp`}
                     >
                       ORDER NOW
```

---

### File 2: `src/components/layout/footer.tsx`
```diff
--- a/src/components/layout/footer.tsx
+++ b/src/components/layout/footer.tsx
@@ -265,7 +265,7 @@ export function Footer() {
             {LEGAL_LINKS.map((legal) => (
               <Link
                 key={legal.href}
                 href={legal.href}
-                className="inline-flex py-1 items-center transition-colors hover:text-foreground"
+                className="inline-flex min-h-[44px] items-center py-2 px-1 text-xs transition-colors hover:text-foreground"
               >
                 {legal.label}
               </Link>
```

---

### File 3: `src/components/catalog/brand-filter.tsx`
```diff
--- a/src/components/catalog/brand-filter.tsx
+++ b/src/components/catalog/brand-filter.tsx
@@ -107,6 +107,7 @@ export function BrandFilter({
                 <input
                   type="checkbox"
                   checked={isChecked}
                   onChange={() => onToggleBrand?.(brand.slug)}
+                  aria-label={`Filter by brand ${brand.name}`}
                   className="sr-only"
                 />
```

---

### File 4: `src/components/catalog/search-modal.tsx`
```diff
--- a/src/components/catalog/search-modal.tsx
+++ b/src/components/catalog/search-modal.tsx
@@ -65,18 +65,11 @@ export function SearchModal({
   const [isLoading, setIsLoading] = React.useState(false);
   const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
+  const [, startTransition] = React.useTransition();
 
   const inputRef = React.useRef<HTMLInputElement>(null);
-  const focusTimerRef = React.useRef<NodeJS.Timeout | null>(null);
 
   const handleOpenChange = React.useCallback(
     (open: boolean) => {
-      if (focusTimerRef.current) {
-        clearTimeout(focusTimerRef.current);
-        focusTimerRef.current = null;
-      }
-
       if (open) {
         setRecentSearches(getRecentSearches());
-        focusTimerRef.current = setTimeout(() => inputRef.current?.focus(), 100);
       } else {
         setQuery("");
         setResults([]);
@@ -87,14 +80,6 @@ export function SearchModal({
     [setOpen]
   );
 
-  React.useEffect(() => {
-    return () => {
-      if (focusTimerRef.current) {
-        clearTimeout(focusTimerRef.current);
-      }
-    };
-  }, []);
-
   // Global Cmd+K / Ctrl+K keyboard shortcut listener
   React.useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
@@ -118,7 +103,9 @@ export function SearchModal({
     if (!trimmed) {
       const emptyTimer = setTimeout(() => {
         if (!cancelled) {
-          setResults([]);
+          startTransition(() => {
+            setResults([]);
+          });
           setIsLoading(false);
         }
       }, 0);
@@ -133,7 +120,9 @@ export function SearchModal({
       try {
         const res = await searchProducts(trimmed, 8);
         if (cancelled) return;
-        setResults(res);
+        startTransition(() => {
+          setResults(res);
+        });
       } catch (err) {
         if (cancelled) return;
         console.error("Search modal query error:", err);
@@ -188,6 +177,10 @@ export function SearchModal({
     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
       {children && <DialogTrigger asChild>{children}</DialogTrigger>}
-      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden sm:max-w-2xl bg-card border-border shadow-2xl">
+      <DialogContent
+        onOpenAutoFocus={(e) => {
+          e.preventDefault();
+          inputRef.current?.focus();
+        }}
+        className="max-w-2xl p-0 gap-0 overflow-hidden sm:max-w-2xl bg-card border-border shadow-2xl"
+      >
           <DialogHeader className="sr-only">
             <DialogTitle>Search Supplement Catalog</DialogTitle>
@@ -204,6 +197,9 @@ export function SearchModal({
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               onKeyDown={handleKeyDown}
+              role="searchbox"
+              aria-autocomplete="list"
+              aria-expanded={results.length > 0}
+              aria-controls="search-results-list"
               placeholder="Search Optimum, Creatine, Whey, Gold Standard..."
               aria-label="Search supplement catalog"
               className="h-10 w-full bg-transparent text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
@@ -240,7 +236,7 @@ export function SearchModal({
                       <button
                         type="button"
                         onClick={handleClearHistory}
-                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none"
+                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 px-2 text-xs text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none rounded-md"
                       >
                         <Trash2 className="h-3 w-3" />
                         <span>Clear</span>
@@ -304,6 +300,7 @@ export function SearchModal({
                 <div className="space-y-1.5" id="search-results-list" role="listbox">
                   {results.map((res) => {
```

---

## 5. Verification Method

To independently verify the implementation:

1. **TypeScript Typecheck:**
   ```bash
   npx tsc --noEmit
   ```
   *Expected result:* 0 errors.

2. **Linter Inspection:**
   ```bash
   npm run lint
   ```
   *Expected result:* 0 errors or warnings.

3. **Touch Target Verification Checklist:**
   - `featured-products-section.tsx`: WhatsApp button on mobile has `min-h-[48px]`.
   - `footer.tsx`: All legal links have `min-h-[44px]`.
   - `search-modal.tsx`: Clear history button has `min-h-[44px] min-w-[44px]`.
   - `brand-filter.tsx`: Checkbox has `aria-label={`Filter by brand ${brand.name}`}`.
   - `search-modal.tsx`: Transition uses `React.useTransition()` and dialog uses `onOpenAutoFocus`.

4. **Invalidation Conditions:**
   - Any touch target `<44px` for standard controls or `<48px` for WhatsApp/Call CTAs.
   - Unhandled Promise or async state tearing during typing in `SearchModal`.
   - Regressions in build or test suites.
