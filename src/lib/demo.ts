/**
 * Demo Mode Data Provider
 * 
 * Provides mock data when no database is configured.
 * This allows the app to be fully interactive without a PostgreSQL connection.
 */

import { v4 as uuidv4 } from 'uuid';

// Types (simplified versions for demo mode)
export interface DemoPerson {
  id: string;
  name: string;
  avatarUrl: string | null;
  relationshipType: string;
  relationshipStatus: 'growing' | 'stable' | 'fading' | 'lost_contact';
  relationshipStrengthScore: number;
  lastInteractionAt: Date | null;
  tags: Array<{ tag: { id: string; name: string; color: string; icon: string | null } }>;
}

export interface DemoInteraction {
  id: string;
  personId: string;
  personName: string;
  interactionType: string;
  rating: number;
  quickTags: string[];
  freeTextNote: string | null;
  interactionDate: Date;
  createdAt: Date;
}

export interface DemoDashboard {
  stats: {
    totalPeople: number;
    growingCount: number;
    stableCount: number;
    fadingCount: number;
    lostContactCount: number;
    interactionsThisMonth: number;
    pendingPromises: number;
  };
  needsAttention: DemoPerson[];
  recentInteractions: DemoInteraction[];
  upcomingPromises: Array<{
    id: string;
    title: string;
    personName: string;
    deadline: Date;
  }>;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const DEMO_TAGS = [
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

let demoPeople: DemoPerson[] = [
  {
    id: 'p-1',
    name: 'Thu Hà',
    avatarUrl: null,
    relationshipType: 'family',
    relationshipStatus: 'growing',
    relationshipStrengthScore: 95,
    lastInteractionAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: [{ tag: DEMO_TAGS[0] }],
  },
  {
    id: 'p-2',
    name: 'Nam Nguyễn',
    avatarUrl: null,
    relationshipType: 'friend',
    relationshipStatus: 'growing',
    relationshipStrengthScore: 85,
    lastInteractionAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: [{ tag: DEMO_TAGS[3] }, { tag: DEMO_TAGS[4] }],
  },
  {
    id: 'p-3',
    name: 'Anh Tuấn',
    avatarUrl: null,
    relationshipType: 'mentor',
    relationshipStatus: 'growing',
    relationshipStrengthScore: 92,
    lastInteractionAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    tags: [{ tag: DEMO_TAGS[9] }, { tag: DEMO_TAGS[6] }],
  },
  {
    id: 'p-4',
    name: 'Lan Chi',
    avatarUrl: null,
    relationshipType: 'friend',
    relationshipStatus: 'stable',
    relationshipStrengthScore: 78,
    lastInteractionAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    tags: [{ tag: DEMO_TAGS[7] }, { tag: DEMO_TAGS[4] }],
  },
  {
    id: 'p-5',
    name: 'Hoàng Calisthenics',
    avatarUrl: null,
    relationshipType: 'friend',
    relationshipStatus: 'stable',
    relationshipStrengthScore: 72,
    lastInteractionAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tags: [{ tag: DEMO_TAGS[2] }, { tag: DEMO_TAGS[8] }],
  },
  {
    id: 'p-6',
    name: 'Annie Phạm',
    avatarUrl: null,
    relationshipType: 'friend',
    relationshipStatus: 'stable',
    relationshipStrengthScore: 68,
    lastInteractionAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: [{ tag: DEMO_TAGS[4] }, { tag: DEMO_TAGS[5] }, { tag: DEMO_TAGS[6] }],
  },
  {
    id: 'p-7',
    name: 'David Đặng',
    avatarUrl: null,
    relationshipType: 'colleague',
    relationshipStatus: 'stable',
    relationshipStrengthScore: 62,
    lastInteractionAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    tags: [{ tag: DEMO_TAGS[1] }, { tag: DEMO_TAGS[4] }],
  },
  {
    id: 'p-8',
    name: 'CEO Minh Phạm',
    avatarUrl: null,
    relationshipType: 'client',
    relationshipStatus: 'stable',
    relationshipStrengthScore: 58,
    lastInteractionAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    tags: [{ tag: DEMO_TAGS[1] }],
  },
  {
    id: 'p-9',
    name: 'Khoa Pug',
    avatarUrl: null,
    relationshipType: 'neighbor',
    relationshipStatus: 'fading',
    relationshipStrengthScore: 45,
    lastInteractionAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    tags: [],
  },
  {
    id: 'p-10',
    name: 'Minh Đức',
    avatarUrl: null,
    relationshipType: 'other',
    relationshipStatus: 'fading',
    relationshipStrengthScore: 28,
    lastInteractionAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    tags: [{ tag: DEMO_TAGS[3] }],
  },
  {
    id: 'p-11',
    name: 'Sarah Chen',
    avatarUrl: null,
    relationshipType: 'client',
    relationshipStatus: 'fading',
    relationshipStrengthScore: 35,
    lastInteractionAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    tags: [{ tag: DEMO_TAGS[7] }, { tag: DEMO_TAGS[4] }],
  },
  {
    id: 'p-12',
    name: 'Emma Wilson',
    avatarUrl: null,
    relationshipType: 'other',
    relationshipStatus: 'lost_contact',
    relationshipStrengthScore: 18,
    lastInteractionAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    tags: [{ tag: DEMO_TAGS[4] }, { tag: DEMO_TAGS[5] }],
  },
];

let demoInteractions: DemoInteraction[] = [
  {
    id: 'i-1',
    personId: 'p-3',
    personName: 'Anh Tuấn',
    interactionType: 'coffee',
    rating: 5,
    quickTags: ['Mentor'],
    freeTextNote: 'Bàn về chiến lược thăng tiến trong team Kaggle',
    interactionDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'i-2',
    personId: 'p-2',
    personName: 'Nam Nguyễn',
    interactionType: 'call',
    rating: 5,
    quickTags: ['Startup'],
    freeTextNote: 'Discussed sản phẩm mới, rất khả thi!',
    interactionDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'i-3',
    personId: 'p-1',
    personName: 'Thu Hà',
    interactionType: 'meal',
    rating: 4,
    quickTags: ['GiaDinh'],
    freeTextNote: 'Bữa tối cùng gia đình, nấu phở bò',
    interactionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'i-4',
    personId: 'p-4',
    personName: 'Lan Chi',
    interactionType: 'coffee',
    rating: 4,
    quickTags: ['Startup'],
    freeTextNote: 'Pitch ý tưởng startup cho chị Lan',
    interactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'i-5',
    personId: 'p-5',
    personName: 'Hoàng Calisthenics',
    interactionType: 'activity',
    rating: 4,
    quickTags: ['TheThao'],
    freeTextNote: 'Tập xà đơn 30 phút, cải thiện nhiều',
    interactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

let demoPromises: Array<{
  id: string;
  title: string;
  personId: string;
  personName: string;
  deadline: Date;
  isCompleted: boolean;
}> = [
  { id: 'pr-1', title: 'Gửi tài liệu AI cho Lan Chi', personId: 'p-4', personName: 'Lan Chi', deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), isCompleted: false },
  { id: 'pr-2', title: 'Hẹn tập xà đơn cuối tuần', personId: 'p-5', personName: 'Hoàng', deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), isCompleted: false },
  { id: 'pr-3', title: 'Cà phê bàn chiến thuật', personId: 'p-2', personName: 'Nam Nguyễn', deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isCompleted: false },
  { id: 'pr-4', title: 'Review PR cho feature mới', personId: 'p-7', personName: 'David Đặng', deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), isCompleted: false },
  { id: 'pr-5', title: 'Gửi slide presentation', personId: 'p-3', personName: 'Anh Tuấn', deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), isCompleted: false },
];

