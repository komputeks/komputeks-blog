import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse posts by category',
};

async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/categories`,
    { cache: 'no-store' }
  );
  return res.json();
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="block p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold mb-2">{category.name}</h2>
              {category.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {category.post_count || 0} posts
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
