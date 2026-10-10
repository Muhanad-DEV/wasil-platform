import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || !user.isSuperAdmin) {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const organizations = await prisma.organization.findMany({
      include: {
        subscription: { include: { plan: true } },
        _count: {
          select: {
            memberships: true,
            cards: true,
            leads: true,
            branches: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ organizations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || !user.isSuperAdmin) {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { orgId, isActive } = body;

    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    const updated = await prisma.organization.update({
      where: { id: orgId },
      data: { isActive },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: orgId,
        userId: user.id,
        action: isActive ? 'ORGANIZATION_REACTIVATED' : 'ORGANIZATION_SUSPENDED',
        resource: 'Organization',
        resourceId: orgId,
      },
    });

    return NextResponse.json({ success: true, organization: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
