# Komputeks Blog

A modern, full-stack technology blog built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Dark/Light Mode** - System preference detection with manual toggle
- **Responsive Design** - Mobile-first approach, works on all devices
- **Article System** - Full article pages with comments, related posts, and navigation
- **Categories & Tags** - Hierarchical categories with subcategories, tag-based filtering
- **Search** - Full-text search with paginated results
- **Breaking News** - Animated ticker for breaking news articles
- **Editor's Picks** - Curated content highlighting
- **Admin Dashboard** - Complete CMS for managing posts, categories, tags, users, and comments
- **Authentication** - Email/password and Google sign-in via Supabase Auth
- **Real Database** - Supabase PostgreSQL with real-time capabilities

## 🛠 Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS 4
- **Backend:** Vercel Serverless Functions
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Email + Google OAuth)
- **Storage:** Supabase Storage
- **Deployment:** Vercel
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📁 Project Structure

```
├── api/                  # Vercel serverless API routes
│   ├── posts.js         # Posts CRUD
│   ├── categories.js    # Categories CRUD
│   ├── tags.js          # Tags CRUD
│   ├── comments.js      # Comments CRUD
│   ├── users.js         # Users CRUD
│   ├── upload.js        # File upload
│   ├── tag-posts.js     # Posts by tag
│   └── adjacent-posts.js # Prev/Next post navigation
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Auth, Theme)
│   ├── lib/             # Utility functions
│   └── pages/           # Page components
├── public/              # Static assets
└── vercel.json          # Vercel configuration
```

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

## 🌐 Production URL

- **GitHub Repository:** https://github.com/komputeks/komputeks-blog
- **Production Deployment:** Vercel (see preview panel for live URL)

## 📝 License

MIT
-e 
## Production URL
https://repo-seven-alpha.vercel.app

