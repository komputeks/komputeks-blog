'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryNavProps {
  categories: Category[];
  activeSlug?: string;
}

export function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Get top-level categories
  const topLevelCategories = categories.filter(c => !c.parent_id);

  return (
    <nav className="space-y-1">
      <Link
        href="/blog"
        className={cn(
          'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          !activeSlug
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
      >
        All Posts
      </Link>
      {topLevelCategories.map(category => {
        const hasChildren = categories.some(c => c.parent_id === category.id);
        const isActive = activeSlug === category.slug;
        const isExpanded = expandedId === category.id;

        return (
          <div key={category.id}>
            <div className="flex items-center">
              <Link
                href={`/category/${category.slug}`}
                className={cn(
                  'flex-1 block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {category.name}
              </Link>
              {hasChildren && (
                <button
                  onClick={() => setExpandedId(isExpanded ? null : category.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ChevronDown className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')} />
                </button>
              )}
            </div>
            <AnimatePresence>
              {isExpanded && hasChildren && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-4 overflow-hidden"
                >
                  {categories
                    .filter(c => c.parent_id === category.id)
                    .map(child => (
                      <Link
                        key={child.id}
                        href={`/category/${child.slug}`}
                        className={cn(
                          'block px-3 py-2 rounded-lg text-sm transition-colors',
                          activeSlug === child.slug
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}
