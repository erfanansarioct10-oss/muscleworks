

> [!NOTE]
> Due to the large number of review comments, Critical severity comments were prioritized as inline comments.

<details>
<summary>🟠 Major comments (43)</summary><blockquote>

<details>
<summary>src/components/product/product-authenticity-badge.tsx-32-68 (1)</summary><blockquote>

`32-68`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Do not render authenticity claims without product metadata.**

`ProductGalleryProps.authenticity` is optional. The gallery still renders a badge. The badge then supplies importer, seal, scratch-code, and batch-certificate claims through fallback text. Products with absent or partial authenticity metadata can display unsupported claims.

- `src/components/product/product-authenticity-badge.tsx#L32-L68`: remove claim defaults and render claim-specific text only when approved metadata supplies it.
- `src/components/product/product-gallery.tsx#L102-L109`: render `ProductAuthenticityBadge` only when the product has an approved authenticity guarantee and supported display metadata.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-authenticity-badge.tsx` around lines 32 - 68,
Remove fallback claim text from ProductAuthenticityBadge and render each
authenticity claim only when corresponding approved metadata is provided. In
product-gallery.tsx lines 102-109, gate ProductAuthenticityBadge rendering on an
approved authenticity guarantee with supported display metadata; otherwise
render no badge. Update both affected files as specified.
```

</details>

<!-- cr-comment:v1:4e113befac40b86f34f7e25c -->

</blockquote></details>
<details>
<summary>context/coding-standards.md-578-578 (1)</summary><blockquote>

`578-578`: _🔒 Security & Privacy_ | _🟠 Major_ | _⚡ Quick win_

**Keep customer personal data out of general logs.**

`payload.customerName` is written to production logs. Log the inquiry ID and non-identifying status fields unless a documented retention policy permits the name.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/coding-standards.md` at line 578, Update the success log in the
inquiry creation flow to remove payload.customerName from console.info. Retain
the inquiryId and include only non-identifying status fields, unless an existing
documented retention policy explicitly permits logging the customer name.
```

</details>

<!-- cr-comment:v1:c0b354b0cdbc9eb6e677aecf -->

</blockquote></details>
<details>
<summary>context/coding-standards.md-460-467 (1)</summary><blockquote>

`460-467`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Default the native button type to `button`.**

Without an explicit type, a button inside a form submits the form. Set `type={props.type ?? 'button'}` while preserving explicit `submit` and `reset` values.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/coding-standards.md` around lines 460 - 467, Update the Button
component’s native button element to default its type to "button" when
props.type is undefined, while preserving explicitly provided submit and reset
values. Add this alongside the existing ref, className, and prop spreading in
the forwardRef render.
```

</details>

<!-- cr-comment:v1:795546bec97197e25e723f23 -->

</blockquote></details>
<details>
<summary>context/coding-standards.md-214-239 (1)</summary><blockquote>

`214-239`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Synchronize canonical documentation with the repository module and export layout.**
- `context/coding-standards.md#L214-L239`: replace example imports that reference absent schema, formatter, and component modules.
- `context/coding-standards.md#L252-L277`: update the product page example to use the actual product component and accessor paths.
- `context/coding-standards.md#L526-L531`: update the Server Action imports to the existing service modules.
- `context/data-models.md#L505-L521`: replace `ActionResponse` with `ActionResult` and reconcile the documented type files with the actual repository exports.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/coding-standards.md` around lines 214 - 239, Synchronize the
documented import examples with the repository’s actual module and export
layout: in context/coding-standards.md lines 214-239 replace absent schema,
formatter, and component imports; update lines 252-277 to use the real product
component and accessor paths; update lines 526-531 to import Server Actions from
the existing service modules; and in context/data-models.md lines 505-521
replace ActionResponse with ActionResult and document the actual type export
files.
```

</details>

<!-- cr-comment:v1:bfb058122e1aa73efefd4ce3 -->

</blockquote></details>
<details>
<summary>context/coding-standards.md-571-583 (1)</summary><blockquote>

`571-583`: _🩺 Stability & Availability_ | _🟠 Major_ | _⚡ Quick win_

**Do not report success after notification failures.**

`Promise.allSettled` resolves even when every dispatch rejects. The action then returns success although no notification was delivered. Inspect the settled results and return a failure or pending result, or persist the inquiry before dispatch.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/coding-standards.md` around lines 571 - 583, Update the inquiry
action around the Promise.allSettled notification dispatches so it does not log
or return success when notification promises reject. Inspect the settled results
from sendCustomerInquiryEmail, sendAdminInquiryAlert, and sendTelegramAlert,
then return the established failure or pending result when delivery is
unsuccessful while preserving success only when the required notifications
complete.
```

</details>

<!-- cr-comment:v1:c2b86418f4a7510a0c048d1e -->

</blockquote></details>
<details>
<summary>context/coding-standards.md-306-320 (1)</summary><blockquote>

`306-320`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Pass the image URL and alt text to `next/image`.**

`Product.images` contains `ImageAsset` objects. Use `src={product.images[0].url}` and `alt={product.images[0].alt}`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/coding-standards.md` around lines 306 - 320, Update the standard
responsive Product Image example to pass the ImageAsset fields to next/image:
use product.images[0].url for src and product.images[0].alt for alt, while
preserving the existing Image configuration.
```

</details>

<!-- cr-comment:v1:b0a8002fdeaf6e0aae7ddcf1 -->

</blockquote></details>
<details>
<summary>context/feature-roadmap.md-311-322 (1)</summary><blockquote>

`311-322`: _📐 Maintainability & Code Quality_ | _🟠 Major_ | _⚡ Quick win_

**Synchronize detailed statuses with the state tracking matrix.**

Sub-Phases 3.2, 4.3, 5.1–5.3, and 6.1 have different statuses in the detailed roadmap and the matrix. An agent can select a different next sub-phase depending on which section it reads. Verify the completed work, then set one authoritative status in both sections.

Based on learnings, work on exactly one atomic sub-phase at a time and follow the four-step progress protocol.







