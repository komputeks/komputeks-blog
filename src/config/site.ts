// Site configuration
export const siteConfig = {
  name: 'Komputeks Blog',
  shortName: 'Komputeks',
  description: 'Modern full-stack technology blog covering the latest in tech, programming, and digital innovation.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://komputeks.blog',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/komputeks/komputeks-blog',
    twitter: 'https://twitter.com/komputeks',
  },
  creator: 'Komputeks',
  email: 'admin@komputeks.com',
};

// Navigation items
export const mainNav = [
  { title: 'Home', href: '/' },
  { title: 'Blog', href: '/blog' },
  { title: 'Categories', href: '/category' },
  { title: 'Tags', href: '/tag' },
  { title: 'Search', href: '/search' },
];

export const adminNav = [
  { title: 'Dashboard', href: '/admin' },
  { title: 'Posts', href: '/admin/posts' },
  { title: 'Categories', href: '/admin/categories' },
  { title: 'Tags', href: '/admin/tags' },
  { title: 'Users', href: '/admin/users' },
  { title: 'Comments', href: '/admin/comments' },
  { title: 'Settings', href: '/admin/settings' },
];

// Pagination defaults
export const paginationConfig = {
  defaultPageSize: 10,
  maxPageSize: 100,
};

// Post status labels
export const postStatusLabels = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
} as const;

// User role labels
export const userRoleLabels = {
  admin: 'Administrator',
  editor: 'Editor',
  author: 'Author',
  reader: 'Reader',
} as const;

// Comment status labels
export const commentStatusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  spam: 'Spam',
  trash: 'Trash',
} as const;

export default siteConfig;
