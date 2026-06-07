import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Komputeks Blog documentation and changelog',
};

const changelog = [
  {
    version: '1.0.0',
    date: '2025-06-07',
    changes: [
      'Initial release of Komputeks Blog',
      'Next.js 16.2.7 with App Router',
      'React 19 with Server Components',
      'TypeScript 5.8 with strict mode',
      'Tailwind CSS 4 styling',
      'Supabase PostgreSQL database',
      'Supabase Auth (Email + Google OAuth)',
      'Admin dashboard for content management',
      'PWA support with offline capabilities',
      'Dark/Light theme with system preference',
    ],
  },
];

const features = [
  {
    title: 'Blog System',
    description: 'Full-featured blog with posts, categories, tags, and comments.',
    details: [
      'Rich text content support',
      'Featured images for posts',
      'Breaking news ticker',
      "Editor's picks highlighting",
      'SEO-optimized URLs and meta tags',
      'Post views tracking',
    ],
  },
  {
    title: 'Admin Dashboard',
    description: 'Complete CMS for managing all content.',
    details: [
      'Posts CRUD with status management',
      'Hierarchical categories',
      'Tags management',
      'User role management (admin, editor, author, subscriber)',
      'Comment moderation',
      'Site settings configuration',
    ],
  },
  {
    title: 'Authentication',
    description: 'Secure user authentication with Supabase.',
    details: [
      'Email/password authentication',
      'Google OAuth integration',
      'Protected admin routes',
      'Role-based access control',
    ],
  },
  {
    title: 'PWA Support',
    description: 'Progressive Web App capabilities.',
    details: [
      'Installable on mobile and desktop',
      'Offline fallback support',
      'App manifest configuration',
      'Service worker caching',
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Documentation
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
        Everything you need to know about Komputeks Blog.
      </p>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Features</h2>
        <div className="grid gap-6">
          {features.map(feature => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                {feature.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tech Stack</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Frontend</h4>
              <ul className="text-gray-600 dark:text-gray-400 text-sm mt-2 space-y-1">
                <li>• Next.js 16.2.7 (App Router)</li>
                <li>• React 19</li>
                <li>• TypeScript 5.8</li>
                <li>• Tailwind CSS 4</li>
                <li>• Framer Motion</li>
                <li>• Lucide Icons</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Backend</h4>
              <ul className="text-gray-600 dark:text-gray-400 text-sm mt-2 space-y-1">
                <li>• Vercel Serverless Functions</li>
                <li>• Supabase PostgreSQL</li>
                <li>• Supabase Auth</li>
                <li>• Supabase Storage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Changelog */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Changelog</h2>
        <div className="space-y-6">
          {changelog.map(entry => (
            <div
              key={entry.version}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  v{entry.version}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {entry.date}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                {entry.changes.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
