'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/components/Toast';

// Check if we're in demo mode (no DATABASE_URL)
const isDemoMode = () => !process.env.NEXT_PUBLIC_DATABASE_URL;

// API base URL
const API_BASE = '/api';

// Query Keys
export const queryKeys = {
  people: ['people'] as const,
  person: (id: string) => ['people', id] as const,
  interactions: (personId?: string) => ['interactions', personId] as const,
  dashboard: ['dashboard'] as const,
  tags: ['tags'] as const,
  promises: ['promises'] as const,
};

// Types
export interface Person {
  id: string;
  name: string;
  avatarUrl: string | null;
  relationshipType: string;
  relationshipStatus: 'growing' | 'stable' | 'fading' | 'lost_contact';
  relationshipStrengthScore: number;
  notes?: string | null;
  lastInteractionAt: string | null;
  tags: Array<{ tag: { id: string; name: string; color: string; icon: string | null } }>;
}

export interface Interaction {
  id: string;
  personId: string;
  personName?: string;
  interactionType: string;
  rating: number;
  quickTags: string[];
  freeTextNote: string | null;
  interactionDate: string;
  createdAt: string;
  person?: {
    id: string;
    name: string;
    relationshipStrengthScore: number;
  };
}

export interface PromiseReminder {
  id: string;
  title: string;
  description?: string | null;
  deadline: string;
  isCompleted: boolean;
  completedAt?: string | null;
  personId: string;
  person?: {
    id: string;
    name: string;
  };
}

export interface DashboardStats {
  totalPeople: number;
  growingCount: number;
  stableCount: number;
  fadingCount: number;
  lostContactCount: number;
  interactionsThisMonth: number;
  pendingPromises: number;
}

export interface Dashboard {
  stats: DashboardStats;
  needsAttention: Person[];
  recentInteractions: Interaction[];
  upcomingPromises: Array<{
    id: string;
    title: string;
    personName: string;
    deadline: string;
  }>;
}

// API Response type
interface ApiResponse<T> {
  data: T | null;
  meta: any;
  error: { code: string; message: string } | null;
}

// ============================================================================
// API HELPERS
// ============================================================================

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const result: ApiResponse<T> = await response.json();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data as T;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Fetch dashboard data (stats, needs attention, recent interactions)
 */
export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async (): Promise<Dashboard> => {
      if (isDemoMode()) {
        const data = await fetchApi<Dashboard>('/demo?type=dashboard');
        return data;
      }
      return await fetchApi<Dashboard>('/dashboard');
    },
    refetchInterval: 30000,
  });
}

/**
 * Fetch all people
 */
export function usePeople() {
  return useQuery({
    queryKey: queryKeys.people,
    queryFn: async (): Promise<Person[]> => {
      if (isDemoMode()) {
        return await fetchApi<Person[]>('/demo?type=people');
      }
      return await fetchApi<Person[]>('/people');
    },
  });
}

/**
 * Create interaction with optimistic update
 * This is the core mutation that powers the QuickAddModal
 */
export function useCreateInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      personId: string;
      interactionType: string;
      rating: number;
      quickTags?: string[];
      freeTextNote?: string;
    }) => {
      if (isDemoMode()) {
        return await fetchApi<any>('/demo', {
          method: 'POST',
          body: JSON.stringify(input),
        });
      }
      return await fetchApi<any>('/interactions', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },

    onMutate: async (newInteraction) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.dashboard });
      await queryClient.cancelQueries({ queryKey: queryKeys.people });

      const previousDashboard = queryClient.getQueryData<Dashboard>(queryKeys.dashboard);
      const previousPeople = queryClient.getQueryData<Person[]>(queryKeys.people);

      const person = previousPeople?.find(p => p.id === newInteraction.personId);
      const personName = person?.name || 'Unknown';

      const optimisticInteraction: Interaction = {
        id: `temp-${Date.now()}`,
        personId: newInteraction.personId,
        personName,
        interactionType: newInteraction.interactionType,
        rating: newInteraction.rating,
        quickTags: newInteraction.quickTags || [],
        freeTextNote: newInteraction.freeTextNote || null,
        interactionDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Dashboard>(queryKeys.dashboard, (old) => {
        if (!old) return old;
        return {
          ...old,
          stats: {
            ...old.stats,
            interactionsThisMonth: old.stats.interactionsThisMonth + 1,
          },
          recentInteractions: [
            optimisticInteraction,
            ...old.recentInteractions.slice(0, 9),
          ],
        };
      });

      return { previousDashboard, previousPeople };
    },

    onError: (_err, _newInteraction, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(queryKeys.dashboard, context.previousDashboard);
      }
      if (context?.previousPeople) {
        queryClient.setQueryData(queryKeys.people, context.previousPeople);
      }
      showToast('Không thể lưu tương tác', 'error');
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      
      if (data?.meta?.scoreChange !== undefined) {
        const change = data.meta.scoreChange;
        showToast(`📈 Đã lưu! Điểm: ${data.meta.newScore} (${change > 0 ? '+' : ''}${change})`, 'success');
      } else {
        showToast('Đã lưu tương tác!', 'success');
      }
    },
  });
}