Also applies to: 418-431, 453-496, 532-539, 715-730

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-roadmap.md` around lines 311 - 322, Synchronize the status
entries for the affected roadmap sub-phases, including the section containing
the SearchBar and SearchModal symbols, with the state tracking matrix. Verify
each sub-phase’s implementation before assigning one authoritative status,
update both detailed-roadmap and matrix entries consistently, and preserve the
four-step progress protocol while handling exactly one atomic sub-phase at a
time.
```

</details>

<!-- cr-comment:v1:503283c84821a9e6293cac9f -->

_Source: Learnings_

</blockquote></details>
<details>
<summary>src/components/catalog/brand-filter.tsx-104-140 (1)</summary><blockquote>

`104-140`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Use a semantic checkbox control for each brand.**

The `<label>` has no associated `<input>`. It is not keyboard-operable and does not expose its checked state to assistive technology. Add a native checkbox and handle `onChange`, or use a keyboard-operable button with `role="checkbox"` and `aria-checked`.

As per coding guidelines, follow WCAG AA accessibility requirements.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/brand-filter.tsx` around lines 104 - 140, Update each
brand option in the label rendered by the brand filter to use a semantic,
keyboard-operable checkbox control with an exposed checked state. Add a native
checkbox associated with the brand label and invoke onToggleBrand with
brand.slug from its onChange, while preserving the existing visual styling and
checked indicator.
```

</details>

<!-- cr-comment:v1:2bc8b389a21600b667c2ec0d -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>context/feature-specs/03-subphase-0.2-styling-system-tailwind-theme-engine.md-19-23 (1)</summary><blockquote>

`19-23`: _📐 Maintainability & Code Quality_ | _🟠 Major_ | _⚡ Quick win_

**Synchronize the Sub-Phase 0.2 target-file contract.**

The specification includes `src/app/layout.tsx` and `src/app/page.tsx`, but the roadmap permits only `src/app/globals.css` and `postcss.config.mjs`. An agent following either document can modify files outside the declared atomic scope.
- `context/feature-specs/03-subphase-0.2-styling-system-tailwind-theme-engine.md#L19-L23`: remove the layout and page migration from Sub-Phase 0.2, or explicitly make it part of the approved scope.
- `context/feature-roadmap.md#L101-L105`: update the target-file list to exactly match the approved Sub-Phase 0.2 scope.

Based on learnings, modify only the declared 2–4 target files for one atomic sub-phase.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In
`@context/feature-specs/03-subphase-0.2-styling-system-tailwind-theme-engine.md`
around lines 19 - 23, Synchronize the Sub-Phase 0.2 target-file contract: in
context/feature-specs/03-subphase-0.2-styling-system-tailwind-theme-engine.md
lines 19-23, remove the src/app/layout.tsx and src/app/page.tsx migration or
explicitly include it in the approved scope; in context/feature-roadmap.md lines
101-105, update the target-file list to exactly match that approved scope. Keep
the atomic sub-phase limited to the declared 2–4 files.
```

</details>

<!-- cr-comment:v1:230c32f351c780d393de0e00 -->

_Source: Learnings_

</blockquote></details>
<details>
<summary>context/feature-roadmap.md-410-412 (1)</summary><blockquote>

`410-412`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Remove the unsupported secondary-store stock claim.**

The roadmap states that stock is available at New Baneshwor and Jhamsikhel. The canonical specification defines one physical store in Golfutar and requires zero secondary-store references.
- `context/feature-roadmap.md#L410-L412`: replace the multi-store stock text with the supported Golfutar inventory status.
- `context/feature-specs/01-coderabbit-review-resolutions.md#L52-L55`: retain the single Golfutar constraint as the canonical business rule.
- `context/feature-specs/01-coderabbit-review-resolutions.md#L196-L203`: verify this definition of done against the roadmap before marking the resolution complete.

Based on learnings, do not invent branches or features that are not defined by the canonical specifications.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-roadmap.md` around lines 410 - 412, Update ProductStockStatus
in context/feature-roadmap.md (lines 410-412) to reference only the supported
Golfutar inventory status, removing New Baneshwor and Jhamsikhel. In
context/feature-specs/01-coderabbit-review-resolutions.md (lines 52-55), retain
the single-Golfutar constraint as the canonical rule; in lines 196-203, verify
the definition of done against the corrected roadmap before marking the
resolution complete.
```

</details>

<!-- cr-comment:v1:891ae657c847716b4e392832 -->

_Source: Learnings_

</blockquote></details>
<details>
<summary>context/feature-specs/03-subphase-0.2-styling-system-tailwind-theme-engine.md-50-52 (1)</summary><blockquote>

`50-52`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Use distinct `next/font` variables for the font tokens.**

`--font-sans` and `--font-heading` reference themselves in the normal `@theme` block. Rename the `next/font` variables and map them through `@theme inline` with the system fallbacks.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In
`@context/feature-specs/03-subphase-0.2-styling-system-tailwind-theme-engine.md`
around lines 50 - 52, Rename the next/font variables used by the --font-sans and
--font-heading bindings to distinct, non-conflicting identifiers, then map those
variables through an `@theme` inline block while retaining the existing system
font fallbacks. Ensure the `@theme` font tokens no longer reference themselves.
```

</details>

<!-- cr-comment:v1:9c77480231f78970900eb594 -->

</blockquote></details>
<details>
<summary>context/feature-specs/04-subphase-0.3-core-utility-layer-type-foundations.md-45-60 (1)</summary><blockquote>

`45-60`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Define one canonical contact-constant contract.**

Feature Spec 04 defines `STORE_PHONE`, `STORE_WHATSAPP`, and `STORE_WHATSAPP_DISPLAY`. Feature Spec 09 requires `STORE_PHONE_DISPLAY`, `STORE_PHONE_INTL`, and `OFFICIAL_WHATSAPP_NUMBER`. A single constants module cannot satisfy both contracts without undocumented aliases.

- `context/feature-specs/04-subphase-0.3-core-utility-layer-type-foundations.md#L45-L60`: define the final exported contact constant names.
- `context/feature-specs/09-subphase-1.4-global-navigation-shell-header.md#L111-L119`: update consumers to use those exact names.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/04-subphase-0.3-core-utility-layer-type-foundations.md`
around lines 45 - 60, Define one canonical exported contact-constant contract in
context/feature-specs/04-subphase-0.3-core-utility-layer-type-foundations.md#L45-L60
by selecting and documenting the final names for the phone and WhatsApp values,
including display and international formats as required. Update consumers in
context/feature-specs/09-subphase-1.4-global-navigation-shell-header.md#L111-L119
to use those exact names consistently; do not rely on undocumented aliases.
```

