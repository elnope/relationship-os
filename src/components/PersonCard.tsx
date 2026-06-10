'use client';

import { cn, getStrengthColor } from '@/lib/utils';

interface Tag {
  id?: string;
  name: string;
  color: string;
  icon?: string | null;
}

interface PersonCardProps {
  name: string;
  avatarUrl?: string | null;
  tags?: Tag[];
  relationshipStrengthScore: number;
  relationshipStatus?: 'growing' | 'stable' | 'fading' | 'lost_contact';
  lastInteractionDate?: Date | string | null;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showStrengthRing?: boolean;
}

export default function PersonCard({
  name,
  avatarUrl,
  tags = [],
  relationshipStrengthScore,
  relationshipStatus,
  lastInteractionDate,
  onClick,
  size = 'md',
  showStrengthRing = true,
}: PersonCardProps) {
  const strength = getStrengthColor(relationshipStrengthScore);
  
  const sizeConfig = {
    sm: {
      avatar: 'w-10 h-10',
      text: 'text-sm',
      badge: 'text-xs px-2 py-0.5',
      gap: 'gap-2',
    },
    md: {
      avatar: 'w-14 h-14',
      text: 'text-base',
      badge: 'text-xs px-2.5 py-1',
      gap: 'gap-3',
    },
    lg: {
      avatar: 'w-20 h-20',
      text: 'text-lg',
      badge: 'text-sm px-3 py-1.5',
      gap: 'gap-4',
    },
  };

  const config = sizeConfig[size];
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex flex-col items-center p-4',
        'bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-[1.5rem]',
        'transition-all duration-300',
        'hover:border-rose-200 hover:shadow-soft-lg',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Avatar with Strength Ring */}
      <div className="relative">
        {/* Glow effect for high scores */}
        {relationshipStrengthScore >= 80 && (
          <div
            className={cn(
              'absolute inset-0 rounded-full blur-xl opacity-30 animate-glow-pulse',
              strength.bg
            )}
          />
        )}

        {/* Strength Ring */}
        {showStrengthRing && (
          <div
            className={cn(
              'absolute -inset-1 rounded-full',
              'bg-gradient-to-br',
              relationshipStrengthScore >= 80
                ? 'from-rose-300 via-rose-400 to-rose-500'
                : relationshipStrengthScore >= 50
                ? 'from-emerald-300 via-emerald-400 to-emerald-500'
                : relationshipStrengthScore >= 20
                ? 'from-amber-300 via-amber-400 to-amber-500'
                : 'from-gray-300 via-gray-400 to-gray-500',
              strength.glow
            )}
            style={{
              padding: '2px',
            }}
          >
            <div className="w-full h-full rounded-full bg-white" />
          </div>
        )}

        {/* Avatar */}
        <div
          className={cn(
            'relative rounded-full overflow-hidden',
            config.avatar,
            'bg-gradient-to-br from-rose-100 to-rose-200',
            'flex items-center justify-center'
          )}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className={cn('font-semibold text-rose-600', size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-xl')}>
              {initials}
            </span>
          )}
        </div>

        {/* Score Badge */}
        {showStrengthRing && (
          <div
            className={cn(
              'absolute -bottom-1 -right-1',
              'flex items-center justify-center',
              'bg-white rounded-full shadow-soft border border-rose-100',
              'px-1.5 py-0.5 min-w-[28px]'
            )}
          >
            <span className={cn('font-bold text-xs', strength.text)}>
              {relationshipStrengthScore}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className={cn('font-semibold text-gray-800 mt-3 text-center', config.text)}>
        {name}
      </h3>

      {/* Tags */}
      {tags.length > 0 && (
        <div className={cn('flex flex-wrap justify-center mt-2', config.gap)}>
          {tags.slice(0, size === 'sm' ? 2 : 3).map((tag) => (
            <span
              key={tag.id}
              className={cn(
                'text-xs font-medium rounded-full',
                'bg-gray-50 text-gray-600 border border-gray-100',
                config.badge
              )}
              style={{
                borderColor: `${tag.color}30`,
                color: tag.color,
              }}
            >
              #{tag.name}
            </span>
          ))}
          {tags.length > (size === 'sm' ? 2 : 3) && (
            <span className="text-xs text-gray-400">+{tags.length - (size === 'sm' ? 2 : 3)}</span>
          )}
        </div>
      )}

      {/* Relationship Status Badge */}
      {relationshipStatus && (
        <div
          className={cn(
            'mt-2 px-2 py-0.5 rounded-full text-xs font-medium',
            strength.bg,
            strength.text
          )}
        >
          {strength.label}
        </div>
      )}
    </div>
  );
}
