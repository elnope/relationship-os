'use client';

import Link from 'next/link';
import { PlusCircle, TrendingUp, Calendar, Clock, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { cn, formatTimeAgo, getStrengthColor, getInteractionIcon } from '@/lib/utils';
import PersonCard from './PersonCard';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import ToastContainer from './Toast';
import { useDashboard, useCreateInteraction, usePeople } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

// Fallback data for when API is not available
const FALLBACK_USER = { name: 'Minh' };
const FALLBACK_NEEDS_ATTENTION = [
  { id: 'p-12', name: 'Emma Wilson', avatarUrl: null, relationshipStrengthScore: 18, tags: [{ id: 't1', name: 'Tech', color: '#6366F1' }, { id: 't2', name: 'AI', color: '#EC4899' }] },
  { id: 'p-10', name: 'Minh Đức', avatarUrl: null, relationshipStrengthScore: 28, tags: [{ id: 't3', name: 'UET', color: '#8B5CF6' }] },
  { id: 'p-11', name: 'Sarah Chen', avatarUrl: null, relationshipStrengthScore: 35, tags: [{ id: 't4', name: 'Startup', color: '#F59E0B' }] },
  { id: 'p-9', name: 'Khoa Pug', avatarUrl: null, relationshipStrengthScore: 45, tags: [] },
];

const FALLBACK_INTERACTIONS = [
  { id: '1', personName: 'Anh Tuấn', personId: 'p-3', type: 'coffee', rating: 5, note: 'Bàn về chiến lược thăng tiến trong team Kaggle', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: '2', personName: 'Nam Nguyễn', personId: 'p-2', type: 'call', rating: 5, note: 'Discussed sản phẩm mới, rất khả thi!', date: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: '3', personName: 'Thu Hà', personId: 'p-1', type: 'meal', rating: 4, note: 'Bữa tối cùng gia đình, nấu phở bò', date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: '4', personName: 'Lan Chi', personId: 'p-4', type: 'coffee', rating: 4, note: 'Pitch ý tưởng startup cho chị Lan', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: '5', personName: 'Hoàng Calisthenics', personId: 'p-5', type: 'activity', rating: 4, note: 'Tập xà đơn 30 phút, cải thiện nhiều', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
];

const FALLBACK_PROMISES = [
  { id: 'pr-1', title: 'Gửi tài liệu AI cho Lan Chi', personName: 'Lan Chi', deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
  { id: 'pr-2', title: 'Hẹn tập xà đơn cuối tuần', personName: 'Hoàng', deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
  { id: 'pr-3', title: 'Cà phê bàn chiến thuật', personName: 'Nam Nguyễn', deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
];

export default function Dashboard() {
  const router = useRouter();
  
  // Use React Query hooks
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();
  const { data: people } = usePeople();
  const createInteraction = useCreateInteraction();

  // Fall back to mock data if loading or no data
  const needsAttention = dashboard?.needsAttention || FALLBACK_NEEDS_ATTENTION;
  const recentInteractions = dashboard?.recentInteractions || FALLBACK_INTERACTIONS;
  const upcomingPromises = dashboard?.upcomingPromises || FALLBACK_PROMISES;
  const stats = dashboard?.stats || {
    totalPeople: 47,
    interactionsThisMonth: 23,
    pendingPromises: 3,
    growingCount: 15,
    fadingCount: 4,
  };

  const handleQuickAddSubmit = (data: {
    personId: string;
    interactionType: string;
    rating: number;
    quickTags?: string[];
    freeTextNote?: string;
  }) => {
    createInteraction.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F6]">
      {/* Sidebar - Hidden on mobile */}
      <Sidebar activeTab="home" />

      {/* Main Content */}
      <main className="ml-24 p-6 pb-24 md:pb-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                Xin chào, <span className="text-rose-500">{FALLBACK_USER.name}</span>! 👋
              </h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                {dashboardLoading ? 'Đang tải...' : 'Hôm nay là ngày tuyệt vời để kết nối'}
              </p>
            </div>
            
            {/* Stats - Hidden on small mobile */}
            <div className="hidden md:flex items-center gap-4">
              <StatCard 
                icon={<TrendingUp className="w-4 h-4" />}
                label="Tương tác tháng này"
                value={stats.interactionsThisMonth}
                color="rose"
              />
              <StatCard 
                icon={<Calendar className="w-4 h-4" />}
                label="Lời hứa đang chờ"
                value={stats.pendingPromises}
                color="amber"
              />
            </div>
          </div>
        </header>

        {/* Needs Attention Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Cần chú ý
            </h2>
            <Link href="/people?status=fading" className="text-sm text-rose-500 font-medium hover:text-rose-600 flex items-center gap-1">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            {needsAttention.map((person: any) => (
              <Link key={person.id} href={`/people/${person.id}`} className="flex-shrink-0 w-44 md:w-48">
                <PersonCard
                  name={person.name}
                  avatarUrl={person.avatarUrl}
                  tags={person.tags}
                  relationshipStrengthScore={person.relationshipStrengthScore}
                  relationshipStatus="fading"
                  size="md"
                />
              </Link>
            ))}
            
            {needsAttention.length === 0 && (
              <div className="w-full py-12 text-center text-gray-400">
                <Heart className="w-8 h-8 mx-auto mb-2 text-rose-300" />
                <p>Tuyệt vời! Tất cả mọi người đều khỏe mạnh 💪</p>
              </div>
            )}
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Interactions */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Tương tác gần đây</h2>
              <Link href="/people" className="text-sm text-rose-500 font-medium hover:text-rose-600 flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-[2rem] p-5 shadow-soft">
              <div className="space-y-3">
                {recentInteractions.map((interaction: any, index: number) => (
                  <Link
                    key={interaction.id}
                    href={`/people/${interaction.personId || interaction.person?.id || 'unknown'}`}
                    className={cn(
                      'flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl transition-all duration-200',
                      'hover:bg-rose-50/50 cursor-pointer group',
                      index === 0 && 'bg-rose-50/30 border border-rose-100/50'
                    )}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-rose-600 font-semibold text-xs md:text-sm">
                        {(interaction.personName || interaction.person?.name || '??')
                          .split(' ')
                          .slice(-1)[0]
                          .substring(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getInteractionIcon(interaction.interactionType || interaction.type)}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm md:text-base leading-tight">
                            {interaction.interactionType === 'coffee' && 'Cà phê với '}
                            {interaction.interactionType === 'call' && 'Gọi điện cho '}
                            {interaction.interactionType === 'meal' && 'Đi ăn với '}
                            {interaction.interactionType === 'chat' && 'Chat với '}
                            {interaction.interactionType === 'video_call' && 'Video call với '}
                            {interaction.interactionType === 'activity' && 'Tập gym với '}
                            {(interaction.type === 'coffee' || interaction.interactionType === 'coffee') && 'Cà phê với '}
                            {interaction.type === 'call' && 'Gọi điện cho '}
                            {interaction.type === 'meal' && 'Đi ăn với '}
                            {interaction.type === 'activity' && 'Tập gym với '}
                            {interaction.personName || interaction.person?.name || 'Unknown'}
                          </p>
                          {interaction.freeTextNote || interaction.note ? (
                            <p className="text-xs md:text-sm text-gray-500 truncate leading-relaxed">
                              {interaction.freeTextNote || interaction.note}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-0.5 text-rose-400">
                        {[...Array(interaction.rating)].map((_, i) => (
                          <span key={i} className="text-xs">★</span>
                        ))}
                        {[...Array(5 - interaction.rating)].map((_, i) => (
                          <span key={i} className="text-gray-200 text-xs">★</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(interaction.interactionDate || interaction.date)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar Widgets */}
          <section className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-[2rem] p-5 shadow-soft">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                Tổng quan
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Tổng số người</span>
                  <span className="font-semibold text-gray-800">{stats.totalPeople}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Đang phát triển</span>
                  <span className="font-semibold text-emerald-600">{stats.growingCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Cần chú ý</span>
                  <span className="font-semibold text-amber-600">{stats.fadingCount}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Xu hướng</span>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">+12%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Promises */}
            <div className="bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-[2rem] p-5 shadow-soft">
              <h3 className="font-semibold text-gray-800 mb-4">Lời hứa sắp tới</h3>
              <div className="space-y-3">
                {upcomingPromises.map((promise: any) => (
                  <div
                    key={promise.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50 hover:bg-rose-50/50 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm leading-tight">{promise.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">với {promise.personName}</p>
                    </div>
                    <span className="text-xs text-amber-600 font-medium whitespace-nowrap flex-shrink-0">
                      {Math.ceil((new Date(promise.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick tip - Mobile only */}
            <div className="md:hidden bg-gradient-to-br from-rose-100 to-rose-200/50 border border-rose-200 rounded-[1.5rem] p-4">
              <p className="text-sm text-rose-700 font-medium leading-relaxed">
                💡 Mẹo: Nhấn nút <span className="font-bold">+</span> bên dưới để nhanh chóng ghi lại tương tác!
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* FAB - Hidden on mobile, links to quick-add */}
      <Link
        href="/quick-add"
        className={cn(
          'fixed bottom-24 md:bottom-8 right-8 z-50 hidden md:flex',
          'w-16 h-16 rounded-full',
          'bg-gradient-to-br from-rose-400 to-rose-500',
          'hover:from-rose-500 hover:to-rose-600',
          'shadow-soft-lg hover:shadow-rose-200/50',
          'items-center justify-center',
          'transition-all duration-300 hover:scale-105 active:scale-95',
          'group'
        )}
      >
        <PlusCircle className="w-8 h-8 text-white" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-white text-sm font-medium text-gray-700 rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-soft border border-rose-100/50">
          Thêm tương tác
        </span>
      </Link>

      {/* Bottom Navigation - Mobile only */}
      <BottomNav />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: 'rose' | 'amber' | 'emerald' }) {
  const colorClasses = {
    rose: 'bg-rose-100 text-rose-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-2xl shadow-soft">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorClasses[color])}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