</details>

<!-- cr-comment:v1:6096db99fc70bdb6a701cf1c -->

</blockquote></details>
<details>
<summary>src/components/catalog/search-bar.tsx-47-60 (1)</summary><blockquote>

`47-60`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Prevent stale search responses from updating current results.**

Both effects clear only the debounce timer. If an earlier `searchProducts` call has already started, it can resolve after a later query and overwrite the newer results.

- `src/components/catalog/search-bar.tsx#L47-L60`: use a cancellation flag or request sequence before every result and loading-state update.
- `src/components/catalog/search-modal.tsx#L118-L128`: apply the same stale-response guard.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/search-bar.tsx` around lines 47 - 60, Prevent stale
asynchronous search responses from updating state in the effect containing the
searchProducts call in src/components/catalog/search-bar.tsx at lines 47-60 by
adding a cancellation flag or request sequence and guarding every results,
selected-index, open-state, and loading-state update, including error and
finally paths. Apply the same stale-response guard to the corresponding
searchProducts effect in src/components/catalog/search-modal.tsx at lines
118-128; ensure cleanup invalidates prior requests while preserving updates from
the latest query.
```

</details>

<!-- cr-comment:v1:1306e3fe9598ab1b2db87b87 -->

</blockquote></details>
<details>
<summary>context/feature-specs/04-subphase-0.3-core-utility-layer-type-foundations.md-56-61 (1)</summary><blockquote>

`56-61`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Resolve the Saturday store-hours conflict.**

Feature Spec 04 defines Saturday hours as 11:00 AM–6:00 PM. Feature Spec 10 instructs the footer to display “Saturday: Contact Required.” This can publish incorrect store hours.

- `context/feature-specs/04-subphase-0.3-core-utility-layer-type-foundations.md#L56-L61`: retain or correct the canonical `STORE_HOURS` value.
- `context/feature-specs/10-subphase-1.5-global-footer-floating-whatsapp-mobile-bar.md#L48-L54`: derive the footer copy from the corrected canonical value.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/04-subphase-0.3-core-utility-layer-type-foundations.md`
around lines 56 - 61, Resolve the Saturday-hours conflict across
context/feature-specs/04-subphase-0.3-core-utility-layer-type-foundations.md:56-61
and
context/feature-specs/10-subphase-1.5-global-footer-floating-whatsapp-mobile-bar.md:48-54
by retaining the canonical Saturday 11:00 AM–6:00 PM value in STORE_HOURS and
updating the footer specification to derive its displayed hours from that
canonical value instead of using “Saturday: Contact Required.”
```

</details>

<!-- cr-comment:v1:8ba43439f0fde5cafd18accf -->

</blockquote></details>
<details>
<summary>src/components/catalog/search-modal.tsx-152-153 (1)</summary><blockquote>

`152-153`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Use a non-navigating search trigger.**

The header passes `Link href="/products"` through `Button asChild` and `DialogTrigger asChild`. Clicking the search control opens the dialog and navigates to `/products`. Use a plain button for the search trigger and keep catalog navigation as a separate link.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/search-modal.tsx` around lines 152 - 153, Update the
DialogTrigger usage in the search modal so it renders a plain non-navigating
button instead of wrapping the header’s Link through asChild. Preserve the
dialog opening behavior via handleOpenChange, and keep /products navigation in a
separate catalog link.
```

</details>

<!-- cr-comment:v1:3be1a820d6ff7cc88b4232b6 -->

</blockquote></details>
<details>
<summary>context/feature-specs/16-subphase-2.2-canonical-json-datasets.md-70-76 (1)</summary><blockquote>

`70-76`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Use the canonical product schema field values.**

Spec 15 defines uppercase `StockStatusEnum` values and the `authenticityMetadata` field. This spec instead requires lowercase stock values and an `authenticity` field. The datasets cannot satisfy both contracts.

Update this specification and the datasets to use the canonical schema, or change the schema and all consumers together.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/16-subphase-2.2-canonical-json-datasets.md` around
lines 70 - 76, Update the product dataset requirements and corresponding dataset
records to match the canonical schema from Spec 15: use the uppercase
StockStatusEnum values and rename the authenticity field to
authenticityMetadata. Keep the schema, datasets, and consumers consistent
without retaining the conflicting lowercase stockStatus values or authenticity
field.
```

</details>

<!-- cr-comment:v1:cb1230af4298ba6a35d200d8 -->

</blockquote></details>
<details>
<summary>src/components/forms/inquiry-form.tsx-369-382 (1)</summary><blockquote>

`369-382`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Keep `Other` separate from the custom city value.**

After the first character is entered, Line 381 replaces `deliveryCity: 'Other'` with the typed city. The condition on Line 369 then becomes false, so the custom-city input unmounts. The select also has no matching item for the typed value.

Keep `deliveryCity` as `'Other'`. Store the custom city in a separate field or state value. Build the final submission payload only in `onSubmit`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/forms/inquiry-form.tsx` around lines 369 - 382, Update the
custom-city handler in the inquiry form so typing only updates customCity and
leaves deliveryCity set to 'Other', keeping the conditional input mounted and
the select value valid. In the form’s onSubmit handler, combine the stored
customCity with the deliveryCity field when constructing the final submission
payload.
```

</details>

<!-- cr-comment:v1:416c061181ab99f43ef744b8 -->

</blockquote></details>
<details>
<summary>context/feature-specs/20-subphase-3.1-product-display-components.md-61-73 (1)</summary><blockquote>

`61-73`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Do not nest the quick-order button inside the product link.**

Lines 61 and 71-73 render a `<button>` inside a `<Link>`. This creates nested interactive content. `preventDefault()` only changes click behavior. It does not correct the HTML structure.

Make the product link and WhatsApp button sibling controls. An overlay link can cover non-interactive card content without wrapping the CTA.






Also applies to: 123-123

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/20-subphase-3.1-product-display-components.md` around
lines 61 - 73, The product card structure must not place the WhatsApp
quick-order button inside the product Link. Update the card component around the
product Link and quick-order CTA so they are sibling controls, using an overlay
link for non-interactive card content while keeping the button independently
clickable and preserving its existing WhatsApp behavior.
```

