'use client';

import { useEffect } from 'react';
import { X, Wrench, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnderDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export default function UnderDevelopmentModal({ isOpen, onClose, featureName }: UnderDevelopmentModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Animated top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 animate-pulse" />

        <div className="p-8 text-center">
          {/* Animated illustration */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full animate-pulse opacity-50" />
            
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Wrench className="w-10 h-10 text-amber-500" />
              </div>
            </div>

            {/* Sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-400 animate-ping" />
            <Sparkles className="absolute -bottom-1 -left-1 w-6 h-6 text-rose-400 animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {featureName ? `${featureName}` : 'Tính năng mới'}
          </h2>

          {/* Message */}
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Tính năng này đang được phát triển tích cực và sẽ sớm ra mắt! 
            Xin lỗi vì sự bất tiện này. 💪
          </p>

          {/* Progress indicator */}
          <div className="w-full max-w-xs mx-auto mb-6">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Đang phát triển...</p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:from-rose-500 hover:to-rose-600 transition-all"
          >
            Đã hiểu!
          </button>
        </div>

        {/* Bottom decoration */}
        <div className="h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400" />
      </div>
    </div>
  );
}
