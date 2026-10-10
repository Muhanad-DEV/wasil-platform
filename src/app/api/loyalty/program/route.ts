import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, requireOrgAccess } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const orgId = searchParams.get('orgId') || user.memberships[0]?.organizationId;

    if (!orgId) return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });

    await requireOrgAccess(orgId, req);

    let program = await prisma.loyaltyProgram.findFirst({
      where: { organizationId: orgId },
      include: {
        rewards: true,
        _count: {
          select: { members: true },
        },
      },
    });

    if (!program) {
      // Auto-create default program if none exists
      program = await prisma.loyaltyProgram.create({
        data: {
          organizationId: orgId,
          name: 'Customer Loyalty Club',
          nameAr: 'برنامج ولاء العملاء',
          type: 'POINTS',
          pointsPerOMR: 10,
          isActive: true,
        },
        include: {
          rewards: true,
          _count: { select: { members: true } },
        },
      });
    }

    return NextResponse.json({ program });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, name, nameAr, type, pointsPerOMR, stampsRequired, description, terms, isActive } = body;

    const existing = await prisma.loyaltyProgram.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Program not found' }, { status: 404 });

    await requireOrgAccess(existing.organizationId, req);

    const updated = await prisma.loyaltyProgram.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        nameAr: nameAr !== undefined ? nameAr : existing.nameAr,
        type: type !== undefined ? type : existing.type,
        pointsPerOMR: pointsPerOMR !== undefined ? parseInt(pointsPerOMR) : existing.pointsPerOMR,
        stampsRequired: stampsRequired !== undefined ? parseInt(stampsRequired) : existing.stampsRequired,
        description: description !== undefined ? description : existing.description,
        terms: terms !== undefined ? terms : existing.terms,
        isActive: isActive !== undefined ? isActive : existing.isActive,
      },
    });

    return NextResponse.json({ success: true, program: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
