'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Users, Filter, X, UserPlus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePeople, useCreatePerson, useTags, useCreateTag } from '@/lib/hooks';
import PersonCard from '@/components/PersonCard';
import AddPersonModal from '@/components/AddPersonModal';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import { showToast } from '@/components/Toast';
import EmptyState from '@/components/EmptyState';

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
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  // Fetch people from API
  const { data: people, isLoading } = usePeople();
  const createPerson = useCreatePerson();
  const { data: tags } = useTags();
  const createTag = useCreateTag();

  // Combine static relationship types with dynamic tags
  const allFilters = useMemo(() => {
    const staticTypes = RELATIONSHIP_FILTERS.map(f => ({ id: f.id, label: f.label, color: f.color, isTag: false }));
    const dynamicTags = (tags || []).map((t: any) => ({ id: `tag-${t.id}`, label: t.name, color: t.color, isTag: true }));
    return [...staticTypes, ...dynamicTags];
  }, [tags]);

  // Handle add tag
  const handleAddTag = () => {
    if (!newTagName.trim()) {
      showToast('Vui lòng nhập tên tag', 'error');
      return;
    }
    createTag.mutate({ name: newTagName.trim() });
    setNewTagName('');
    setShowAddTag(false);
  };

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

        // Type filter (relationship type or tag)
        if (typeFilter) {
          if (typeFilter.startsWith('tag-')) {
            // Filter by tag - check if person has this tag
            const tagId = typeFilter.replace('tag-', '');
            const hasTag = person.tags?.some((t: any) => t.tag?.id === tagId);
            if (!hasTag) return false;
          } else {
            // Filter by relationship type
            if (person.relationshipType !== typeFilter) {
              return false;
            }
          }
        }

        return true;
      })
      .sort((a: any, b: any) => {
        // Sort by status priority (fading first), then by score
        const statusOrder: Record<string, number> = { fading: 0, lost_contact: 1, stable: 2, growing: 3 };
        const statusDiff = (statusOrder[a.relationshipStatus] ?? 4) - (statusOrder[b.relationshipStatus] ?? 4);
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
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6">
      {/* Sidebar */}
      <Sidebar activeTab="people" />

      {/* Main Content - offset for sidebar */}
      <main className="ml-0 md:ml-20 p-4 md:p-6">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-gray-50/95 backdrop-blur-lg border-b border-gray-200 mb-4">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-md">
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
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
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
                className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all shadow-sm"
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
                  {(statusCounts as any)[filter.id] > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-black/10">
                      {(statusCounts as any)[filter.id]}
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
              {allFilters.map((filter) => (
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
              {/* Add Tag Button */}
              {showAddTag ? (
                <div className="flex-shrink-0 flex items-center gap-1">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(); if (e.key === 'Escape') { setShowAddTag(false); setNewTagName(''); } }}
                    placeholder="Tên tag..."
                    className="w-24 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
                    autoFocus
                  />
                  <button
                    onClick={handleAddTag}
                    className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddTag(true)}
                  className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-200"
                >
                  <Plus className="w-3 h-3" />
                  Thêm loại
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-4 md:px-6 py-4">
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
                <div key={i} className="bg-white border border-gray-100 rounded-3xl p-5 animate-pulse shadow-md">
                  <div className="w-full aspect-square rounded-2xl bg-gray-100 mb-4" />
                  <div className="h-4 bg-gray-100 rounded-xl mb-2" />
                  <div className="h-3 bg-gray-100 rounded-xl w-2/3" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredPeople.length === 0 && (
            hasActiveFilters ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md">
                <EmptyState.Search query={searchQuery} />
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md">
                <EmptyState.People onAction={() => setIsAddModalOpen(true)} />
              </div>
            )
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
        </div>
      </main>

      {/* Add Person Modal */}
      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddPerson}
        isLoading={createPerson.isPending}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
