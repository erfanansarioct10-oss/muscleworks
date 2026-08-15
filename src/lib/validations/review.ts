import { z } from "zod";

export const ReviewItemSchema = z.object({
  id: z.string().min(1),
  rating: z.number().int().min(1).max(5).default(5),
  headline: z.string().min(2).max(100),
  author: z.string().min(2).max(80),
  role: z.string().min(2).max(80),
  location: z.string().optional(),
  quote: z.string().min(10).max(1000),
  isFeatured: z.boolean().default(true),
});

export type ReviewItem = z.infer<typeof ReviewItemSchema>;
