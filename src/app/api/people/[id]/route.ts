/**
 * Relationship OS - Person Delete API
 * 
 * DELETE /api/people/[id] - Soft delete a person
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    // Verify person exists and belongs to user
    const person = await prisma.person.findFirst({
      where: {
        id,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (!person) {
      return NextResponse.json(
        {
          data: null,
          meta: null,
          error: { code: 'PERSON_NOT_FOUND', message: 'Person not found' },
        },
        { status: 404 }
      );
    }

    // Soft delete the person (set deletedAt timestamp)
    // This preserves all interaction history
    await prisma.person.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    // Also delete related data that shouldn't be preserved
    await prisma.$transaction([
      // Delete tag associations
      prisma.personTag.deleteMany({
        where: { personId: id },
      }),
      // Delete promises
      prisma.promiseReminder.deleteMany({
        where: { personId: id },
      }),
      // Note: We keep interactions for historical purposes
      // If you want to delete them too, uncomment below:
      // prisma.interaction.deleteMany({
      //   where: { personId: id },
      // }),
    ]);

    return NextResponse.json({
      data: { deleted: true, id },
      meta: null,
      error: null,
    });

  } catch (error) {
    console.error('Error deleting person:', error);
    return NextResponse.json(
      {
        data: null,
        meta: null,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to delete person' },
      },
      { status: 500 }
    );
  }
}
