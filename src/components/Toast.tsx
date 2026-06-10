'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Simple toast state management
let toasts: Toast[] = [];
let toastsListeners: Array<(toasts: Toast[]) => void> = [];

export function showToast(message: string, type: ToastType = 'success') {
  const toast: Toast = {
    id: Math.random().toString(36).substring(7),
    message,
    type,
  };
  
  toasts = [...toasts, toast];
  toastsListeners.forEach(listener => listener([...toasts]));
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    removeToast(toast.id);
  }, 3000);
}

function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id);
  toastsListeners.forEach(listener => listener([...toasts]));
}

export default function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastsListeners.push(setCurrentToasts);
    return () => {
      toastsListeners = toastsListeners.filter(l => l !== setCurrentToasts);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4">
      {currentToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(onDismiss, 200);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const backgrounds = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-soft-lg',
        'transition-all duration-300 ease-out',
        backgrounds[toast.type],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      {icons[toast.type]}
      <p className="flex-1 font-medium text-gray-700 text-sm">{toast.message}</p>
      <button
        onClick={handleDismiss}
        className="w-6 h-6 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}
