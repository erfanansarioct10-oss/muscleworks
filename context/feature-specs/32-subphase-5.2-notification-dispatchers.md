# Feature Spec 32: Sub-Phase 5.2 — Multi-Channel Notification Dispatchers

> **Spec ID:** `32-subphase-5.2-notification-dispatchers`  
> **Target Sub-Phase / Branch:** Sub-Phase 5.2 (`Phase 5 — Lead Forms, Server Actions & Notifications Pipeline`)  
> **Status:** Approved  
> **Created Date:** 2026-08-10  
> **Author:** Antigravity AI Agent

---

## Executive Summary

Sub-Phase 5.2 establishes the multi-channel notification dispatcher layer for MUSCLEWORKS SUPPLEMENTS. It provides direct Telegram Bot API push alert notifications for store managers and responsive React Email templates for customer inquiry confirmations and admin email alerts. This infrastructure ensures store managers at Golfutar Kathmandu receive real-time lead alerts on mobile while customers receive professional email receipts with physical store address details, authenticity guarantees, and direct WhatsApp CTAs.

---

## 1. What We Are Going to Do

Itemized list of target files:

| # | Target File | Action Required | Responsibility Summary |
|:---:|---|:---:|---|
| 1 | `src/lib/services/telegram.ts` | **[NEW]** | Direct HTTP Telegram Bot API alert dispatcher (`sendTelegramAlert`) with MarkdownV2 escaping and dev console fallback. |
| 2 | `src/emails/CustomerInquiryConfirmation.tsx` | **[NEW]** | Branded customer inquiry receipt email template built with `@react-email/components` (Jet Black luxury theme, order summary, Golfutar store footer). |
| 3 | `src/emails/AdminInquiryAlert.tsx` | **[NEW]** | Store manager push alert email template with customer phone, delivery city, product context, and quick action links. |
| 4 | `src/lib/services/resend.ts` | **[NEW]** | Multi-channel email dispatcher leveraging Resend SDK to send customer and admin emails concurrently via `Promise.allSettled`. |
| 5 | `src/scripts/validate-notification-services.ts` | **[NEW]** | Executable validation script testing MarkdownV2 escaping, Telegram formatting, React Email HTML rendering, and Resend dev fallbacks. |
| 6 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 32 in the Specification Registry Index. |
| 7 | `context/progress-tracker.md` | **[MODIFY]** | Update Phase 5 progress status and active sub-phase notes. |

---

## 2. Why We Are Going to Do It

