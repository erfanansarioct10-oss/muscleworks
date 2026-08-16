import rawReviewsData from '@/data/reviews.json';
import { ReviewItem, ReviewItemSchema } from '@/lib/validations/review';

// Runtime validation on module load
const parsedReviews: ReviewItem[] =
  ReviewItemSchema.array().parse(rawReviewsData);

/**
 * Returns all verified customer reviews.
 */
export async function getReviews(): Promise<ReviewItem[]> {
  return [...parsedReviews];
}

/**
 * Returns featured customer reviews for homepage carousel or social proof sections.
 */
export async function getFeaturedReviews(
  limit?: number
): Promise<ReviewItem[]> {
  const featured = parsedReviews.filter((review) => review.isFeatured);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

/**
 * Finds a specific customer review by unique ID.
 */
export async function getReviewById(
  id: string
): Promise<ReviewItem | null> {
  const review = parsedReviews.find((item) => item.id === id);
  return review || null;
}
