**Actionable comments posted: 10**

<details>
<summary>🧹 Nitpick comments (6)</summary><blockquote>

<details>
<summary>src/components/location/store-map-embed.tsx (2)</summary><blockquote>

`1-13`: _🚀 Performance & Scalability_ | _🔵 Trivial_ | _⚡ Quick win_

**Remove `'use client'`; this component has no interactivity.**

`StoreMapEmbed` renders static markup from a JSON import. It uses no hooks, no state, and no event handlers. The directive forces the component and its `lucide-react` icons into the client bundle without benefit.

As per coding guidelines: "Use Server Components by default and add `'use client'` only to interactive leaf components."

<details>
<summary>♻️ Proposed change</summary>

```diff
-'use client';
-
 import { MapPin, Navigation, ExternalLink, Car } from 'lucide-react';
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/location/store-map-embed.tsx` around lines 1 - 13, Remove the
top-level 'use client' directive from StoreMapEmbed so it remains a Server
Component; preserve the existing static rendering and StoreMapEmbedProps API.
```

</details>

<!-- cr-comment:v1:5a49aff7404c8a05e9d9973e -->

_Source: Coding guidelines_

---

`23-33`: _🔒 Security & Privacy_ | _🔵 Trivial_ | _💤 Low value_

**Consider a curated `sandbox` value on the map iframe.**

The `src` comes from repository-controlled data, so the current risk is low. A curated `sandbox` still limits the embedded document if the URL value ever changes. Google Maps embeds need scripts and same-origin access, so verify the embed still loads before you merge this change.

<details>
<summary>🛡️ Proposed hardening</summary>

```diff
         loading="lazy"
         referrerPolicy="no-referrer-when-downgrade"
+        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/location/store-map-embed.tsx` around lines 23 - 33, Update the
map iframe in the location embed component to include a curated sandbox policy
permitting the scripts and same-origin access required by Google Maps, then
verify the configured embed URL still loads and functions correctly.
```

</details>

<!-- cr-comment:v1:24078810128af6aa970cbff1 -->

_Source: Linters/SAST tools_

</blockquote></details>
<details>
<summary>src/app/(marketing)/location/page.tsx (2)</summary><blockquote>

`80-83`: _🔒 Security & Privacy_ | _🔵 Trivial_ | _💤 Low value_

**Escape `<` when you serialize the JSON-LD payload.**

`JSON.stringify` does not escape `<`. If any store dataset string ever contains `</script`, the browser terminates the script block early and the remaining text renders as HTML. The data is repository-controlled today, so the risk is low, but the guard costs one `replace`.

<details>
<summary>🛡️ Proposed hardening</summary>

```diff
       <script
         type="application/ld+json"
-        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
+        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
       />
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/app/`(marketing)/location/page.tsx around lines 80 - 83, Update the
JSON-LD serialization in the page’s structured-data script to escape every
less-than character after JSON.stringify, preventing embedded </script sequences
from terminating the script block. Keep the existing jsonLd payload and
dangerouslySetInnerHTML flow unchanged aside from this serialization hardening.
```

</details>

<!-- cr-comment:v1:4747eb6d9c82dc815338b71d -->

_Source: Linters/SAST tools_

---

`142-144`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _⚡ Quick win_

**Read the municipality and postal code from the dataset.**

Lines 143 hardcodes `Budha-Nilkantha, Kathmandu 44500`. The component already destructures `address`, and Line 154 renders the same fields from data. A dataset change would leave this heading stale.

<details>
<summary>♻️ Proposed refactor</summary>

```diff
                     <p className="text-xs text-muted-foreground">
-                      Budha-Nilkantha, Kathmandu 44500
+                      {address.municipality}, {address.city} {address.postalCode}
                     </p>
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/app/`(marketing)/location/page.tsx around lines 142 - 144, Update the
location heading near the address destructuring to render the municipality and
postal code from the existing address data, matching the fields used by the
later address rendering instead of hardcoding “Budha-Nilkantha, Kathmandu
44500.”
```

</details>

<!-- cr-comment:v1:9c6aedfd51575aea7d9e3c34 -->

</blockquote></details>
<details>
<summary>src/scripts/validate-location-components.ts (1)</summary><blockquote>

`6-12`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _💤 Low value_

