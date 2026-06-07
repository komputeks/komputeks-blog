import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse posts by tag',
};

async function getTags() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tags`,
    { cache: 'no-store' }
  );
  return res.json();
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Tags</h1>

      {tags.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tags found.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag: any) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card hover:bg-accent transition-colors"
            >
              <span className="font-medium">{tag.name}</span>
              <span className="text-sm text-muted-foreground">({tag.post_count || 0})</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
