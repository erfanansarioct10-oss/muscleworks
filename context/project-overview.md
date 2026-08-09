# MUSCLEWORKS SUPPLEMENTS — PROJECT OVERVIEW

**Document:** `Project-overview.md`  
**Purpose:** Canonical project context for all AI coding agents  
**Client:** MUSCLEWORKS SUPPLEMENTS  
**Business established:** 2026  
**Location:** Golfutar, Budha-Nilkantha, Nepal 44500  
**Primary market:** Kathmandu Valley + Nationwide Nepal  
**Website type:** Product catalog + lead/order-generation website  
**Initial e-commerce:** Not required  
**Primary ordering channel:** WhatsApp / Phone  
**Hosting target:** Vercel  
**Development:** Antigravity IDE coding agents

---

## 1. AI AGENT MISSION

Build and maintain the MUSCLEWORKS SUPPLEMENTS website as a **fast, mobile-first, SEO-focused, secure product discovery and order-generation platform**.

Every implementation decision must serve these business goals:

1. Increase online reach and Google visibility.
2. Help customers discover products quickly.
3. Make product information, pricing, availability, and authenticity clear.
4. Turn product discovery into WhatsApp orders, phone calls, or inquiries.
5. Build trust in MUSCLEWORKS as a premium supplement retailer.
6. Support nationwide Nepal delivery.
7. Keep the platform simple and maintainable.
8. Avoid unnecessary e-commerce complexity in V1.

**Do not drift into building a traditional full e-commerce platform unless the project scope is explicitly changed.**

---

## 2. BUSINESS IDENTITY

### Business

**MUSCLEWORKS SUPPLEMENTS**

MUSCLEWORKS is a retail supplement and sports nutrition store based in Golfutar, Budha-Nilkantha, Nepal.

The business sells branded, high-quality supplements across broad categories, with an emphasis on popular international and local brands, multiple product weight/size options, product authenticity, quality, and competitive pricing.

Products may be:

- Imported.
- Distributed.
- Locally sourced.

The store may provide customers with a small token of appreciation, such as bottles, with purchases. This is a customer-experience differentiator, not the primary value proposition.

### Positioning

The intended brand positioning is:

**Trusted + Premium**

The website must communicate:

- Authenticity.
- Product quality.
- Professionalism.
- Trust.
- Premium sports nutrition.
- Reliable customer service.

---

## 3. BUSINESS LOCATION & HOURS

**Address:**  
Golfutar, Budha-Nilkantha, Nepal 44500

**Store hours:**  
Sunday–Friday: 10:00 AM – 9:00 PM

**Saturday hours:** Not yet specified.

Do not invent Saturday hours.

---

## 4. TARGET CUSTOMERS

Primary customer groups:

1. Gym members.
2. Bodybuilders.
3. General health-conscious customers.
4. Beginners.

### Geographic priority

**Primary:** Kathmandu Valley

**Secondary:** Nationwide Nepal

### Customer concerns

The website must answer the questions customers care about most:

- How much does the product cost?
- Is the product high quality?
- Is the product authentic?
- What brand is it?
- What size/weight is available?
- What flavors are available?
- Is it currently available?
- Can it be delivered?

---

## 5. PRIMARY BUSINESS OBJECTIVES

### 5.1 Generate online orders

Core conversion journey:

**Google → Product → Product Information → WhatsApp → Order Confirmation → Delivery**

### 5.2 Generate inquiries

Customers must be able to:

- WhatsApp the store.
- Call the store.
- Submit an inquiry.

### 5.3 Build credibility

Trust should be supported by:

- Authenticity information.
- Product information.
- Professional design.
- Store information.
- Physical location.
- Customer-facing policies.
- Helpful educational content.
- Clear pricing and delivery information.

### 5.4 Improve Google visibility

Priority geographic targets:

- Golfutar.
- Budhanilkantha.
- Kathmandu.
- Lalitpur.
- Bhaktapur.
- Nepal.

### 5.5 Display the product catalog

Customers should be able to understand what MUSCLEWORKS sells without needing to call merely to discover basic product information.