// ============================================================================
// DEMO MODE FUNCTIONS
// ============================================================================

export function getDashboard(): DemoDashboard {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Stats
  const stats = {
    totalPeople: demoPeople.length,
    growingCount: demoPeople.filter(p => p.relationshipStatus === 'growing').length,
    stableCount: demoPeople.filter(p => p.relationshipStatus === 'stable').length,
    fadingCount: demoPeople.filter(p => p.relationshipStatus === 'fading').length,
    lostContactCount: demoPeople.filter(p => p.relationshipStatus === 'lost_contact').length,
    interactionsThisMonth: demoInteractions.filter(i => i.interactionDate >= startOfMonth).length,
    pendingPromises: demoPromises.filter(p => !p.isCompleted).length,
  };

  // Needs attention (fading or no recent interaction)
  const needsAttention = demoPeople
    .filter(p => {
      const isFading = p.relationshipStatus === 'fading' || p.relationshipStatus === 'lost_contact';
      const noRecentInteraction = !p.lastInteractionAt || p.lastInteractionAt < thirtyDaysAgo;
      return isFading || noRecentInteraction;
    })
    .sort((a, b) => a.relationshipStrengthScore - b.relationshipStrengthScore)
    .slice(0, 5);

  // Recent interactions
  const recentInteractions = [...demoInteractions]
    .sort((a, b) => b.interactionDate.getTime() - a.interactionDate.getTime())
    .slice(0, 10);

  // Upcoming promises (not completed)
  const upcomingPromises = demoPromises
    .filter(p => !p.isCompleted)
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 5);

  return {
    stats,
    needsAttention,
    recentInteractions,
    upcomingPromises,
  };
}

export function getPeople() {
  return [...demoPeople];
}

export function getPerson(id: string) {
  return demoPeople.find(p => p.id === id);
}

