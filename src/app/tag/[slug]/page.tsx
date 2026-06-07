import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: 'Tag',
  description: 'Browse posts with this tag',
};

async function getTag(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tags`,
    { cache: 'no-store' }
  );
  const tags = await res.json();
  return tags.find((t: any) => t.slug === slug);
}

async function getPostsByTag(tagId: string, page: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/posts?tag=${tagId}&page=${page}&per_page=10&status=published`,
    { cache: 'no-store' }
  );
  return res.json();
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1', 10);

  const tag = await getTag(slug);

  if (!tag) {
    notFound();
  }

  const postsData = await getPostsByTag(tag.id, page);
  const posts = postsData.data || [];
  const totalPages = postsData.total_pages || 1;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/tag" className="hover:text-foreground">Tags</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{tag.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8">
        Posts tagged with "<span className="text-primary">{tag.name}</span>"
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts with this tag yet.</p>
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
              href={`/tag/${slug}?page=${p}`}
              className={`px-3 py-1 rounded ${p === page ? 'bg-primary text-white' : 'bg-muted hover:bg-accent'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