/**
 * Create a new person
 */
export function useCreatePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      relationshipType: string;
      tagIds?: string[];
      notes?: string;
    }) => {
      if (isDemoMode()) {
        // In demo mode, add to the demo data store
        const { createPerson: createDemoPerson } = await import('@/lib/demo');
        return createDemoPerson(input);
      }
      return await fetchApi<Person>('/people', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },

    onMutate: async (newPerson) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.people });
      await queryClient.cancelQueries({ queryKey: queryKeys.dashboard });

      const previousPeople = queryClient.getQueryData<Person[]>(queryKeys.people);

      // Optimistic person
      const optimisticPerson: Person = {
        id: `temp-${Date.now()}`,
        name: newPerson.name,
        avatarUrl: null,
        relationshipType: newPerson.relationshipType,
        relationshipStatus: 'stable',
        relationshipStrengthScore: 50,
        notes: newPerson.notes || null,
        lastInteractionAt: null,
        tags: [],
      };

      queryClient.setQueryData<Person[]>(queryKeys.people, (old) => {
        if (!old) return [optimisticPerson];
        return [optimisticPerson, ...old];
      });

      return { previousPeople };
    },

    onError: (_err, _newPerson, context) => {
      if (context?.previousPeople) {
        queryClient.setQueryData(queryKeys.people, context.previousPeople);
      }
      showToast('Không thể thêm người', 'error');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      showToast('Đã thêm người mới! 🎉', 'success');
    },
  });
}

/**
 * Update person's notes
 */
export function useUpdateNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ personId, notes }: { personId: string; notes: string }) => {
      if (isDemoMode()) {
        // In demo mode, update local state
        return { personId, notes };
      }
      return await fetchApi<{ id: string; notes: string }>(`/people/${personId}/notes`, {
        method: 'PATCH',
        body: JSON.stringify({ notes }),
      });
    },

    onMutate: async ({ personId, notes }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.person(personId) });
      await queryClient.cancelQueries({ queryKey: queryKeys.people });

      const previousPeople = queryClient.getQueryData<Person[]>(queryKeys.people);

      // Optimistically update in people list
      queryClient.setQueryData<Person[]>(queryKeys.people, (old) => {
        if (!old) return old;
        return old.map(p => p.id === personId ? { ...p, notes } : p);
      });

      return { previousPeople };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousPeople) {
        queryClient.setQueryData(queryKeys.people, context.previousPeople);
      }
      showToast('Không thể lưu ghi chú', 'error');
    },

    onSuccess: () => {
      showToast('Đã lưu ghi chú!', 'success');
    },
  });
}

/**
 * Toggle promise completion
 */
export function useTogglePromise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      if (isDemoMode()) {
        // In demo mode, update local state
        return { id, isCompleted };
      }
      return await fetchApi<PromiseReminder>('/promises', {
        method: 'PATCH',
        body: JSON.stringify({ id, isCompleted }),
      });
    },

    onMutate: async ({ id, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.promises });
      await queryClient.cancelQueries({ queryKey: queryKeys.dashboard });

      const previousPromises = queryClient.getQueryData<PromiseReminder[]>(queryKeys.promises);
      const previousDashboard = queryClient.getQueryData<Dashboard>(queryKeys.dashboard);

      // Optimistically update in promises list
      queryClient.setQueryData<PromiseReminder[]>(queryKeys.promises, (old) => {
        if (!old) return old;
        return old.map(p => p.id === id ? { ...p, isCompleted } : p);
      });

      // Optimistically update dashboard promises count
      queryClient.setQueryData<Dashboard>(queryKeys.dashboard, (old) => {
        if (!old) return old;
        const delta = isCompleted ? -1 : 1;
        return {
          ...old,
          stats: {
            ...old.stats,
            pendingPromises: Math.max(0, old.stats.pendingPromises + delta),
          },
        };
      });

      return { previousPromises, previousDashboard };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousPromises) {
        queryClient.setQueryData(queryKeys.promises, context.previousPromises);
      }
      if (context?.previousDashboard) {
        queryClient.setQueryData(queryKeys.dashboard, context.previousDashboard);
      }
      showToast('Không thể cập nhật lời hứa', 'error');
    },

    onSuccess: (data, variables) => {
      if (variables.isCompleted) {
        showToast('✅ Đã hoàn thành lời hứa!', 'success');
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.promises });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

/**
 * Fetch interactions for a specific person
 */
export function useInteractions(personId?: string) {
  return useQuery({
    queryKey: queryKeys.interactions(personId),
    queryFn: async (): Promise<Interaction[]> => {
      if (isDemoMode()) {
        const data = await fetchApi<Dashboard>('/demo?type=dashboard');
        return data?.recentInteractions || [];
      }
      const endpoint = personId 
        ? `/interactions?personId=${personId}` 
        : '/interactions';
      return await fetchApi<Interaction[]>(endpoint);
    },
  });
}