---

## 6. V1 PRODUCT MODEL

Expected initial catalog:

- Approximately **20–50 products**.
- Approximately **10–20 major brands**.

The final category taxonomy must be based on actual inventory. Do not invent product categories simply for SEO.

Potential categories identified during discovery include:

- Protein.
- Creatine.
- Pre-workout.
- Vitamins.
- Minerals.
- Health supplements.
- Weight gainers.
- Amino acids.
- Other sports nutrition products.

### Product data fields

Support:

| Field | Requirement |
|---|---|
| Product name | Required |
| Brand | Required |
| Category | Required |
| Regular price | Required |
| Discount price | If applicable |
| Weight/size | Required |
| Flavor | If applicable |
| Description | Required |
| Ingredients | Required |
| Nutrition facts | Required |
| Directions | Required |
| Product images | Required |
| Authenticity information | Required |
| Stock status | Required |
| SKU | Required |

### Product variants

The data model should support:

- Multiple weights.
- Multiple flavors.
- Multiple sizes.
- Different prices per variant where applicable.

---

## 7. PRODUCT PAGE STANDARD

Every product page should provide enough information for an informed customer inquiry without requiring a phone call for basic facts.

Recommended structure:

1. Product image gallery.
2. Brand.
3. Product name.
4. Category.
5. Price.
6. Discount price where applicable.
7. Weight/size.
8. Flavor.
9. Stock status.
10. Product description.
11. Ingredients.
12. Nutrition facts.
13. Directions.
14. Authenticity information.
15. Delivery information.
16. WhatsApp order CTA.
17. Call CTA.
18. Inquiry CTA.
19. Related products.
20. Relevant FAQ.

### Trust rule

Product authenticity and quality are major customer concerns.

Do not hide trust information deep in the page.

Do not fabricate:

- Certifications.
- Reviews.
- Testimonials.
- Distributor claims.
- Authenticity claims.
- Awards.
- Guarantees.

Only publish claims supplied and approved by the business.

---

## 8. ORDERING MODEL — V1

### No traditional e-commerce checkout

V1 does **not** require:

- Shopping cart.
- Customer accounts.
- Online checkout.
- Online payment processing.
- Automated order management.
- Customer order dashboard.
- Automated delivery management.

### Primary WhatsApp flow

**Customer discovers product**

→ **Product page**

→ **Order on WhatsApp**

→ **WhatsApp opens with product-specific pre-written message**

→ **Customer sends message**

→ **MUSCLEWORKS confirms manually**

→ **Delivery arranged**

The WhatsApp message should identify the product and relevant variant/weight when applicable.

---

## 9. CONTACT & INQUIRY SYSTEM

### Required customer channels

- WhatsApp — primary conversion channel.
- Phone.
- Website inquiry form.
- Email.
- Telegram notifications for admin.

### Inquiry flow

**Website form**

→ Validation

→ Server-side processing

→ Resend

→ Customer confirmation email

→ Admin notification email

→ Telegram admin notification

Never expose private API keys or service credentials in browser/client code.

### Possible inquiry fields

- Name.
- Phone number.
- Email.
- Product.
- Message.
- Preferred contact method.

Final fields should remain conversion-focused and privacy-conscious.

---

## 10. DELIVERY

MUSCLEWORKS delivers **nationwide Nepal**.

Delivery charges apply.

Exact delivery pricing rules have not yet been finalized.

Delivery time depends on destination.

Do not promise a universal delivery timeframe.

Failed deliveries are handled manually by the admin in V1.

No automated failed-delivery workflow is required.

---

## 11. WEBSITE SCOPE

### Core pages

1. Home.
2. About.
3. Products.
4. Categories.
5. Brands.
6. Product Detail.
7. Contact.
8. Store Location.
9. FAQ.

### SEO/content architecture

The platform should also support:

- Buying guides.
- Supplement education.
- Brand pages.
- Product comparisons.
- FAQs.
- Fitness/nutrition articles.

The exact URL structure must be established during technical SEO architecture.

---