</details>

<!-- cr-comment:v1:a7a637906e86b229bcd30d9a -->

</blockquote></details>
<details>
<summary>src/actions/inquiry.ts-106-129 (1)</summary><blockquote>

`106-129`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _🏗️ Heavy lift_

**Do not confirm receipt when every delivery channel fails.**

This action has no durable persistence before notification dispatch. If Telegram and Resend both fail, lines 124-129 still report that the inquiry was received. The lead is then lost.

Persist the validated inquiry in a durable outbox before dispatch. If durable persistence is unavailable, return a retriable error when no notification channel accepts the inquiry. Apply the same outcome contract to `src/actions/contact.ts`, which uses the same dispatch pattern.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/actions/inquiry.ts` around lines 106 - 129, Persist the validated inquiry
to a durable outbox before the concurrent dispatch in the inquiry action, and
apply the same change to the corresponding dispatch flow in contact action.
Track whether either notification channel accepts the queued item; when both
channels fail and no durable persistence is available, return a retriable error
instead of the success receipt. Preserve the existing best-effort dispatch
diagnostics and success response when persistence or at least one channel
succeeds.
```

</details>

<!-- cr-comment:v1:4ca11b1f5d58f88072df70cc -->

</blockquote></details>
<details>
<summary>src/lib/services/telegram.ts-24-30 (1)</summary><blockquote>

`24-30`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Escape MarkdownV2 hyphens and test that behavior.** Telegram MarkdownV2 reserves `-`, and `submittedAt` always contains hyphens. The current formatter can therefore cause Telegram to reject otherwise valid notifications.

- `src/lib/services/telegram.ts#L24-L30`: add `-` to the escaped character set.
- `src/scripts/validate-notification-services.ts#L33-L39`: assert that `-2` becomes `\\-2`.

<details>
<summary>Proposed correction</summary>

