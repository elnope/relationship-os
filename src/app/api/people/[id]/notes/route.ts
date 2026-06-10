/**
 * Relationship OS - Notes API
 * 
 * PATCH /api/people/[id]/notes - Update person's notes
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

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

    // Update notes
    const updatedPerson = await prisma.person.update({
      where: { id },
      data: {
        notes: body.notes,
      },
      select: {
        id: true,
        notes: true,
      },
    });

    return NextResponse.json({
      data: updatedPerson,
      meta: { updated: true },
      error: null,
    });

  } catch (error) {
    console.error('Error updating notes:', error);
    return NextResponse.json(
      {
        data: null,
        meta: null,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to update notes' },
      },
      { status: 500 }
    );
  }
}
