'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, basePath, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  // Always show first page
  pages.push(1);

  // Show ellipsis or pages around current
  if (showEllipsisStart) {
    pages.push('ellipsis-start');
  }

  // Pages around current
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  // Show ellipsis before last
  if (showEllipsisEnd) {
    pages.push('ellipsis-end');
  }

  // Always show last page
  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)}>
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="p-2 rounded-md hover:bg-accent transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="p-2 rounded-md text-muted-foreground">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (typeof page === 'string') {
          return (
            <span key={page} className="px-3 py-1 text-muted-foreground">
              ...
            </span>
          );
        }

        return (
          <Link
            key={index}
            href={`${basePath}?page=${page}`}
            className={cn(
              'px-3 py-1 rounded-md transition-colors',
              page === currentPage
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            )}
          >
            {page}
          </Link>
        );
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="p-2 rounded-md hover:bg-accent transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="p-2 rounded-md text-muted-foreground">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
