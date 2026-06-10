'use client';

import { useState, useEffect } from 'react';
import { X, Coffee, Phone, Video, MessageCircle, UtensilsCrossed, Beer, Activity, Gift, Mail, MessageSquare, MoreHorizontal, Search } from 'lucide-react';
import { cn, getInteractionLabel } from '@/lib/utils';
import StarRating from './StarRating';
import { showToast } from './Toast';
import { usePeople } from '@/lib/hooks';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    personId: string;
    interactionType: string;
    rating: number;
    quickTags?: string[];
    freeTextNote?: string;
  }) => void;
}

interface QuickTag {
  id: string;
  label: string;
  emoji: string;
}

const INTERACTION_TYPES = [
  { id: 'coffee', icon: Coffee, label: 'Cà phê', color: 'bg-amber-100 text-amber-600 border-amber-200' },
  { id: 'call', icon: Phone, label: 'Gọi điện', color: 'bg-green-100 text-green-600 border-green-200' },
  { id: 'video_call', icon: Video, label: 'Video call', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { id: 'chat', icon: MessageCircle, label: 'Chat', color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { id: 'meal', icon: UtensilsCrossed, label: 'Đi ăn', color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { id: 'drinks', icon: Beer, label: 'Uống nước', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
  { id: 'activity', icon: Activity, label: 'Hoạt động', color: 'bg-pink-100 text-pink-600 border-pink-200' },
  { id: 'event', icon: Gift, label: 'Sự kiện', color: 'bg-rose-100 text-rose-600 border-rose-200' },
  { id: 'text', icon: MessageSquare, label: 'Nhắn tin', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  { id: 'email', icon: Mail, label: 'Email', color: 'bg-cyan-100 text-cyan-600 border-cyan-200' },
  { id: 'other', icon: MoreHorizontal, label: 'Khác', color: 'bg-gray-100 text-gray-600 border-gray-200' },
];

const QUICK_TAGS: QuickTag[] = [
  { id: 'thân_mật', label: 'Thân mật', emoji: '😊' },
  { id: 'chuyên_sâu', label: 'Chuyên sâu', emoji: '💭' },
  { id: 'công_việc', label: 'Công việc', emoji: '💼' },
  { id: 'vui_vẻ', label: 'Vui vẻ', emoji: '🎉' },
  { id: 'hỗ_trợ', label: 'Hỗ trợ', emoji: '🤝' },
  { id: 'kinh_doanh', label: 'Kinh doanh', emoji: '📈' },
  { id: 'catch_up', label: 'Catch up', emoji: '☕' },
  { id: 'kỷ_niệm', label: 'Kỷ niệm', emoji: '🎊' },
  { id: 'lên_kế_hoạch', label: 'Lên kế hoạch', emoji: '📋' },
  { id: 'networking', label: 'Networking', emoji: '🌐' },
];

// Default people for when API is not available
const DEFAULT_PEOPLE = [
  { id: 'p-1', name: 'Thu Hà', relationshipStrengthScore: 95, tag: 'Gia đình' },
  { id: 'p-2', name: 'Nam Nguyễn', relationshipStrengthScore: 85, tag: 'UET FC' },
  { id: 'p-3', name: 'Anh Tuấn', relationshipStrengthScore: 92, tag: 'Mentor' },
  { id: 'p-4', name: 'Lan Chi', relationshipStrengthScore: 78, tag: 'Startup' },
  { id: 'p-5', name: 'Hoàng Calisthenics', relationshipStrengthScore: 72, tag: 'Gym' },
  { id: 'p-6', name: 'Annie Phạm', relationshipStrengthScore: 68, tag: 'Tech' },
  { id: 'p-7', name: 'David Đặng', relationshipStrengthScore: 62, tag: 'Công việc' },
  { id: 'p-8', name: 'CEO Minh Phạm', relationshipStrengthScore: 58, tag: 'Khách hàng' },
  { id: 'p-9', name: 'Khoa Pug', relationshipStrengthScore: 45, tag: 'Hàng xóm' },
  { id: 'p-10', name: 'Minh Đức', relationshipStrengthScore: 38, tag: 'UET' },
  { id: 'p-11', name: 'Sarah Chen', relationshipStrengthScore: 35, tag: 'Partner' },
  { id: 'p-12', name: 'Emma Wilson', relationshipStrengthScore: 18, tag: 'Tech' },
];

export default function QuickAddModal({ isOpen, onClose, onSubmit }: QuickAddModalProps) {
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [rating, setRating] = useState(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch people from API or use defaults
  const { data: peopleData } = usePeople();
  const people = peopleData?.length ? peopleData : DEFAULT_PEOPLE;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPerson(null);
      setSelectedType(null);
      setRating(3);
      setSelectedTags([]);
      setNote('');
      setSearchQuery('');
      setShowSearch(false);
      setIsSubmitting(false);
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

  const filteredPeople = people.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedPerson || !selectedType) {
      showToast('Vui lòng chọn người và loại tương tác', 'error');
      return;
    }

    setIsSubmitting(true);
    
    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const interactionLabel = INTERACTION_TYPES.find(t => t.id === selectedType)?.label || 'tương tác';
    
    onSubmit({
      personId: selectedPerson.id,
      interactionType: selectedType,
      rating,
      quickTags: selectedTags,
      freeTextNote: note || undefined,
    });

    setIsSubmitting(false);
    onClose();
  };

  const canSubmit = selectedPerson && selectedType;

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
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedPerson ? 'Đánh giá tương tác' : 'Chọn người'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-rose-50 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* Step 1: Person Selection */}
          {showSearch || !selectedPerson ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người quen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
                  autoFocus={showSearch}
                />
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                {(searchQuery ? filteredPeople : people).map((person: any) => {
                  const initials = person.name.split(' ').slice(-1)[0].substring(0, 2).toUpperCase();
                  const isSelected = selectedPerson?.id === person.id;

                  return (
                    <button
                      key={person.id}
                      onClick={() => {
                        setSelectedPerson(person);
                        setShowSearch(false);
                      }}
                      className={cn(
                        'flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200',
                        isSelected
                          ? 'border-rose-400 bg-rose-50'
                          : 'border-gray-100 bg-white hover:border-rose-200 hover:bg-rose-50/50'
                      )}
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                        <span className="text-rose-600 font-semibold">{initials}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap block">{person.name}</span>
                        {(person.tag || person.tags?.[0]?.tag?.name) && (
                          <span className="text-xs text-gray-400">{person.tag || person.tags[0].tag.name}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Selected Person Display */
            <div 
              className="flex items-center gap-4 p-4 bg-rose-50/50 border border-rose-100 rounded-2xl cursor-pointer hover:bg-rose-100/50 transition-colors"
              onClick={() => setShowSearch(true)}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 flex items-center justify-center shadow-soft">
                <span className="text-white font-semibold">
                  {selectedPerson.name.split(' ').slice(-1)[0].substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{selectedPerson.name}</p>
                {selectedPerson.tag && (
                  <p className="text-sm text-gray-500">{selectedPerson.tag}</p>
                )}
              </div>
              <span className={cn(
                'px-3 py-1 rounded-full text-sm font-bold',
                selectedPerson.relationshipStrengthScore >= 80
                  ? 'bg-rose-100 text-rose-600'
                  : selectedPerson.relationshipStrengthScore >= 50
                  ? 'bg-emerald-100 text-emerald-600'
                  : selectedPerson.relationshipStrengthScore >= 20
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-gray-100 text-gray-500'
              )}>
                {selectedPerson.relationshipStrengthScore}
              </span>
            </div>
          )}

          {/* Step 2: Interaction Type */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">Loại tương tác</h3>
            <div className="grid grid-cols-4 gap-2">
              {INTERACTION_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200',
                      isSelected
                        ? `${type.color} border-current`
                        : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                    )}
                  >
                    <Icon className={cn('w-6 h-6', isSelected ? 'opacity-100' : 'text-gray-400')} />
                    <span className={cn('text-xs font-medium text-center', isSelected ? 'opacity-100' : 'text-gray-500')}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Rating */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">Mức độ kết nối</h3>
            <div className="flex items-center justify-center py-2">
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
          </div>

          {/* Step 4: Quick Tags */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">Tags nhanh</h3>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);

                return (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                      isSelected
                        ? 'bg-gradient-to-r from-rose-300 to-rose-400 text-white shadow-soft'
                        : 'bg-gray-50 text-gray-600 border border-gray-100 hover:border-rose-200 hover:bg-rose-50'
                    )}
                  >
                    <span className="mr-1">{tag.emoji}</span>
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Optional Note */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">Ghi chú (tùy chọn)</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Vài dòng về buổi gặp..."
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-rose-100/50 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className={cn(
              'w-full py-4 rounded-full font-semibold text-lg transition-all duration-300',
              canSubmit && !isSubmitting
                ? 'bg-gradient-to-r from-rose-300 to-rose-400 text-white hover:from-rose-400 hover:to-rose-500 shadow-soft-lg hover:shadow-rose-200/50 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu tương tác'}
          </button>
        </div>
      </div>
    </div>
  );
}
