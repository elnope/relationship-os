'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ 
  value, 
  onChange, 
  readonly = false, 
  size = 'md' 
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const displayValue = hoverValue ?? value;
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div 
      className={cn(
        'flex items-center gap-1',
        !readonly && 'cursor-pointer'
      )}
      onMouseLeave={() => setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayValue;
        const isPartial = !isFilled && star - 1 < displayValue && star > displayValue;
        
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            className={cn(
              'relative transition-all duration-150',
              !readonly && 'hover:scale-110 active:scale-95',
              readonly && 'cursor-default'
            )}
          >
            {/* Background star (gray) */}
            <Star 
              className={cn(
                sizeClasses[size],
                'text-gray-200 fill-gray-200'
              )} 
            />
            
            {/* Foreground star (rose) */}
            <Star 
              className={cn(
                sizeClasses[size],
                'absolute inset-0 transition-all duration-150',
                isFilled || isPartial
                  ? 'text-rose-400 fill-rose-400'
                  : 'text-transparent'
              )}
              style={{
                ...(isPartial && {
                  clipPath: `inset(0 ${100 - (displayValue % 1) * 100}% 0 0)`,
                }),
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
