/**
 * MUSCLEWORKS SUPPLEMENTS — CANONICAL APPLICATION CONSTANTS
 * Single Source of Truth for brand metadata, store locations, contact links, and delivery promises.
 */

export const STORE_NAME = "MuscleWorks Supplements";
export const STORE_LEGAL_NAME = "MuscleWorks Supplements Nepal";
export const STORE_TAGLINE =
  "100% Genuine Sports Nutrition & Fitness Supplements in Nepal";
export const STORE_SHORT_TAGLINE = "100% Genuine Sports Nutrition Nepal";
export const STORE_DESCRIPTION =
  "Kathmandu's premier destination for 100% authentic imported whey protein, creatine, mass gainers, and pre-workouts. Direct retail outlet in Golfutar, Budha-Nilkantha.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://muscleworksnepal.com";

export const DEFAULT_PRODUCT_PLACEHOLDER = "/brnding-assets/logo.webp";


// Contact & Ordering Details
export const STORE_PHONE = "+977 986-1725036";
export const STORE_PHONE_RAW = "+9779861725036";
export const STORE_WHATSAPP = "+9779861725036";
export const STORE_EMAIL = "orders@muscleworksnepal.com";
export const STORE_SUPPORT_EMAIL = "support@muscleworksnepal.com";

// Physical Location Metadata (Single Flagship Store)
export const STORE_LOCATION = {
  name: "MuscleWorks Flagship Store",
  street: "Golfutar Main Road",
  area: "Budha-Nilkantha",
  city: "Kathmandu",
  postalCode: "44500",
  country: "Nepal",
  fullAddress: "Golfutar, Budha-Nilkantha, Kathmandu (44500), Nepal",
  landmark: "Near Golfutar Basketball Court / Budha-Nilkantha Highway",
  coordinates: {
    latitude: 27.7525222,
    longitude: 85.3467945,
  },
  googleMapsUrl:
    "https://www.google.com/maps/place/MUSCLEWORKS+SUPPLEMENTS/@27.752597,85.3466912,17z/data=!4m15!1m8!3m7!1s0x39eb19002cf5b31f:0x7685a7207f30b8ef!2sMUSCLEWORKS+SUPPLEMENTS!8m2!3d27.7525222!4d85.3467945!10e5!16s%2Fg%2F11nr8t5p78!3m5!1s0x39eb19002cf5b31f:0x7685a7207f30b8ef!8m2!3d27.7525222!4d85.3467945!16s%2Fg%2F11nr8t5p78?entry=ttu",
  googleMapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.1895697204987!2d85.3442195761358!3d27.75252682390196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19002cf5b31f%3A0x7685a7207f30b8ef!2sMUSCLEWORKS%20SUPPLEMENTS!5e0!3m2!1sen!2snp!4v1723719000000!5m2!1sen!2snp",
} as const;

// Operating Hours
export const STORE_HOURS = {
  weekdays: "Sunday – Friday: 10:00 AM – 8:00 PM",
  saturday: "Saturday: Contact for store hours / delivery",
  displayShort: "Sun – Fri: 10AM – 8PM | Sat: Contact Required",
  openingTime: "10:00",
  closingTime: "20:00",
} as const;

// Delivery Promises & Rules for Nepal
export const DELIVERY_PROMISES = {
  valleyTimeline: "Same-Day / 24-Hour Express Delivery",
  valleyCoverage: "Kathmandu, Lalitpur & Bhaktapur Valley",
  nationwideTimeline: "2–4 Days Tracked Courier Delivery",
  nationwideCoverage: "Pokhara, Butwal, Biratnagar, Chitwan, Dharan & All Major Cities",
  freeDeliveryThreshold: 5000,
  standardValleyRate: 150,
  standardNationwideRate: 250,
  freeDeliveryText: "Free Kathmandu delivery on orders above NPR 5,000",
} as const;

// Brand Value Props & Trust Badges
export const TRUST_PILLARS = [
  {
    id: "authenticity",
    title: "100% Genuine Guarantee",
    description: "Official authorized importer hologram seals & scratch-off verification codes on every container.",
    badge: "100% Authentic",
  },
  {
    id: "delivery",
    title: "Fast Kathmandu Dispatch",
    description: "Same-day delivery in Kathmandu Valley and express courier across all provinces of Nepal.",
    badge: "24-Hr Delivery",
  },
  {
    id: "store",
    title: "Physical Retail Store",
    description: "Visit our physical store in Golfutar, Budha-Nilkantha to inspect authentic seals before buying.",
    badge: "Golfutar Store",
  },
  {
    id: "expert-advice",
    title: "Free Expert Guidance",
    description: "Direct WhatsApp stack consultation tailored to your training goals, diet, and experience.",
    badge: "Expert Advice",
  },
] as const;

// Primary Navigation Hierarchy
export const MAIN_NAV_ITEMS = [
  { label: "Products", href: "/products" },
  { label: "Proteins", href: "/categories/proteins" },
  { label: "Creatine", href: "/categories/creatine" },
  { label: "Gainers", href: "/categories/mass-gainers" },
  { label: "Brands", href: "/brands" },
  { label: "Authenticity", href: "/authenticity" },
  { label: "Store Location", href: "/location" },
  { label: "Guides", href: "/guides" },
] as const;

// Social & Community Channels (WhatsApp & Instagram Official)
export const SOCIAL_LINKS = [
  {
    platform: "WhatsApp",
    href: `https://wa.me/${STORE_WHATSAPP.replace(/\+/g, "")}`,
    label: "Chat & Order on WhatsApp",
  },
  {
    platform: "Instagram",
    href: "https://www.instagram.com/muscleworks.supplements/?hl=en",
    label: "Follow @muscleworks.supplements on Instagram",
  },
] as const;


// Delivery Cities for Nepal Checkout / Inquiries
export const NEPAL_DELIVERY_CITIES = [
  { id: "ktm-inside", name: "Kathmandu (Inside Ring Road)", zone: "valley", fee: 100 },
  { id: "ktm-outside", name: "Kathmandu (Outside Ring Road)", zone: "valley", fee: 150 },
  { id: "lalitpur", name: "Lalitpur", zone: "valley", fee: 150 },
  { id: "bhaktapur", name: "Bhaktapur", zone: "valley", fee: 150 },
  { id: "pokhara", name: "Pokhara", zone: "nationwide", fee: 250 },
  { id: "butwal", name: "Butwal / Bhairahawa", zone: "nationwide", fee: 250 },
  { id: "chitwan", name: "Chitwan / Narayangarh", zone: "nationwide", fee: 250 },
  { id: "biratnagar", name: "Biratnagar", zone: "nationwide", fee: 250 },
  { id: "dharan", name: "Dharan / Itahari", zone: "nationwide", fee: 250 },
  { id: "nepalgunj", name: "Nepalgunj", zone: "nationwide", fee: 300 },
  { id: "other", name: "Other Location (Nepal)", zone: "nationwide", fee: 300 },
] as const;
