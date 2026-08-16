import rawGuidesData from '@/data/guides.json';
import {
  GuideCategory,
  GuideFrontmatter,
  GuideFrontmatterSchema,
} from '@/lib/validations/guide';

// Runtime validation on module load
const parsedGuides: GuideFrontmatter[] =
  GuideFrontmatterSchema.array().parse(rawGuidesData);

/**
 * Returns all educational buying guides sorted by publishedDate descending.
 */
export async function getAllGuides(): Promise<GuideFrontmatter[]> {
  return [...parsedGuides].sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() -
      new Date(a.publishedDate).getTime()
  );
}

/**
 * Finds an educational guide by URL slug.
 */
export async function getGuideBySlug(
  slug: string
): Promise<GuideFrontmatter | null> {
  const normalizedSlug = slug.toLowerCase().trim();
  const guide = parsedGuides.find((item) => item.slug === normalizedSlug);
  return guide || null;
}

/**
 * Returns featured educational guides for homepage or catalog callouts.
 */
export async function getFeaturedGuides(limit = 3): Promise<GuideFrontmatter[]> {
  const all = await getAllGuides();
  return all.filter((guide) => guide.isFeatured).slice(0, limit);
}

/**
 * Returns guides belonging to a specific category.
 */
export async function getGuidesByCategory(
  category: GuideCategory
): Promise<GuideFrontmatter[]> {
  const all = await getAllGuides();
  return all.filter((guide) => guide.category === category);
}

/**
 * Returns related guides based on matching category or related products, excluding current guide slug.
 */
export async function getRelatedGuides(
  slug: string,
  limit = 2
): Promise<GuideFrontmatter[]> {
  const current = await getGuideBySlug(slug);
  const all = await getAllGuides();

  if (!current) {
    return all.slice(0, limit);
  }

  const filtered = all.filter((g) => g.slug !== current.slug);

  const sameCategory = filtered.filter(
    (g) => g.category === current.category
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const remaining = filtered.filter((g) => g.category !== current.category);
  return [...sameCategory, ...remaining].slice(0, limit);
}