**`NODE_ENV` is assigned after the imported modules are evaluated in both validator scripts.** ES module imports are hoisted, so the top-level `Object.assign(process.env, { NODE_ENV: 'test' })` statement runs only after every imported module has already executed. Any module-scope read of `process.env.NODE_ENV` sees the original value.
- `src/scripts/validate-location-components.ts#L6-L12`: set `NODE_ENV` in the run command, or convert the five imports to dynamic `import()` calls placed after the assignment.
- `src/scripts/validate-form-components.ts#L6-L10`: apply the same change to the three form-component imports.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/scripts/validate-location-components.ts` around lines 6 - 12, Ensure
NODE_ENV is set before imported modules evaluate in both validator scripts:
src/scripts/validate-location-components.ts lines 6-12 and
src/scripts/validate-form-components.ts lines 6-10. Either configure NODE_ENV in
the run command or replace the static component imports with dynamic import()
calls executed after the existing assignment; apply the corresponding change to
all five location imports and all three form-component imports.
```

</details>

<!-- cr-comment:v1:886c6ba1a102ae0a1509cd80 -->

</blockquote></details>
<details>
<summary>context/feature-specs/37-subphase-5.5-contact-store-locations-experience.md (1)</summary><blockquote>

`31-31`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _💤 Low value_

**Replace the LaTeX expression with plain text.**

GitHub renders `$\ge 48\text{px}$` literally in this context. Write `>= 48px` instead.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/37-subphase-5.5-contact-store-locations-experience.md`
at line 31, Update the Mobile Touch Targets requirement in the feature
specification to replace the LaTeX expression with the plain-text form >= 48px,
preserving the rest of the requirement unchanged.
```

</details>

<!-- cr-comment:v1:3261cad2da4c2148aa7f7f75 -->

</blockquote></details>

</blockquote></details>

<details>
<summary>🤖 Prompt for all review comments with AI agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

Inline comments:
In
`@context/feature-specs/36-subphase-5.4-interactive-form-components-consultation-modal.md`:
- Line 3: Update the status header in the Sub-Phase 5.4 specification to match
the tracker and registry convention, replacing “Draft / Pending Implementation”
with the established implemented-state value such as Approved or the
consistently used Complete status.

In `@context/feature-specs/37-subphase-5.5-contact-store-locations-experience.md`:
- Line 3: Update the Status field in the feature specification from “Draft /
Pending Implementation” to the repository’s implemented state, reflecting
completion of the four target files; follow the project’s established status
wording and update the corresponding progress-tracker and roadmap entries as
required.
- Line 29: Resolve the accessor/implementation drift by updating the location
page and StoreMapEmbed to obtain store metadata through getStoreInfo(),
getOpeningHours(), isStoreOpenNow(), and getTodayOpeningHours() from
`@/lib/data/store` instead of importing store-info.json directly; preserve
StoreHoursCard’s existing isStoreOpenNow usage and ensure all required metadata
remains available.

In `@src/app/`(marketing)/contact/page.tsx:
- Around line 170-176: Update the interactive links in
src/app/(marketing)/contact/page.tsx at lines 170-176, 48-50, and 190-192 to
provide touch targets of at least 44×44px, preserving their existing content and
behavior. Update the telephone call link in
src/components/location/store-hours-card.tsx at lines 116-121 to provide a touch
target of at least 48×48px.

In `@src/components/forms/consultation-modal.tsx`:
- Around line 33-42: Update isControlled in the modal state logic to require
both controlledOpen and setControlledOpen, so passing open without onOpenChange
uses uncontrolledOpen updates and allows Escape, overlay, and close-button
actions to close the dialog.

In `@src/components/forms/contact-form.tsx`:
- Around line 301-327: Update the contact form validation around
preferredContactMethod and the email field so selecting email requires a
non-empty email value. Add cross-field validation that produces an email-field
error when preferredContactMethod is 'email', and ensure that error is rendered
by the email input while leaving other contact-method behavior unchanged.
- Around line 211-327: Update the contact form controls to expose programmatic
labels and selection semantics: assign matching unique ids and htmlFor values
for the full name, phone, email, delivery city, and conditional custom-city
inputs/select trigger, adding a label for the city selector. Convert the
preferredContactMethod button group into an accessible radio group, with the
group labelled and each option using role="radio" and aria-checked based on
selectedContactMethod while preserving its existing selection behavior.

In `@src/components/forms/inquiry-form.tsx`:
- Around line 354-366: Update the delivery-city handling in the inquiry form so
the custom-city input uses setValue('deliveryCity', ...) on every change,
keeping react-hook-form state synchronized instead of relying only on
customCity. In the submission validation, require a non-empty custom city when
selectedDeliveryCity is 'Other', and prevent the literal 'Other' or stale value
from being submitted.
- Around line 254-413: Update the inquiry form fields around the Full Name,
phoneNumber, email, inquiryType, deliveryCity, customCity,
preferredContactMethod, and message controls so each label has a matching
control id, and each validation message has a stable id referenced through the
control’s aria-describedby when present. Make the Preferred Response Method
container a radiogroup and expose each option’s selected state with aria-checked
while preserving button behavior.

