## 2026-08-15T03:07:26Z

# Dispatch Assignment: Domain 2 (R2) — Logic Bugs, Edge Cases & Data Integrity

## Target Scope
Inspect the MUSCLEWORKS Next.js 16 codebase at `c:\nooridigital_assets\my-projects\muscleworks` for:
1. **WhatsApp URL Generation Engine (`wa.me`)**:
   - Check all WhatsApp link constructors (`wa.me/977...`).
   - Query parameter encoding: `encodeURIComponent`, double encoding, missing encoding, newline handling (`%0A` vs `\n`), special characters (`&`, `?`, `#`, `/`, `+`, emojis, product titles with hyphens/quotes/percentages).
   - Phone number formatting for WhatsApp: ensuring international format without `+` or leading zeros if required by `wa.me/977...` vs `tel:`.
2. **Telegram Bot API Integration**:
   - Check all Telegram message formatters, handlers, and notification pipelines.
   - MarkdownV2 special character escaping: Characters requiring escaping `_ * [ ] ( ) ~ \` > # + - = | { } . !` (e.g. dots in prices `Rs. 5,000`, hyphens in phones `+977-98...`, exclamation marks, parentheses in sizes). Missing escapes cause Telegram 400 Bad Request.
   - Error handling: are errors caught and logged, or silently swallowed? Are fetch failures causing hanging promises or lost notifications?
3. **Data Integrity & Validations**:
   - Phone number validation regex (must support Nepal standard `+977-98...`, `98...`, `97...`, `01...` landlines or mobile formats according to specs).
   - Pricing calculations: NPR integer prices, discount percentages, cart/inquiry totals, rounding errors, string vs number types.
   - Referential integrity across JSON datasets (`src/data/` or similar): cross-check product IDs, category IDs, brand IDs, image asset paths, slug uniqueness, missing required fields.

## Output Requirements
Write your detailed findings to `c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_r2\analysis.md` and complete with `c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_r2\handoff.md`.
For every finding:
- File path (relative and absolute)
- Exact line numbers
- Severity (Critical, Major, Minor, Optimization)
- Issue summary & Root cause
- Concrete impact analysis
- Copy-paste ready fix diff
