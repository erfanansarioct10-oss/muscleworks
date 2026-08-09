<!-- This is an auto-generated comment: summarize by coderabbit.ai -->
<!-- review_stack_entry_start -->

[![Review Change Stack](https://storage.googleapis.com/coderabbit_public_assets/review-stack-in-coderabbit-ui.svg)](https://app.coderabbit.ai/change-stack/erfanansarioct10-oss/muscleworks/pull/1?utm_source=github_walkthrough&utm_medium=github&utm_campaign=change_stack)

<!-- review_stack_entry_end -->
<!-- walkthrough_start -->

<details>
<summary>📝 Walkthrough</summary>

## Walkthrough

The change establishes the project foundation. It adds agent rules, canonical context documents, domain specifications, architecture plans, coding standards, implementation phases, and renames the package to `muscleworks`.

### Changes

**Project foundation**

|Layer / File(s)|Summary|
|---|---|
|**Agent governance and progress tracking** <br> `AGENTS.md`, `context/ai-workflow.md`, `context/progress-tracker.md`, `context/feature-specs/README.md`|Defines context authority, scoped execution, approval workflow, progress synchronization, and validation gates.|
|**Business and system architecture** <br> `context/project-overview.md`, `context/project-architecture.md`, `context/project-tech-stacks.md`|Documents the V1 business scope, routes, rendering model, WhatsApp ordering, inquiry processing, security boundaries, integrations, and technical stack.|
|**Domain schemas and validation contracts** <br> `context/data-models.md`|Defines Zod schemas and inferred types for products, catalog entities, inquiries, store information, guides, and validation rules.|
|**Implementation roadmap and project structure** <br> `context/file-map.md`, `context/feature-roadmap.md`, `package.json`|Documents the project tree, module responsibilities, phased implementation plan, completion criteria, and changes the package name to `muscleworks`.|
|**Coding, security, accessibility, and performance standards** <br> `context/coding-standards.md`|Defines mobile-first UI rules, strict TypeScript practices, Next.js architecture, Server Action handling, accessibility requirements, performance budgets, and review checks.|

**Estimated code review effort:** 3 (Moderate) | ~20 minutes

</details>

<!-- walkthrough_end -->
<!-- pre_merge_checks_walkthrough_start -->

<details>
<summary>🚥 Pre-merge checks | ✅ 5</summary>

<details>
<summary>✅ Passed checks (5 passed)</summary>

|         Check name         | Status   | Explanation                                                                                                                               |
| :------------------------: | :------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
|      Description Check     | ✅ Passed | Check skipped - CodeRabbit’s high-level summary is enabled.                                                                               |
|         Title check        | ✅ Passed | The title accurately summarizes the main change: initializing canonical project documentation for context, architecture, and data models. |
|     Docstring Coverage     | ✅ Passed | No functions found in the changed files to evaluate docstring coverage. Skipping docstring coverage check.                                |
|     Linked Issues check    | ✅ Passed | Check skipped because no linked issues were found for this pull request.                                                                  |
| Out of Scope Changes check | ✅ Passed | Check skipped because no linked issues were found for this pull request.                                                                  |

</details>

</details>

<!-- pre_merge_checks_walkthrough_end -->
<!-- finishing_touch_checkbox_start -->

<details>
<summary>✨ Finishing Touches</summary>

<details>
<summary>🧪 Generate unit tests (beta)</summary>

- [ ] <!-- {"checkboxId": "f47ac10b-58cc-4372-a567-0e02b2c3d479", "radioGroupId": "utg-output-choice-group-unknown_comment_id"} -->   Create PR with unit tests
- [ ] <!-- {"checkboxId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8", "radioGroupId": "utg-output-choice-group-unknown_comment_id"} -->   Commit unit tests in branch `initial`

</details>

</details>

<!-- finishing_touch_checkbox_end -->
<!-- tips_start -->

---




<sub>Comment `@coderabbitai help` to get the list of available commands.</sub>

<!-- tips_end -->

**Actionable comments posted: 15**

<details>
<summary>🤖 Prompt for all review comments with AI agents</summary>

````
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

Inline comments:
In `@AGENTS.md`:
- Around line 40-49: Update the Markdown links in the AGENTS.md reference table
to use repository-relative targets instead of workstation-specific
file:///c:/... URLs. Preserve each link’s existing context file destination and
link text, using paths such as context/progress-tracker.md.

In `@context/ai-workflow.md`:
- Around line 51-70: Unify the Server Action contract across all referenced
documentation: in context/ai-workflow.md lines 51-70, require one exact
ActionResult export path rather than alternatives; in context/data-models.md
lines 328-360, replace ActionResponse with the canonical ActionResult fields and
update its export mapping; in context/project-architecture.md lines 226-237,
reference that canonical envelope and approved rate-limit values instead of
defining another shape; and in context/coding-standards.md lines 455-493, use
the same ActionResult path and fields, hp_field, _form_loaded_at, and approved
rate-limit window.
- Line 132: Label each ASCII diagram or directory-tree fence as text by changing
the opening fence to ```text at context/ai-workflow.md:132-132,
context/project-architecture.md:97-97 and 283-283, context/file-map.md:30-30,
and context/coding-standards.md:15-15, 263-263, and 473-473.

In `@context/coding-standards.md`:
- Around line 570-575: Update the not-found standards entry for
src/app/not-found.tsx to reference the canonical /products route instead of the
nonexistent /catalog route, while preserving the existing /categories and home
links.
- Around line 128-173: Update the ProductSchema example and its Product type
inference in section 3.3 to import from src/lib/validations/product.ts instead
of the prohibited src/lib/schemas/ path, and match the canonical ProductSchema
shape defined by context/data-models.md. Preserve the z.infer-based type
derivation and remove fields or definitions that conflict with the canonical
contract.
- Line 337: Update the global CSS reference in the file map to use the canonical
App Router path src/app/globals.css instead of src/styles/globals.css, so the
Tailwind CSS v4 `@theme` file is created in the correct location.

In `@context/data-models.md`:
- Around line 189-198: Update ProductVariantSchema to add an object-level
refinement requiring discountPriceNpr to be strictly less than priceNpr when
discountPriceNpr is provided, while preserving valid variants that omit the
discount price.
- Around line 175-181: Update AuthenticityMetadataSchema and the corresponding
schema at the additional referenced section so authenticity,
importer/distributor, and verification claims are opt-in rather than assumed.
Remove the true default from isAuthenticGuarantee, make claim fields optional,
and only validate or require their evidence when the approved claim is
explicitly enabled; do not fabricate default claims.

In `@context/feature-roadmap.md`:
- Around line 121-122: Reconcile context/feature-roadmap.md with the frozen
canonical specifications: at lines 121-122 remove unapproved phone numbers,
delivery rates, and social links; at lines 200-216 replace New Baneshwor and
Jhamsikhel with the single Golfutar location and remove unsupported guarantees
and delivery claims; at lines 228-234 use src/lib/validations/; at lines 253-264
remove unapproved second-store data and testimonials; at lines 313-345 split
each five-file sub-phase into compliant 2–4 file sub-phases; at lines 425-433
use canonical service paths, hp_field, and the approved rate-limit contract; at
lines 488-494 use the canonical marketing contact and single-location routes;
and at lines 568-577 use canonical policy and FAQ routes without drafting legal
or delivery terms before approved materials exist.

In `@context/file-map.md`:
- Line 292: Update the FAQ route’s data flow to use a new typed accessor in
src/lib/data/faqs.ts instead of importing faqs.json directly. Define the
accessor’s explicit return type, validate the JSON against the project’s
established schema pattern, and update the FAQ page component to consume that
accessor while preserving its existing FAQPage JSON-LD behavior.

In `@context/progress-tracker.md`:
- Line 54: Update the completed-document count in the progress summary from 9 to
10 so it matches the ten documents listed in the relevant document list.

In `@context/project-architecture.md`:
- Around line 168-180: Replace the hard-coded muscleworksnepal.com URL in the
order message template with a value derived from the approved
NEXT_PUBLIC_SITE_URL configuration, preserving the products/{slug} path and
using the configured site URL only after it is available.
- Around line 264-270: Update the Product + Offer row in the schema table so the
availability value escapes the pipe separator as \|, keeping “InStock |
OutOfStock” within the Included Data cell and preserving the rest of the row
unchanged.

In `@context/project-tech-stacks.md`:
- Line 71: Update the Rate Limiting entry to restrict the in-memory fallback to
local development only; outside local development, require configured Upstash
credentials or fail closed rather than using an instance-local limiter.

In `@package.json`:
- Line 2: Update the root package metadata in package-lock.json to match the
renamed package declared by package.json as muscleworks, including the
lockfile’s root package entry; regenerate or refresh the lockfile without
altering unrelated dependency data.
````

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

**Run ID**: `cd869f57-fb74-4376-8ab3-7665a8924e49`

</details>

<details>
<summary>📥 Commits</summary>

Reviewing files that changed from the base of the PR and between 331a1deb781e9e8b4c7a7f277a501f869169ab1b and 72e3a6ddaedc043df68b18f3a4a852a5cbae7922.

</details>

<details>
<summary>📒 Files selected for processing (12)</summary>

* `AGENTS.md`
* `context/ai-workflow.md`
* `context/coding-standards.md`
* `context/data-models.md`
* `context/feature-roadmap.md`
* `context/feature-specs/README.md`
* `context/file-map.md`
* `context/progress-tracker.md`
* `context/project-architecture.md`
* `context/project-overview.md`
* `context/project-tech-stacks.md`
* `package.json`

</details>

</details>

<!-- This is an auto-generated comment by CodeRabbit for review status -->