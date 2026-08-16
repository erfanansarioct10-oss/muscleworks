# Milestone 3 Investigation Report: Touch Targets, ARIA Attributes & Interaction States

**Explorer:** Explorer 1 (`explorer_m3_1`)  
**Target Sub-Phase / Milestone:** Milestone 3 (Touch Targets, ARIA Attributes & Interaction States)  
**Target Files:**
1. `src/components/home/featured-products-section.tsx`
2. `src/components/layout/footer.tsx`
3. `src/components/layout/mobile-nav.tsx`  
**Related Audit Findings:** LOW-01, LOW-02, LOW-03, LOW-04, LOW-09, LOW-10, INFO-02

---

## 1. Observation

Direct forensic inspection of the codebase yielded the following observations with exact file paths, line numbers, and verbatim code:

### 1.1 `src/components/home/featured-products-section.tsx`
- **Location:** Line 180 (within banner loop lines 104–189)
- **Verbatim Code:**
  ```tsx
  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-200 active:scale-95 min-h-[44px] sm:min-h-[48px] ${banner.buttonClass}`}
    aria-label={`Order ${banner.title} via WhatsApp`}
  >
    ORDER NOW
  </a>
  ```
- **Violations Observed:**
  1. **Sub-standard Conversion CTA Touch Target (<48px on Mobile):** The class `min-h-[44px] sm:min-h-[48px]` explicitly permits a 44px height on viewports `<640px`. According to Project Directive Invariant 5 (`context/coding-standards.md:69`, `AGENTS.md`), high-priority conversion CTAs (specifically WhatsApp order buttons) must maintain $\ge 48\text{px}$ touch target clearance across all viewports.
  2. **Missing Accessible Keyboard Focus Indicator:** The `<a>` element has active state animations (`active:scale-95`) but lacks explicit `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` styling.

---

### 1.2 `src/components/layout/footer.tsx`
- **Location:** Lines 266–273
- **Verbatim Code:**
  ```tsx
  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
    {LEGAL_LINKS.map((legal) => (
      <Link
        key={legal.href}
        href={legal.href}
        className="inline-flex py-1 items-center transition-colors hover:text-foreground"
      >
        {legal.label}
      </Link>
    ))}
  </div>
  ```
- **Violations Observed:**
  1. **Sub-standard Touch Target (<44px) on Legal Links:** `className="inline-flex py-1 items-center transition-colors hover:text-foreground"` has only `py-1` (4px top + 4px bottom padding) on a 12px text line, resulting in an effective touch target height of ~20px. This violates WCAG 2.1 SC 2.5.8 (Target Size Minimum, $\ge 44\text{px}$) and finding LOW-10.
  2. **Missing Keyboard Focus Rings Across Interactive Links:**
     - Legal links (line 269): Missing `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`.
     - Social channel links (lines 136–149): Have `min-h-11 min-w-11` (44px) but lack `focus-visible:ring-2` rings.
     - Category navigation links (line 165): Have `min-h-11` but lack `focus-visible:ring-2` rings.
     - Google Maps external link (line 196): Missing `focus-visible:ring-2`.
     - Direct phone & email links (lines 217–228): Missing `focus-visible:ring-2`.
  3. **Decorative SVGs Missing `aria-hidden="true"`:**
     - `ChevronRight` in category links (line 167) and `ExternalLink` in maps (line 199) need explicit `aria-hidden="true"`.

---

### 1.3 `src/components/layout/mobile-nav.tsx`
- **Location:** Lines 97–104 (Drawer Trigger), 111–125 (Header & Title/Description), 138–193 (Nav Items), 198–227 (Bottom Action Buttons)
- **Verbatim Code:**
  ```tsx
  // Trigger (lines 97-104)
  <button
    type="button"
    aria-label="Open mobile navigation menu"
    className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-95 lg:hidden"
  >
    <Menu className="h-5 w-5" />
  </button>

  // SheetHeader (lines 111-125)
  <SheetHeader className="border-b border-border p-5 text-left">
    <div className="flex items-center pr-8">
      <div className="relative h-12 w-60 shrink-0">
        <Image src="/brnding-assets/logo.webp" alt={STORE_NAME} fill sizes="240px" className="object-contain object-left" priority />
      </div>
    </div>
    <SheetTitle className="sr-only">{STORE_NAME} Navigation</SheetTitle>
  </SheetHeader>

  // Bottom Call Button (lines 216-227)
  <Button
    asChild
    variant="outline"
    size="default"
    className="w-full justify-center gap-2"
  >
    <a href={`tel:${STORE_PHONE_RAW}`}>
      <Phone className="h-4 w-4 text-foreground" />
      <span>Call Store: {STORE_PHONE}</span>
    </a>
  </Button>
  ```
- **Violations Observed:**
  1. **Missing `SheetDescription` (Radix Dialog A11y):** `SheetContent` defines `<SheetTitle className="sr-only">` but lacks `<SheetDescription className="sr-only">`, which can cause Radix dialog description warnings in screen reader accessibility trees.
  2. **Missing `focus-visible` Rings on Trigger & Nav Items:** The hamburger `<button>` trigger (line 100), category links (line 142), and trust links (line 176) do not specify `focus-visible:ring-2 focus-visible:ring-ring`.
  3. **Touch Target Sizing on Phone Conversion CTA:** The phone call button uses `size="default"` (`h-11` = 44px). Upgrading to `size="lg"` or adding `min-h-[48px]` ensures both primary conversion actions at the base of the drawer achieve $\ge 48\text{px}$.
  4. **Subordinate Icon Accessibility:** Icons in navigation links (`Menu`, `Icon`, `ChevronRight`, `MessageCircle`, `Phone`) lack explicit `aria-hidden="true"`.

---

## 2. Logic Chain

1. **Premise 1 (Project Design Directives & Invariants):**
   - Standard interactive controls (buttons, links, icon buttons) must satisfy $\ge 44 \times 44\text{px}$ touch target bounds.
   - High-priority conversion CTAs (direct WhatsApp order links, direct phone call links) must satisfy $\ge 48 \times 48\text{px}$ touch target bounds across **all screen sizes**, especially mobile smartphones.
   - All interactive controls must support keyboard accessibility with clear `focus-visible` styling (`ring-2 ring-ring`).
   - Radix Dialogs/Sheets must provide both an accessible Title (`DialogTitle`/`SheetTitle`) and an accessible Description (`DialogDescription`/`SheetDescription`) to satisfy screen reader regional requirements.

2. **Premise 2 (Direct Code Evidence):**
   - `featured-products-section.tsx:180` uses `min-h-[44px] sm:min-h-[48px]`, causing mobile WhatsApp order buttons to render at 44px rather than the required 48px.
   - `footer.tsx:269` uses `py-1` without `min-h-[44px]`, causing legal links to render at ~20px height.
   - `mobile-nav.tsx:111-125` lacks `<SheetDescription>` and uses `size="default"` (44px) for the direct telephone conversion CTA.
   - Across `featured-products-section.tsx`, `footer.tsx`, and `mobile-nav.tsx`, multiple interactive elements lack `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` focus indicators and `aria-hidden="true"` on non-semantic icons.

3. **Inference / Conclusion:**
   - Surgical updates to these 3 components will completely eliminate the touch target and ARIA accessibility violations without altering the visual hierarchy or introducing regressions.

---

## 3. Caveats

1. **Review Carousel Pagination:** `CustomerReviewsSection` (`src/components/home/customer-reviews-section.tsx:132`) was inspected and found to already have `min-h-[44px] min-w-[44px]` with `focus-visible:ring-2` applied in earlier milestones.
2. **Brand Filter Checkbox:** `src/components/catalog/brand-filter.tsx:110` (Finding INFO-02) is a related M3 file where `<input type="checkbox">` requires `aria-label={`Filter by brand ${brand.name}`}`.
3. **No Source Code Modified:** In accordance with the Explorer role, no source code in `src/` was modified during this investigation.

---

## 4. Conclusion & Concrete Remediation Plan

### Proposed Code Diff for `src/components/home/featured-products-section.tsx`
```diff
--- a/src/components/home/featured-products-section.tsx
+++ b/src/components/home/featured-products-section.tsx
@@ -177,8 +177,8 @@ export function FeaturedProductsSection() {
                     <a
                       href={whatsappUrl}
                       target="_blank"
                       rel="noopener noreferrer"
-                      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-200 active:scale-95 min-h-[44px] sm:min-h-[48px] ${banner.buttonClass}`}
+                      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-200 active:scale-95 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${banner.buttonClass}`}
                       aria-label={`Order ${banner.title} via WhatsApp`}
                     >
                       ORDER NOW
