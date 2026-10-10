import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hashPassword, requireOrgAccess } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const orgId = searchParams.get('orgId') || user.memberships[0]?.organizationId;

    if (!orgId) return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });

    await requireOrgAccess(orgId, req);

    const members = await prisma.organizationMembership.findMany({
      where: { organizationId: orgId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ members });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { organizationId, email, name, role, title, phone } = body;

    const orgId = organizationId || user.memberships[0]?.organizationId;
    if (!orgId) return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });

    await requireOrgAccess(orgId, req);

    const cleanEmail = email.toLowerCase().trim();

    // Find or create user
    let targetUser = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!targetUser) {
      targetUser = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: name.trim(),
          phone: phone ? phone.trim() : null,
          passwordHash: hashPassword('Wasil2026!'), // Default temporary password
          role: role === 'ADMIN' ? 'ORGANIZATION_ADMIN' : 'SALES_REP',
          emailVerified: true,
        },
      });
    }

    // Check if membership already exists
    const existingMembership = await prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: {
          userId: targetUser.id,
          organizationId: orgId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User is already a member of this organization' },
        { status: 409 }
      );
    }

    const membership = await prisma.organizationMembership.create({
      data: {
        userId: targetUser.id,
        organizationId: orgId,
        role: role || 'SALES_REP',
        title: title || 'Team Member',
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, membership });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
