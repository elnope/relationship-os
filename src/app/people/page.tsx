'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Users, Filter, X, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePeople, useCreatePerson } from '@/lib/hooks';
import PersonCard from '@/components/PersonCard';
import AddPersonModal from '@/components/AddPersonModal';

const FILTER_OPTIONS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'growing', label: 'Đang phát triển', color: 'emerald' },
  { id: 'stable', label: 'Ổn định', color: 'blue' },
  { id: 'fading', label: 'Đang nhạt dần', color: 'amber' },
  { id: 'lost_contact', label: 'Mất liên lạc', color: 'gray' },
];

const RELATIONSHIP_FILTERS = [
  { id: 'family', label: 'Gia đình', color: '#EF4444' },
  { id: 'friend', label: 'Bạn bè', color: '#10B981' },
  { id: 'colleague', label: 'Đồng nghiệp', color: '#3B82F6' },
  { id: 'mentor', label: 'Mentor', color: '#8B5CF6' },
  { id: 'client', label: 'Khách hàng', color: '#F59E0B' },
  { id: 'other', label: 'Khác', color: '#6B7280' },
];

export default function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch people from API
  const { data: people, isLoading } = usePeople();
  const createPerson = useCreatePerson();

  // Filter and sort people
  const filteredPeople = useMemo(() => {
    if (!people) return [];

    return people
      .filter((person: any) => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesName = person.name.toLowerCase().includes(query);
          const matchesTags = person.tags?.some((t: any) => 
            t.tag?.name?.toLowerCase().includes(query)
          );
          if (!matchesName && !matchesTags) return false;
        }

        // Status filter
        if (statusFilter !== 'all' && person.relationshipStatus !== statusFilter) {
          return false;
        }

        // Type filter
        if (typeFilter && person.relationshipType !== typeFilter) {
          return false;
        }

        return true;
      })
      .sort((a: any, b: any) => {
        // Sort by status priority (fading first), then by score
        const statusOrder = { fading: 0, lost_contact: 1, stable: 2, growing: 3 };
        const statusDiff = statusOrder[a.relationshipStatus] - statusOrder[b.relationshipStatus];
        if (statusDiff !== 0) return statusDiff;
        return b.relationshipStrengthScore - a.relationshipStrengthScore;
      });
  }, [people, searchQuery, statusFilter, typeFilter]);

  // Count by status
  const statusCounts = useMemo(() => {
    if (!people) return {};
    return {
      all: people.length,
      growing: people.filter((p: any) => p.relationshipStatus === 'growing').length,
      stable: people.filter((p: any) => p.relationshipStatus === 'stable').length,
      fading: people.filter((p: any) => p.relationshipStatus === 'fading').length,
      lost_contact: people.filter((p: any) => p.relationshipStatus === 'lost_contact').length,
    };
  }, [people]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter(null);
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || typeFilter;

  // Handle add person
  const handleAddPerson = (data: {
    name: string;
    relationshipType: string;
    tagIds?: string[];
    notes?: string;
  }) => {
    createPerson.mutate(data);
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F6] pb-24 md:pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFF5F6]/95 backdrop-blur-lg border-b border-rose-100/50">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-300 to-rose-400 flex items-center justify-center shadow-soft">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Mối quan hệ</h1>
                <p className="text-sm text-gray-500">
                  {statusCounts.all || 0} người trong danh sách
                </p>
              </div>
            </div>
            
            {/* Add Person Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-300 to-rose-400 text-white rounded-2xl font-medium shadow-soft hover:from-rose-400 hover:to-rose-500 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Thêm</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-100 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all shadow-soft"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="px-4 md:px-6 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  statusFilter === filter.id
                    ? filter.color === 'emerald'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : filter.color === 'blue'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : filter.color === 'amber'
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : filter.color === 'gray'
                      ? 'bg-gray-100 text-gray-600 border border-gray-200'
                      : 'bg-gradient-to-r from-rose-300 to-rose-400 text-white shadow-soft'
                    : 'bg-white text-gray-600 border border-gray-100 hover:border-rose-200 hover:bg-rose-50'
                )}
              >
                {filter.label}
                {statusCounts[filter.id as keyof typeof statusCounts] > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-black/10">
                    {statusCounts[filter.id as keyof typeof statusCounts]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter - Secondary */}
        <div className="px-4 md:px-6 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setTypeFilter(null)}
              className={cn(
                'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                !typeFilter
                  ? 'bg-gray-100 text-gray-700 border border-gray-200'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Filter className="w-3 h-3" />
              Tất cả loại
            </button>
            {RELATIONSHIP_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTypeFilter(typeFilter === filter.id ? null : filter.id)}
                className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                  typeFilter === filter.id
                    ? 'text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50'
                )}
                style={{
                  backgroundColor: typeFilter === filter.id ? filter.color : undefined,
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 md:px-6 py-4">
        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between mb-4 px-3 py-2 bg-rose-50/50 rounded-2xl border border-rose-100">
            <span className="text-sm text-rose-600">
              Hiển thị {filteredPeople.length} / {people?.length || 0} người
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-rose-500 font-medium hover:text-rose-600"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/80 border border-rose-100/50 rounded-[2rem] p-5 animate-pulse">
                <div className="w-full aspect-square rounded-3xl bg-gray-100 mb-4" />
                <div className="h-4 bg-gray-100 rounded-xl mb-2" />
                <div className="h-3 bg-gray-100 rounded-xl w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPeople.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {hasActiveFilters ? 'Không tìm thấy' : 'Chưa có ai trong danh sách'}
            </h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              {hasActiveFilters
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc'
                : 'Bắt đầu thêm những người quan trọng trong cuộc sống của bạn'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-rose-100 text-rose-600 rounded-full font-medium hover:bg-rose-200 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* People Grid */}
        {!isLoading && filteredPeople.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPeople.map((person: any) => (
              <Link key={person.id} href={`/people/${person.id}`}>
                <PersonCard
                  name={person.name}
                  avatarUrl={person.avatarUrl}
                  tags={person.tags?.map((t: any) => t.tag) || []}
                  relationshipStrengthScore={person.relationshipStrengthScore}
                  relationshipStatus={person.relationshipStatus}
                  size="lg"
                />
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Add Person Modal */}
      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddPerson}
        isLoading={createPerson.isPending}
      />
    </div>
  );
}