```

---

### Proposed Code Diff for `src/components/layout/footer.tsx`
```diff
--- a/src/components/layout/footer.tsx
+++ b/src/components/layout/footer.tsx
@@ -136,7 +136,7 @@ export function Footer() {
                       key={social.platform}
                       href={social.href}
                       target="_blank"
                       rel="noopener noreferrer"
-                      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-secondary/60 p-2.5 text-muted-foreground transition-all duration-200 active:scale-95 shadow-xs ${
+                      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-secondary/60 p-2.5 text-muted-foreground transition-all duration-200 active:scale-95 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                         isWhatsApp
                           ? "hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
                           : "hover:border-pink-500 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white"
@@ -164,8 +164,8 @@ export function Footer() {
                 <li key={cat.href}>
                   <Link
                     href={cat.href}
-                    className="group inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
+                    className="group inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
                   >
-                    <ChevronRight className="h-3 w-3 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
+                    <ChevronRight className="h-3 w-3 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
                     <span>{cat.label}</span>
                   </Link>
@@ -193,7 +193,7 @@ export function Footer() {
                   <a
                     href={STORE_LOCATION.googleMapsUrl}
                     target="_blank"
                     rel="noopener noreferrer"
-                    className="inline-flex min-h-11 items-center gap-1 font-medium text-foreground hover:text-accent hover:underline mt-1"
+                    className="inline-flex min-h-11 items-center gap-1 font-medium text-foreground hover:text-accent hover:underline mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                   >
                     <span>Get Directions on Google Maps</span>
-                    <ExternalLink className="h-3 w-3" />
+                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                   </a>
@@ -217,14 +217,14 @@ export function Footer() {
                 <a
                   href={`tel:${STORE_PHONE_RAW}`}
-                  className="inline-flex min-h-12 min-w-12 items-center gap-2 font-medium text-foreground hover:text-accent"
+                  className="inline-flex min-h-12 min-w-12 items-center gap-2 font-medium text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                 >
-                  <Phone className="h-3.5 w-3.5 text-accent" />
+                  <Phone className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                   <span>{STORE_PHONE}</span>
                 </a>
                 <a
                   href={`mailto:${STORE_EMAIL}`}
-                  className="inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-foreground"
+                  className="inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                 >
-                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
+                  <Mail className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                   <span>{STORE_EMAIL}</span>
                 </a>
@@ -266,7 +266,7 @@ export function Footer() {
             {LEGAL_LINKS.map((legal) => (
               <Link
                 key={legal.href}
                 href={legal.href}
-                className="inline-flex py-1 items-center transition-colors hover:text-foreground"
+                className="inline-flex min-h-[44px] items-center py-2 px-1 text-xs transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
               >
                 {legal.label}
               </Link>
```

---

### Proposed Code Diff for `src/components/layout/mobile-nav.tsx`
```diff
--- a/src/components/layout/mobile-nav.tsx
+++ b/src/components/layout/mobile-nav.tsx
@@ -23,4 +23,5 @@ import {
   SheetHeader,
   SheetTitle,
+  SheetDescription,
   SheetTrigger,
 } from "@/components/ui/sheet";
@@ -100,3 +101,3 @@ export function MobileNav() {
-          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-95 lg:hidden"
+          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
         >
-          <Menu className="h-5 w-5" />
+          <Menu className="h-5 w-5" aria-hidden="true" />
         </button>
@@ -124,3 +125,6 @@ export function MobileNav() {
           <SheetTitle className="sr-only">{STORE_NAME} Navigation</SheetTitle>
+          <SheetDescription className="sr-only">
+            Mobile navigation menu for {STORE_NAME} supplement catalog, store location, and contact options.
+          </SheetDescription>
         </SheetHeader>
@@ -142,3 +146,3 @@ export function MobileNav() {
-                    className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
+                    className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                   >
                     <div className="flex items-center gap-3">
                       <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
-                        <Icon className="h-4 w-4" />
+                        <Icon className="h-4 w-4" aria-hidden="true" />
                       </div>
                       <span>{item.label}</span>
                     </div>
                     {item.badge ? (
                       <Badge variant="default" className="text-[10px]">
                         {item.badge}
                       </Badge>
                     ) : (
-                      <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
+                      <ChevronRight className="h-4 w-4 text-muted-foreground/60" aria-hidden="true" />
                     )}
                   </Link>
@@ -176,3 +180,3 @@ export function MobileNav() {
-                    className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
+                    className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                   >
                     <div className="flex items-start gap-3">
                       <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-accent">
-                        <Icon className="h-4 w-4" />
+                        <Icon className="h-4 w-4" aria-hidden="true" />
                       </div>
                       <div className="flex flex-col">
                         <span>{item.label}</span>
                         <span className="text-xs font-normal text-muted-foreground">
                           {item.description}
                         </span>
                       </div>
                     </div>
-                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
+                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                   </Link>
@@ -203,7 +207,7 @@ export function MobileNav() {
-            className="w-full justify-center gap-2 shadow-lg font-semibold"
+            className="w-full justify-center gap-2 shadow-lg font-semibold min-h-[48px]"
           >
             <a
               href={whatsappUrl}
               target="_blank"
               rel="noopener noreferrer"
               onClick={() => setOpen(false)}
             >
-              <MessageCircle className="h-5 w-5" />
+              <MessageCircle className="h-5 w-5" aria-hidden="true" />
               <span>Order on WhatsApp</span>
             </a>
           </Button>
 
           <Button
             asChild
             variant="outline"
-            size="default"
-            className="w-full justify-center gap-2"
+            size="lg"
+            className="w-full justify-center gap-2 min-h-[48px]"
           >
             <a href={`tel:${STORE_PHONE_RAW}`}>
-              <Phone className="h-4 w-4 text-foreground" />
+              <Phone className="h-4 w-4 text-foreground" aria-hidden="true" />
               <span>Call Store: {STORE_PHONE}</span>
             </a>
           </Button>
```

---

## 5. Verification Method

Once applied by the worker, the changes can be independently verified using the following suite:

1. **Type Checking:**
   ```bash
   npx tsc --noEmit
   ```
   *Expected result:* 0 errors.

2. **Linting:**
   ```bash
   npm run lint
   ```
   *Expected result:* 0 warnings, 0 errors.

3. **Touch Target Class Verification (Grep):**
   - Verify `min-h-[48px]` exists in `featured-products-section.tsx`:
     ```powershell
     Select-String -Path "src/components/home/featured-products-section.tsx" -Pattern "min-h-\[48px\]"
     ```
   - Verify `min-h-[44px]` on footer legal links:
     ```powershell
     Select-String -Path "src/components/layout/footer.tsx" -Pattern "min-h-\[44px\]"
     ```
   - Verify `SheetDescription` in `mobile-nav.tsx`:
     ```powershell
     Select-String -Path "src/components/layout/mobile-nav.tsx" -Pattern "SheetDescription"
     ```

4. **Automated Component Verification Scripts:**
   ```bash
   node src/scripts/validate-mobile-nav.ts
   node src/scripts/validate-home-components.ts
   ```
