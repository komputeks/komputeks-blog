// Core domain types for Komputeks Blog

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  category_id: string | null;
  author_id: string | null;
  status: 'draft' | 'published' | 'archived';
  is_breaking: boolean;
  is_editors_pick: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  category?: Category;
  author?: User;
  tags?: Tag[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  created_at: string;
  parent?: Category;
  children?: Category[];
  post_count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  post_count?: number;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'editor' | 'author' | 'reader';
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string | null;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  created_at: string;
  post?: Post;
  user?: User;
  replies?: Comment[];
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Search types
export interface SearchResult {
  posts: Post[];
  query: string;
  total: number;
}

// Navigation types
export interface AdjacentPosts {
  prev: Post | null;
  next: Post | null;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: User['role'];
}

// Form types
export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  category_id: string | null;
  status: Post['status'];
  is_breaking: boolean;
  is_editors_pick: boolean;
  tag_ids: string[];
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
}

export interface TagFormData {
  name: string;
  slug: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: User['role'];
  bio: string | null;
  avatar_url: string | null;
}

export interface CommentFormData {
  author_name: string;
  author_email: string;
  content: string;
}
