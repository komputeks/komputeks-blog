import { useState, useEffect, useCallback } from 'react';
import type { Post, PaginatedResponse } from '@/types';

interface UsePostsOptions {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  status?: string;
  search?: string;
}

export function usePosts(options: UsePostsOptions = {}) {
  const [data, setData] = useState<PaginatedResponse<Post> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, perPage = 10, category, tag, status, search } = options;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('per_page', perPage.toString());
      if (category) params.set('category', category);
      if (tag) params.set('tag', tag);
      if (status) params.set('status', status);
      if (search) params.set('search', search);

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, perPage, category, tag, status, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { data, loading, error, refetch: fetchPosts };
}
