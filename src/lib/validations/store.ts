import { z } from 'zod';

/**
 * Days of the Week Enum
 */
export const DayOfWeekEnum = z.enum([
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]);

export type DayOfWeek = z.infer<typeof DayOfWeekEnum>;

/**
 * Opening Hours Item Schema
 */
export const OpeningHourItemSchema = z.object({
  day: DayOfWeekEnum,
  label: z.string(),
  opens: z.string(),
  closes: z.string(),
  isClosed: z.boolean().default(false),
  note: z.string().optional(),
});

export type OpeningHourItem = z.infer<typeof OpeningHourItemSchema>;

/**
 * Geographic Location Coordinates Schema
 */
export const GeoCoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  googleMapsPlaceUrl: z.string().url(),
  googleMapsEmbedUrl: z.string().url(),
});

export type GeoCoordinates = z.infer<typeof GeoCoordinatesSchema>;

/**
 * Delivery Zone Policy Schema
 */
export const DeliveryZonePolicySchema = z.object({
  coverage: z.literal('Nationwide Nepal'),
  primaryZones: z.array(z.string()),
  deliveryFeeNotes: z.string(),
  freeDeliveryThresholdNpr: z.number().int().positive().optional(),
});

export type DeliveryZonePolicy = z.infer<typeof DeliveryZonePolicySchema>;

/**
 * Store Contact Matrix Schema
 */
export const StoreContactMatrixSchema = z.object({
  primaryPhone: z.string(),
  secondaryPhone: z.string().optional(),
  whatsappNumber: z.string(),
  whatsappDisplay: z.string(),
  storeEmail: z.string().email(),
  supportEmail: z.string().email().optional(),
});

export type StoreContactMatrix = z.infer<typeof StoreContactMatrixSchema>;

/**
 * Physical Retail Outlet Schema (Golfutar, Budha-Nilkantha, Kathmandu)
 */
export const StoreInfoSchema = z.object({
  name: z.literal('MUSCLEWORKS SUPPLEMENTS'),
  legalName: z.string().default('MUSCLEWORKS SUPPLEMENTS'),
  tagline: z.string(),
  establishedYear: z.literal(2026),
  address: z.object({
    streetAddress: z.string(),
    area: z.string(),
    municipality: z.string(),
    city: z.string(),
    district: z.string(),
    province: z.string(),
    postalCode: z.literal('44500'),
    country: z.literal('Nepal'),
    landmark: z.string().optional(),
  }),
  coordinates: GeoCoordinatesSchema,
  openingHours: z.array(OpeningHourItemSchema),
  contacts: StoreContactMatrixSchema,
  deliveryPolicy: DeliveryZonePolicySchema,
  socialLinks: z.object({
    instagram: z.string().url().optional(),
    tiktok: z.string().url().optional(),
    facebook: z.string().url().optional(),
  }),
});

export type StoreInfo = z.infer<typeof StoreInfoSchema>;
