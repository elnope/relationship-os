'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Edit3,
  Gift,
  CheckCircle,
  Circle,
  Sparkles,
  MoreVertical
} from 'lucide-react';
import { cn, formatTimeAgo, getInteractionIcon } from '@/lib/utils';
import { usePeople, useInteractions, usePromises, useCreateInteraction, useUpdateNotes, useTogglePromise, useUpdatePerson, useDeletePerson, useCreatePromise } from '@/lib/hooks';
import QuickAddModal from '@/components/QuickAddModal';
import AddPromiseModal from '@/components/AddPromiseModal';
import EditPersonModal from '@/components/EditPersonModal';
import ToastContainer from '@/components/Toast';

// Fallback data
const FALLBACK_PERSON = {
  id: 'unknown',
  name: 'Người dùng',
  avatarUrl: null,
  relationshipType: 'friend',
  relationshipStatus: 'stable' as const,
  relationshipStrengthScore: 50,
  notes: null as string | null,
  lastInteractionAt: null,
  tags: [] as Array<{ tag: { id: string; name: string; color: string; icon: string | null } }>,
};

const FALLBACK_INTERACTIONS = [
  { id: '1', interactionType: 'coffee', rating: 5, freeTextNote: 'Cà phê bàn về chiến lược', interactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: '2', interactionType: 'call', rating: 4, freeTextNote: 'Discussed sản phẩm mới', interactionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  { id: '3', interactionType: 'meal', rating: 5, freeTextNote: 'Bữa tối cùng gia đình', interactionDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
];

const TABS = [
  { id: 'history', label: 'Lịch sử', icon: Clock },
  { id: 'promises', label: 'Lời hứa', icon: Gift },
  { id: 'notes', label: 'Ghi chú', icon: Edit3 },
];

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const personId = params.id as string;

  const [activeTab, setActiveTab] = useState('history');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAddPromiseOpen, setIsAddPromiseOpen] = useState(false);
  const [isEditPersonOpen, setIsEditPersonOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Fetch data
  const { data: people } = usePeople();
  const { data: allInteractions } = useInteractions();
  const { data: promises } = usePromises();
  const createInteraction = useCreateInteraction();
  const updateNotes = useUpdateNotes();
  const togglePromise = useTogglePromise();
  const updatePerson = useUpdatePerson();
  const deletePerson = useDeletePerson();
  const createPromise = useCreatePromise();

  // Find this person
  const person = people?.find((p: any) => p.id === personId) || FALLBACK_PERSON;
  
  // Filter interactions for this person
  const interactions = allInteractions?.filter((i: any) => 
    i.personId === personId || i.person?.id === personId
  ) || FALLBACK_INTERACTIONS;

  // Filter promises for this person (for this person only)
  const personPromises = promises?.filter((p: any) => 
    p.personId === personId || p.person?.id === personId
  ) || [];

  // Sync notes from person
  useEffect(() => {
    if (person?.notes) {
      setNotes(person.notes);
    }
  }, [person?.notes]);

  // Handle Quick Add Submit
  const handleQuickAddSubmit = (data: any) => {
    createInteraction.mutate({
      ...data,
      personId,
    });
  };

  // Handle Add Promise
  const handleAddPromise = (data: { title: string; deadline: string; description?: string }) => {
    createPromise.mutate({
      personId,
      ...data,
    });
    setIsAddPromiseOpen(false);
  };

  // Handle Notes Save
  const handleSaveNotes = () => {
    updateNotes.mutate({ personId, notes });
    setIsEditingNotes(false);
  };

  // Handle Promise Toggle
  const handleTogglePromise = (promiseId: string, currentStatus: boolean) => {
    togglePromise.mutate({ id: promiseId, isCompleted: !currentStatus });
  };

  // Handle Edit Person
  const handleEditPerson = (data: any) => {
    updatePerson.mutate({ id: personId, ...data });
    setIsEditPersonOpen(false);
  };

  // Handle Delete Person
  const handleDeletePerson = () => {
    deletePerson.mutate(personId, {
      onSuccess: () => {
        router.push('/people');
      },
    });
  };

  // Get initials for avatar
  const initials = person.name
    .split(' ')
    .slice(-1)[0]
    .substring(0, 2)
    .toUpperCase();

  // Get status colors
  const statusColors = {
    growing: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    stable: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    fading: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    lost_contact: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  };
  const colors = statusColors[person.relationshipStatus as keyof typeof statusColors] || statusColors.stable;

  // Status labels
  const statusLabels = {
    growing: 'Đang phát triển',
    stable: 'Ổn định',
    fading: 'Đang nhạt dần',
    lost_contact: 'Mất liên lạc',
  };

  // Interaction type labels
  const interactionLabels: Record<string, string> = {
    coffee: 'Cà phê',
    call: 'Gọi điện',
    video_call: 'Video call',
    chat: 'Chat',
    meal: 'Đi ăn',
    drinks: 'Uống nước',
    activity: 'Hoạt động',
    event: 'Sự kiện',
    gift: 'Quà tặng',
    text: 'Nhắn tin',
    email: 'Email',
    other: 'Khác',
  };

  return (
    <div className="min-h-screen bg-[#FFF5F6] pb-24 md:pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFF5F6]/95 backdrop-blur-lg border-b border-rose-100/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white border border-rose-100 flex items-center justify-center hover:bg-rose-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-gray-500 font-medium">Hồ sơ</span>
          
          {/* Edit button */}
          <button
            onClick={() => setIsEditPersonOpen(true)}
            className="ml-auto w-10 h-10 rounded-2xl bg-white border border-rose-100 flex items-center justify-center hover:bg-rose-50 transition-colors"
          >
            <Edit3 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Profile Section */}
      <section className="px-4 md:px-6 py-6">
        <div className="bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-[2rem] p-6 shadow-soft">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center mb-6">
            {/* Avatar */}
            <div className="relative mb-4">
              <div 
                className={cn(
                  'w-28 h-28 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br from-rose-300 to-rose-400',
                  'shadow-soft-lg ring-4 ring-offset-4',
                )}
              >
                <span className="text-white font-bold text-3xl">{initials}</span>
              </div>
              {/* Strength indicator */}
              <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white border-2 shadow-md flex items-center justify-center"
                style={{ borderColor: colors.text.includes('emerald') ? '#10B981' : colors.text.includes('amber') ? '#F59E0B' : colors.text.includes('gray') ? '#6B7280' : '#3B82F6' }}
              >
                <span className="text-xs font-bold">{person.relationshipStrengthScore}</span>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold text-gray-800 text-center">{person.name}</h1>
            
            {/* Status Badge */}
            <span className={cn(
              'mt-2 px-4 py-1 rounded-full text-sm font-medium border',
              colors.bg, colors.text, colors.border
            )}>
              {statusLabels[person.relationshipStatus as keyof typeof statusLabels]}
            </span>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {person.tags?.map((tag: any, index: number) => (
                <span
                  key={tag.tag?.id || index}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${tag.tag?.color || tag.color}20`, color: tag.tag?.color || tag.color }}
                >
                  {tag.tag?.icon || tag.icon} {tag.tag?.name || tag.name}
                </span>
              ))}
              {(!person.tags || person.tags.length === 0) && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500">
                  Không có tags
                </span>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50/50 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-800">{interactions.length}</p>
              <p className="text-xs text-gray-500">Tương tác</p>
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {person.lastInteractionAt 
                  ? formatTimeAgo(new Date(person.lastInteractionAt))
                  : 'Chưa có'
                }
              </p>
              <p className="text-xs text-gray-500">Lần cuối</p>
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-800">{personPromises.length}</p>
              <p className="text-xs text-gray-500">Lời hứa</p>
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className={cn(
              'w-full py-4 rounded-full font-semibold text-lg',
              'bg-gradient-to-r from-rose-300 to-rose-400',
              'text-white shadow-soft-lg',
              'hover:from-rose-400 hover:to-rose-500',
              'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
              'flex items-center justify-center gap-2'
            )}
          >
            <span className="text-xl">+</span>
            Thêm tương tác
          </button>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4 md:px-6">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white text-gray-800 shadow-soft border border-rose-100/50'
                    : 'text-gray-500 hover:bg-white/50'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-4 md:px-6 pb-6">
        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-[2rem] p-5 shadow-soft">
            {interactions.length === 0 ? (
              <div className="py-8 text-center">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Chưa có tương tác nào</p>
                <button
                  onClick={() => setIsQuickAddOpen(true)}
                  className="mt-3 text-rose-500 font-medium hover:text-rose-600"
                >
                  Thêm tương tác đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Timeline */}
                <div className="relative pl-4">
                  {/* Timeline line */}
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-rose-200 via-rose-300 to-transparent rounded-full" />
                  
                  {interactions.map((interaction: any, index: number) => (
                    <div key={interaction.id} className="relative pl-8 pb-6 last:pb-0">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-white border-2 border-rose-300 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                      </div>

                      {/* Content */}
                      <div className="bg-gray-50/50 rounded-2xl p-4 hover:bg-rose-50/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {getInteractionIcon(interaction.interactionType)}
                            </span>
                            <span className="font-medium text-gray-800">
                              {interactionLabels[interaction.interactionType] || interactionLabels.other}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 text-rose-400">
                            {[...Array(interaction.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        
                        {interaction.freeTextNote && (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {interaction.freeTextNote}
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTimeAgo(interaction.interactionDate || interaction.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Promises Tab */}
        {activeTab === 'promises' && (
          <div className="space-y-4">
            {/* Add Promise Button */}
            <button
              onClick={() => setIsAddPromiseOpen(true)}
              className={cn(
                'w-full py-3 rounded-2xl font-medium',
                'bg-gradient-to-r from-amber-100 to-amber-50',
                'border border-amber-200',
                'text-amber-700',
                'hover:from-amber-200 hover:to-amber-100',
                'transition-all duration-200',
                'flex items-center justify-center gap-2'
              )}
            >
              <Gift className="w-5 h-5" />
              Thêm lời hứa
            </button>

            {/* Promises List */}
            <div className="bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-[2rem] p-5 shadow-soft">
              {personPromises.length === 0 ? (
                <div className="py-8 text-center">
                  <Gift className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Không có lời hứa nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {personPromises.map((promise: any) => (
                    <div
                      key={promise.id}
                      className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl hover:bg-rose-50/30 transition-colors"
                    >
                      <button
                        onClick={() => handleTogglePromise(promise.id, promise.isCompleted)}
                        className="mt-0.5 flex-shrink-0"
                        disabled={togglePromise.isPending}
                      >
                        {promise.isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-300 hover:text-rose-400 transition-colors" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'font-medium leading-tight',
                          promise.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
                        )}>
                          {promise.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Hạn: {new Date(promise.deadline).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      {!promise.isCompleted && (
                        <span className="text-xs text-amber-600 font-medium whitespace-nowrap">
                          {Math.ceil((new Date(promise.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-[2rem] p-5 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                Ghi chú cá nhân
              </h3>
              <button
                onClick={() => {
                  if (isEditingNotes) {
                    handleSaveNotes();
                  } else {
                    setIsEditingNotes(true);
                  }
                }}
                disabled={updateNotes.isPending}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isEditingNotes 
                    ? 'text-emerald-500 hover:text-emerald-600' 
                    : 'text-rose-500 hover:text-rose-600'
                )}
              >
                {updateNotes.isPending ? 'Đang lưu...' : isEditingNotes ? 'Lưu' : 'Chỉnh sửa'}
              </button>
            </div>
            
            {isEditingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Thêm ghi chú về người này..."
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all resize-none"
              />
            ) : (
              <div className="min-h-[120px]">
                {notes ? (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{notes}</p>
                ) : (
                  <p className="text-gray-400 italic">
                    Nhấn "Chỉnh sửa" để thêm ghi chú về người này. Ví dụ: "Thích ăn cay", "Đang học IELTS", "Sinh nhật: 15/03"
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Modals */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSubmit={handleQuickAddSubmit}
      />

      <AddPromiseModal
        isOpen={isAddPromiseOpen}
        onClose={() => setIsAddPromiseOpen(false)}
        onSubmit={handleAddPromise}
        isLoading={createPromise.isPending}
        personName={person.name}
      />

      <EditPersonModal
        isOpen={isEditPersonOpen}
        onClose={() => setIsEditPersonOpen(false)}
        onSubmit={handleEditPerson}
        onDelete={handleDeletePerson}
        isLoading={updatePerson.isPending}
        isDeleting={deletePerson.isPending}
        person={person}
      />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