## 12. HOMEPAGE REQUIREMENTS

The homepage should communicate quickly:

- MUSCLEWORKS SUPPLEMENTS.
- Premium/trusted positioning.
- Product categories.
- Popular products.
- Popular brands.
- Primary ordering/contact actions.
- Store location.
- Nationwide delivery.
- Authenticity/trust messaging.
- Educational content.
- FAQ.
- Contact options.

Primary CTA:

**Browse Products / Order via WhatsApp**

Secondary CTAs:

- Call Now.
- Contact Us.
- Visit Store.

---

## 13. PRODUCT DISCOVERY

The product catalog should support:

- Search.
- Category filtering.
- Brand filtering.
- Product cards.
- Price visibility.
- Stock/availability indication where appropriate.
- Product detail navigation.

Mobile product discovery is a priority.

---

## 14. CATEGORY PAGES

Each category should support:

- Category title.
- Category description.
- Relevant products.
- SEO-friendly content.
- FAQs where appropriate.
- Related categories.

Only index category pages that represent genuine search intent and useful content.

---

## 15. BRAND PAGES

Important brands should have dedicated pages.

Possible content:

- Brand name.
- Brand overview.
- Brand/product positioning.
- Available products.
- Relevant FAQs.
- Related categories.

Brand pages are both a UX feature and an SEO opportunity.

---

## 16. ABOUT / CONTACT / LOCATION

### About

Communicate:

- Who MUSCLEWORKS is.
- Store history.
- Product philosophy.
- Quality focus.
- Brand philosophy.
- Customer service.
- Physical location.
- Trust/authenticity positioning.

### Contact

Include:

- Phone.
- WhatsApp.
- Inquiry form.
- Store address.
- Store hours.
- Location/map.
- Social links.

### Physical location

Golfutar, Budha-Nilkantha, Nepal 44500.

Make the physical location easy to discover through:

- Contact page.
- Dedicated location information.
- Footer.
- Maps/location integration where appropriate.
- Local SEO implementation.

---

## 17. FAQ

FAQ content must answer genuine customer questions.

Initial topics:

- Product authenticity.
- Product quality.
- Pricing.
- Delivery.
- Delivery charges.
- Available brands.
- Product availability.
- WhatsApp ordering.
- Store location.
- Store hours.
- General product-usage questions.

Avoid generic filler FAQs.

---

## 18. SOCIAL MEDIA

Existing social presence:

- Instagram.
- TikTok.

Integrate social links appropriately.

Do not add unnecessary third-party embeds or scripts that hurt performance.

---

## 19. SEO IS A CORE REQUIREMENT

SEO is not an afterthought.

The site should support:

- Crawlable HTML.
- Clean URLs.
- Correct metadata.
- Canonical URLs.
- XML sitemap.
- Robots directives.
- Structured data where appropriate.
- Open Graph metadata.
- Social metadata.
- Optimized images.
- Semantic HTML.
- Internal linking.
- Breadcrumbs where useful.
- Correct heading hierarchy.
- Strong Core Web Vitals.
- Mobile-first rendering.
- Indexable product/category/brand pages.
- Search-engine-friendly pagination/filter architecture.
- 404 handling.
- Redirect strategy.

### Initial search intents

These are starting points for research, not guaranteed keywords:

- Supplement store Nepal.
- Protein powder Nepal.
- Whey protein Kathmandu.
- Creatine Nepal.
- Sports nutrition Nepal.
- Supplement shop Kathmandu.

Actual keyword strategy must be validated during SEO research.

### Content strategy

Support:

- Buying guides.
- Supplement education.
- Brand pages.
- Product comparisons.
- FAQs.
- Fitness/nutrition articles.

Content must be useful and accurate, not keyword filler.

---

## 20. PERFORMANCE REQUIREMENTS

Performance is a first-class requirement.

Prioritize:

- Fast initial load.
- Minimal JavaScript.
- Optimized images.
- Responsive images.
- Efficient fonts.
- Caching.
- CDN delivery.
- Server-side/static rendering where appropriate.
- Minimal third-party scripts.
- Lazy loading where appropriate.

