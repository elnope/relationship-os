/**
 * Relationship OS - Tags API
 * 
 * GET  /api/tags     - List all tags for current user
 * POST /api/tags     - Create a new tag
 */

import { NextRequest, NextResponse } from 'next/server';

interface CreateTagBody {
  name: string;
  color?: string;
  icon?: string;
}

async function getCurrentUser() {
  const { default: prisma } = await import('@/lib/prisma');
  return prisma.user.findFirst({
    where: { email: 'minh@relos.app' },
  });
}

// Predefined colors for random selection
const TAG_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E', '#78716C', '#64748B', '#6B7280',
];

function getRandomColor() {
  return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
}

// ============================================================================
// GET - List Tags
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { default: prisma } = await import('@/lib/prisma');

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { data: null, meta: null, error: { code: 'USER_NOT_FOUND', message: 'Demo user not found' } },
        { status: 401 }
      );
    }

    const tags = await prisma.tag.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      data: tags,
      meta: { total: tags.length },
      error: null,
    });

  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { data: null, meta: null, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch tags' } },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Create Tag
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const { default: prisma } = await import('@/lib/prisma');

    const body: CreateTagBody = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: { code: 'VALIDATION_ERROR', message: 'Tag name is required' },
        },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { data: null, meta: null, error: { code: 'USER_NOT_FOUND', message: 'Demo user not found' } },
        { status: 401 }
      );
    }

    const tagName = body.name.trim();

    // Check if tag already exists
    const existingTag = await prisma.tag.findFirst({
      where: { userId: user.id, name: tagName },
    });

    if (existingTag) {
      return NextResponse.json(
        { data: null, meta: null, error: { code: 'TAG_EXISTS', message: 'Tag already exists' } },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        userId: user.id,
        name: tagName,
        color: body.color || getRandomColor(),
        icon: body.icon || null,
      },
    });

    return NextResponse.json({
      data: tag,
      meta: { created: true },
      error: null,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { data: null, meta: null, error: { code: 'INTERNAL_ERROR', message: 'Failed to create tag' } },
      { status: 500 }
    );
  }
}
