'use client';

import { useState, useEffect } from 'react';
import { X, UserPlus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import StarRating from './StarRating';
import { showToast } from './Toast';
import { useTags } from '@/lib/hooks';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    relationshipType: string;
    tagIds?: string[];
    notes?: string;
  }) => void;
  isLoading?: boolean;
}

const RELATIONSHIP_TYPES = [
  { id: 'family', label: 'Gia đình', color: '#EF4444', icon: '👨‍👩‍👧‍👦' },
  { id: 'partner', label: 'Người yêu', color: '#EC4899', icon: '❤️' },
  { id: 'friend', label: 'Bạn bè', color: '#10B981', icon: '🤝' },
  { id: 'mentor', label: 'Mentor', color: '#8B5CF6', icon: '🎯' },
  { id: 'colleague', label: 'Đồng nghiệp', color: '#3B82F6', icon: '💼' },
  { id: 'client', label: 'Khách hàng', color: '#F59E0B', icon: '📈' },
  { id: 'neighbor', label: 'Hàng xóm', color: '#EAB308', icon: '🏠' },
  { id: 'other', label: 'Khác', color: '#6B7280', icon: '👤' },
];

// Default tags for demo mode
const DEFAULT_TAGS = [
  { id: 'tag-1', name: 'GiaDinh', color: '#EF4444', icon: '👨‍👩‍👧‍👦' },
  { id: 'tag-2', name: 'CongViec', color: '#3B82F6', icon: '💼' },
  { id: 'tag-3', name: 'TheThao', color: '#10B981', icon: '🏋️' },
  { id: 'tag-4', name: 'UET', color: '#8B5CF6', icon: '🎓' },
  { id: 'tag-5', name: 'Tech', color: '#6366F1', icon: '💻' },
  { id: 'tag-6', name: 'AI', color: '#EC4899', icon: '🤖' },
  { id: 'tag-7', name: 'Kaggle', color: '#20B2AA', icon: '📊' },
  { id: 'tag-8', name: 'Startup', color: '#F59E0B', icon: '🚀' },
  { id: 'tag-9', name: 'Gym', color: '#F97316', icon: '💪' },
  { id: 'tag-10', name: 'Mentor', color: '#A855F7', icon: '🎯' },
];

export default function AddPersonModal({ isOpen, onClose, onSubmit, isLoading = false }: AddPersonModalProps) {
  const [name, setName] = useState('');
  const [relationshipType, setRelationshipType] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);

  // Fetch tags from API or use defaults
  const { data: tags } = useTags();
  const availableTags = tags?.length ? tags : DEFAULT_TAGS;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setRelationshipType(null);
      setSelectedTagIds([]);
      setNotes('');
      setStep(1);
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

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      showToast('Vui lòng nhập tên', 'error');
      return;
    }
    if (!relationshipType) {
      showToast('Vui lòng chọn loại quan hệ', 'error');
      return;
    }

    onSubmit({
      name: name.trim(),
      relationshipType,
      tagIds: selectedTagIds,
      notes: notes.trim() || undefined,
    });
  };

  const canSubmit = name.trim() && relationshipType;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md border border-rose-100/50 rounded-[2.5rem] shadow-soft-lg animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-rose-100/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-300 to-rose-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Thêm người mới</h2>
              <p className="text-xs text-gray-500">Bước {step} / 2</p>
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
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* Step 1: Name & Relationship Type */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
                  autoFocus
                />
              </div>

              {/* Relationship Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-600">
                  Loại quan hệ <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {RELATIONSHIP_TYPES.map((type) => {
                    const isSelected = relationshipType === type.id;

                    return (
                      <button
                        key={type.id}
                        onClick={() => setRelationshipType(type.id)}
                        className={cn(
                          'flex items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 text-left',
                          isSelected
                            ? 'border-current'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        )}
                        style={{
                          borderColor: isSelected ? type.color : undefined,
                          backgroundColor: isSelected ? `${type.color}15` : undefined,
                        }}
                      >
                        <span className="text-lg">{type.icon}</span>
                        <span 
                          className={cn(
                            'text-sm font-medium',
                            isSelected ? '' : 'text-gray-600'
                          )}
                          style={{ color: isSelected ? type.color : undefined }}
                        >
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setStep(2)}
                disabled={!name.trim() || !relationshipType}
                className={cn(
                  'w-full py-3 rounded-full font-semibold transition-all duration-300',
                  name.trim() && relationshipType
                    ? 'bg-gradient-to-r from-rose-300 to-rose-400 text-white hover:from-rose-400 hover:to-rose-500 shadow-soft'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                Tiếp tục
              </button>
            </div>
          )}

          {/* Step 2: Tags & Notes */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Tags */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-600">
                  Tags <span className="text-gray-400">(tùy chọn)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag: any) => {
                    const isSelected = selectedTagIds.includes(tag.id);

                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                          isSelected
                            ? 'text-white shadow-soft'
                            : 'bg-gray-50 text-gray-600 border border-gray-100 hover:border-rose-200'
                        )}
                        style={{
                          backgroundColor: isSelected ? tag.color : undefined,
                        }}
                      >
                        <span className="mr-1">{tag.icon}</span>
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Ghi chú <span className="text-gray-400">(tùy chọn)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Thêm ghi chú về người này..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all resize-none"
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-full font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isLoading}
                  className={cn(
                    'flex-1 py-3 rounded-full font-semibold transition-all duration-300',
                    canSubmit && !isLoading
                      ? 'bg-gradient-to-r from-rose-300 to-rose-400 text-white hover:from-rose-400 hover:to-rose-500 shadow-soft'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  )}
                >
                  {isLoading ? 'Đang lưu...' : 'Thêm người'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="px-5 pb-4 flex-shrink-0">
          <div className="flex gap-2 justify-center">
            <div className={cn('w-2 h-2 rounded-full transition-colors', step === 1 ? 'bg-rose-400' : 'bg-gray-200')} />
            <div className={cn('w-2 h-2 rounded-full transition-colors', step === 2 ? 'bg-rose-400' : 'bg-gray-200')} />
          </div>
        </div>
      </div>
    </div>
  );
}