```diff
- return text.replace(/[_*[\]()~`>#+=|{}.!\\]/g, '\\$&');
+ return text.replace(/[-_*[\]()~`>#+=|{}.!\\]/g, '\\$&');
```

```diff
 assert(escaped.includes('\\.') && escaped.includes('\\!') && escaped.includes('\\+1'), 'Escapes dots, exclamations, and plus signs');
+assert(escaped.includes('\\-2'), 'Escapes hyphens');
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/services/telegram.ts` around lines 24 - 30, Update escapeMarkdownV2
in src/lib/services/telegram.ts (lines 24-30) to include hyphens in the escaped
MarkdownV2 character set. Add or update the assertion in
src/scripts/validate-notification-services.ts (lines 33-39) to verify that "-2"
is converted to "\-2".
```

</details>

<!-- cr-comment:v1:8ee78b06d0b67a2fdf59614b -->

</blockquote></details>
<details>
<summary>src/lib/services/telegram.ts-97-109 (1)</summary><blockquote>

`97-109`: _🩺 Stability & Availability_ | _🟠 Major_ | _⚡ Quick win_

**Add a deadline to the Telegram request.**

Pass a bounded `AbortSignal` to `fetch`. If the request times out, return a failed dispatch result. `Promise.allSettled` waits for `sendTelegramAlert()` before `submitInquiryAction()` returns.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/services/telegram.ts` around lines 97 - 109, Add a bounded timeout
signal to the fetch call in sendTelegramAlert, using the existing request
error-handling flow to convert an abort or timeout into a failed dispatch
result. Ensure the deadline is enforced without changing successful Telegram
dispatch behavior, so submitInquiryAction is not left waiting indefinitely.
```

</details>

<!-- cr-comment:v1:c90cab025bfde9f7d90b6c5b -->

</blockquote></details>
<details>
<summary>src/lib/catalog.ts-148-160 (1)</summary><blockquote>

`148-160`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Use the fuzzy-search engine for the `search` filter.**

`targetText.includes(query)` only supports exact substrings. Queries with minor spelling errors return no products. This does not meet the catalog fuzzy-search requirement.

Use the project fuzzy-search implementation before applying the remaining filters. The approved catalog specification requires fuzzy text search.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/catalog.ts` around lines 148 - 160, Replace the exact
`targetText.includes(query)` check in the search branch of the catalog filtering
flow with the project’s approved fuzzy-search implementation. Apply fuzzy
matching to the same product, brand, category, description, and tag text before
the remaining filters, while preserving the existing trimmed, case-insensitive
query behavior.
```

</details>

<!-- cr-comment:v1:6a0c5ae837678fa550d5e60f -->

</blockquote></details>
<details>
<summary>context/feature-specs/33-subphase-5.3-server-actions-pipeline.md-44-54 (1)</summary><blockquote>

`44-54`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Use the exported silent-success constant name.**

`SILENT_SPAM_SUCCESS_RESPONSE` does not match the `SILENT_SUCCESS_RESPONSE` export in `context/feature-specs/31-subphase-5.1-anti-spam-rate-limiting.md` lines 133-137.

Use one canonical identifier in both specifications. Otherwise, the Server Action implementation will fail type checking.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/33-subphase-5.3-server-actions-pipeline.md` around
lines 44 - 54, Replace SILENT_SPAM_SUCCESS_RESPONSE with the exported canonical
identifier SILENT_SUCCESS_RESPONSE in both the Honeypot Trap Inspection and
Submission Timing Trap examples, keeping the silent-success behavior unchanged.
```

</details>

<!-- cr-comment:v1:5227be162dc1c8b838a4d10d -->

</blockquote></details>
<details>
<summary>context/feature-specs/32-subphase-5.2-notification-dispatchers.md-88-109 (1)</summary><blockquote>

`88-109`: _🩺 Stability & Availability_ | _🟠 Major_ | _⚡ Quick win_

**Bound the Telegram request duration.**

Because both Server Actions await `sendTelegramAlert()` through `Promise.allSettled()`, a stalled `fetch()` can keep the action pending until the platform execution limit. Use an `AbortController` with a bounded timeout, and clear the timer in `finally`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/32-subphase-5.2-notification-dispatchers.md` around
lines 88 - 109, Bound the fetch request in the Telegram dispatch flow with an
AbortController and a finite timeout, passing its signal to fetch so stalled
requests are aborted. Ensure the timeout is cleared in a finally block while
preserving the existing success and error result handling.
```

</details>

<!-- cr-comment:v1:e3db92de1464120932226f63 -->

</blockquote></details>
<details>
<summary>src/scripts/validate-server-actions.ts-6-11 (2)</summary><blockquote>

`6-11`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _🏗️ Heavy lift_

**Isolate this validator from live notification and rate-limit services.**

If `RESEND_API_KEY` or Upstash credentials exist, these action calls can send test leads and mutate live rate-limit buckets. `clearInMemoryRateLimitCache()` does not reset Upstash state.

Inject test doubles for notification and rate-limit services, or add an explicit test-only service implementation. Do not run this validator against configured production integrations.







Also applies to: 56-56, 133-133

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/scripts/validate-server-actions.ts` around lines 6 - 11, Update the
validator around submitInquiryAction, submitContactAction, and
clearInMemoryRateLimitCache to use explicit test-only notification and
rate-limit implementations instead of configured Resend or Upstash integrations.
Ensure validation calls cannot send notifications or mutate live rate-limit
state, including when production credentials are present, while preserving the
validator’s existing assertions.
```

</details>

<!-- cr-comment:v1:5cf860ddd3b7999762a1c0f3 -->

---

`6-11`: _📐 Maintainability & Code Quality_ | _🟠 Major_ | _⚡ Quick win_

**Isolate validator side effects from external services**

`NODE_ENV='test'` does not disable integrations. Upstash runs when credentials exist, and Resend and Telegram dispatch when their credentials exist. This script can mutate production rate limits and send fixture submissions to real recipients. Add test-mode guards or inject test doubles. Dynamic imports do not prevent these function-time credential checks.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/scripts/validate-server-actions.ts` around lines 6 - 11, The
validate-server-actions script must prevent fixture validation from contacting
external services or mutating production state. Update the execution paths
around submitInquiryAction, submitContactAction, and clearInMemoryRateLimitCache
to use explicit test-mode guards or injected test doubles for Upstash, Resend,
and Telegram, ensuring no real integrations run even when credentials are
present.
```

</details>

<!-- cr-comment:v1:1ff0dba4b073d7993854f55f -->

</blockquote></details>
<details>
<summary>src/actions/contact.ts-106-129 (1)</summary><blockquote>

`106-129`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Return an error when no store notification succeeds.**

`Promise.allSettled` records notification failures, but Lines 125-129 still return `success: true`.

`sendInquiryEmails` can return delivery errors without rejecting. If Telegram and the administrator email both fail, no lead is stored or delivered. The form then shows a successful receipt for a lost contact request.

Return a retriable failure when neither Telegram nor the administrator email succeeds. Keep the success response only when at least one store notification channel accepts the lead.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/actions/contact.ts` around lines 106 - 129, Update the return logic after
the dispatch diagnostics in the contact action to determine whether Telegram
succeeded or the administrator email completed without delivery errors. Return a
retriable failure result when both notification channels fail, including
fulfilled results with email errors; preserve the existing success envelope only
when at least one channel accepts the lead.
```

</details>

<!-- cr-comment:v1:b86bcd4d55a3e110d3ad78d6 -->

</blockquote></details>
<details>
<summary>src/lib/services/resend.ts-83-85 (1)</summary><blockquote>

`83-85`: _🔒 Security & Privacy_ | _🟠 Major_ | _⚡ Quick win_

**Do not log the customer email address.**

Line 84 writes `payload.email` to server logs. Development and preview logs can have broad retention and access.

Log only whether a customer email was supplied, or redact the address before logging.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/services/resend.ts` around lines 83 - 85, Update the customer
confirmation logging around the RESEND development log to stop emitting
payload.email; log only whether an email was supplied, while preserving the
existing rendered-length log.
```

</details>

<!-- cr-comment:v1:bc3f972910f4c85d4824466b -->

_Source: Linters/SAST tools_

</blockquote></details>
<details>
<summary>context/file-map.md-97-146 (1)</summary><blockquote>

`97-146`: _📐 Maintainability & Code Quality_ | _🟠 Major_ | _🏗️ Heavy lift_

**Synchronize the canonical route documentation with the implemented route tree.**

Both documents describe the homepage as `src/app/(marketing)/page.tsx`. The progress tracker identifies the implemented homepage as `src/app/page.tsx`. This causes agents to target the wrong route.

- `context/file-map.md#L97-L146`: update the application tree to match the implemented route layout and component names.
- `context/project-architecture.md#L63-L127`: update the rendering table and route hierarchy to use the same implemented route layout.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/file-map.md` around lines 97 - 146, Synchronize the canonical route
documentation with the implemented route tree: in context/file-map.md lines
97-146, update the application tree and component names, including the homepage
path, to match the implementation; in context/project-architecture.md lines
63-127, update the rendering table and route hierarchy to use the same paths and
names. Ensure both documents consistently reference src/app/page.tsx rather than
the marketing route-group homepage, with no direct code changes required.
```

</details>

<!-- cr-comment:v1:e29684a565d32d64934cadd0 -->

</blockquote></details>
<details>
<summary>src/components/catalog/catalog-filters.tsx-210-228 (1)</summary><blockquote>

`210-228`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Use semantic keyboard-operable filter controls.**

These clickable labels have no associated input. The visual checkbox and switch elements cannot receive keyboard focus or expose checked state to assistive technology.

- `src/components/catalog/catalog-filters.tsx#L210-L228`: use a native checkbox for each category and bind `checked` and `onChange`.
- `src/components/catalog/catalog-filters.tsx#L245-L263`: use a native checkbox for each fitness goal and bind `checked` and `onChange`.
- `src/components/catalog/catalog-filters.tsx#L342-L362`: use a native checkbox or a `button` with `role="switch"` and `aria-checked` for the stock filter.
As per coding guidelines, use WCAG AA accessibility requirements.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/catalog-filters.tsx` around lines 210 - 228, Replace
the non-focusable category filter label at
src/components/catalog/catalog-filters.tsx:210-228 with a native checkbox bound
to the category’s checked state and change handler. Apply the same
native-checkbox treatment to fitness goals at
src/components/catalog/catalog-filters.tsx:245-263. Update the stock filter at
src/components/catalog/catalog-filters.tsx:342-362 to use a native checkbox or
keyboard-operable switch with the appropriate checked state and accessible
semantics, preserving the existing toggle behavior and visual styling.
```

</details>

<!-- cr-comment:v1:2f869276a8478594aa2cf430 -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>src/components/layout/navbar.tsx-5-10 (1)</summary><blockquote>

`5-10`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Do not expose `/guides` before the guide route is implemented.**

The progress tracker marks Sub-Phase 6.7 Educational Hub Routes as incomplete. Both navigation surfaces currently send users to `/guides`.

- `src/components/layout/navbar.tsx#L5-L10`: remove or hide the `Guides` link until the route is available.
- `src/components/layout/mobile-nav.tsx#L81-L85`: remove or hide the `Supplement & Stack Guides` link until the route is available.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/layout/navbar.tsx` around lines 5 - 10, Remove or hide the
Guides entry from NAV_LINKS in src/components/layout/navbar.tsx at lines 5-10,
and remove or hide the Supplement & Stack Guides link in
src/components/layout/mobile-nav.tsx at lines 81-85 until the /guides route is
implemented.
```

</details>

<!-- cr-comment:v1:32b380a6ae070b8081b34174 -->

</blockquote></details>
<details>
<summary>context/progress-tracker.md-3-33 (1)</summary><blockquote>

`3-33`: _📐 Maintainability & Code Quality_ | _🟠 Major_ | _⚡ Quick win_

**Synchronize the active implementation phase.**

The tracker marks Sub-Phase 6.1 complete but also lists it as next. The overview still reports Phase 5 and Sub-Phase 5.4 as active. This can cause agents to work on an already completed sub-phase.

- `context/progress-tracker.md#L3-L33`: set Sub-Phase 6.2 as next and update the Phase 6 completion count to 1/8.
- `context/project-overview.md#L1109-L1113`: update the current project status to Phase 6 and reference the tracker state.
Based on learnings, follow the four-step progress protocol, including progress updates.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/progress-tracker.md` around lines 3 - 33, Synchronize the progress
documentation: in context/progress-tracker.md lines 3-33, keep Sub-Phase 6.1
marked complete, set Sub-Phase 6.2 as the next step, and change the Phase 6
overview count to 1/8; in context/project-overview.md lines 1109-1113, update
the current project status from Phase 5/Sub-Phase 5.4 to Phase 6 and reference
the tracker’s active state. Follow the established four-step progress protocol
and include the required progress updates.
```

</details>

<!-- cr-comment:v1:f78e514b77f036d7016858b4 -->

_Source: Learnings_

</blockquote></details>
<details>
<summary>src/lib/search.ts-54-55 (1)</summary><blockquote>

`54-55`: _🩺 Stability & Availability_ | _🟠 Major_ | _⚡ Quick win_

**`defaultVariant` can be `undefined` if a product has no variants.**

Line 55 falls back to `product.variants[0]`. If `variants` is empty, that value is `undefined`, and line 73 throws a TypeError. The failure happens during index construction, so every search request fails, not just the one product. Confirm that `ProductSchema` enforces a minimum of one variant. If it does not, add a guard.

<details>
<summary>🛡️ Proposed guard</summary>

```diff
-      priceNpr: defaultVariant.priceNpr,
-      discountPriceNpr: defaultVariant.discountPriceNpr,
+      priceNpr: defaultVariant?.priceNpr ?? 0,
+      discountPriceNpr: defaultVariant?.discountPriceNpr,
```
</details>





```shell
#!/bin/bash
# Description: Check whether the product schema requires at least one variant.
set -euo pipefail
fd -t f 'product.ts' src/lib/validations -x rg -n -C3 'variants|nonempty|min\(' {}
```


Also applies to: 73-74

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/search.ts` around lines 54 - 55, Verify whether ProductSchema
requires at least one variant; if not, guard the defaultVariant flow in the
search index construction so products with empty variants are skipped or handled
before the access at lines 73-74. Preserve the existing defaultVariant selection
for products containing variants and prevent one invalid product from failing
the entire index build.
```

</details>

<!-- cr-comment:v1:16abe1f8893639e02bdccc06 -->

</blockquote></details>
<details>
<summary>data/products.json-898-902 (1)</summary><blockquote>

`898-902`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Two products are assigned to the wrong brand.**

`data/brands.json` contains no entry for Insane Labz or MusclePharm. These two records reuse unrelated brand IDs:

- Line 901: `Insane Labz Psychotic Gold Pre-Workout` uses `brand_kevin_levrone`.
- Line 1046: `MusclePharm Essentials Fish Oil Softgels` uses `brand_labrada`.

`getProductsByBrand` in `src/lib/data/products.ts` filters on `brandId`, so the Kevin Levrone brand page will list an Insane Labz product and the Labrada brand page will list a MusclePharm product. `RelatedProducts` will also map these products to the wrong brand name. The brand verification text ("Radiant Traders gold hologram", "Lee Labrada stamp of authenticity") will then be shown for products that do not carry those seals, which is an authenticity claim risk for a store whose main value proposition is genuineness.

Add `brand_insane_labz` and `brand_musclepharm` entries to `data/brands.json`, then point these products at the correct IDs.





Also applies to: 1043-1047

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@data/products.json` around lines 898 - 902, Add brand_insane_labz and
brand_musclepharm entries to data/brands.json using the existing brand schema,
then update the brandId for Insane Labz Psychotic Gold Pre-Workout and
MusclePharm Essentials Fish Oil Softgels in data/products.json to reference
their corresponding new IDs instead of brand_kevin_levrone and brand_labrada.
```

</details>

<!-- cr-comment:v1:2ce72c063c17f902855e919f -->

</blockquote></details>
<details>
<summary>data/guides.json-24-28 (1)</summary><blockquote>

`24-28`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Four `relatedProductSlugs` entries do not match any product slug.**

Compare with `data/products.json`:

- `muscletech-nitro-tech-100-whey-gold` (line 26) — the product slug is `muscletech-nitro-tech-performance-series`.
- `dymatize-iso-100-hydrolyzed` (lines 27 and 75) — the product slug is `dymatize-iso-100-hydrolyzed-protein`.
- `muscletech-platinum-100-percent-creatine` (line 116) — the product slug is `muscletech-platinum-100-creatine`.

These references resolve to no product. Related-product rendering and internal links from guides will be empty or broken.

<details>
<summary>🐛 Proposed fix for the dangling slugs</summary>

```diff
     "relatedProductSlugs": [
       "optimum-nutrition-gold-standard-100-whey",
-      "muscletech-nitro-tech-100-whey-gold",
-      "dymatize-iso-100-hydrolyzed"
+      "muscletech-nitro-tech-performance-series",
+      "dymatize-iso-100-hydrolyzed-protein"
     ],
```

```diff
     "relatedProductSlugs": [
-      "dymatize-iso-100-hydrolyzed",
+      "dymatize-iso-100-hydrolyzed-protein",
       "optimum-nutrition-gold-standard-100-whey",
       "myprotein-impact-whey-protein"
     ],
```

```diff
     "relatedProductSlugs": [
       "kevin-levrone-gold-creatine",
-      "muscletech-platinum-100-percent-creatine"
+      "muscletech-platinum-100-creatine"
     ],
```
</details>





Run the following script to confirm every referenced slug exists and to check `relatedCategorySlugs` too:

```shell
#!/bin/bash
# Description: Cross-check guide references against product and category datasets.
set -euo pipefail

fd -t f 'products.json|categories.json|guides.json' -x echo {}

python3 - <<'PY'
import json, pathlib
root = pathlib.Path('.')
def load(p):
    f = list(root.rglob(p))
    return json.loads(f[0].read_text()) if f else []
products = load('data/products.json')
categories = load('data/categories.json')
guides = load('data/guides.json')
pslugs = {p['slug'] for p in products}
cslugs = {c.get('slug') for c in categories}
for g in guides:
    for s in g.get('relatedProductSlugs', []):
        if s not in pslugs:
            print('MISSING PRODUCT SLUG:', g['slug'], '->', s)
    for s in g.get('relatedCategorySlugs', []):
        if s not in cslugs:
            print('MISSING CATEGORY SLUG:', g['slug'], '->', s)
print('product slugs:', sorted(pslugs))
print('category slugs:', sorted(cslugs))
PY
```


Also applies to: 74-78, 114-117

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@data/guides.json` around lines 24 - 28, Update the affected
relatedProductSlugs entries in guides.json to use the exact existing product
slugs: replace muscletech-nitro-tech-100-whey-gold with
muscletech-nitro-tech-performance-series, dymatize-iso-100-hydrolyzed with
dymatize-iso-100-hydrolyzed-protein, and
muscletech-platinum-100-percent-creatine with muscletech-platinum-100-creatine.
Verify all relatedProductSlugs and relatedCategorySlugs resolve against their
respective datasets.
```

</details>

<!-- cr-comment:v1:d1d222c110b5809195105009 -->

</blockquote></details>
<details>
<summary>data/faqs.json-58-60 (1)</summary><blockquote>

`58-60`: _🔒 Security & Privacy_ | _🟠 Major_ | _⚡ Quick win_

**Qualify public creatine safety and dosage guidance.**

The current content can be read as universal medical advice. Replace categorical safety language with evidence-scoped wording. Add a clear instruction for people with kidney conditions, people at risk of kidney problems, and other users who need clinician advice before using creatine. NCCIH specifically advises people at risk of kidney problems to consult a health care provider and notes that safety data for children and adolescents are unavailable. ([nccih.nih.gov](https://www.nccih.nih.gov/health/bodybuilding-and-performance-enhancement-supplements?utm_source=openai))

- `data/faqs.json#L58-L60`: replace the leading “No” with qualified language and add the safety caveat.
- `data/categories.json#L53-L60`: add the same safety qualification to the daily-dose and loading-phase guidance.
- `data/faqs.json#L73-L76`: add the same safety qualification to the loading and maintenance guidance.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@data/faqs.json` around lines 58 - 60, Qualify the creatine safety and dosage
guidance rather than presenting it as universal medical advice: update
data/faqs.json lines 58-60 to replace the leading “No” and add advice for people
with kidney conditions, kidney-risk factors, or others needing clinician
guidance; apply the same safety qualification to the daily-dose and
loading-phase guidance in data/categories.json lines 53-60 and the loading and
maintenance guidance in data/faqs.json lines 73-76, including that safety data
for children and adolescents are unavailable.
```

</details>

<!-- cr-comment:v1:6ff485ab8901fe619f025c4e -->

</blockquote></details>
<details>
<summary>scripts/validate-datasets.ts-48-61 (1)</summary><blockquote>

`48-61`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Reject duplicate catalog identity values.**

The relational checks accept duplicate category, brand, product, and variant IDs. They also accept duplicate slugs. `getProductBySlug` resolves a slug with `.find()`, so a duplicate product slug makes the route select the first record instead of rejecting invalid data.

Add uniqueness checks for category and brand IDs/slugs, product IDs/slugs, and each product’s variant IDs before reporting success.

<details>
<summary>Proposed validation</summary>

```diff
+function assertUnique<T>(
+  records: readonly T[],
+  getKey: (record: T) => string,
+  label: string
+): void {
+  const seen = new Set<string>();
+
+  for (const record of records) {
+    const key = getKey(record);
+    if (seen.has(key)) {
+      throw new Error(`Duplicate ${label}: ${key}`);
+    }
+    seen.add(key);
+  }
+}
+
+assertUnique(categoriesResult.data, (category) => category.id, 'category ID');
+assertUnique(categoriesResult.data, (category) => category.slug, 'category slug');
+assertUnique(brandsResult.data, (brand) => brand.id, 'brand ID');
+assertUnique(brandsResult.data, (brand) => brand.slug, 'brand slug');
+assertUnique(productsResult.data, (product) => product.id, 'product ID');
+assertUnique(productsResult.data, (product) => product.slug, 'product slug');
+
+for (const product of productsResult.data) {
+  assertUnique(product.variants, (variant) => variant.id, `${product.id} variant ID`);
+}
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@scripts/validate-datasets.ts` around lines 48 - 61, Extend the dataset
validation flow in scripts/validate-datasets.ts to reject duplicate category and
brand IDs/slugs, product IDs/slugs, and variant IDs within each product before
reporting success. Add duplicate detection alongside the existing categoryIds
and brandIds cross-checks, emit a clear validation error identifying the
duplicated identity, and exit with failure when any duplicate is found.
```

</details>

<!-- cr-comment:v1:31877d841a0bdf1a32425868 -->

</blockquote></details>
<details>
<summary>src/components/forms/contact-form.tsx-185-188 (1)</summary><blockquote>

`185-188`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Keep the `Other` sentinel separate from custom city text.**

At Line 319, the first typed character replaces `deliveryCity === 'Other'`. The condition at Line 307 then becomes false, so the custom-city input unmounts. The submitted city becomes only that first character.

Also clear `customCity` when the user selects “Send Another Message.” Otherwise, a later submission can reuse the prior city.

<details>
<summary>Proposed change</summary>

```diff
               onChange={(e) => {
-                const val = e.target.value;
-                setCustomCity(val);
-                setValue('deliveryCity', val ? val : 'Other', { shouldValidate: true });
+                setCustomCity(e.target.value);
               }}
```

```diff
               onClick={() => {
                 setSubmittedReceipt(null);
+                setCustomCity('');
                 reset();
               }}
```
</details>






Also applies to: 306-320

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/forms/contact-form.tsx` around lines 185 - 188, Update the
delivery-city handling near the custom-city input so the “Other” sentinel
remains distinct from typed custom city text, keeping the custom-city input
mounted while users enter their city and submitting the complete value. In the
“Send Another Message” handler that calls setSubmittedReceipt and reset, also
clear customCity so later submissions cannot reuse the previous city.
```

</details>

<!-- cr-comment:v1:be4e6e6e4962c0313314d327 -->

</blockquote></details>
<details>
<summary>src/components/layout/footer.tsx-36-41 (1)</summary><blockquote>

`36-41`: _🔒 Security & Privacy_ | _🟠 Major_ | _🏗️ Heavy lift_

**Add the legal routes before publishing these links.**

The supplied route inventory contains no page for `/privacy-policy`, `/terms`, `/delivery-policy`, or `/disclaimer`. These footer links will lead users to unavailable pages. Add the pages, or remove the links until the documents are available.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/layout/footer.tsx` around lines 36 - 41, Resolve the missing
destinations referenced by LEGAL_LINKS: add pages for /privacy-policy, /terms,
/delivery-policy, and /disclaimer before publishing these footer links, or
remove the corresponding entries until those documents are available. Keep
LEGAL_LINKS aligned with the actual route inventory.
```

</details>

<!-- cr-comment:v1:39ab69967533948082357691 -->

</blockquote></details>
<details>
<summary>src/app/(marketing)/location/page.tsx-240-260 (1)</summary><blockquote>

`240-260`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Use one free-delivery threshold.**

Line 258 states NPR 10,000. `src/lib/constants.ts` lines 92-95 define free delivery above NPR 5,000. Customers receive different qualification rules depending on the page. Render the canonical rule here, or update the canonical rule after the business decision.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/app/`(marketing)/location/page.tsx around lines 240 - 260, Update the
“Free Valley Delivery” text in the delivery information block to use the
canonical free-delivery threshold from the relevant constants symbol, ensuring
it matches the NPR 5,000 rule defined there. Do not introduce a separate
hardcoded threshold; preserve the existing Kathmandu Valley qualification
wording.
```

</details>

<!-- cr-comment:v1:46a528404e48d2deb9b69a7c -->

</blockquote></details>
<details>
<summary>src/lib/constants.ts-29-45 (1)</summary><blockquote>

`29-45`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _🏗️ Heavy lift_

**Unify the store-location source of truth.**

Lines 32 and 39-40 conflict with `data/store-info.json`, which the supplied location validator identifies as Golfutar at `27.7478, 85.3533`. The footer and WhatsApp helpers use these constants, while the location page uses store data. Users can receive different addresses or directions by entry point. Derive all store-location values from one canonical record.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/constants.ts` around lines 29 - 45, Update STORE_LOCATION and the
consumers using it to derive all address, coordinate, and map-link values from
the canonical data/store-info.json record, including the validated Golfutar
coordinates 27.7478 and 85.3533. Remove conflicting hardcoded location values
while preserving the existing footer, WhatsApp, and location-page behavior
through the shared source.
```

</details>

<!-- cr-comment:v1:d2e65adf3b0c25ecb063ebd5 -->

</blockquote></details>
<details>
<summary>src/lib/analytics.ts-151-161 (1)</summary><blockquote>

`151-161`: _🔒 Security & Privacy_ | _🟠 Major_ | _⚡ Quick win_

**Do not forward raw search text to analytics providers.**

A user can enter personal data into the catalog search field. Lines 155 and 158 send that raw value to GA4, Meta Pixel, and `mw:analytics`. Send aggregate data such as query length and result count instead.

<details>
<summary>Proposed fix</summary>

```diff
-    label: params.query,
+    label: 'catalog_search',
     value: params.resultsCount,
     params: {
-      search_term: params.query,
+      search_length: params.query.length,
       results_count: params.resultsCount,
     },
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/analytics.ts` around lines 151 - 161, Update trackSearchQuery so
params.query is never forwarded to analytics providers through either label or
params.search_term. Replace the raw query value with aggregate data such as its
length, while preserving resultsCount in value and params.results_count.
```

</details>

<!-- cr-comment:v1:29c47d0fd79b7f258711cf2d -->

</blockquote></details>
<details>
<summary>src/app/categories/[slug]/page.tsx-65-69 (1)</summary><blockquote>

`65-69`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Pass the category constraint to `CatalogContainer`.**

`CatalogContainer` reads `category` only from the query string. Call `getProductsByCategory(slug)` so category archives exclude products from other categories.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/app/categories/`[slug]/page.tsx around lines 65 - 69, Update the
product-loading call in the page’s Promise.all to use
getProductsByCategory(slug) instead of getProducts(), so the products passed to
CatalogContainer are constrained to the current category while categories and
brands remain unchanged.
```

</details>

<!-- cr-comment:v1:08ef8775e1dae7191c8ba238 -->

</blockquote></details>

</blockquote></details>

<!-- This is an auto-generated comment by CodeRabbit for review status -->