/**
 * Fetch tags
 */
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: async () => {
      if (isDemoMode()) {
        return [
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
      }
      return await fetchApi<any[]>('/tags');
    },
  });
}

/**
 * Fetch promises
 */
export function usePromises(options: { personId?: string; status?: 'pending' | 'completed' } = {}) {
  return useQuery({
    queryKey: [...queryKeys.promises, options],
    queryFn: async (): Promise<PromiseReminder[]> => {
      if (isDemoMode()) {
        const data = await fetchApi<Dashboard>('/demo?type=dashboard');
        return data?.upcomingPromises.map(p => ({
          ...p,
          isCompleted: false,
          personId: '',
          description: null,
          completedAt: null,
        })) || [];
      }
      
      let endpoint = '/promises';
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.personId) params.append('personId', options.personId);
      if (params.toString()) endpoint += `?${params.toString()}`;
      
      return await fetchApi<PromiseReminder[]>(endpoint);
    },
  });
}

/**
 * Update person details
 */
export function useUpdatePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { 
      id: string;
      name?: string;
      relationshipType?: string;
      tagIds?: string[];
      notes?: string;
    }) => {
      if (isDemoMode()) {
        // In demo mode, update local state
        const { updatePerson } = await import('@/lib/demo');
        return updatePerson(id, data);
      }
      return await fetchApi<Person>(`/people/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    onMutate: async ({ id, ...newData }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.people });
      await queryClient.cancelQueries({ queryKey: queryKeys.person(id) });

      const previousPeople = queryClient.getQueryData<Person[]>(queryKeys.people);

      // Optimistically update in people list
      queryClient.setQueryData<Person[]>(queryKeys.people, (old) => {
        if (!old) return old;
        return old.map(p => p.id === id ? { ...p, ...newData } : p);
      });

      return { previousPeople };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousPeople) {
        queryClient.setQueryData(queryKeys.people, context.previousPeople);
      }
      showToast('Không thể cập nhật thông tin', 'error');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      showToast('Đã cập nhật thông tin!', 'success');
    },
  });
}

/**
 * Delete a person
 */
export function useDeletePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemoMode()) {
        // In demo mode, remove from local state
        const { deletePerson } = await import('@/lib/demo');
        return deletePerson(id);
      }
      return await fetchApi<{ deleted: boolean }>(`/people/${id}`, {
        method: 'DELETE',
      });
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.people });
      await queryClient.cancelQueries({ queryKey: queryKeys.dashboard });

      const previousPeople = queryClient.getQueryData<Person[]>(queryKeys.people);

      // Optimistically remove from people list
      queryClient.setQueryData<Person[]>(queryKeys.people, (old) => {
        if (!old) return old;
        return old.filter(p => p.id !== id);
      });

      return { previousPeople };
    },

    onError: (_err, _id, context) => {
      if (context?.previousPeople) {
        queryClient.setQueryData(queryKeys.people, context.previousPeople);
      }
      showToast('Không thể xóa người này', 'error');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      showToast('Đã xóa người này', 'success');
    },
  });
}

/**
 * Create a new promise
 */
export function useCreatePromise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      personId: string;
      title: string;
      deadline: string;
      description?: string;
    }) => {
      if (isDemoMode()) {
        // In demo mode, add to local state
        const { createPromise } = await import('@/lib/demo');
        return createPromise(input);
      }
      return await fetchApi<PromiseReminder>('/promises', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },

    onMutate: async (newPromise) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.promises });
      await queryClient.cancelQueries({ queryKey: queryKeys.dashboard });

      const previousPromises = queryClient.getQueryData<PromiseReminder[]>(queryKeys.promises);
      const previousDashboard = queryClient.getQueryData<Dashboard>(queryKeys.dashboard);

      // Optimistic promise
      const optimisticPromise: PromiseReminder = {
        id: `temp-${Date.now()}`,
        title: newPromise.title,
        description: newPromise.description || null,
        deadline: new Date(newPromise.deadline).toISOString(),
        isCompleted: false,
        completedAt: null,
        personId: newPromise.personId,
        person: undefined,
      };

      // Optimistically add to promises list
      queryClient.setQueryData<PromiseReminder[]>(queryKeys.promises, (old) => {
        if (!old) return [optimisticPromise];
        return [optimisticPromise, ...old];
      });

      // Update dashboard
      queryClient.setQueryData<Dashboard>(queryKeys.dashboard, (old) => {
        if (!old) return old;
        return {
          ...old,
          stats: {
            ...old.stats,
            pendingPromises: old.stats.pendingPromises + 1,
          },
        };
      });

      return { previousPromises, previousDashboard };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousPromises) {
        queryClient.setQueryData(queryKeys.promises, context.previousPromises);
      }
      if (context?.previousDashboard) {
        queryClient.setQueryData(queryKeys.dashboard, context.previousDashboard);
      }
      showToast('Không thể tạo lời hứa', 'error');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promises });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      showToast('Đã thêm lời hứa mới!', 'success');
    },
  });
}
