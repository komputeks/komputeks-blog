'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { adminNav } from '@/config/site';
import { LayoutDashboard, FileText, FolderOpen, Tag, Users, MessageSquare, Settings, LogOut } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Dashboard: LayoutDashboard,
  Posts: FileText,
  Categories: FolderOpen,
  Tags: Tag,
  Users: Users,
  Comments: MessageSquare,
  Settings: Settings,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="font-bold text-xl">Admin</Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {adminNav.map((item) => {
              const Icon = iconMap[item.title] || LayoutDashboard;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium hover:bg-accent transition-colors text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
