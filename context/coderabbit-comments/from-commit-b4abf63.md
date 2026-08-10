<!-- This is an auto-generated comment: summarize by coderabbit.ai -->
<!-- review_stack_entry_start -->

[![Review Change Stack](https://storage.googleapis.com/coderabbit_public_assets/review-stack-in-coderabbit-ui.svg)](https://app.coderabbit.ai/change-stack/erfanansarioct10-oss/muscleworks/pull/4?utm_source=github_walkthrough&utm_medium=github&utm_campaign=change_stack)

<!-- review_stack_entry_end -->
<!-- walkthrough_start -->

<details>
<summary>📝 Walkthrough</summary>

## Walkthrough

This pull request replaces the starter Next.js application with the MuscleWorks Supplements foundation. It adds project specifications, validated catalog data, storefront routes, reusable UI, product and catalog flows, WhatsApp ordering, analytics, inquiry actions, notifications, security controls, and validation scripts.

### Changes

**MuscleWorks storefront foundation**

|Layer / File(s)|Summary|
|---|---|
|**Project guidance and application foundation** <br> `AGENTS.md`, `context/...`, `package.json`, `next.config.ts`, `tsconfig.json`, `src/app/...`|Added canonical project guidance, architecture documents, feature specifications, package dependencies, path aliases, Tailwind styling, root layout, metadata, navigation, footer, 404 handling, and error boundaries.|
|**Validated domain data and accessors** <br> `data/*`, `src/lib/validations/*`, `src/lib/data/*`, `scripts/validate-datasets.ts`|Added product, brand, category, FAQ, guide, and store datasets. Added Zod schemas, typed accessors, cross-reference validation, store-hours handling, and dataset checks.|
|**Catalog, search, and filtering** <br> `src/lib/catalog.ts`, `src/lib/search.ts`, `src/components/catalog/*`, `src/app/products/*`, `src/app/categories/*`, `src/app/brands/*`|Added catalog filtering and sorting, Fuse.js search, recent-search storage, URL-synchronized filters, mobile filter drawers, product catalog routes, category routes, and brand routes.|
|**Reusable UI and product presentation** <br> `src/components/ui/*`, `src/components/product/*`|Added CVA and Radix-based UI primitives, product cards and grids, galleries, variant selectors, stock indicators, nutrition and authenticity sections, related products, and the mobile sticky order bar.|
|**WhatsApp ordering and analytics** <br> `src/lib/whatsapp.ts`, `src/lib/analytics.ts`, `src/lib/constants.ts`, `src/scripts/validate-whatsapp-analytics.ts`|Added centralized WhatsApp URL builders for orders, inquiries, authenticity checks, consultations, and store locations. Added guarded GA4, Meta Pixel, and DOM event tracking.|
|**Inquiry security and notifications** <br> `src/actions/*`, `src/lib/services/*`, `src/emails/*`, `src/types/actions.ts`, `src/scripts/validate-*`|Added standardized action results, honeypot and timing-trap checks, sanitization, scoped rate limiting, Telegram alerts, Resend email dispatch, React Email templates, and server-action validation scripts.|

**Estimated code review effort:** 5 (Critical) | ~120 minutes

**Possibly related PRs**

- [erfanansarioct10-oss/muscleworks#1](https://github.com/erfanansarioct10-oss/muscleworks/pull/1) — Adds the project context and architecture foundation extended by this pull request.
- [erfanansarioct10-oss/muscleworks#2](https://github.com/erfanansarioct10-oss/muscleworks/pull/2) — Contains related scaffolding, documentation, layout, UI, constants, and utility changes.
- [erfanansarioct10-oss/muscleworks#3](https://github.com/erfanansarioct10-oss/muscleworks/pull/3) — Contains related schemas, datasets, routes, components, utilities, and feature specifications.

</details>

<!-- walkthrough_end -->
<!-- pre_merge_checks_walkthrough_start -->

<details>
<summary>🚥 Pre-merge checks | ✅ 4 | ❌ 1</summary>

### ❌ Failed checks (1 inconclusive)

|  Check name | Status         | Explanation                                                                                                                                                      | Resolution                                                                                                                                          |
| :---------: | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title check | ❓ Inconclusive | The title identifies the project phase but does not describe the substantial catalog, data, UI, routing, security, and notification changes in the pull request. | Replace “Phase 5” with a concise summary of the primary implementation changes, such as “Add catalog, product, inquiry, and notification features.” |

<details>
<summary>✅ Passed checks (4 passed)</summary>

|         Check name         | Status   | Explanation                                                                                                |
| :------------------------: | :------- | :--------------------------------------------------------------------------------------------------------- |
|      Description Check     | ✅ Passed | Check skipped - CodeRabbit’s high-level summary is enabled.                                                |
|     Docstring Coverage     | ✅ Passed | No functions found in the changed files to evaluate docstring coverage. Skipping docstring coverage check. |
|     Linked Issues check    | ✅ Passed | Check skipped because no linked issues were found for this pull request.                                   |
| Out of Scope Changes check | ✅ Passed | Check skipped because no linked issues were found for this pull request.                                   |

</details>

</details>

<!-- pre_merge_checks_walkthrough_end -->
<!-- finishing_touch_checkbox_start -->

<details>
<summary>✨ Finishing Touches</summary>

<details>
<summary>📝 Generate docstrings</summary>

- [ ] <!-- {"checkboxId": "7962f53c-55bc-4827-bfbf-6a18da830691"} --> Create stacked PR
- [ ] <!-- {"checkboxId": "3e1879ae-f29b-4d0d-8e06-d12b7ba33d98"} --> Commit on current branch

</details>
<details>
<summary>🧪 Generate unit tests (beta)</summary>

- [ ] <!-- {"checkboxId": "f47ac10b-58cc-4372-a567-0e02b2c3d479", "radioGroupId": "utg-output-choice-group-unknown_comment_id"} -->   Create PR with unit tests
- [ ] <!-- {"checkboxId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8", "radioGroupId": "utg-output-choice-group-unknown_comment_id"} -->   Commit unit tests in branch `Phase-5`

</details>

</details>

<!-- finishing_touch_checkbox_end -->
<!-- tips_start -->

---




<sub>Comment `@coderabbitai help` to get the list of available commands.</sub>

<!-- tips_end -->

**Actionable comments posted: 2**

> [!NOTE]
> Due to the large number of review comments, Critical severity comments were prioritized as inline comments.

<details>
<summary>🟡 Minor comments (40)</summary><blockquote>

<details>
<summary>src/app/page.tsx-21-30 (1)</summary><blockquote>

`21-30`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Remove or update the stale rollout status.**

The homepage states “Sub-Phase 0.2 Active,” but this PR is Phase 5. Do not show obsolete internal implementation status to customers. Replace it with current public content or remove the badge.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/app/page.tsx` around lines 21 - 30, Update the badge in the homepage’s
badge group to remove the obsolete “Sub-Phase 0.2 Active” rollout status,
replacing it with current customer-facing content or removing that badge while
preserving the other public badges.
```

</details>

<!-- cr-comment:v1:b02916a7e2019cebbf9cb33e -->

</blockquote></details>
<details>
<summary>src/app/not-found.tsx-17-23 (1)</summary><blockquote>

`17-23`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Point the store shortcut to an existing route.**

`/location` is not present in the supplied App Router route inventory. Selecting “Golfutar Store” from this 404 page leads to another 404 page. Use an existing route or add the location route in its approved sub-phase.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/app/not-found.tsx` around lines 17 - 23, Update the “Golfutar Store”
entry in CATEGORY_SHORTCUTS to use an existing App Router route instead of
/location, or add the location route only if it is part of the approved
sub-phase. Preserve the shortcut label and icon.
```

</details>

<!-- cr-comment:v1:b80df375d695d8889d1d7a94 -->

</blockquote></details>
<details>
<summary>src/app/globals.css-3-5 (1)</summary><blockquote>

`3-5`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Use distinct `next/font` variables in the theme mapping.**

Rename the variables in `src/app/layout.tsx`, then use `@theme inline` to map them to `--font-sans` and `--font-heading`. This prevents self-reference and ensures Tailwind utilities resolve the loaded fonts and fallbacks.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/app/globals.css` around lines 3 - 5, Rename the next/font variable
definitions in layout.tsx to distinct names, then update the globals.css `@theme`
block to `@theme` inline and map --font-sans and --font-heading to those renamed
variables with the existing fallbacks. Ensure neither theme variable
self-references and Tailwind font utilities resolve the loaded fonts.
```

</details>

<!-- cr-comment:v1:b41a87fd3317a9c78a979943 -->

</blockquote></details>
<details>
<summary>context/coderabbit-comments/from-commit-d8692fd.md-1108-1109 (1)</summary><blockquote>

`1108-1109`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Fix the malformed `summary` closing tag.**

Line [1108] closes `<summary>` with `</parameter>`. Replace it with `</summary>` so the disclosure markup remains valid.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/coderabbit-comments/from-commit-d8692fd.md` around lines 1108 - 1109,
Correct the malformed closing tag in the summary markup by replacing the
`</parameter>` terminator with `</summary>`, preserving valid disclosure
structure.
```

</details>

<!-- cr-comment:v1:646b603157618f197d275c3e -->

</blockquote></details>
<details>
<summary>context/coderabbit-comments/from-commit-227be71.md-6-6 (1)</summary><blockquote>

`6-6`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Add language identifiers to generated Markdown fences.** The archived review reports contain repeated MD040 violations. Use `text` for prose prompt fences and retain languages such as `diff` or `mermaid` for typed blocks.

- `context/coderabbit-comments/from-commit-227be71.md#L6-L6`: add a language identifier to the outer prompt fence.
- `context/coderabbit-comments/from-commit-72e3a6d.md#L86-L86`: add a language identifier to the outer prompt fence.
- `context/coderabbit-comments/from-commit-8b6772d.md#L141-L141`: type this and all later bare prompt fences.
- `context/coderabbit-comments/from-commit-d8692fd.md#L29-L29`: type this and all later bare prompt fences.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/coderabbit-comments/from-commit-227be71.md` at line 6, Update the
archived Markdown prompt fences to include language identifiers and eliminate
MD040 violations: use text for prose prompt fences while preserving existing
diff, mermaid, and other typed-fence languages. Apply this in
context/coderabbit-comments/from-commit-227be71.md lines 6-6,
context/coderabbit-comments/from-commit-72e3a6d.md lines 86-86, and all later
bare prompt fences beginning at
context/coderabbit-comments/from-commit-8b6772d.md lines 141-141 and
context/coderabbit-comments/from-commit-d8692fd.md lines 29-29.
```

</details>

<!-- cr-comment:v1:b481167850d69a65a8ad1b5f -->

_Source: Linters/SAST tools_

</blockquote></details>
<details>
<summary>context/data-models.md-494-495 (1)</summary><blockquote>

`494-495`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Validate related catalog links as slugs.**

`relatedProductSlugs` and `relatedCategorySlugs` accept arbitrary strings. Invalid values can generate broken product and category CTAs. Apply the canonical slug regex, or a shared slug schema, to both arrays.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/data-models.md` around lines 494 - 495, Update the
relatedProductSlugs and relatedCategorySlugs fields in the data model to
validate each entry with the canonical slug regex or shared slug schema instead
of z.string(), while preserving their array types and default empty arrays.
```

</details>

<!-- cr-comment:v1:1e8e88f20e5a7f923df4caaa -->

</blockquote></details>
<details>
<summary>src/lib/services/telegram.ts-61-61 (1)</summary><blockquote>

`61-61`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Escape the static MarkdownV2 divider.**

The hyphens in `*--- Product Context ---*` are reserved MarkdownV2 characters. Telegram can reject every alert with product context. Replace the divider with plain bold text, such as `*Product Context*`, or escape each hyphen.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/services/telegram.ts` at line 61, Update the productDetails
formatting in the product-context construction to use MarkdownV2-safe plain bold
text, replacing the hyphen-based divider with a label such as Product Context
while preserving the surrounding newline and joined lines.
```

</details>

<!-- cr-comment:v1:c0d0ec16c5d11e7900a4a6e9 -->

</blockquote></details>
<details>
<summary>src/lib/validations/inquiry.ts-82-86 (1)</summary><blockquote>

`82-86`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Enforce the server timestamp format.**

The canonical contract requires an ISO datetime. Replace `z.string()` with `z.string().datetime()` to reject malformed timestamps before notification processing.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/validations/inquiry.ts` around lines 82 - 86, Update
InquiryServerPayloadSchema’s submittedAt validator to use z.string().datetime()
instead of z.string(), enforcing the canonical ISO datetime format before
notification processing while leaving the other fields unchanged.
```

</details>

<!-- cr-comment:v1:ba8148c19d3d87b83fb33c7f -->

</blockquote></details>
<details>
<summary>context/feature-specs/06-subphase-1.1-core-action-feedback-primitives.md-42-65 (1)</summary><blockquote>

`42-65`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Align the button and badge color contracts.**

This specification requires crimson and emerald variants. The roadmap specifies Jet Black primary actions, Jet Black and Metallic Gold WhatsApp actions, and Metallic Gold authentic badges. Select one canonical contract and update this specification before component work continues.

As per coding guidelines, `src/app/globals.css` must define the project’s minimal premium modern luxury theme tokens.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/06-subphase-1.1-core-action-feedback-primitives.md`
around lines 42 - 65, Update the button and badge variant contracts in the
specification to use one canonical color system consistent with the roadmap: Jet
Black for primary actions, Jet Black and Metallic Gold for WhatsApp actions, and
Metallic Gold for authentic badges. Ensure the corresponding theme tokens are
defined in src/app/globals.css before component implementation proceeds, and
remove conflicting crimson or emerald assignments.
```

</details>

<!-- cr-comment:v1:9a7175ccf3c860cf445d337e -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>context/feature-roadmap.md-66-75 (1)</summary><blockquote>

`66-75`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Synchronize the roadmap summary and state matrix.**

The milestone table and state matrix no longer match the detailed phase sections. This can select the wrong next sub-phase.

- `context/feature-roadmap.md#L66-L75`: update the listed totals for Phase 2, Phase 3, and Phase 6 to match the detailed sub-phase lists.
- `context/feature-roadmap.md#L698-L710`: reconcile the statuses for Sub-Phases 3.2, 4.3, and 5.1–5.3 with their detailed status sections.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-roadmap.md` around lines 66 - 75, Synchronize the roadmap
summary with the detailed phase sections: in context/feature-roadmap.md lines
66-75, update the Estimated Sub-Phases totals for Phase 2, Phase 3, and Phase 6
to reflect their actual listed sub-phases; in context/feature-roadmap.md lines
698-710, update the state matrix statuses for Sub-Phases 3.2, 4.3, and 5.1–5.3
to match their corresponding detailed status sections.
```

</details>

<!-- cr-comment:v1:85417a4a9405000f56d5b258 -->

</blockquote></details>
<details>
<summary>context/feature-specs/12-light-theme-design-system-migration.md-20-24 (1)</summary><blockquote>

`20-24`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Correct the recorded contrast result.**

`#059669` against `#FFFFFF` has approximately 3.8:1 contrast, not 4.52:1. It does not meet WCAG AA for normal-size text. Correct this historical record to prevent a false compliance claim.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/12-light-theme-design-system-migration.md` around lines
20 - 24, Correct the contrast ratio recorded in the theme feature description
for `#059669` against white from 4.52:1 to approximately 3.8:1, and remove the
claim that it meets WCAG AA for normal-size text.
```

</details>

<!-- cr-comment:v1:61bebaaaab1c1b13f6f4c9bb -->

</blockquote></details>
<details>
<summary>context/feature-specs/11-coderabbit-commit-8b6772d-resolutions.md-27-30 (1)</summary><blockquote>

`27-30`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Add blank lines before each remediation table.**

Markdownlint reports MD058 for every sub-phase table. Add one blank line between each `### Sub-Phase` heading and its table.

- `context/feature-specs/11-coderabbit-commit-8b6772d-resolutions.md#L27-L30`: add a blank line before the table.
- `context/feature-specs/11-coderabbit-commit-8b6772d-resolutions.md#L33-L36`: add a blank line before the table.
- `context/feature-specs/11-coderabbit-commit-8b6772d-resolutions.md#L39-L43`: add a blank line before the table.
- `context/feature-specs/11-coderabbit-commit-8b6772d-resolutions.md#L46-L49`: add a blank line before the table.
- `context/feature-specs/11-coderabbit-commit-8b6772d-resolutions.md#L52-L55`: add a blank line before the table.
- `context/feature-specs/11-coderabbit-commit-8b6772d-resolutions.md#L58-L61`: add a blank line before the table.
- `context/feature-specs/11-coderabbit-commit-8b6772d-resolutions.md#L64-L69`: add a blank line before the table.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/11-coderabbit-commit-8b6772d-resolutions.md` around
lines 27 - 30, Add a blank line between each Sub-Phase heading and its
remediation table in
context/feature-specs/11-coderabbit-commit-8b6772d-resolutions.md at lines
27-30, 33-36, 39-43, 46-49, 52-55, 58-61, and 64-69 to satisfy Markdownlint
MD058.
```

</details>

<!-- cr-comment:v1:5a37c26122519f40b31755c4 -->

_Source: Linters/SAST tools_

</blockquote></details>
<details>
<summary>context/feature-specs/08-subphase-1.3-overlay-dialog-primitives.md-135-139 (1)</summary><blockquote>

`135-139`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Replace the impossible `0ms TTFB` acceptance criterion.**

A completed build cannot verify zero TTFB. TTFB includes response processing and network time. Replace this criterion with static prerender verification and a measurable deployed-performance budget.

- `context/feature-specs/08-subphase-1.3-overlay-dialog-primitives.md#L135-L139`: replace the `0ms TTFB` statement with a defined prerender and deployed-performance check.
- `context/feature-specs/09-subphase-1.4-global-navigation-shell-header.md#L136-L141`: use the same measurable verification criterion.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/08-subphase-1.3-overlay-dialog-primitives.md` around
lines 135 - 139, The acceptance criteria in
context/feature-specs/08-subphase-1.3-overlay-dialog-primitives.md lines 135-139
and context/feature-specs/09-subphase-1.4-global-navigation-shell-header.md
lines 136-141 both use the impossible “0ms TTFB” requirement. Replace that
criterion in both files with explicit static-prerender verification and a
defined, measurable deployed-performance budget, using the same wording and
thresholds in each location.
```

</details>

<!-- cr-comment:v1:e74250b60fe633403fa477b7 -->

</blockquote></details>
<details>
<summary>src/lib/validations/store.ts-21-28 (1)</summary><blockquote>

`21-28`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Validate `opens` and `closes` at the schema boundary.**

Invalid strings pass validation, then `parseTimeToMinutes` treats them as contact-only hours. This can mark an open day as closed. Constrain both fields to the supported 12-hour and 24-hour formats plus `Contact Store`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/validations/store.ts` around lines 21 - 28, Update
OpeningHourItemSchema so both opens and closes validate against the supported
12-hour and 24-hour time formats, while also allowing the exact “Contact Store”
value. Reject other strings at the schema boundary before parseTimeToMinutes
processes them.
```

</details>

<!-- cr-comment:v1:510a2a8ccae13d6d35aeb92c -->

</blockquote></details>
<details>
<summary>src/lib/data/products.ts-121-134 (1)</summary><blockquote>

`121-134`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Match the documented catalog-search contract.**

An empty query must return all products. This function currently returns `[]`. Brand and category matching also uses internal IDs, so display-name queries such as `Optimum Nutrition` do not match `brand_optimum_nutrition`.

Return the full catalog for an empty query. Match against resolved brand and category names in addition to IDs.

As per coding guidelines, “Before writing or modifying code, read the relevant canonical specification files in `context/`; do not guess or invent behavior.”

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/data/products.ts` around lines 121 - 134, Update
searchProductsInMemory so empty or whitespace-only queries return the full
validatedProducts catalog instead of an empty array. Preserve matching against
brandId and categoryId, and additionally match each product’s resolved display
brand and category names so queries such as “Optimum Nutrition” succeed; first
consult the relevant canonical specifications in context/ to use the established
resolution symbols.
```

</details>

<!-- cr-comment:v1:de0107d09a685c59ae6c1b13 -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>src/scripts/validate-catalog-accessors.ts-79-96 (1)</summary><blockquote>

`79-96`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Assert accessor semantics before reporting success.**

The script only checks that `getProductById()` returns a value. It does not verify the returned ID. It also does not verify category filtering, brand filtering, related-product exclusion, or search matches. A broken accessor can therefore produce a passing validation result.

Add assertions for returned identities and each documented filter invariant.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/scripts/validate-catalog-accessors.ts` around lines 79 - 96, Update the
validation flow around getProductById, getProductsByCategory,
getProductsByBrand, getRelatedProducts, and searchProductsInMemory to assert
their documented invariants before logging success: verify the returned product
ID, category and brand membership, exclusion of the source product from related
results, and that every search result matches the requested term. Throw
descriptive errors when any assertion fails.
```

</details>

<!-- cr-comment:v1:381631e0fa0b804f4d3cca33 -->

</blockquote></details>
<details>
<summary>src/scripts/validate-pdp-components.ts-19-43 (1)</summary><blockquote>

`19-43`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Render the components before reporting validation success.**

`React.createElement()` only creates element descriptions. It does not execute the components, so render-time failures remain undetected. Use `react-dom/server` for static output assertions and a component test runner for selector and gallery interactions.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/scripts/validate-pdp-components.ts` around lines 19 - 43, Update the
validation flow around ProductStockStatus, ProductVariantSelector, and
ProductGallery so each component is actually rendered rather than only
instantiated with React.createElement. Use react-dom/server for static render
assertions, and exercise ProductVariantSelector and ProductGallery through the
project’s component test runner to cover their interactions before reporting
validation success.
```

</details>

<!-- cr-comment:v1:f5aa2a4ec995dc27396744b8 -->

</blockquote></details>
<details>
<summary>src/emails/CustomerInquiryConfirmation.tsx-121-126 (1)</summary><blockquote>

`121-126`: _🔒 Security & Privacy_ | _🟡 Minor_ | _⚡ Quick win_

**Set explicit touch-target dimensions for email CTAs.**

The WhatsApp and phone CTAs do not guarantee the required 48×48px target. The standard web link does not guarantee the required 44×44px target.

- `src/emails/CustomerInquiryConfirmation.tsx#L121-L126`: Set the WhatsApp CTA to at least 48×48px.
- `src/emails/CustomerInquiryConfirmation.tsx#L143-L146`: Wrap the web link in a 44×44px clickable area.
- `src/emails/AdminInquiryAlert.tsx#L68-L72`: Wrap the phone link in a 48×48px clickable area.
- `src/emails/AdminInquiryAlert.tsx#L118-L129`: Set both WhatsApp and phone CTA buttons to at least 48×48px.

As per coding guidelines, “Standard buttons and links must have touch targets of at least 44×44px; WhatsApp and phone conversion CTAs must be at least 48×48px.”

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/emails/CustomerInquiryConfirmation.tsx` around lines 121 - 126, The email
CTAs need explicit touch-target sizing: in
src/emails/CustomerInquiryConfirmation.tsx lines 121-126, set the WhatsApp
button to at least 48×48px; in lines 143-146, wrap the web link in a 44×44px
clickable area; in src/emails/AdminInquiryAlert.tsx lines 68-72, wrap the phone
link in a 48×48px clickable area; and in lines 118-129, set both WhatsApp and
phone buttons to at least 48×48px.
```

</details>

<!-- cr-comment:v1:f83a263bdb68d28185263a44 -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>context/feature-specs/31-subphase-5.1-anti-spam-rate-limiting.md-49-50 (1)</summary><blockquote>

`49-50`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Implement a sliding-window fallback.**

This fallback uses a fixed counter that expires from the first request. It permits ten requests around a window boundary, so it does not enforce the specified trailing 60-minute limit.

Store request timestamps per identifier and remove timestamps outside the active window.






Also applies to: 97-120

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/31-subphase-5.1-anti-spam-rate-limiting.md` around
lines 49 - 50, Replace the fixed { count, expiresAt } entries in inMemoryCache
with per-identifier request timestamp collections, and update the associated
rate-limit logic to append each request and remove timestamps older than the
trailing 60-minute window before counting. Enforce the limit using only the
retained timestamps so requests cannot bypass the limit at a fixed-window
boundary.
```

</details>

<!-- cr-comment:v1:ddebc821688d1c1d2eb8c392 -->

</blockquote></details>
<details>
<summary>src/components/product/product-gallery.tsx-46-78 (1)</summary><blockquote>

`46-78`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Clamp `selectedIndex` when the image list changes.**

If this component receives fewer images after a product change, `activeImage` falls back to the first image. The counter and navigation handlers still use the stale index. The next navigation action can then increment an invalid index indefinitely.

Clamp the index against `normalizedImages.length` before rendering and inside both navigation handlers.






Also applies to: 194-197

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-gallery.tsx` around lines 46 - 78, Clamp
selectedIndex to the valid normalizedImages range before deriving activeImage,
resetting it to the last available index when the image list shrinks. Update
handlePrev and handleNext to normalize the current index against
normalizedImages.length before calculating navigation, preserving wraparound
without allowing stale indices to grow or remain invalid.
```

</details>

<!-- cr-comment:v1:95545ece0070a28bb039881a -->

</blockquote></details>
<details>
<summary>src/components/layout/footer.tsx-26-34 (1)</summary><blockquote>

`26-34`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Use the canonical category slugs.**

`whey-protein` and `mass-gainer` do not match the documented `proteins` and `mass-gainers` taxonomy values. These links can open the catalog with no matching products. Use canonical slugs or link to the category archive routes.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/layout/footer.tsx` around lines 26 - 34, Update the
SUPPLEMENT_CATEGORIES entries for Whey Protein and Mass Gainers to use the
canonical category slugs “proteins” and “mass-gainers” in their href query
parameters, preserving the remaining links unchanged.
```

</details>

<!-- cr-comment:v1:4791a1dced952345830d82cb -->

</blockquote></details>
<details>
<summary>src/components/layout/navbar.tsx-5-10 (1)</summary><blockquote>

`5-10`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Remove or implement the `/authenticity` route consistently.**

The canonical routing hierarchy does not define `/authenticity`. Both desktop and mobile navigation expose this unavailable path.

- `src/components/layout/navbar.tsx#L5-L10`: Replace `/authenticity` with an implemented approved route.
- `src/components/layout/mobile-nav.tsx#L66-L85`: Apply the same route decision to the mobile navigation item.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/layout/navbar.tsx` around lines 5 - 10, Remove the unavailable
/authenticity navigation entry or replace it with an approved implemented route
in NAV_LINKS, then apply the identical route decision to the corresponding
mobile navigation item in src/components/layout/mobile-nav.tsx lines 66-85 so
desktop and mobile navigation remain consistent.
```

</details>

<!-- cr-comment:v1:274c9cfb99642af0c528766a -->

</blockquote></details>
<details>
<summary>src/components/layout/footer.tsx-36-41 (1)</summary><blockquote>

`36-41`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Point legal links to implemented routes.**

The canonical route map defines `/privacy-policy` and `/delivery-policy`. It does not define `/privacy`, `/delivery-returns`, or `/disclaimer`. These footer links will lead to missing pages unless matching routes are added through approved scope.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/layout/footer.tsx` around lines 36 - 41, Update the
LEGAL_LINKS href values to use the implemented canonical routes, specifically
/privacy-policy and /delivery-policy; replace the unsupported /privacy,
/delivery-returns, and /disclaimer targets while preserving the existing labels
and link structure.
```

</details>

<!-- cr-comment:v1:3dcc7133fa349155ae29b6a5 -->

</blockquote></details>
<details>
<summary>context/project-overview.md-1109-1126 (1)</summary><blockquote>

`1109-1126`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Update the stale project status.**

`context/progress-tracker.md` records Phase 5 as active and Sub-Phase 5.3 as complete. These lines state that full development has not started. Keep one current status source, or update this section to match the tracker.

As per coding guidelines, read `context/progress-tracker.md` first on every turn and update project progress after completing work.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/project-overview.md` around lines 1109 - 1126, Update the “CURRENT
PROJECT STATUS” section to match the authoritative Phase 5 and Sub-Phase 5.3
status in progress-tracker.md, removing the stale claim that full development
has not started and revising the listed current phase or freeze items as needed.
Read progress-tracker.md first and update it after completing the change so both
status sources remain consistent.
```

</details>

<!-- cr-comment:v1:6a5ae09d2407397e866f4d27 -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>data/products.json-914-916 (1)</summary><blockquote>

`914-916`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Reconcile the Psychotic Gold serving math.**

`servingSize` is `1 Scoop (6g)` and `servingsPerContainer` is `30`, which yields 180g. The variant declares `sizeOrWeight: "200g (30 Servings)"`. Every other product in this file is internally consistent on this calculation. Correct either the scoop weight or the container weight.





Also applies to: 940-940

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@data/products.json` around lines 914 - 916, Reconcile the Psychotic Gold
nutrition and variant weight values by updating the relevant fields in the
product entry around nutritionFacts and sizeOrWeight so servingSize ×
servingsPerContainer equals the declared container weight; apply the same
correction to the matching occurrence near the second referenced location.
```

</details>

<!-- cr-comment:v1:245f022fde9dadc5693fd285 -->

</blockquote></details>
<details>
<summary>src/components/product/product-sticky-bar.tsx-71-77 (1)</summary><blockquote>

`71-77`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Mark the thumbnail as decorative.**

The image uses `alt={product.name}`, and line 83 renders the same product name as adjacent text. A screen reader announces the name twice. The thumbnail carries no information beyond that text.

<details>
<summary>♿ Proposed change</summary>

```diff
             <Image
               src={thumbnail}
-              alt={product.name}
+              alt=""
               fill
               sizes="44px"
               className="object-contain p-1"
             />
```
</details>

As per coding guidelines: "Use strict TypeScript with zero `any` usage, CVA component variants, and WCAG AA accessibility standards."

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-sticky-bar.tsx` around lines 71 - 77, Update
the Image in the product sticky bar to use an empty alt value because the
adjacent product name already conveys its meaning. Preserve the existing
thumbnail rendering and styling while marking the image decorative for screen
readers.
```

</details>

<!-- cr-comment:v1:0bb84c8f00c3588229fef3fe -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>data/faqs.json-62-62 (1)</summary><blockquote>

`62-62`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Remove the hardcoded placeholder phone number from FAQ content.**

The answer embeds `+977 9800000000`. This looks like a placeholder, and it is user-facing. It also duplicates contact data that belongs in `data/store-info.json`. If the real number changes, this answer becomes stale. Replace the literal number with a reference to the WhatsApp/phone channel, or populate it from the store data source.

<details>
<summary>📝 Proposed fix</summary>

```diff
-    "answer": "We are open Sunday through Friday from 10:00 AM to 9:00 PM. On Saturdays, opening hours may vary — please contact us directly via WhatsApp or phone (+977 9800000000) before visiting on Saturday.",
+    "answer": "We are open Sunday through Friday from 10:00 AM to 9:00 PM. On Saturdays, opening hours may vary — please contact us directly via WhatsApp or phone before visiting on Saturday.",
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@data/faqs.json` at line 62, Update the FAQ answer around the Saturday
opening-hours entry to remove the hardcoded +977 9800000000 placeholder. Refer
users to the WhatsApp or phone channel without embedding a number, or reuse the
canonical contact value from data/store-info.json if the FAQ supports
data-driven content.
```

</details>

<!-- cr-comment:v1:31128375fe8a2eb48a8d3ac2 -->

</blockquote></details>
<details>
<summary>context/project-tech-stacks.md-143-143 (1)</summary><blockquote>

`143-143`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Fix the AGENTS.md link.**

The link uses an absolute local Windows path (`file:///c:/...`). This path does not resolve for other developers or in the Git hosting UI. Use a repository-relative link.

<details>
<summary>📝 Proposed fix</summary>

```diff
-4. **Adhere to Next.js 16 Rules:** Follow all Next.js 16 breaking conventions and rules as outlined in [AGENTS.md](file:///c:/nooridigital_assets/my-projects/muscleworks/AGENTS.md).
+4. **Adhere to Next.js 16 Rules:** Follow all Next.js 16 breaking conventions and rules as outlined in [AGENTS.md](../AGENTS.md).
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/project-tech-stacks.md` at line 143, Replace the absolute Windows
file URL in the “Adhere to Next.js 16 Rules” entry with a repository-relative
link to AGENTS.md, preserving the existing link text and guidance.
```

</details>

<!-- cr-comment:v1:bfc4916912f698bf9cf447dd -->

</blockquote></details>
<details>
<summary>data/products.json-670-670 (1)</summary><blockquote>

`670-670`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Correct the `Egg Creatine` ingredient entry.**

The ON Serious Mass protein blend lists "Egg Creatine". The actual blend component is egg albumin. Ingredient text is allergen-relevant customer-facing data, so the wrong term is a real defect.

<details>
<summary>🐛 Proposed fix</summary>

```diff
-    "ingredients": "Maltodextrin, Protein Blend (Whey Protein Concentrate, Calcium Caseinate, Egg Creatine), Cocoa, Natural and Artificial Flavors, Vitamin and Mineral Blend.",
+    "ingredients": "Maltodextrin, Protein Blend (Whey Protein Concentrate, Calcium Caseinate, Egg Albumin), Cocoa, Natural and Artificial Flavors, Vitamin and Mineral Blend.",
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@data/products.json` at line 670, Update the ingredients value in the product
entry to replace “Egg Creatine” with the correct component name “Egg Albumin,”
preserving the rest of the ingredient text unchanged.
```

</details>

<!-- cr-comment:v1:a055830049b42527fbf01e58 -->

</blockquote></details>
<details>
<summary>src/components/product/product-sticky-bar.tsx-45-48 (1)</summary><blockquote>

`45-48`: _🩺 Stability & Availability_ | _🟡 Minor_ | _⚡ Quick win_

**Add the missing placeholder image asset.**

`public/images/products/placeholder.webp` is absent, but both product components reference it. Add the asset or update both fallback paths.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-sticky-bar.tsx` around lines 45 - 48, Add the
missing public placeholder.webp asset at the path referenced by the thumbnail
fallback, or consistently update the fallback paths in both product components
to an existing placeholder asset. Ensure both product image fallback references
resolve to a valid asset.
```

</details>

<!-- cr-comment:v1:a1112a197ef5c424b4801cfe -->

</blockquote></details>
<details>
<summary>src/components/catalog/active-filters.tsx-36-40 (1)</summary><blockquote>

`36-40`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**The `q` and `searchQuery` aliases are not honored by the catalog.**

Lines 36-40 accept three parameter names for the search term. `src/components/catalog/catalog-container.tsx` (line 47) reads only `search`, and `src/components/catalog/search-bar.tsx` (line 233) writes only `search`. If a URL carries `?q=whey`, this component renders a "Search" pill while the product grid stays unfiltered, so the pill misrepresents the applied filter state.

Read only `search` here, and drop the extra `removeFilter` calls on lines 146-147.

<details>
<summary>🐛 Proposed fix</summary>

```diff
-  const searchParam =
-    searchParams.get('search') ??
-    searchParams.get('q') ??
-    searchParams.get('searchQuery') ??
-    '';
+  const searchParam = searchParams.get('search') ?? '';
```

```diff
-                onClick={() => {
-                  removeFilter('search');
-                  removeFilter('q');
-                  removeFilter('searchQuery');
-                }}
+                onClick={() => removeFilter('search')}
```
</details>





Also applies to: 144-148

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/active-filters.tsx` around lines 36 - 40, Update the
search parameter handling in the active-filters component to read only the
`search` key, matching `catalog-container.tsx` and `search-bar.tsx`; remove the
`removeFilter` calls for the `q` and `searchQuery` aliases while preserving
removal of the canonical search filter.
```

</details>

<!-- cr-comment:v1:efe1b0c3121a0f85981092ee -->

</blockquote></details>
<details>
<summary>src/components/catalog/search-modal.tsx-154-188 (1)</summary><blockquote>

`154-188`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**The dialog close button overlaps the search input row.**

`DialogContent` always renders a close button positioned `absolute right-4 top-4` with a 44px box (`src/components/ui/dialog.tsx`, line 48). Line 154 sets `p-0`, so the input row on lines 163-188 starts at the top edge of the dialog. The close button therefore lands on top of the clear button (line 176) and the ESC hint (line 185), which sit at the right end of that same row.

Reserve space for the close button with right padding on the input row, or add a `hideClose` prop to `DialogContent` and let this modal supply its own close control.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/search-modal.tsx` around lines 154 - 188, Update the
top search input bar in the SearchModal component to reserve right-side space
for DialogContent’s absolute close button, preventing overlap with the clear
button and ESC hint. Apply the spacing to the input row without changing the
existing search behavior or controls.
```

</details>

<!-- cr-comment:v1:6333e091def00bcf578e6da0 -->

</blockquote></details>
<details>
<summary>src/components/product/product-card.tsx-52-55 (1)</summary><blockquote>

`52-55`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**The placeholder image path differs across components.**

This file uses `/images/products/placeholder.jpg`. `src/components/catalog/search-bar.tsx` (line 170) and `src/components/catalog/search-modal.tsx` (line 282) use `/images/placeholder-product.webp`. At most one of these paths can be correct for both locations, and a wrong path renders a broken image through `next/image`.

Define one placeholder constant in `src/lib/constants.ts` and import it in all three components.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-card.tsx` around lines 52 - 55, Centralize the
product placeholder path by defining a shared constant in constants.ts, then
replace the fallback path in product-card and the corresponding hardcoded paths
in search-bar and search-modal with that imported constant. Ensure all three
components use the same valid image path.
```

</details>

<!-- cr-comment:v1:7810ac0a119d673cb0a06147 -->

</blockquote></details>
<details>
<summary>src/components/ui/badge.tsx-12-17 (1)</summary><blockquote>

`12-17`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Verify contrast for the `authentic` and `stock` variants on dark surfaces.**

Both variants pair `text-amber-700` with `bg-amber-500/10`. The background is nearly transparent, so the effective contrast depends on the surface behind the badge. `src/components/product/product-card.tsx` (line 115) renders the `authentic` badge over a dark image overlay, where dark amber text on a dark surface likely fails WCAG AA.

Confirm the contrast ratio for both surfaces, or set an explicit background instead of a 10% tint.

As per coding guidelines: "Use strict TypeScript with zero `any` usage, CVA component variants, and WCAG AA accessibility standards."





```shell
#!/bin/bash
# Description: Compute WCAG contrast for the amber badge variants over light and dark surfaces.
python3 - <<'PY'
def srgb(c):
    c = c/255
    return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4

def lum(rgb):
    r,g,b = (srgb(v) for v in rgb)
    return 0.2126*r + 0.7152*g + 0.0722*b

def ratio(a,b):
    la,lb = lum(a),lum(b)
    hi,lo = max(la,lb),min(la,lb)
    return (hi+0.05)/(lo+0.05)

def mix(fg, bg, alpha):
    return tuple(round(f*alpha + b*(1-alpha)) for f,b in zip(fg,bg))

amber700 = (180,83,9)      # tailwind amber-700
amber500 = (245,158,11)    # tailwind amber-500
light    = (255,255,255)
dark     = (23,23,23)      # neutral-900

for name, surface in (("light surface", light), ("dark surface", dark)):
    bg = mix(amber500, surface, 0.10)
    print(f"{name}: effective bg={bg} contrast(text-amber-700)={ratio(amber700,bg):.2f} (AA normal text needs 4.5)")
PY
```

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/ui/badge.tsx` around lines 12 - 17, Update the CVA definitions
for the authentic and stock variants to ensure WCAG AA contrast on both light
and dark surfaces; replace the translucent bg-amber-500/10 treatment with an
explicit background or otherwise adjust the amber text/background pairing.
Preserve the existing variant styling and authentic font-bold behavior while
making both badges readable over the dark product-card overlay.
```

</details>

<!-- cr-comment:v1:704dcb939e13becc13ffbbdd -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>src/components/catalog/mobile-filter-drawer.tsx-161-171 (1)</summary><blockquote>

`161-171`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Staged price values are committed without validation.**

Lines 161-171 write `stagedMinPrice` and `stagedMaxPrice` straight from the raw input strings on lines 372 and 381. The `min={0}` attribute constrains the spinner control only; a typed or pasted value is not blocked. A negative value, a non-numeric token, or an inverted range therefore reaches the URL. `src/components/catalog/catalog-filters.tsx` clamps and swaps the range on lines 120-134, so the two filter surfaces produce different URLs for the same user input.

Parse and clamp the values here, and swap them when the minimum exceeds the maximum.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/mobile-filter-drawer.tsx` around lines 161 - 171,
Update the staged price commit logic in the mobile filter drawer to parse
numeric inputs, clamp both values to the valid non-negative range, and handle
non-numeric or empty values consistently before setting URL parameters. When
both values are valid and the minimum exceeds the maximum, swap them, matching
the normalization behavior used by catalog-filters.tsx.
```

</details>

<!-- cr-comment:v1:3672ac6d0f793b4237df1bf1 -->

</blockquote></details>
<details>
<summary>src/components/ui/select.tsx-126-131 (1)</summary><blockquote>

`126-131`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Select options are below the 44px touch target.**

Line 127 sets `py-2.5` with `text-sm`. The resulting row height is about 40px, which is under the 44px minimum. The scroll buttons in this same file already set `min-h-[44px]` on lines 43 and 60, so the option rows are the only inconsistent target.

<details>
<summary>♿ Proposed fix</summary>

```diff
-      "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-8 text-sm outline-none transition-colors",
+      "relative flex min-h-11 w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-8 text-sm outline-none transition-colors",
```
</details>

As per coding guidelines: "Standard buttons and links must have touch targets of at least 44×44px".

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/ui/select.tsx` around lines 126 - 131, Update the select
option row styling in the component using the className expression to enforce a
minimum 44px height, matching the existing scroll-button treatment with
min-h-[44px]. Preserve the current padding, typography, focus, disabled, and
className behavior.
```

</details>

<!-- cr-comment:v1:bbd229ed779da04c4352d67e -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>src/components/ui/button.tsx-25-34 (1)</summary><blockquote>

`25-34`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**The `link` variant sizing is overridden by the `size` classes.**

`cva` emits base classes, then variant classes, then size classes. `tailwind-merge` keeps the last conflicting class. The default `size` is `default`, which emits `h-11 px-5 py-2.5` after the `link` variant emits `p-0 h-auto`. The link therefore renders with an 11-unit height and horizontal padding, which does not match an inline text link.

Add a size that carries no box metrics, and require it for the `link` variant, or move the reset into the consumer `className`.

<details>
<summary>♻️ Proposed size addition</summary>

```diff
       size: {
         default: "h-11 px-5 py-2.5",
         sm: "h-11 rounded-lg px-3.5 text-xs",
         lg: "h-12 rounded-xl px-6 text-base font-semibold",
         xl: "h-14 rounded-2xl px-8 text-lg font-bold",
         icon: "h-11 w-11 p-0",
+        inline: "h-auto p-0",
       },
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/ui/button.tsx` around lines 25 - 34, Update the button variant
configuration so the link variant cannot receive the default size metrics: add a
size option with no box-model classes, then configure the link variant to
require that size while preserving normal sizing for other variants. Use the
existing variant and size definitions in the button configuration.
```

</details>

<!-- cr-comment:v1:da28e9d876c5f4e0d5f8fe07 -->

</blockquote></details>
<details>
<summary>src/components/catalog/catalog-filters.tsx-117-135 (1)</summary><blockquote>

`117-135`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**`parseInt` can write `NaN` into the URL.**

Lines 120-121 apply `Math.max(0, parseInt(...))`. A number input can hold values such as `-` or `e` that produce `NaN`. `NaN !== null` is true, so line 131 writes the literal string `"NaN"` into `minPrice` or `maxPrice`. The catalog then filters against an unparseable value, and `src/components/catalog/active-filters.tsx` (line 229) renders `formatNprPrice(Number("NaN"))`.

Discard non-finite values before building the update.

<details>
<summary>🐛 Proposed fix</summary>

```diff
-    const minVal = minPriceInput ? Math.max(0, parseInt(minPriceInput, 10)) : null;
-    const maxVal = maxPriceInput ? Math.max(0, parseInt(maxPriceInput, 10)) : null;
+    const parsePrice = (raw: string): number | null => {
+      if (!raw) return null;
+      const parsed = Number.parseInt(raw, 10);
+      return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
+    };
+
+    const minVal = parsePrice(minPriceInput);
+    const maxVal = parsePrice(maxPriceInput);
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/catalog-filters.tsx` around lines 117 - 135, Update
handleApplyPriceInputs to validate the parsed minPriceInput and maxPriceInput
values with Number.isFinite before applying Math.max or constructing URL
parameters. Treat non-finite values as null so updateUrlParams never receives
“NaN”, while preserving the existing min/max ordering behavior for valid values.
```

</details>

<!-- cr-comment:v1:d2ecfbc972ccac002c513f69 -->

</blockquote></details>
<details>
<summary>src/components/catalog/mobile-filter-drawer.tsx-207-207 (1)</summary><blockquote>

`207-207`: _🩺 Stability & Availability_ | _🟡 Minor_ | _⚡ Quick win_

**Declare the `gold` color tokens or replace these utilities with existing theme tokens.** `globals.css` does not define `--color-gold-*`, so Tailwind emits none of the `gold` utilities. The `focus-visible:outline-none` classes then leave the affected controls without a visible focus indicator.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/mobile-filter-drawer.tsx` at line 207, Update the
affected control styling in the mobile filter drawer to use existing theme color
tokens, or define the referenced gold tokens in the global theme configuration
so the bg-gold, text-gold, and border-gold utilities are generated. Preserve a
visible focus indicator for the controls using focus-visible styling.
```

</details>

<!-- cr-comment:v1:a37c52cb608aa710d91c149d -->

</blockquote></details>
<details>
<summary>src/components/product/nutrition-table.tsx-143-149 (1)</summary><blockquote>

`143-149`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Preserve a daily value of zero.**

When `item.dailyValuePercentage` is `0`, Line 148 renders `†`. Use nullish coalescing so that only missing values render `†`.

```diff
- {item.dailyValuePercentage ? item.dailyValuePercentage : '†'}
+ {item.dailyValuePercentage ?? '†'}
```

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/nutrition-table.tsx` around lines 143 - 149, Update
the daily value rendering in the items map to use nullish coalescing for
item.dailyValuePercentage, preserving 0 while displaying † only when the value
is null or undefined.
```

</details>

<!-- cr-comment:v1:0dd2bab11e5302d6c031fedf -->

</blockquote></details>

</blockquote></details>

---

<details>
<summary>ℹ️ Review info</summary>

<details>
<summary>⚙️ Run configuration</summary>

**Configuration used**: defaults

**Review profile**: CHILL

**Plan**: Pro Plus

**Run ID**: `751e283c-1b2e-4653-90a2-1c1f5960deef`

</details>

<details>
<summary>📥 Commits</summary>

Reviewing files that changed from the base of the PR and between 331a1deb781e9e8b4c7a7f277a501f869169ab1b and b4abf63a7169ce6fdf0c4cb6a575f63d15448582.

</details>

<details>
<summary>⛔ Files ignored due to path filters (7)</summary>

* `package-lock.json` is excluded by `!**/package-lock.json`
* `public/file.svg` is excluded by `!**/*.svg`
* `public/globe.svg` is excluded by `!**/*.svg`
* `public/next.svg` is excluded by `!**/*.svg`
* `public/vercel.svg` is excluded by `!**/*.svg`
* `public/window.svg` is excluded by `!**/*.svg`
* `src/app/favicon.ico` is excluded by `!**/*.ico`

</details>

<details>
<summary>📒 Files selected for processing (149)</summary>

* `.gitignore`
* `AGENTS.md`
* `app/globals.css`
* `app/layout.tsx`
* `app/page.tsx`
* `context/ai-workflow.md`
* `context/coderabbit-comments/from-commit-227be71.md`
* `context/coderabbit-comments/from-commit-72e3a6d.md`
* `context/coderabbit-comments/from-commit-8b6772d.md`
* `context/coderabbit-comments/from-commit-d8692fd.md`
* `context/coding-standards.md`
* `context/data-models.md`
* `context/feature-roadmap.md`
* `context/feature-specs/01-coderabbit-review-resolutions.md`
* `context/feature-specs/02-subphase-0.1-project-scaffold-dependency-manifest.md`
* `context/feature-specs/03-subphase-0.2-styling-system-tailwind-theme-engine.md`
* `context/feature-specs/04-subphase-0.3-core-utility-layer-type-foundations.md`
* `context/feature-specs/05-subphase-0.4-root-layout-font-engine-metadata.md`
* `context/feature-specs/06-subphase-1.1-core-action-feedback-primitives.md`
* `context/feature-specs/07-subphase-1.2-form-input-text-primitives.md`
* `context/feature-specs/08-subphase-1.3-overlay-dialog-primitives.md`
* `context/feature-specs/09-subphase-1.4-global-navigation-shell-header.md`
* `context/feature-specs/10-subphase-1.5-global-footer-floating-whatsapp-mobile-bar.md`
* `context/feature-specs/11-coderabbit-commit-8b6772d-resolutions.md`
* `context/feature-specs/12-light-theme-design-system-migration.md`
* `context/feature-specs/13-minimal-premium-luxury-theme.md`
* `context/feature-specs/14-coderabbit-commit-227be71-resolutions.md`
* `context/feature-specs/15-subphase-2.1-zod-schemas-domain-type-definitions.md`
* `context/feature-specs/16-subphase-2.2-canonical-json-datasets.md`
* `context/feature-specs/17-subphase-2.3-supplementary-datasets.md`
* `context/feature-specs/18-subphase-2.4-catalog-data-accessor-layer.md`
* `context/feature-specs/19-subphase-2.5-store-faq-content-accessor-layer.md`
* `context/feature-specs/20-subphase-3.1-product-display-components.md`
* `context/feature-specs/21-subphase-3.2-in-memory-fuzzy-search-engine.md`
* `context/feature-specs/22-subphase-3.3-desktop-filter-components-active-state.md`
* `context/feature-specs/23-subphase-3.4-mobile-filter-drawer-brand-facets.md`
* `context/feature-specs/24-subphase-3.5-products-catalog-hub-route.md`
* `context/feature-specs/25-subphase-3.6-category-brand-archive-routes.md`
* `context/feature-specs/26-subphase-4.1-whatsapp-url-engine-analytics-tracker.md`
* `context/feature-specs/27-subphase-4.2-product-gallery-variant-selector.md`
* `context/feature-specs/28-subphase-4.3-product-specs-nutrition-trust.md`
* `context/feature-specs/29-subphase-4.4-product-detail-route-sticky-bar.md`
* `context/feature-specs/30-coderabbit-commit-d8692fd-resolutions.md`
* `context/feature-specs/31-subphase-5.1-anti-spam-rate-limiting.md`
* `context/feature-specs/32-subphase-5.2-notification-dispatchers.md`
* `context/feature-specs/33-subphase-5.3-server-actions-pipeline.md`
* `context/feature-specs/README.md`
* `context/file-map.md`
* `context/progress-tracker.md`
* `context/project-architecture.md`
* `context/project-overview.md`
* `context/project-tech-stacks.md`
* `data/brands.json`
* `data/categories.json`
* `data/faqs.json`
* `data/guides.json`
* `data/products.json`
* `data/store-info.json`
* `next.config.ts`
* `package.json`
* `public/brnding-assets/favicon.webp`
* `public/brnding-assets/logo.webp`
* `scripts/validate-datasets.ts`
* `src/actions/contact.ts`
* `src/actions/inquiry.ts`
* `src/app/brands/[slug]/page.tsx`
* `src/app/brands/page.tsx`
* `src/app/categories/[slug]/page.tsx`
* `src/app/categories/page.tsx`
* `src/app/error.tsx`
* `src/app/global-error.tsx`
* `src/app/globals.css`
* `src/app/layout.tsx`
* `src/app/not-found.tsx`
* `src/app/page.tsx`
* `src/app/products/[slug]/page.tsx`
* `src/app/products/page.tsx`
* `src/components/catalog/active-filters.tsx`
* `src/components/catalog/brand-filter.tsx`
* `src/components/catalog/catalog-container.tsx`
* `src/components/catalog/catalog-filters.tsx`
* `src/components/catalog/category-chips.tsx`
* `src/components/catalog/mobile-filter-drawer.tsx`
* `src/components/catalog/search-bar.tsx`
* `src/components/catalog/search-modal.tsx`
* `src/components/catalog/sort-select.tsx`
* `src/components/layout/footer.tsx`
* `src/components/layout/header.tsx`
* `src/components/layout/mobile-nav.tsx`
* `src/components/layout/navbar.tsx`
* `src/components/product/authenticity-guarantee-box.tsx`
* `src/components/product/nutrition-table.tsx`
* `src/components/product/product-authenticity-badge.tsx`
* `src/components/product/product-card.tsx`
* `src/components/product/product-detail-view.tsx`
* `src/components/product/product-gallery.tsx`
* `src/components/product/product-grid.tsx`
* `src/components/product/product-specs.tsx`
* `src/components/product/product-sticky-bar.tsx`
* `src/components/product/product-stock-status.tsx`
* `src/components/product/product-variant-selector.tsx`
* `src/components/product/related-products.tsx`
* `src/components/ui/badge.tsx`
* `src/components/ui/breadcrumb.tsx`
* `src/components/ui/button.tsx`
* `src/components/ui/card.tsx`
* `src/components/ui/dialog.tsx`
* `src/components/ui/input.tsx`
* `src/components/ui/select.tsx`
* `src/components/ui/separator.tsx`
* `src/components/ui/sheet.tsx`
* `src/components/ui/skeleton.tsx`
* `src/components/ui/textarea.tsx`
* `src/components/ui/toast.tsx`
* `src/emails/AdminInquiryAlert.tsx`
* `src/emails/CustomerInquiryConfirmation.tsx`
* `src/lib/analytics.ts`
* `src/lib/catalog.ts`
* `src/lib/constants.ts`
* `src/lib/data/brands.ts`
* `src/lib/data/categories.ts`
* `src/lib/data/faqs.ts`
* `src/lib/data/guides.ts`
* `src/lib/data/products.ts`
* `src/lib/data/store.ts`
* `src/lib/search.ts`
* `src/lib/services/ratelimit.ts`
* `src/lib/services/resend.ts`
* `src/lib/services/security.ts`
* `src/lib/services/telegram.ts`
* `src/lib/utils.ts`
* `src/lib/validations/common.ts`
* `src/lib/validations/guide.ts`
* `src/lib/validations/inquiry.ts`
* `src/lib/validations/product.ts`
* `src/lib/validations/store.ts`
* `src/lib/whatsapp.ts`
* `src/scripts/validate-catalog-accessors.ts`
* `src/scripts/validate-notification-services.ts`
* `src/scripts/validate-pdp-components.ts`
* `src/scripts/validate-pdp-specs-components.ts`
* `src/scripts/validate-security-ratelimit.ts`
* `src/scripts/validate-server-actions.ts`
* `src/scripts/validate-store-faq-guide-accessors.ts`
* `src/scripts/validate-supplementary-datasets.ts`
* `src/scripts/validate-whatsapp-analytics.ts`
* `src/types/actions.ts`
* `src/types/index.ts`
* `tsconfig.json`

</details>

<details>
<summary>💤 Files with no reviewable changes (3)</summary>

* app/layout.tsx
* app/page.tsx
* app/globals.css

</details>

</details>

<!-- This is an auto-generated comment by CodeRabbit for review status -->