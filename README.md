# Komputeks Blog

A modern, full-stack technology blog built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Supabase.

## 🚀 Features

- **Next.js 16.2.7** - Latest App Router with Server Components
- **React 19** - Latest React features including Actions
- **TypeScript 5.8** - Strict mode enabled for type safety
- **Tailwind CSS 4** - Modern utility-first styling
- **Supabase** - PostgreSQL database, Auth, and Storage
- **Dark/Light Mode** - System preference detection with manual toggle
- **PWA Support** - Installable with offline capabilities
- **SEO Optimized** - Meta tags, Open Graph, and structured data

## 📁 Project Structure

```
├── api/                  # Vercel serverless API routes
├── src/
│   ├── app/             # Next.js App Router pages
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

- `komputeks_posts` - Blog articles
- `komputeks_categories` - Hierarchical categories
- `komputeks_tags` - Article tags
- `komputeks_post_tags` - Post-tag junction table
- `komputeks_users` - User profiles
- `komputeks_comments` - Article comments

## 🔑 Demo Credentials

- **Email:** admin@komputeks.com
- **Password:** admin123

## 📝 License

MIT

## Production URL

Deployed on Vercel - see preview panel for live URL.