export function createInteraction(input: {
  personId: string;
  interactionType: string;
  rating: number;
  quickTags?: string[];
  freeTextNote?: string;
}) {
  const person = demoPeople.find(p => p.id === input.personId);
  if (!person) {
    throw new Error('Person not found');
  }

  const interaction: DemoInteraction = {
    id: `i-${Date.now()}`,
    personId: input.personId,
    personName: person.name,
    interactionType: input.interactionType,
    rating: input.rating,
    quickTags: input.quickTags || [],
    freeTextNote: input.freeTextNote || null,
    interactionDate: new Date(),
    createdAt: new Date(),
  };

  // Add to interactions
  demoInteractions.unshift(interaction);

  // Recalculate score (simplified demo algorithm)
  const DECAY_RATES: Record<string, number> = {
    family: 0.05, partner: 0.08, friend: 0.15, mentor: 0.12,
    colleague: 0.25, client: 0.30, neighbor: 0.35, other: 0.40,
  };
  
  const INTERACTION_WEIGHTS: Record<string, number> = {
    coffee: 1.0, call: 1.0, video_call: 1.1, chat: 0.6,
    meal: 1.2, drinks: 0.9, activity: 1.1, event: 1.3,
    gift: 1.4, text: 0.4, email: 0.3, other: 0.5,
  };

  const previousScore = person.relationshipStrengthScore;
  const decayRate = DECAY_RATES[person.relationshipType] || 0.4;
  const weight = INTERACTION_WEIGHTS[input.interactionType] || 0.5;
  
  const daysSince = person.lastInteractionAt
    ? Math.max(0, Math.floor((Date.now() - person.lastInteractionAt.getTime()) / (24 * 60 * 60 * 1000)))
    : 30;
  
  const bonus = Math.min(input.rating * weight * 3, 40);
  const decay = Math.min(daysSince * decayRate * Math.log10(daysSince + 1), 30);
  const newScore = Math.max(0, Math.min(100, Math.round(previousScore + bonus - decay)));

  // Update person
  person.relationshipStrengthScore = newScore;
  person.lastInteractionAt = new Date();
  
  if (person.relationshipType === 'family') {
    if (newScore >= 65) person.relationshipStatus = 'growing';
    else if (newScore >= 40) person.relationshipStatus = 'stable';
    else if (newScore >= 15) person.relationshipStatus = 'fading';
    else person.relationshipStatus = 'lost_contact';
  } else {
    if (newScore >= 70) person.relationshipStatus = 'growing';
    else if (newScore >= 50) person.relationshipStatus = 'stable';
    else if (newScore >= 25) person.relationshipStatus = 'fading';
    else person.relationshipStatus = 'lost_contact';
  }

  return {
    interaction,
    person,
    meta: {
      previousScore,
      newScore,
      scoreChange: newScore - previousScore,
    },
  };
}

export function isDemoMode() {
  return !process.env.DATABASE_URL;
}

/**
 * Create a new person in demo mode
 */
export function createPerson(input: {
  name: string;
  relationshipType: string;
  tagIds?: string[];
  notes?: string;
}) {
  const newPerson: DemoPerson = {
    id: `p-${Date.now()}`,
    name: input.name,
    avatarUrl: null,
    relationshipType: input.relationshipType,
    relationshipStatus: 'stable',
    relationshipStrengthScore: 50,
    lastInteractionAt: null,
    tags: [],
  };

  // Add tags if provided
  if (input.tagIds && input.tagIds.length > 0) {
    for (const tagId of input.tagIds) {
      const tag = DEMO_TAGS.find(t => t.id === tagId);
      if (tag) {
        newPerson.tags.push({ tag });
      }
    }
  }

  // Add to people array
  demoPeople.unshift(newPerson);

  return newPerson;
}

/**
 * Toggle promise completion in demo mode
 */
export function togglePromise(id: string) {
  const promise = demoPromises.find(p => p.id === id);
  if (promise) {
    promise.isCompleted = !promise.isCompleted;
  }
  return promise;
}

/**
 * Update person's notes in demo mode
 */
export function updatePersonNotes(personId: string, notes: string) {
  const person = demoPeople.find(p => p.id === personId);
  if (person) {
    (person as any).notes = notes;
  }
  return person;
}

/**
 * Update a person in demo mode
 */
export function updatePerson(id: string, data: {
  name?: string;
  relationshipType?: string;
  tagIds?: string[];
  notes?: string;
}) {
  const person = demoPeople.find(p => p.id === id);
  if (person) {
    if (data.name !== undefined) person.name = data.name;
    if (data.relationshipType !== undefined) person.relationshipType = data.relationshipType;
    if (data.notes !== undefined) (person as any).notes = data.notes;
    if (data.tagIds !== undefined) {
      person.tags = [];
      for (const tagId of data.tagIds) {
        const tag = DEMO_TAGS.find(t => t.id === tagId);
        if (tag) {
          person.tags.push({ tag });
        }
      }
    }
  }
  return person;
}

/**
 * Delete a person in demo mode
 */
export function deletePerson(id: string) {
  const index = demoPeople.findIndex(p => p.id === id);
  if (index !== -1) {
    demoPeople.splice(index, 1);
    return { deleted: true };
  }
  return { deleted: false };
}

/**
 * Create a promise in demo mode
 */
export function createPromise(input: {
  personId: string;
  title: string;
  deadline: string;
  description?: string;
}) {
  const person = demoPeople.find(p => p.id === input.personId);
  const promise = {
    id: `pr-${Date.now()}`,
    title: input.title,
    description: input.description || null,
    deadline: new Date(input.deadline),
    isCompleted: false,
    completedAt: null,
    personId: input.personId,
    personName: person?.name || 'Unknown',
  };
  
  demoPromises.push(promise);
  return promise;
}
