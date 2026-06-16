'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Users, CheckSquare, Settings, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab?: 'home' | 'people' | 'promises' | 'settings';
}

const navItems = [
  { id: 'home' as const, icon: Home, label: 'Trang chủ', href: '/' },
  { id: 'people' as const, icon: Users, label: 'Mọi người', href: '/people' },
  { id: 'promises' as const, icon: CheckSquare, label: 'Lời hứa', href: '/promises' },
  { id: 'settings' as const, icon: Settings, label: 'Cài đặt', href: '/settings' },
];

export default function Sidebar({ activeTab = 'home' }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 z-40 hidden md:flex flex-col bg-white border-r border-gray-200 shadow-md">
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100">
        <Link href="/" className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
          <span className="text-white font-bold text-xl">R</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center justify-center py-6 gap-2">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href) || activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'group relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300',
                active
                  ? 'bg-gradient-to-br from-rose-400 to-rose-500 shadow-md scale-105'
                  : 'hover:bg-gray-100'
              )}
              title={item.label}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-all duration-200',
                  active ? 'text-white' : 'text-gray-500 group-hover:text-rose-500'
                )}
              />

              {/* Active indicator */}
              {active && (
                <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-rose-500 rounded-l-full" />
              )}

              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-sm text-white font-medium rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-lg z-50">
                {item.label}
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Add Button */}
      <div className="h-24 flex items-center justify-center border-t border-gray-100">
        <Link
          href="/quick-add"
          className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300',
            'bg-gradient-to-br from-rose-400 to-rose-500',
            'hover:from-rose-500 hover:to-rose-600',
            'shadow-md hover:shadow-lg hover:scale-110',
            'active:scale-95'
          )}
          title="Thêm tương tác"
        >
          <PlusCircle className="w-7 h-7 text-white" />
        </Link>
      </div>
    </aside>
  );
}
