/**
 * Relationship OS - Promises API
 * 
 * GET    /api/promises     - List promises
 * POST   /api/promises     - Create promise
 * PATCH  /api/promises     - Update promise (toggle completion, edit)
 * DELETE /api/promises     - Delete promise
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ============================================================================
// TYPES
// ============================================================================

interface CreatePromiseBody {
  personId: string;
  title: string;
  description?: string;
  deadline: string;
}

interface UpdatePromiseBody {
  id: string;
  title?: string;
  description?: string;
  deadline?: string;
  isCompleted?: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

async function getCurrentUser() {
  return prisma.user.findFirst({
    where: { email: 'minh@relos.app' },
  });
}

// ============================================================================
// GET - List Promises
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { data: null, meta: null, error: { code: 'USER_NOT_FOUND', message: 'Demo user not found' } },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status'); // 'pending' | 'completed' | undefined
    const personId = searchParams.get('personId');

    const where: any = { userId: user.id };

    if (status === 'pending') {
      where.isCompleted = false;
    } else if (status === 'completed') {
      where.isCompleted = true;
    }

    if (personId) {
      where.personId = personId;
    }

    const promises = await prisma.promiseReminder.findMany({
      where,
      include: {
        person: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { deadline: 'asc' },
    });

    return NextResponse.json({
      data: promises,
      meta: { total: promises.length },
      error: null,
    });

  } catch (error) {
    console.error('Error fetching promises:', error);
    return NextResponse.json(
      { data: null, meta: null, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch promises' } },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Create Promise
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: CreatePromiseBody = await request.json();

    if (!body.personId || !body.title || !body.deadline) {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: personId, title, deadline' },
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

    // Verify person belongs to user
    const person = await prisma.person.findFirst({
      where: { id: body.personId, userId: user.id },
    });

    if (!person) {
      return NextResponse.json(
        { data: null, meta: null, error: { code: 'PERSON_NOT_FOUND', message: 'Person not found' } },
        { status: 404 }
      );
    }

    const promise = await prisma.promiseReminder.create({
      data: {
        userId: user.id,
        personId: body.personId,
        title: body.title,
        description: body.description,
        deadline: new Date(body.deadline),
      },
      include: {
        person: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      data: promise,
      meta: { created: true },
      error: null,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating promise:', error);
    return NextResponse.json(
      { data: null, meta: null, error: { code: 'INTERNAL_ERROR', message: 'Failed to create promise' } },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH - Update Promise (Toggle Completion)
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const body: UpdatePromiseBody = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: { code: 'VALIDATION_ERROR', message: 'Missing promise id' },
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

    // Build update data
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.deadline !== undefined) updateData.deadline = new Date(body.deadline);
    if (body.isCompleted !== undefined) {
      updateData.isCompleted = body.isCompleted;
      updateData.completedAt = body.isCompleted ? new Date() : null;
    }

    const promise = await prisma.promiseReminder.update({
      where: { id: body.id },
      data: updateData,
      include: {
        person: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      data: promise,
      meta: { updated: true },
      error: null,
    });

  } catch (error: any) {
    console.error('Error updating promise:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { data: null, meta: null, error: { code: 'NOT_FOUND', message: 'Promise not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: null, meta: null, error: { code: 'INTERNAL_ERROR', message: 'Failed to update promise' } },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE - Delete Promise
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: { code: 'VALIDATION_ERROR', message: 'Missing promise id' },
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

    await prisma.promiseReminder.delete({
      where: { id },
    });

    return NextResponse.json({
      data: { deleted: true },
      meta: null,
      error: null,
    });

  } catch (error: any) {
    console.error('Error deleting promise:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { data: null, meta: null, error: { code: 'NOT_FOUND', message: 'Promise not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: null, meta: null, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete promise' } },
      { status: 500 }
    );
  }
}
