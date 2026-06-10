'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CheckSquare, Settings, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', icon: Home, label: 'Trang chủ', href: '/' },
  { id: 'people', icon: Users, label: 'Mọi người', href: '/people' },
  { id: 'promises', icon: CheckSquare, label: 'Lời hứa', href: '/promises' },
  { id: 'settings', icon: Settings, label: 'Cài đặt', href: '/settings' },
];

interface BottomNavProps {
  onAddClick?: () => void;
}

export default function BottomNav({ onAddClick }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background blur */}
      <div className="bg-white/90 backdrop-blur-lg border-t border-rose-100/50 px-2 pb-safe">
        {/* Inner container */}
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200',
                  'min-w-[64px]',
                  active
                    ? 'text-rose-500'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <div
                  className={cn(
                    'relative flex items-center justify-center',
                    active && 'bg-rose-100 rounded-full p-2'
                  )}
                >
                  <Icon className={cn('w-5 h-5', active && 'w-5 h-5')} />
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-400" />
                  )}
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  active ? 'text-rose-500' : 'text-gray-500'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Center Add Button */}
          <button
            onClick={onAddClick}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-4 py-2',
              'mt-[-24px]'
            )}
          >
            <div
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center',
                'bg-gradient-to-br from-rose-400 to-rose-500',
                'shadow-soft-lg',
                'hover:from-rose-500 hover:to-rose-600',
                'transition-all duration-200 hover:scale-105 active:scale-95'
              )}
            >
              <PlusCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-500">Thêm</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