1. **Instant Store Admin Alerts:** In Nepal, store managers operate primarily on mobile devices. Telegram Bot push notifications deliver instant customer inquiry details (Name, Phone, Delivery City, Product, Price) directly to store staff within seconds of form submission.
2. **Customer Trust & Engagement:** Customers submitting a web inquiry or pre-order receive an immediate, high-lux email receipt confirming their request, assuring 100% genuine importer authenticity, and providing direct phone/WhatsApp numbers for physical store follow-up at Golfutar Kathmandu.
3. **Robust Escaping & Security:** Telegram MarkdownV2 requires explicit escaping of 18 reserved characters (`_`, `*`, `[`, `]`, `(`, `)`, `~`, `` ` ``, `>`, `#`, `+`, `-`, `=`, `|`, `{`, `}`, `.`, `!`). A dedicated escaping utility prevents Telegram API `400 Bad Request` payload parse crashes.
4. **Developer Experience & Resiliency:** When secrets (`TELEGRAM_BOT_TOKEN`, `RESEND_API_KEY`) are missing during local development, services log formatted previews to the console without throwing errors or breaking local developer workflows.

---

## 3. How We Are Going to Implement It

### Step 1: Telegram Bot Dispatcher (`src/lib/services/telegram.ts`)

```typescript
export interface TelegramInquiryAlertPayload {
  inquiryId: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  inquiryType: string;
  message: string;
  preferredContactMethod?: string;
  deliveryCity?: string;
  productContext?: {
    productName: string;
    variantLabel?: string;
    priceNpr?: number;
  };
  submittedAt?: string;
}

export function escapeMarkdownV2(text: string): string {
  if (!text) return '';
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
}

export async function sendTelegramAlert(
  payload: TelegramInquiryAlertPayload
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const markdownMsg = buildTelegramMarkdownMessage(payload);

  if (!botToken || !chatId) {
    if (process.env.NODE_ENV === 'development') {
      console.log('\n--- [TELEGRAM DEV LOG] ---');
      console.log(markdownMsg);
      console.log('---------------------------\n');
      return { success: true, messageId: 9999 };
    }
    console.error('[Telegram Service Error] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID.');
    return { success: false, error: 'Telegram credentials missing' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: markdownMsg,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.error('[Telegram API Error]:', data);
      return { success: false, error: data.description || 'Telegram API call failed' };
    }

    return { success: true, messageId: data.result?.message_id };
  } catch (err) {
    console.error('[Telegram Service Exception]:', err);
    return { success: false, error: 'Telegram request failed' };
  }
}
```

### Step 2: React Email Templates (`src/emails/`)

Built using `@react-email/components` (`Html`, `Head`, `Body`, `Container`, `Section`, `Text`, `Heading`, `Hr`, `Link`, `Img`, `Button`, `Preview`).

- **Theme:** Jet Black background (`#0B0B0B`), Metallic Gold typography accents (`#D4AF37`), pure white text, charcoal table card borders (`#2C2C2C`), Emerald WhatsApp button (`#059669`).
- **Footer:** Physical address: *Golfutar, Budha-Nilkantha, Kathmandu (44500), Nepal*. Hotline: *+977 9801234567*.

### Step 3: Resend Email Service (`src/lib/services/resend.ts`)

```typescript
import { Resend } from 'resend';
import { render } from '@react-email/components';
import CustomerInquiryConfirmation from '@/emails/CustomerInquiryConfirmation';
import AdminInquiryAlert from '@/emails/AdminInquiryAlert';

export async function sendInquiryEmails(payload: InquiryFormClientValues & { inquiryId: string }): Promise<{
  customerEmailSuccess: boolean;
  adminEmailSuccess: boolean;
}> { ... }
```

---

## 4. When We Are Going to Do It

```text
Step 1: Create src/lib/services/telegram.ts
    │
    ▼
Step 2: Create src/emails/CustomerInquiryConfirmation.tsx
    │
    ▼
Step 3: Create src/emails/AdminInquiryAlert.tsx
    │
    ▼
Step 4: Create src/lib/services/resend.ts
    │
    ▼
Step 5: Create src/scripts/validate-notification-services.ts & run test suite
    │
    ▼
Step 6: Register Spec 32 in README.md & update progress-tracker.md
    │
    ▼
Step 7: Type-check with `npx tsc --noEmit`
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Telegram Bot Token | `process.env.TELEGRAM_BOT_TOKEN` | Direct Telegram Bot HTTP API |
| Telegram Chat ID | `process.env.TELEGRAM_CHAT_ID` | Admin alert destination channel/group |
| Resend API Key | `process.env.RESEND_API_KEY` | Transactional email dispatch |
| Store Sender Email | `process.env.RESEND_FROM_EMAIL` | Sender address header |
| Store Admin Email | `process.env.STORE_ADMIN_EMAIL` | Admin recipient email |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Telegram 400 Bad Request** | Unescaped special character in MarkdownV2. | Use `escapeMarkdownV2()` on all dynamic customer inputs. |
| **Missing API Keys in Dev** | Local environment lacks Resend/Telegram keys. | Log formatted console previews in `NODE_ENV === 'development'`. |
| **Email Delivery Failures** | Invalid customer email or spam filter reject. | Use `Promise.allSettled` so email failure doesn't block Telegram dispatch. |

---

## 7. Verification & Definition of Done

1. Validation script `src/scripts/validate-notification-services.ts` passes 100%.
2. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
3. Spec 32 registered in `context/feature-specs/README.md`.
4. `context/progress-tracker.md` updated with Sub-Phase 5.2 completed.
