import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['technology', 'programming', 'blog', 'tutorials', 'web development', 'software engineering'],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@komputeks',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-primary">Komputeks Blog</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your source for the latest in technology, programming tutorials, and software engineering insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="text-lg font-semibold mb-2">Latest Posts</h3>
          <p className="text-muted-foreground">
            Stay updated with our newest articles on technology and programming.
          </p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="text-lg font-semibold mb-2">Tutorials</h3>
          <p className="text-muted-foreground">
            Step-by-step guides to help you master new technologies.
          </p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="text-lg font-semibold mb-2">Community</h3>
          <p className="text-muted-foreground">
            Join our community of developers and tech enthusiasts.
          </p>
        </div>
      </div>
    </div>
  );
}
