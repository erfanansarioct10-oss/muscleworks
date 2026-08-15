import { formatNprPrice } from '../utils';

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
    productId?: string;
    productName: string;
    productSlug?: string;
    variantSku?: string;
    variantLabel?: string;
    priceNpr?: number;
  };
  submittedAt?: string;
}

/**
 * Escapes reserved Telegram MarkdownV2 characters for normal text entities.
 * Reserved: _ * [ ] ( ) ~ ` > # + - = | { } . ! \
 */
export function escapeMarkdownV2(text: string): string {
  if (!text) return '';
  return text.replace(/[-_*[\]()~`>#+=|{}.!\\]/g, '\\$&');
}

/**
 * Escapes reserved Telegram MarkdownV2 characters inside `code` and `pre` entities.
 * According to Telegram Bot API specification, only ` and \ need to be escaped in code blocks.
 */
export function escapeMarkdownV2Code(text: string): string {
  if (!text) return '';
  return text.replace(/[`\\]/g, '\\$&');
}

/**
 * Formats structured MarkdownV2 message payload for Telegram admin notification.
 */
export function buildTelegramMarkdownMessage(payload: TelegramInquiryAlertPayload): string {
  const timestamp = payload.submittedAt || new Date().toISOString();
  
  const header = `*🚨 NEW CUSTOMER INQUIRY — MUSCLEWORKS*`;
  
  const customerDetails = [
    `👤 *Name:* ${escapeMarkdownV2(payload.fullName)}`,
    `📞 *Phone:* \`${escapeMarkdownV2Code(payload.phoneNumber)}\``,
    payload.email ? `📧 *Email:* ${escapeMarkdownV2(payload.email)}` : null,
    `📍 *Delivery City:* ${escapeMarkdownV2(payload.deliveryCity || 'Kathmandu')}`,
    `💬 *Contact Method:* ${escapeMarkdownV2(payload.preferredContactMethod || 'whatsapp')}`,
    `🏷️ *Inquiry Type:* ${escapeMarkdownV2(payload.inquiryType)}`,
  ]
    .filter(Boolean)
    .join('\n');

  let productDetails = '';
  if (payload.productContext) {
    const pc = payload.productContext;
    const lines = [
      `📦 *Product:* ${escapeMarkdownV2(pc.productName)}`,
      pc.variantLabel ? `⚖️ *Variant:* ${escapeMarkdownV2(pc.variantLabel)}` : null,
      pc.variantSku ? `🆔 *SKU:* \`${escapeMarkdownV2Code(pc.variantSku)}\`` : null,
      pc.priceNpr ? `💰 *Price:* ${escapeMarkdownV2(formatNprPrice(pc.priceNpr))}` : null,
    ].filter(Boolean);

    productDetails = `\n*Product Context*\n${lines.join('\n')}`;
  }

  const messageSection = `\n📝 *Customer Message:*\n"${escapeMarkdownV2(payload.message)}"`;
  
  const footer = `\n🆔 *Inquiry ID:* \`${escapeMarkdownV2Code(payload.inquiryId)}\`\n⏰ *Submitted:* ${escapeMarkdownV2(timestamp)}`;

  return `${header}\n\n${customerDetails}${productDetails}\n${messageSection}\n${footer}`;
}

/**
 * Dispatches an instant Telegram Bot push alert to store managers.
 * In local development without credentials, logs payload to console with [Telegram Dev Log].
 */
export async function sendTelegramAlert(
  payload: TelegramInquiryAlertPayload
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const markdownMsg = buildTelegramMarkdownMessage(payload);

  const hasCredentials = Boolean(botToken) && Boolean(chatId);

  if (!hasCredentials) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log('\n--- [TELEGRAM DEV LOG: ADMIN PUSH ALERT] ---');
      console.log(markdownMsg);
      console.log('--------------------------------------------\n');
      return { success: true, messageId: 99999 };
    }

    console.error('[Telegram Service Error] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in production.');
    return { success: false, error: 'Telegram bot credentials missing' };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        chat_id: chatId,
        text: markdownMsg,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      }),
    });

    const data = (await response.json()) as {
      ok: boolean;
      result?: { message_id: number };
      description?: string;
    };

    if (!response.ok || !data.ok) {
      console.error('[Telegram API Error Response]:', data);
      return {
        success: false,
        error: data.description || `Telegram API request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      messageId: data.result?.message_id,
    };
  } catch (err) {
    console.error('[Telegram Dispatch Exception]:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown Telegram dispatch error',
    };
  }
}