Test on realistic mobile conditions, not only high-end desktop hardware.

---

## 21. MOBILE-FIRST REQUIREMENT

Critical mobile journeys:

**Google → Product → Price → WhatsApp**

**Google → Product → Call**

**Google → Product → Inquiry**

Mobile UX must prioritize:

- Readability.
- Product images.
- Price visibility.
- CTA accessibility.
- Fast navigation.
- Simple forms.
- Minimal friction.

---

## 22. SECURITY REQUIREMENTS

Security must be designed in from the beginning.

Required considerations include:

- Secure authentication for any future administrative functionality.
- Server-side validation.
- Input sanitization.
- Rate limiting.
- Spam protection.
- Secure API handling.
- Secure secrets management.
- HTTPS.
- Secure headers.
- Dependency security.
- Safe error handling without sensitive information leakage.
- Injection protection.
- XSS protection.
- CSRF protection where applicable.
- Access control.
- Secure third-party integration.
- Appropriate logging/monitoring.
- Backup/recovery strategy.
- Secure deployment pipeline.

Security implementation should align with the **current OWASP application-security guidance applicable at launch**.

---

## 23. CONTENT MANAGEMENT / DATA MANAGEMENT

The client does not require a public-facing admin system.

However, the agency will maintain product information after launch.

Therefore, the project still requires a clean content/data management mechanism.

The preferred principle is:

**Use the simplest maintainable content architecture that supports agency-managed updates.**

It must allow maintenance of:

- Products.
- Prices.
- Stock status.
- Brands.
- Categories.
- Product information.
- SEO metadata.
- Articles/content.

Do not build a custom admin dashboard unless a real requirement emerges.

---

## 24. INFRASTRUCTURE & SERVICES

### Domain

Client will obtain the domain.

Exact domain is not yet provided.

### Hosting

Target:

**Vercel**

### Expected third-party services

- Resend — transactional/inquiry email.
- Telegram Bot — admin notifications.
- WhatsApp — customer ordering.
- Phone — customer contact.
- Instagram/TikTok — social presence.
- Maps/location service as appropriate.

Do not hard-code credentials.

---

## 25. LEGAL / POLICY CONTENT

Client has confirmed required business/legal materials are available.

Before launch, collect and use the actual approved materials.

Potential documents:

- Privacy Policy.
- Terms & Conditions.
- Refund/Return Policy.
- Delivery/Shipping Policy.
- Product disclaimer.
- Business/contact information.

**Never invent legal claims or policies.**

---

## 26. ANALYTICS & CONVERSION TRACKING

The platform should measure:

- Organic traffic.
- Product page visits.
- WhatsApp CTA clicks.
- Phone CTA clicks.
- Inquiry submissions.
- Popular products.
- Popular categories.
- Geographic traffic.
- Search performance.

### Conversion priority

Primary:

**WhatsApp order click**

Secondary:

- Phone click.
- Inquiry submission.
- Email inquiry.
- Product engagement.
- Store-location interaction.

Analytics/search tooling must be established during technical setup.

---

## 27. V1 OUT OF SCOPE — HARD SCOPE BOUNDARY

This section is a **hard boundary for all AI coding agents**.

Agents must **NOT build, add, scaffold, prototype, or partially implement** features listed here unless a human project owner explicitly changes the approved V1 scope.

Do not interpret "it would be useful", "it is standard for e-commerce", "it improves the UX", "it may be needed later", or "it feels good to add" as permission.

### Explicitly out of scope for V1

