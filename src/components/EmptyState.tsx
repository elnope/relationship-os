'use client';

import { cn } from '@/lib/utils';
import { Users, Gift, CheckSquare, Settings, Search, PlusCircle } from 'lucide-react';

type EmptyStateType = 'people' | 'promises' | 'settings' | 'search' | 'default';

interface EmptyStateProps {
  type: EmptyStateType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

// SVG Illustrations for different empty states
function PeopleIllustration({ className }: { className?: string }) {
  return (
    <svg className={cn('w-40 h-40', className)} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="80" cy="80" r="70" fill="#FEF2F2" />
      
      {/* Person 1 - Center */}
      <circle cx="80" cy="55" r="20" fill="#FEE2E2" stroke="#F87171" strokeWidth="2" />
      <circle cx="80" cy="52" r="8" fill="#F87171" />
      <path d="M65 70 Q80 85 95 70" stroke="#F87171" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* Person 2 - Left */}
      <circle cx="40" cy="95" r="15" fill="#FEE2E2" stroke="#F87171" strokeWidth="2" />
      <circle cx="40" cy="93" r="6" fill="#F87171" />
      <path d="M29 106 Q40 118 51 106" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      
      {/* Person 3 - Right */}
      <circle cx="120" cy="95" r="15" fill="#FEE2E2" stroke="#F87171" strokeWidth="2" />
      <circle cx="120" cy="93" r="6" fill="#F87171" />
      <path d="M109 106 Q120 118 131 106" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      
      {/* Plus signs */}
      <circle cx="65" cy="75" r="10" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
      <path d="M65 70 V80 M60 75 H70" stroke="white" strokeWidth="2" strokeLinecap="round" />
      
      <circle cx="110" cy="100" r="8" fill="#A78BFA" stroke="#8B5CF6" strokeWidth="2" />
      <path d="M110 96 V104 M107 100 H113" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Decorative elements */}
      <circle cx="25" cy="50" r="4" fill="#FCA5A5" />
      <circle cx="140" cy="45" r="3" fill="#FCA5A5" />
      <circle cx="145" cy="120" r="5" fill="#FCA5A5" />
    </svg>
  );
}

