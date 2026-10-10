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

    const { org, membershipRole } = await requireOrgAccess(orgId, req);

    const fullOrg = await prisma.organization.findUnique({
      where: { id: org.id },
      include: {
        profiles: { take: 1 },
        subscription: { include: { plan: true } },
        _count: {
          select: {
            cards: true,
            leads: true,
            memberships: true,
            branches: true,
          },
        },
      },
    });

    return NextResponse.json({ organization: fullOrg, role: membershipRole });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      id,
      name,
      nameAr,
      industry,
      commercialRegNo,
      phone,
      email,
      website,
      whatsapp,
      description,
      descriptionAr,
      city,
      defaultLanguage,
    } = body;

    if (!id) return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });

    await requireOrgAccess(id, req);

    const updated = await prisma.organization.update({
      where: { id },
      data: {
        name,
        nameAr,
        industry,
        commercialRegNo,
        phone,
        email,
        website,
        whatsapp,
        description,
        descriptionAr,
        city,
        defaultLanguage,
      },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: id,
        userId: user.id,
        action: 'SETTINGS_UPDATED',
        resource: 'Organization',
        resourceId: id,
      },
    });

    return NextResponse.json({ success: true, organization: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
