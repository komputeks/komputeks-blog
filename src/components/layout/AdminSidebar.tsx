import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderOpen, Tags, Users, MessageSquare, Settings } from 'lucide-react';
import { navigation } from '@/config/site';
import { cn } from '@/lib/utils';

const icons = {
  Dashboard: LayoutDashboard,
  Posts: FileText,
  Categories: FolderOpen,
  Tags: Tags,
  Users: Users,
  Comments: MessageSquare,
  Settings: Settings,
};

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Admin Panel</h2>
        <nav className="space-y-1">
          {navigation.admin.map(item => {
            const Icon = icons[item.name as keyof typeof icons];
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
