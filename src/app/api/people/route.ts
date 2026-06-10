/**
 * Relationship OS - People API
 * 
 * GET  /api/people - List all people
 * POST /api/people - Create a new person
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ============================================================================
// TYPES
// ============================================================================

interface CreatePersonBody {
  name: string;
  relationshipType: string;
  tagIds?: string[];
  notes?: string;
}

interface UpdatePersonBody {
  name?: string;
  notes?: string;
}

// ============================================================================
// GET - List People
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Get current user (for demo, use the seed user)
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

    // Fetch people with relations
    const people = await prisma.person.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: { interactions: true },
        },
      },
      orderBy: [
        { relationshipStatus: 'asc' },
        { relationshipStrengthScore: 'desc' },
      ],
    });

    return NextResponse.json({
      data: people,
      meta: {
        total: people.length,
      },
      error: null,
    });

  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      {
        data: null,
        meta: null,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch people' },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Create Person
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: CreatePersonBody = await request.json();

    // Validate required fields
    if (!body.name || !body.relationshipType) {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: name, relationshipType',
          },
        },
        { status: 400 }
      );
    }

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

    // Create person with tags
    const person = await prisma.person.create({
      data: {
        userId: user.id,
        name: body.name,
        relationshipType: body.relationshipType as any,
        notes: body.notes,
        // Default values for new person
        relationshipStrengthScore: 50,
        relationshipStatus: 'stable',
        tags: body.tagIds && body.tagIds.length > 0
          ? {
              create: body.tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });

    return NextResponse.json({
      data: person,
      meta: {
        created: true,
      },
      error: null,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating person:', error);
    return NextResponse.json(
      {
        data: null,
        meta: null,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to create person' },
      },
      { status: 500 }
    );
  }
}
