import { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for posts',
};

async function searchPosts(query: string, page: number) {
  if (!query) return { data: [], total: 0, total_pages: 0 };

  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  const res = await fetch(
    `${baseUrl}/api/search?q=${encodeURIComponent(query)}&page=${page}&per_page=10`,
    { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    }
  );
  
  if (!res.ok) return { data: [], total: 0, total_pages: 0 };
  return res.json();
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page: pageParam } = await searchParams;
  const query = q || '';
  const page = parseInt(pageParam || '1', 10);

  const results = await searchPosts(query, page);
  const posts = results.data || [];
  const totalPages = results.total_pages || 1;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Search</h1>

      <form className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </form>

      {query && (
        <p className="text-muted-foreground mb-6">
          {results.total} result{results.total !== 1 ? 's' : ''} for "<span className="font-medium text-foreground">{query}</span>"
        </p>
      )}

      {query && posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found for your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <article key={post.id} className="bg-card rounded-lg border overflow-hidden">
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                {post.category && (
                  <span className="text-xs font-medium text-primary">{post.category.name}</span>
                )}
                <h2 className="text-lg font-semibold mt-1 mb-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <a
                  href={`/blog/${post.slug}`}
                  className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Read more →
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/search?q=${encodeURIComponent(query)}&page=${p}`}
              className={`px-3 py-1 rounded ${p === page ? 'bg-primary text-white' : 'bg-muted hover:bg-accent'}`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
