# Komputeks Blog

A modern, full-stack technology blog built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Supabase.

**Live Site:** Deployed on Vercel

## 🚀 Features

- **Next.js 16.2.7** - Latest App Router with Server Components
- **React 19** - Latest React features including Actions
- **TypeScript 5.8** - Strict mode enabled for type safety
- **Tailwind CSS 4** - Modern utility-first styling
- **Supabase** - PostgreSQL database, Auth, and Storage
- **Dark/Light Mode** - System preference detection with manual toggle
- **PWA Support** - Installable with offline capabilities
- **SEO Optimized** - Meta tags, Open Graph, and structured data
- **Full-text Search** - Search posts by title, content, and excerpt
- **Comment System** - Comments with moderation workflow
- **Admin Dashboard** - Complete CMS for content management

## 📁 Project Structure

```
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── admin/       # Admin dashboard pages
│   │   ├── api/         # API routes (Serverless Functions)
│   │   ├── blog/        # Blog pages
│   │   ├── category/    # Category pages
│   │   ├── tag/         # Tag pages
│   │   └── ...
│   ├── components/      # Reusable UI components
│   ├── providers/       # React context providers
│   ├── lib/             # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── schemas/         # Zod validation schemas
├── public/              # Static assets
└── vercel.json          # Vercel configuration
```

## 🛠 Tech Stack

- **Frontend:** Next.js 16 + React 19 + TypeScript 5.8 + Tailwind CSS 4
- **Backend:** Vercel Serverless Functions
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth (Email + Google OAuth)
- **Storage:** Supabase Storage
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 🗄 Database Schema

- `komputeks_posts` - Blog articles with status (draft/published/archived)
- `komputeks_categories` - Hierarchical categories
- `komputeks_tags` - Article tags
- `komputeks_post_tags` - Post-tag junction table
- `komputeks_users` - User profiles with roles (admin/editor/author/reader)
- `komputeks_comments` - Article comments with moderation status

## 🔑 Demo Credentials

- **Email:** admin@komputeks.com
- **Password:** admin123

## 📝 API Routes

- `GET/POST /api/posts` - List/Create posts
- `GET/PUT/DELETE /api/posts/[id]` - Post CRUD
- `GET/POST /api/categories` - Categories
- `GET/POST /api/tags` - Tags
- `GET/POST /api/comments` - Comments
- `GET /api/search` - Full-text search
- `GET /api/adjacent-posts` - Previous/Next post navigation
- `POST /api/upload` - File upload to Supabase Storage

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in your credentials
4. Run development server: `npm run dev`
5. Open http://localhost:3000

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
