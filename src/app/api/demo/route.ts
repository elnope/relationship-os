/**
 * Relationship OS - Demo Mode API
 * 
 * This route handles all data operations in demo mode.
 * It provides the same interface as the real API but uses in-memory data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDashboard, createInteraction, getPeople, isDemoMode } from '@/lib/demo';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Check if we're in demo mode (no database configured)
 */
function checkDemoMode() {
  if (!isDemoMode()) {
    return NextResponse.json(
      {
        data: null,
        meta: null,
        error: {
          code: 'DEMO_MODE_DISABLED',
          message: 'Database is configured. Use the production API instead.',
        },
      },
      { status: 400 }
    );
  }
  return null;
}

// ============================================================================
// GET HANDLERS
// ============================================================================

/**
 * GET /api/demo?type=dashboard
 * GET /api/demo?type=people
 */
export async function GET(request: NextRequest) {
  // Check demo mode
  const demoCheck = checkDemoMode();
  if (demoCheck) return demoCheck;

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'dashboard';

  try {
    switch (type) {
      case 'dashboard':
        return NextResponse.json({
          data: getDashboard(),
          meta: { mode: 'demo' },
          error: null,
        });

      case 'people':
        return NextResponse.json({
          data: getPeople(),
          meta: { mode: 'demo' },
          error: null,
        });

      default:
        return NextResponse.json(
          {
            data: null,
            meta: null,
            error: { code: 'INVALID_TYPE', message: 'Invalid type parameter' },
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Demo API error:', error);
    return NextResponse.json(
      {
        data: null,
        meta: null,
        error: { code: 'INTERNAL_ERROR', message: 'Demo mode error' },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/demo
 * Create a new interaction in demo mode
 */
export async function POST(request: NextRequest) {
  // Check demo mode
  const demoCheck = checkDemoMode();
  if (demoCheck) return demoCheck;

  try {
    const body = await request.json();

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

    // Create interaction
    const result = createInteraction({
      personId: body.personId,
      interactionType: body.interactionType,
      rating: body.rating,
      quickTags: body.quickTags,
      freeTextNote: body.freeTextNote,
    });

    return NextResponse.json({
      data: {
        id: result.interaction.id,
        personId: result.interaction.personId,
        interactionType: result.interaction.interactionType,
        rating: result.interaction.rating,
        quickTags: result.interaction.quickTags,
        freeTextNote: result.interaction.freeTextNote,
        interactionDate: result.interaction.interactionDate,
        createdAt: result.interaction.createdAt,
        person: {
          id: result.person.id,
          name: result.person.name,
          relationshipStrengthScore: result.person.relationshipStrengthScore,
          relationshipStatus: result.person.relationshipStatus,
        },
      },
      meta: {
        mode: 'demo',
        personId: result.person.id,
        previousScore: result.meta.previousScore,
        newScore: result.meta.newScore,
        scoreChange: result.meta.scoreChange,
      },
      error: null,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Demo API error:', error);
    
    if (error.message === 'Person not found') {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: { code: 'PERSON_NOT_FOUND', message: 'Person not found' },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: null,
        meta: null,
        error: { code: 'INTERNAL_ERROR', message: 'Demo mode error' },
      },
      { status: 500 }
    );
  }
}
