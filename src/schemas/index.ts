import { z } from 'zod';

// Post validation schema
export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  slug: z.string().min(1, 'Slug is required').max(250, 'Slug must be 250 characters or less').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt must be 500 characters or less').optional(),
  featured_image: z.string().url('Must be a valid URL').nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  is_breaking: z.boolean().default(false),
  is_editors_pick: z.boolean().default(false),
  tag_ids: z.array(z.string().uuid()).optional(),
});

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  slug: z.string().min(1, 'Slug is required').max(120, 'Slug must be 120 characters or less').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  image_url: z.string().url('Must be a valid URL').nullable().optional(),
});

// Tag validation schema
export const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  slug: z.string().min(1, 'Slug is required').max(60, 'Slug must be 60 characters or less').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
});

// User validation schema
export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').nullable().optional(),
  email: z.string().email('Must be a valid email'),
  role: z.enum(['admin', 'editor', 'author', 'reader']).default('reader'),
  bio: z.string().max(500, 'Bio must be 500 characters or less').nullable().optional(),
  avatar_url: z.string().url('Must be a valid URL').nullable().optional(),
});

// Comment validation schema
export const commentSchema = z.object({
  author_name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  author_email: z.string().email('Must be a valid email'),
  content: z.string().min(1, 'Comment is required').max(2000, 'Comment must be 2000 characters or less'),
  post_id: z.string().uuid('Post ID must be a valid UUID'),
  parent_id: z.string().uuid().nullable().optional(),
});

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
});

// Search validation
export const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(200, 'Query must be 200 characters or less'),
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(10),
});

// Export types inferred from schemas
export type PostInput = z.infer<typeof postSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type TagInput = z.infer<typeof tagSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
