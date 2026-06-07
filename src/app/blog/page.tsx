import type { Metadata } from 'next';
import { PostCard, CategoryNav } from '@/components/blog';

type Props = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

async function getPosts(page: number, category?: string) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    let url = `${baseUrl}/api/posts?limit=12&page=${page}&status=published`;
    if (category) url += `&category=${category}`;

    const res = await fetch(url, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) return { data: [], total: 0, total_pages: 0 };
    return res.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { data: [], total: 0, total_pages: 0 };
  }
}

async function getCategories() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/categories`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explore our latest articles on technology, programming, and software engineering.',
};

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const categorySlug = params.category;

  const [postsData, categories] = await Promise.all([
    getPosts(page, categorySlug),
    getCategories(),
  ]);

  const posts = postsData.data || [];
  const totalPages = postsData.total_pages || 1;

  // Find current category if filtering
  const currentCategory = categorySlug 
    ? categories.find((c: any) => c.slug === categorySlug) 
    : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <CategoryNav categories={categories} currentSlug={categorySlug} />
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-8">
            {currentCategory ? currentCategory.name : 'All Posts'}
          </h1>

          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No posts found.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/blog?page=${p}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className={`px-3 py-1 rounded ${
                        p === page ? 'bg-primary text-white' : 'bg-muted hover:bg-accent'
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
