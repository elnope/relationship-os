'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showToast } from './Toast';

interface AddPromiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    deadline: string;
    description?: string;
  }) => void;
  isLoading?: boolean;
  personName?: string;
}

export default function AddPromiseModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  personName 
}: AddPromiseModalProps) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDeadline('');
      setDescription('');
    }
  }, [isOpen]);

  // Handle escape key
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

  // Get tomorrow's date as default
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast('Vui lòng nhập tiêu đề', 'error');
      return;
    }
    if (!deadline) {
      showToast('Vui lòng chọn ngày hạn', 'error');
      return;
    }

    onSubmit({
      title: title.trim(),
      deadline,
      description: description.trim() || undefined,
    });
  };

  const canSubmit = title.trim() && deadline;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md border border-rose-100/50 rounded-[2.5rem] shadow-soft-lg animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-rose-100/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Thêm lời hứa</h2>
              {personName && (
                <p className="text-xs text-gray-500">với {personName}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-rose-50 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Tiêu đề <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Gọi điện chúc mừng sinh nhật"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
              autoFocus
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Ngày hạn <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={getTomorrow()}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
                style={{ colorScheme: 'normal' }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Ghi chú <span className="text-gray-400">(tùy chọn)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thêm ghi chú..."
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all resize-none"
            />
          </div>

          {/* Quick deadlines */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Chọn nhanh
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 1);
                  setDeadline(d.toISOString().split('T')[0]);
                }}
                className="flex-1 px-3 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors"
              >
                Ngày mai
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 7);
                  setDeadline(d.toISOString().split('T')[0]);
                }}
                className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                1 tuần
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 30);
                  setDeadline(d.toISOString().split('T')[0]);
                }}
                className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                1 tháng
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-rose-100/50">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
            className={cn(
              'w-full py-3 rounded-full font-semibold transition-all duration-300',
              canSubmit && !isLoading
                ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-white hover:from-amber-400 hover:to-amber-500 shadow-soft'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Đang lưu...' : 'Thêm lời hứa'}
          </button>
        </div>
      </div>
    </div>
  );
}
