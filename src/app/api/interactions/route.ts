/**
 * Relationship OS - Interactions API
 * 
 * POST /api/interactions
 * Creates a new interaction and recalculates relationship strength.
 * 
 * This is the heart of the MVP - handles the core transaction:
 * 1) Create interaction record
 * 2) Recalculate relationship strength score
 * 3) Update relationship status
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ============================================================================
// TYPES
// ============================================================================

interface RequestBody {
  personId: string;
  interactionType: string;
  rating: number;
  quickTags?: string[];
  freeTextNote?: string;
  interactionDate?: string;
}

interface ResponseMeta {
  personId: string;
  previousScore: number;
  newScore: number;
  previousStatus: string;
  newStatus: string;
  scoreChange: number;
}

// ============================================================================
// ALGORITHM CONSTANTS
// ============================================================================

const DECAY_RATES: Record<string, number> = {
  family: 0.05,
  partner: 0.08,
  friend: 0.15,
  mentor: 0.12,
  colleague: 0.25,
  client: 0.30,
  neighbor: 0.35,
  other: 0.40,
};

const INTERACTION_WEIGHTS: Record<string, number> = {
  coffee: 1.0,
  call: 1.0,
  video_call: 1.1,
  chat: 0.6,
  meal: 1.2,
  drinks: 0.9,
  activity: 1.1,
  event: 1.3,
  gift: 1.4,
  text: 0.4,
  email: 0.3,
  other: 0.5,
};

const BASE_SCORE = 50;
const MAX_BONUS = 40;
const MAX_DECAY_PENALTY = 30;

// Status thresholds (with family adjustments)
const STATUS_THRESHOLDS: Record<string, { status: string; threshold: number }> = {
  family: { status: 'growing', threshold: 65 },
};

const DEFAULT_STATUS_THRESHOLDS = [
  { status: 'growing', threshold: 70 },
  { status: 'stable', threshold: 50 },
  { status: 'fading', threshold: 25 },
];

// ============================================================================
// ALGORITHM FUNCTIONS
// ============================================================================

/**
 * Calculate the new relationship strength score after adding an interaction.
 * 
 * Formula: newScore = previousScore + interactionBonus - timeDecay
 * 
 * Where:
 * - interactionBonus = rating * weight * 3 (capped at MAX_BONUS)
 * - timeDecay = daysSinceLastInteraction * decayRate (capped at MAX_DECAY_PENALTY)
 * 
 * Score is clamped to 0-100 range.
 */
function calculateNewScore(
  currentScore: number,
  relationshipType: string,
  interactionType: string,
  rating: number,
  lastInteractionAt: Date | null
): number {
  const decayRate = DECAY_RATES[relationshipType] || DECAY_RATES.other;
  const weight = INTERACTION_WEIGHTS[interactionType] || INTERACTION_WEIGHTS.other;

  // Calculate interaction bonus (0-40)
  const rawBonus = rating * weight * 3;
  const interactionBonus = Math.min(rawBonus, MAX_BONUS);

  // Calculate time decay penalty
  const now = new Date();
  const lastInteraction = lastInteractionAt || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const daysSince = Math.max(0, Math.floor((now.getTime() - lastInteraction.getTime()) / (24 * 60 * 60 * 1000)));
  
  // Logarithmic decay - slower at first, then increases
  const rawDecay = daysSince * decayRate * Math.log10(daysSince + 1);
  const timeDecay = Math.min(rawDecay, MAX_DECAY_PENALTY);

  // Calculate new score
  const newScore = currentScore + interactionBonus - timeDecay;

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(newScore)));
}

/**
 * Determine the relationship status based on score and type.
 */
function determineStatus(
  score: number,
  relationshipType: string
): string {
  // Family has lower thresholds
  if (relationshipType === 'family') {
    if (score >= 65) return 'growing';
    if (score >= 40) return 'stable';
    if (score >= 15) return 'fading';
    return 'lost_contact';
  }

  // Default thresholds
  if (score >= 70) return 'growing';
  if (score >= 50) return 'stable';
  if (score >= 25) return 'fading';
  return 'lost_contact';
}

// ============================================================================
// API HANDLERS
// ============================================================================

