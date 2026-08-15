import rawStoreData from '@/data/store-info.json';
import {
  DeliveryZonePolicy,
  OpeningHourItem,
  StoreInfo,
  StoreInfoSchema,
} from '@/lib/validations/store';

// Runtime validation on module load
const parsedStoreInfo: StoreInfo = StoreInfoSchema.parse(rawStoreData);

/**
 * Returns the full physical retail store metadata object for Golfutar, Budha-Nilkantha, Kathmandu.
 */
export async function getStoreInfo(): Promise<StoreInfo> {
  return parsedStoreInfo;
}

/**
 * Returns opening hours list for all days of the week.
 */
export async function getOpeningHours(): Promise<OpeningHourItem[]> {
  return parsedStoreInfo.openingHours;
}

/**
 * Returns nationwide delivery policy and Kathmandu same-day delivery terms.
 */
export async function getDeliveryPolicy(): Promise<DeliveryZonePolicy> {
  return parsedStoreInfo.deliveryPolicy;
}

/**
 * Returns the opening hours entry for today based on Nepal timezone (Asia/Kathmandu).
 */
export async function getTodayOpeningHours(): Promise<OpeningHourItem | null> {
  try {
    const kathmanduDay = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      weekday: 'long',
    })
      .format(new Date())
      .toLowerCase();

    const todayHours = parsedStoreInfo.openingHours.find(
      (h) => h.day === kathmanduDay
    );

    return todayHours || null;
  } catch {
    return null;
  }
}

/**
 * Parses a time string ("10:00 AM", "09:00 PM", "10:00", "21:00") into minutes past midnight.
 * Returns null if the string represents a contact-required sentinel ("Contact Store").
 */
function parseTimeToMinutes(timeStr: string): number | null {
  const trimmed = timeStr.trim().toUpperCase();
  if (trimmed === 'CONTACT STORE' || !trimmed) return null;

  // 12-hour format e.g. "10:00 AM" or "09:00 PM"
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const period = match12[3];
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // 24-hour format e.g. "10:00" or "21:00"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }

  return null;
}

/**
 * Evaluates whether the Golfutar store is currently open based on Asia/Kathmandu time.
 */
export async function isStoreOpenNow(): Promise<{
  isOpen: boolean;
  message: string;
}> {
  try {
    const now = new Date();

    const kathmanduDay = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      weekday: 'long',
    })
      .format(now)
      .toLowerCase();

    const todayHours = parsedStoreInfo.openingHours.find(
      (h) => h.day === kathmanduDay
    );

    if (!todayHours || todayHours.isClosed) {
      return {
        isOpen: false,
        message: 'Closed today. Please contact us via WhatsApp for inquiries.',
      };
    }

    const openMinutes = parseTimeToMinutes(todayHours.opens);
    const closeMinutes = parseTimeToMinutes(todayHours.closes);

    if (openMinutes === null || closeMinutes === null) {
      return {
        isOpen: false,
        message:
          todayHours.note ||
          'Saturday hours vary. Please contact store before visiting Golfutar flagship.',
      };
    }

    // Get current Kathmandu hour & minute as total minutes past midnight
    const kathmanduTimeParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(now);

    const hourStr = kathmanduTimeParts.find((p) => p.type === 'hour')?.value || '0';
    const minStr = kathmanduTimeParts.find((p) => p.type === 'minute')?.value || '0';
    const parsedHour = parseInt(hourStr, 10);
    const normalizedHour = parsedHour === 24 ? 0 : parsedHour;
    const currentMinutes = normalizedHour * 60 + parseInt(minStr, 10);

    const isOpen =
      openMinutes <= closeMinutes
        ? currentMinutes >= openMinutes && currentMinutes < closeMinutes
        : currentMinutes >= openMinutes || currentMinutes < closeMinutes;

    if (isOpen) {
      return {
        isOpen: true,
        message: `Open Now (${todayHours.opens} – ${todayHours.closes})`,
      };
    }

    return {
      isOpen: false,
      message: `Currently Closed. Opens at ${todayHours.opens}.`,
    };
  } catch {
    return {
      isOpen: false,
      message: 'Store status unavailable',
    };
  }
}

