import rawFaqData from '@/data/faqs.json';
import { FAQItem, FAQItemSchema } from '@/lib/validations/common';

// Runtime validation on module load
const parsedFaqs: FAQItem[] = FAQItemSchema.array().parse(rawFaqData);

/**
 * Returns all FAQ entries sorted by priority ascending.
 */
export async function getFAQs(): Promise<FAQItem[]> {
  return [...parsedFaqs].sort(
    (a, b) => (a.priority ?? 99) - (b.priority ?? 99)
  );
}

/**
 * Returns FAQ items belonging to a specific category.
 */
export async function getFAQsByCategory(category: string): Promise<FAQItem[]> {
  const normalizedCat = category.toLowerCase().trim();
  return parsedFaqs
    .filter((faq) => faq.category?.toLowerCase() === normalizedCat)
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
}

/**
 * Finds a specific FAQ entry by unique ID.
 */
export async function getFAQById(id: string): Promise<FAQItem | null> {
  const faq = parsedFaqs.find((item) => item.id === id);
  return faq || null;
}

/**
 * Performs in-memory keyword search across FAQ questions and answers.
 */
export async function searchFAQs(query: string): Promise<FAQItem[]> {
  const q = query.toLowerCase().trim();
  if (!q) return getFAQs();

  return parsedFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.category?.toLowerCase().includes(q)
  );
}

/**
 * Returns top-priority featured FAQs for home or category pages.
 */
export async function getFeaturedFAQs(limit = 4): Promise<FAQItem[]> {
  const faqs = await getFAQs();
  return faqs.slice(0, limit);
}
