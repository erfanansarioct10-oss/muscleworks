# Investigation Plan: Defensive Validation, Security Traps & Accessibility Specialist

## Scope & Focus
1. **Defensive Programming, Validation & Anti-Spam Security Traps (R3)**
   - Audit all server actions in `src/actions/`:
     - Input validation via Zod schemas (`safeParse` or `parse`) at entry boundary.
     - Return envelope: standard `ActionResult<T>` structure (`{ success, message, error, fieldErrors, data }`).
     - Honeypot enforcement (`hp_field` present, non-empty check, bot rejection).
     - Timing trap enforcement (`_form_loaded_at`, min 2000ms delay check).
     - Rate limiting integration: check Upstash Redis config, IP extraction, fallback behavior in dev/mock modes.
     - Notification dispatch: Telegram, Resend, error handling, error swallowing vs bubbling, sensitive data leakage in error responses.
2. **Accessibility, HTML Semantics & Touch Target Compliance (R4)**
   - Landmarks & Semantic HTML:
     - Check layouts and views for `<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<section>`, `<aside>`.
     - Heading hierarchy (h1 -> h2 -> h3) consistency.
   - Touch Target Sizing:
     - Interactive elements (buttons, links, select triggers, inputs) >= 44x44px (`min-h-[44px] min-w-[44px]` or adequate padding/sizing).
     - Conversion CTAs (WhatsApp buttons, Phone Call buttons, Quick Order triggers) >= 48x48px (`min-h-[48px]`).
   - Screen Reader & ARIA Attributes:
     - Icon-only buttons (search, cart/bag trigger, mobile hamburger, close buttons, quantity adjusters, accordion toggles) have `aria-label` or `.sr-only`.
     - Expandable elements have `aria-expanded` and `aria-controls`.
     - Dialog / Modal triggers and content have appropriate roles (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, etc.).
   - Contrast & Focus States:
     - Focus rings (`focus-visible:ring-...` / `outline-none focus-visible:...`).
     - Text contrast against background colors.
3. **Execution Steps**:
   - Step 1: Discover all files in `src/actions/`, `src/lib/validations/`, `src/lib/rate-limit/`, `src/lib/notifications/`, `src/components/`, `src/app/`.
   - Step 2: Perform deep dive into all files in `src/actions/` and related validators.
   - Step 3: Check graph nodes in `graphify-out/graph.json` and `graphify-out/GRAPH_REPORT.md` to map communities and node references.
   - Step 4: Perform systematic scan of UI components for accessibility, semantics, touch target dimensions, ARIA attributes, and focus rings.
   - Step 5: Formulate itemized findings with unified diff patches.
   - Step 6: Write `report.md`, `handoff.md`, update `progress.md` and `BRIEFING.md`.
   - Step 7: Send final handoff message to orchestrator.