/**
 * POST /api/interactions
 * Create a new interaction and update relationship strength.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: RequestBody = await request.json();

    // Validate required fields
    if (!body.personId || !body.interactionType || typeof body.rating !== 'number') {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: personId, interactionType, rating',
          },
        },
        { status: 400 }
      );
    }

    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Rating must be between 1 and 5',
          },
        },
        { status: 400 }
      );
    }

    // Get current user (for demo, use the seed user)
    const user = await prisma.user.findFirst({
      where: { email: 'minh@relos.app' },
    });

    if (!user) {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Demo user not found. Please run the seed script.',
          },
        },
        { status: 401 }
      );
    }

    // Verify person exists and belongs to user
    const person = await prisma.person.findFirst({
      where: {
        id: body.personId,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (!person) {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: {
            code: 'PERSON_NOT_FOUND',
            message: 'Person not found or does not belong to current user',
          },
        },
        { status: 404 }
      );
    }

    // Calculate new score BEFORE creating interaction
    const previousScore = person.relationshipStrengthScore;
    const previousStatus = person.relationshipStatus;
    const newScore = calculateNewScore(
      previousScore,
      person.relationshipType,
      body.interactionType,
      body.rating,
      person.lastInteractionAt
    );
    const newStatus = determineStatus(newScore, person.relationshipType);

    // Transaction: Create interaction + Update person
    const [interaction, updatedPerson] = await prisma.$transaction([
      // 1) Create the interaction record
      prisma.interaction.create({
        data: {
          userId: user.id,
          personId: person.id,
          interactionType: body.interactionType as any,
          rating: body.rating,
          quickTags: body.quickTags || [],
          freeTextNote: body.freeTextNote,
          interactionDate: body.interactionDate 
            ? new Date(body.interactionDate) 
            : new Date(),
        },
      }),

      // 2) Update person with new score and status
      prisma.person.update({
        where: { id: person.id },
        data: {
          relationshipStrengthScore: newScore,
          relationshipStatus: newStatus as any,
          lastInteractionAt: new Date(),
        },
      }),
    ]);

    // Calculate score change for meta
    const scoreChange = newScore - previousScore;

    // Build response meta
    const meta: ResponseMeta = {
      personId: person.id,
      previousScore,
      newScore,
      previousStatus,
      newStatus,
      scoreChange,
    };

    // Return success response
    return NextResponse.json({
      data: {
        id: interaction.id,
        personId: interaction.personId,
        interactionType: interaction.interactionType,
        rating: interaction.rating,
        quickTags: interaction.quickTags,
        freeTextNote: interaction.freeTextNote,
        interactionDate: interaction.interactionDate,
        createdAt: interaction.createdAt,
        person: {
          id: updatedPerson.id,
          name: updatedPerson.name,
          relationshipStrengthScore: updatedPerson.relationshipStrengthScore,
          relationshipStatus: updatedPerson.relationshipStatus,
        },
      },
      meta,
      error: null,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating interaction:', error);
    
    return NextResponse.json(
      {
        data: null,
        meta: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred while creating the interaction',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/interactions
 * List interactions with pagination and filters.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const personId = searchParams.get('personId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const cursor = searchParams.get('cursor');

    // Get current user
    const user = await prisma.user.findFirst({
      where: { email: 'minh@relos.app' },
    });

    if (!user) {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: { code: 'USER_NOT_FOUND', message: 'Demo user not found' },
        },
        { status: 401 }
      );
    }

    // Build where clause
    const where: any = { userId: user.id };
    if (personId) {
      where.personId = personId;
    }

    // Fetch interactions
    const interactions = await prisma.interaction.findMany({
      where,
      include: {
        person: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            relationshipStrengthScore: true,
          },
        },
      },
      orderBy: { interactionDate: 'desc' },
      take: limit + 1, // Fetch one extra to determine if there's a next page
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });

    // Determine pagination
    const hasMore = interactions.length > limit;
    const items = hasMore ? interactions.slice(0, -1) : interactions;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return NextResponse.json({
      data: items,
      meta: {
        hasMore,
        nextCursor,
        total: items.length,
      },
      error: null,
    });

  } catch (error) {
    console.error('Error fetching interactions:', error);
    return NextResponse.json(
      {
        data: null,
        meta: null,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch interactions' },
      },
      { status: 500 }
    );
  }
}