In `@src/components/location/store-hours-card.tsx`:
- Around line 21-30: Update the store-hours component’s currentKathmanduDay and
isStoreOpenNow flow to keep the Kathmandu day and store status in client state,
initializing both after mount to avoid stale statically rendered values. Refresh
both values on a timer so opening, closing, and midnight transitions are
reflected, and clear the timer in the effect cleanup.

---

Nitpick comments:
In `@context/feature-specs/37-subphase-5.5-contact-store-locations-experience.md`:
- Line 31: Update the Mobile Touch Targets requirement in the feature
specification to replace the LaTeX expression with the plain-text form >= 48px,
preserving the rest of the requirement unchanged.

In `@src/app/`(marketing)/location/page.tsx:
- Around line 80-83: Update the JSON-LD serialization in the page’s
structured-data script to escape every less-than character after JSON.stringify,
preventing embedded </script sequences from terminating the script block. Keep
the existing jsonLd payload and dangerouslySetInnerHTML flow unchanged aside
from this serialization hardening.
- Around line 142-144: Update the location heading near the address
destructuring to render the municipality and postal code from the existing
address data, matching the fields used by the later address rendering instead of
hardcoding “Budha-Nilkantha, Kathmandu 44500.”

In `@src/components/location/store-map-embed.tsx`:
- Around line 1-13: Remove the top-level 'use client' directive from
StoreMapEmbed so it remains a Server Component; preserve the existing static
rendering and StoreMapEmbedProps API.
- Around line 23-33: Update the map iframe in the location embed component to
include a curated sandbox policy permitting the scripts and same-origin access
required by Google Maps, then verify the configured embed URL still loads and
functions correctly.

In `@src/scripts/validate-location-components.ts`:
- Around line 6-12: Ensure NODE_ENV is set before imported modules evaluate in
both validator scripts: src/scripts/validate-location-components.ts lines 6-12
and src/scripts/validate-form-components.ts lines 6-10. Either configure
NODE_ENV in the run command or replace the static component imports with dynamic
import() calls executed after the existing assignment; apply the corresponding
change to all five location imports and all three form-component imports.
```

</details>

<details>
<summary>🪄 Autofix</summary>

Fix all unresolved CodeRabbit comments on this PR:

- [ ] <!-- {"checkboxId": "4b0d0e0a-96d7-4f10-b296-3a18ea78f0b9"} --> Push a commit to this branch (recommended)
- [ ] <!-- {"checkboxId": "ff5b1114-7d8c-49e6-8ac1-43f82af23a33"} --> Create a new PR with the fixes

</details>

---

<details>
<summary>ℹ️ Review info</summary>

<details>
<summary>⚙️ Run configuration</summary>

**Configuration used**: defaults

**Review profile**: CHILL

**Plan**: Pro Plus

**Run ID**: `91c67a24-3f31-4d99-8619-b94cc43e6438`

</details>

<details>
<summary>📥 Commits</summary>

Reviewing files that changed from the base of the PR and between cf7b7f3964556e8285fd19f93dfa2e91dda1001d and 82dc2d2ab6c6fd5b6b9610d69d312120349552f3.

</details>

<details>
<summary>📒 Files selected for processing (14)</summary>

* `context/feature-roadmap.md`
* `context/feature-specs/36-subphase-5.4-interactive-form-components-consultation-modal.md`
* `context/feature-specs/37-subphase-5.5-contact-store-locations-experience.md`
* `context/feature-specs/README.md`
* `context/progress-tracker.md`
* `src/app/(marketing)/contact/page.tsx`
* `src/app/(marketing)/location/page.tsx`
* `src/components/forms/consultation-modal.tsx`
* `src/components/forms/contact-form.tsx`
* `src/components/forms/inquiry-form.tsx`
* `src/components/location/store-hours-card.tsx`
* `src/components/location/store-map-embed.tsx`
* `src/scripts/validate-form-components.ts`
* `src/scripts/validate-location-components.ts`

</details>

<details>
<summary>🚧 Files skipped from review as they are similar to previous changes (1)</summary>

* context/feature-roadmap.md

</details>

</details>

<!-- This is an auto-generated comment by CodeRabbit for review status -->