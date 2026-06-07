'use client';

import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Post } from '@/types';
import { cn } from '@/lib/utils';

interface BreakingNewsProps {
  posts: Post[];
}

export function BreakingNews({ posts }: BreakingNewsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (posts.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse whitespace-nowrap">
          BREAKING
        </span>
        <div ref={containerRef} className="flex-1 overflow-hidden">
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 30,
                ease: 'linear',
              },
            }}
          >
            {posts.map(post => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="hover:underline text-sm font-medium"
              >
                {post.title}
              </a>
            ))}
            {/* Duplicate for seamless loop */}
            {posts.map(post => (
              <a
                key={`dup-${post.id}`}
                href={`/blog/${post.slug}`}
                className="hover:underline text-sm font-medium"
              >
                {post.title}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
