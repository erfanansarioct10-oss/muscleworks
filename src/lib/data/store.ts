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

    if (kathmanduDay === 'saturday' || todayHours.opens === 'Contact Store') {
      return {
        isOpen: false,
        message:
          'Saturday hours vary. Please contact store before visiting Golfutar flagship.',
      };
    }

    // Get current Kathmandu hour (0-23)
    const kathmanduHourStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      hour: 'numeric',
      hour12: false,
    }).format(now);

    const kathmanduHour = parseInt(kathmanduHourStr, 10);

    // Standard business hours: 10 AM (10) to 9 PM (21)
    if (kathmanduHour >= 10 && kathmanduHour < 21) {
      return {
        isOpen: true,
        message: 'Open Now (10:00 AM – 9:00 PM)',
      };
    }

    return {
      isOpen: false,
      message: 'Currently Closed. Opens at 10:00 AM.',
    };
  } catch {
    return {
      isOpen: false,
      message: 'Store status unavailable',
    };
  }
}