function PromisesIllustration({ className }: { className?: string }) {
  return (
    <svg className={cn('w-40 h-40', className)} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="80" cy="80" r="70" fill="#FFFBEB" />
      
      {/* Gift box */}
      <rect x="40" y="70" width="80" height="50" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
      <rect x="30" y="60" width="100" height="20" rx="6" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
      
      {/* Ribbon vertical */}
      <rect x="72" y="60" width="16" height="60" fill="#FBBF24" />
      
      {/* Ribbon horizontal */}
      <rect x="40" y="65" width="80" height="10" fill="#FBBF24" />
      
      {/* Bow */}
      <ellipse cx="80" cy="55" rx="20" ry="12" fill="#F59E0B" />
      <ellipse cx="70" cy="55" rx="12" ry="8" fill="#FBBF24" />
      <ellipse cx="90" cy="55" rx="12" ry="8" fill="#FBBF24" />
      <circle cx="80" cy="55" r="6" fill="#D97706" />
      
      {/* Sparkles */}
      <path d="M30 45 L35 50 L30 55 L25 50 Z" fill="#FBBF24" />
      <path d="M130 50 L135 55 L130 60 L125 55 Z" fill="#FBBF24" />
      <path d="M25 95 L30 100 L25 105 L20 100 Z" fill="#F59E0B" />
      <path d="M135 90 L140 95 L135 100 L130 95 Z" fill="#F59E0B" />
      
      {/* Checkmark hint */}
      <circle cx="120" cy="110" r="15" fill="#A78BFA" opacity="0.5" />
      <path d="M113 110 L118 115 L128 105" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIllustration({ className }: { className?: string }) {
  return (
    <svg className={cn('w-40 h-40', className)} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="80" cy="80" r="70" fill="#F0F9FF" />
      
      {/* Magnifying glass */}
      <circle cx="70" cy="70" r="35" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="3" />
      <circle cx="70" cy="70" r="25" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5 5" />
      <line x1="95" y1="95" x2="120" y2="120" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
      
      {/* Question mark inside */}
      <path d="M60 60 Q60 50 70 50 Q80 50 80 60 Q80 68 70 70 L70 75" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="70" cy="82" r="2" fill="#38BDF8" />
      
      {/* Stars */}
      <path d="M130 40 L132 45 L137 45 L133 48 L135 53 L130 50 L125 53 L127 48 L123 45 L128 45 Z" fill="#FBBF24" />
      <path d="M35 110 L36 113 L39 113 L37 115 L38 118 L35 116 L32 118 L33 115 L31 113 L34 113 Z" fill="#FBBF24" />
    </svg>
  );
}

function DefaultIllustration({ className }: { className?: string }) {
  return (
    <svg className={cn('w-40 h-40', className)} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="80" cy="80" r="70" fill="#F5F3FF" />
      
      {/* Heart */}
      <path d="M80 120 L50 90 Q35 75 50 60 Q65 45 80 60 Q95 45 110 60 Q125 75 110 90 Z" fill="#C4B5FD" stroke="#8B5CF6" strokeWidth="2" />
      
      {/* Sparkles around */}
      <circle cx="30" cy="50" r="5" fill="#A78BFA" />
      <circle cx="130" cy="45" r="4" fill="#A78BFA" />
      <circle cx="140" cy="90" r="6" fill="#A78BFA" />
      <circle cx="25" cy="100" r="4" fill="#A78BFA" />
      
      {/* Small hearts */}
      <path d="M50 40 L45 35 L50 30 L55 35 Z" fill="#DDD6FE" />
      <path d="M115 35 L110 30 L115 25 L120 30 Z" fill="#DDD6FE" />
    </svg>
  );
}

function SettingsIllustration({ className }: { className?: string }) {
  return (
    <svg className={cn('w-40 h-40', className)} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="80" cy="80" r="70" fill="#F3F4F6" />
      
      {/* Gear/Settings wheel */}
      <circle cx="80" cy="80" r="35" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="3" />
      <circle cx="80" cy="80" r="20" fill="#F9FAFB" stroke="#9CA3AF" strokeWidth="2" />
      
      {/* Gear teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <rect
          key={i}
          x="75"
          y="38"
          width="10"
          height="12"
          rx="2"
          fill="#9CA3AF"
          transform={`rotate(${angle} 80 80)`}
        />
      ))}
      
      {/* Wrench */}
      <path d="M55 55 L45 45 M60 60 L50 50" stroke="#6B7280" strokeWidth="4" strokeLinecap="round" />
      
      {/* Sparkles */}
      <circle cx="130" cy="50" r="4" fill="#FBBF24" />
      <circle cx="35" cy="60" r="3" fill="#FBBF24" />
      <circle cx="140" cy="110" r="5" fill="#FBBF24" />
      <circle cx="30" cy="115" r="4" fill="#FBBF24" />
    </svg>
  );
}

export default function EmptyState({ type, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  const renderIllustration = () => {
    switch (type) {
      case 'people':
        return <PeopleIllustration className="mb-6" />;
      case 'promises':
        return <PromisesIllustration className="mb-6" />;
      case 'settings':
        return <SettingsIllustration className="mb-6" />;
      case 'search':
        return <SearchIllustration className="mb-6" />;
      default:
        return <DefaultIllustration className="mb-6" />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      {/* Illustration */}
      {renderIllustration()}

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-gray-500 max-w-xs mb-6">{description}</p>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:from-rose-500 hover:to-rose-600 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Preset components for common empty states
EmptyState.People = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState
    type="people"
    title="Chưa có ai trong danh sách"
    description="Bắt đầu thêm những người quan trọng trong cuộc sống của bạn"
    actionLabel="Thêm người bạn đầu tiên"
    onAction={onAction}
  />
);

EmptyState.Promises = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState
    type="promises"
    title="Không có lời hứa nào"
    description="Tạo lời hứa mới để theo dõi những cam kết quan trọng"
    actionLabel="Tạo lời hứa mới"
    onAction={onAction}
  />
);

EmptyState.Search = ({ query }: { query?: string }) => (
  <EmptyState
    type="search"
    title="Không tìm thấy kết quả"
    description={query ? `Không có kết quả cho "${query}"` : 'Thử tìm kiếm với từ khóa khác'}
  />
);

EmptyState.Settings = () => (
  <EmptyState
    type="settings"
    title="Không có cài đặt"
    description="Các tùy chọn cài đặt sẽ xuất hiện ở đây"
  />
);
