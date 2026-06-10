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
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:block">
      <nav className="flex flex-col items-center gap-3 bg-white/80 backdrop-blur-md border border-rose-100/50 rounded-[2rem] p-3 shadow-soft">
        {/* Logo */}
        <Link href="/" className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 flex items-center justify-center mb-2 shadow-soft hover:scale-105 transition-transform">
          <span className="text-white font-bold text-lg">R</span>
        </Link>

        {/* Navigation Items */}
        <div className="flex flex-col items-center gap-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href) || activeTab === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                  'hover:bg-rose-50',
                  active && 'bg-gradient-to-br from-rose-300 to-rose-400 shadow-soft-lg'
                )}
                title={item.label}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors duration-200',
                    active ? 'text-white' : 'text-gray-400 group-hover:text-rose-500'
                  )}
                />

                {/* Active indicator dot */}
                {active && (
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md" />
                )}

                {/* Tooltip */}
                <span className="absolute left-full ml-3 px-3 py-1.5 bg-white text-sm font-medium text-gray-700 rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-soft border border-rose-100/50">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent my-2" />

        {/* Quick Add Button */}
        <Link
          href="/quick-add"
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
            'bg-gradient-to-br from-rose-400 to-rose-500',
            'hover:from-rose-500 hover:to-rose-600',
            'shadow-soft-lg hover:shadow-rose-200/50 hover:scale-105',
            'active:scale-95'
          )}
          title="Thêm tương tác"
        >
          <PlusCircle className="w-6 h-6 text-white" />
        </Link>
      </nav>
    </aside>
  );
}