- Shopping cart.
- Online checkout.
- Online payment gateway.
- Customer accounts.
- Customer login/signup.
- Customer profiles.
- Customer order history.
- Customer order dashboard.
- Automated order management.
- Automated order status tracking.
- Automated delivery management.
- Automated failed-delivery workflows.
- Complex inventory management.
- Client-facing admin dashboard.
- Custom CMS/admin panel unless separately approved.
- Coupons and discount-code systems.
- Loyalty points/rewards systems.
- Wishlist functionality.
- Product personalization.
- Personalized product recommendations.
- Automated abandoned-cart recovery.
- Automated marketing automation.
- Subscription products/orders.
- Product reviews/ratings unless explicitly approved.
- User-generated content systems.
- Live chat systems unless explicitly approved.
- Marketplace functionality.
- Multi-vendor functionality.
- Multi-store management.
- Affiliate systems.
- Customer referral systems.
- Advanced CRM functionality.
- Automated invoicing.
- Automated tax/accounting systems.
- Automated shipping-label generation.
- Delivery tracking integrations.
- Warehouse management.
- Supplier management.
- Purchase-order management.
- Complex stock synchronization with external systems.
- Native mobile applications.
- Desktop applications.
- Cryptocurrency/Web3 functionality.
- AI chatbot/customer-support agents.
- AI-generated product claims or medical advice.
- Medical diagnosis or treatment functionality.
- Social-media feed embeds that materially hurt performance.
- Unnecessary third-party widgets, scripts, SDKs, or integrations.
- Features created solely because they are common on competitor websites.
- Features created solely for speculative future requirements.
- Any functionality requiring business rules that have not been approved.
- Any legal, compliance, pricing, delivery, authenticity, warranty, refund, or product claims that have not been supplied or approved.

### Critical anti-scope-creep rule

**Agents must not "improve" the product by inventing additional features.**

If an agent identifies a potentially useful feature outside the approved scope:

1. Do not implement it.
2. Do not create placeholder infrastructure for it unless required by an approved V1 dependency.
3. Record it as a future recommendation.
4. Continue with the approved task.

The correct behavior is:

> **Implement the requirement, not the agent's imagination.**

### What agents MAY do

Agents may make normal implementation decisions that are necessary to satisfy an approved requirement, including:

- Choosing an appropriate internal component structure.
- Refactoring code when necessary for the assigned task.
- Adding tests required for the assigned functionality.
- Adding security controls required by the approved architecture.
- Adding accessibility improvements that do not alter scope.
- Making performance optimizations that preserve functionality.
- Improving maintainability within the assigned feature.
- Adding internal abstractions where they reduce duplication or technical debt.

These are implementation-quality decisions, **not permission to introduce new product features**.

### Scope-change rule

If an implementation appears to require an out-of-scope feature, stop and flag the dependency for human review.

Do not silently expand V1.

Possible future V2 capabilities may include some of the above, but they are not V1 requirements.
## 28. FUTURE V2 COMPATIBILITY

The architecture should not unnecessarily block future expansion into:

- Full e-commerce checkout.
- Online payments.
- Customer accounts.
- Order history.
- Automated order management.
- Inventory management.
- Coupons.
- Loyalty.
- Wishlist.
- Automated delivery tracking.
- Customer reviews.
- Advanced analytics.
- Personalized recommendations.

**Do not build V2 functionality prematurely.**

---

## 29. ANTIGRAVITY AGENT DEVELOPMENT RULES

All development is executed through Antigravity IDE coding agents.

Agents must work in **small, explicit, bounded tasks**.

Do not issue a single broad instruction such as:

> Build the entire MUSCLEWORKS website.

Instead, split work into discrete packages such as:

1. Project foundation and environment.
2. Global layout/navigation/footer.
3. Design system and responsive UI primitives.
4. Product data architecture.
5. Product catalog.
6. Product detail pages.
7. Category pages.
8. Brand pages.
9. WhatsApp ordering.
10. Contact/inquiry system.
11. Resend integration.
12. Telegram notifications.
13. SEO infrastructure.
14. Structured data.
15. Performance optimization.
16. Security hardening.
17. Analytics/conversion tracking.
18. QA/accessibility/mobile testing.
19. SEO validation.
20. Production deployment.

Each agent task should explicitly define:

- Objective.
- Scope.
- Allowed files/components to change.
- Dependencies.
- Acceptance criteria.
- Security considerations.
- SEO considerations.
- Testing requirements.
- Explicit non-goals.

Agents must preserve existing project decisions and must not silently expand scope.

---

## 30. AGENT SCOPE GUARDRAILS

