import Link from 'next/link';
import type { Tag } from '@/types';

interface TagListProps {
  tags: Tag[];
  limit?: number;
}

export function TagList({ tags, limit }: TagListProps) {
  const displayTags = limit ? tags.slice(0, limit) : tags;

  if (displayTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map(tag => (
        <Link
          key={tag.id}
          href={`/tag/${tag.slug}`}
          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}
