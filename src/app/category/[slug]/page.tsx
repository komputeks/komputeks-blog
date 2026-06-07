import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: 'Category',
  description: 'Browse posts in this category',
};

async function getCategory(slug: string) {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/categories`, { 
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!res.ok) return null;
  const categories = await res.json();
  return categories.find((c: any) => c.slug === slug);
}

async function getPostsByCategory(categoryId: string, page: number) {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  const res = await fetch(
    `${baseUrl}/api/posts?category=${categoryId}&page=${page}&per_page=10&status=published`,
    { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    }
  );
  
  if (!res.ok) return { data: [], total: 0, total_pages: 0 };
  return res.json();
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1', 10);

  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const postsData = await getPostsByCategory(category.id, page);
  const posts = postsData.data || [];
  const totalPages = postsData.total_pages || 1;

  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/category" className="hover:text-foreground">Categories</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-muted-foreground mb-8">{category.description}</p>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts in this category yet.</p>
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
                <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
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
              href={`/category/${slug}?page=${p}`}
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