Before implementing any feature, an agent should ask:

### Business

- Does this help product discovery?
- Does this improve trust?
- Does this improve SEO?
- Does this increase WhatsApp/call/inquiry conversion?
- Does this support the actual MUSCLEWORKS business?

### Scope

- Is this explicitly required for V1?
- Is this necessary to support an existing V1 requirement?
- Is this a future-V2 feature being introduced prematurely?

### Technical

- Does this increase complexity unnecessarily?
- Does this hurt performance?
- Does this create a security risk?
- Does this introduce unnecessary third-party dependencies?
- Does this make future maintenance harder?

### Content

- Is the information actually supplied or approved?
- Are we inventing business claims?
- Are we inventing product data?
- Are we creating generic SEO filler?

If a feature does not clearly support the project, do not add it silently.

---

## 31. SOURCE-OF-TRUTH RULE

This document is intended to provide stable project context to AI coding agents.

When requirements conflict:

1. Follow the latest explicitly approved project decision.
2. Do not silently reinterpret business requirements.
3. Do not invent missing facts.
4. Flag contradictions for human review.
5. Preserve V1 scope unless explicitly changed.
6. Keep implementation decisions traceable to an approved requirement.

This document summarizes the current project specification. It is not permission to invent unresolved business, legal, content, or technical decisions.

---

## 32. OUTSTANDING INFORMATION

The following information is still required before the relevant implementation decisions can be finalized.

### Business

- Official Saturday store status/hours.
- Official phone number.
- Official WhatsApp number.
- Official business email.
- Final delivery fee/rules.
- Final product categories.
- Initial 20–50 products.
- Initial 10–20 brands.

### Brand

- Official logo/master assets.
- Official fonts/colors.
- Existing brand guidelines.
- Available product/store photography.

### Trust

- Exact authenticity claims MUSCLEWORKS can accurately make.
- Certificates/distributor relationships/invoices or other legitimate public trust materials, if any.

### Technical

- Domain.
- Business email/domain.
- Domain/Vercel account ownership.
- Resend account ownership.
- Telegram bot ownership.
- Analytics/search account setup.

### Content

- Final product descriptions.
- Nutrition/ingredient information.
- Content approval owner.
- Legal/policy documents.

**Agents must not fill these gaps with assumptions.**

---

## 33. DEFINITION OF DONE — BUSINESS FLOW

A V1 implementation succeeds when a new customer can:

**Discover**

Find MUSCLEWORKS through Google.

↓

**Browse**

Reach the relevant product/category page.

↓

**Understand**

See brand, product, price, size, flavor, description, ingredients, nutrition, authenticity, and availability information where applicable.

↓

**Trust**

Understand why MUSCLEWORKS is a credible retailer.

↓

**Convert**

Click:

- Order on WhatsApp
- Call
- Send Inquiry

↓

**Fulfill**

MUSCLEWORKS manually confirms the order and arranges nationwide delivery.

---

## 34. CTO DIRECTION

The correct V1 strategy is:

> **SEO-first product catalog + trust-building website + WhatsApp conversion system**

Not:

> **Full e-commerce platform + checkout + accounts + payments + inventory + delivery infrastructure**

The biggest risks are:

1. Overengineering the website.
2. Hiding or weakening product pricing/authenticity information.
3. Building a catalog without strong conversion paths.
4. Creating generic SEO content instead of genuinely useful pages.
5. Failing to establish a clean product-data workflow.
6. Allowing AI coding agents to expand scope without approval.

The website should be **fast, secure, mobile-first, SEO-friendly, maintainable, and conversion-focused**.

---

## 35. CURRENT PROJECT STATUS

**Discovery:** Substantially complete.

**Current phase:** Requirements validation → Information architecture → UX strategy → Technical architecture.

Before full development begins, freeze:

1. Sitemap.
2. Product data model.
3. Category taxonomy.
4. Brand taxonomy.
5. Conversion flows.
6. Content requirements.
7. SEO architecture.
8. Third-party integrations.
9. Technical stack.
10. V1 scope.