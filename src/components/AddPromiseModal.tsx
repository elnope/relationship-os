'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Calendar, Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showToast } from './Toast';
import { usePeople } from '@/lib/hooks';

interface AddPromiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    personId: string;
    title: string;
    deadline: string;
    description?: string;
  }) => void;
  isLoading?: boolean;
  initialPersonId?: string;
}

export default function AddPromiseModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialPersonId
}: AddPromiseModalProps) {
  const [person, setPerson] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(!initialPersonId);

  // Validation state
  const [errors, setErrors] = useState<{ person?: string; title?: string; deadline?: string }>({});
  const [touched, setTouched] = useState(false);

  // Fetch people
  const { data: peopleData } = usePeople();
  const people = peopleData || [];

  // Set initial person if provided
  useEffect(() => {
    if (isOpen && initialPersonId && peopleData) {
      const found = peopleData.find((p: any) => p.id === initialPersonId);
      if (found) {
        setPerson(found);
        setShowSearch(false);
      }
    }
  }, [isOpen, initialPersonId, peopleData]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPerson(null);
      setTitle('');
      setDeadline('');
      setDescription('');
      setSearchQuery('');
      setShowSearch(!initialPersonId);
      setErrors({});
      setTouched(false);
    }
  }, [isOpen, initialPersonId]);

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

  const filteredPeople = people.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get tomorrow's date as default
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = () => {
    setTouched(true);

    const newErrors: { person?: string; title?: string; deadline?: string } = {};
    if (!person) {
      newErrors.person = 'Vui lòng chọn người!';
    }
    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề!';
    }
    if (!deadline) {
      newErrors.deadline = 'Vui lòng chọn ngày hạn!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.person) showToast(newErrors.person, 'error');
      else if (newErrors.title) showToast(newErrors.title, 'error');
      else if (newErrors.deadline) showToast(newErrors.deadline, 'error');
      return;
    }

    onSubmit({
      personId: person.id,
      title: title.trim(),
      deadline,
      description: description.trim() || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md border border-amber-100 rounded-[2.5rem] shadow-soft-lg animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-amber-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Tạo lời hứa mới</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-amber-50 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Person Selection */}
          {showSearch || !person ? (
            <div className="space-y-3">
              {/* Inline Error */}
              {touched && errors.person && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.person}
                </div>
              )}
              <label className="text-sm font-medium text-gray-600">
                Người nhận <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all"
                  autoFocus={showSearch}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {filteredPeople.map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPerson(p);
                      setShowSearch(false);
                      setErrors((prev) => ({ ...prev, person: undefined }));
                    }}
                    className="flex-shrink-0 px-4 py-2 rounded-full border-2 border-gray-100 bg-white hover:border-amber-300 hover:bg-amber-50 transition-all text-sm font-medium text-gray-700"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {person.name.split(' ').slice(-1)[0].substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{person.name}</p>
              </div>
              <button
                onClick={() => { setPerson(null); setShowSearch(true); }}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Đổi
              </button>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Tiêu đề <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: undefined })); }}
              placeholder="Ví dụ: Gọi điện chúc mừng sinh nhật"
              className={cn(
                'w-full px-4 py-3 bg-gray-50 border rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all',
                touched && errors.title ? 'border-red-300 bg-red-50' : 'border-gray-100'
              )}
              autoFocus
            />
            {touched && errors.title && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </p>
            )}
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
                onChange={(e) => { setDeadline(e.target.value); setErrors((prev) => ({ ...prev, deadline: undefined })); }}
                min={getTomorrow()}
                className={cn(
                  'w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all',
                  touched && errors.deadline ? 'border-red-300 bg-red-50' : 'border-gray-100'
                )}
                style={{ colorScheme: 'normal' }}
              />
            </div>
            {touched && errors.deadline && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.deadline}
              </p>
            )}
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all resize-none"
            />
          </div>

          {/* Quick deadlines */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Chọn nhanh</label>
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
        <div className="p-5 border-t border-amber-100 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(
              'w-full py-3 rounded-full font-semibold transition-all duration-300',
              !isLoading
                ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-white hover:from-amber-400 hover:to-amber-500 shadow-soft'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Đang lưu...' : 'Tạo lời hứa'}
          </button>
        </div>
      </div>
    </div>
  );
}
