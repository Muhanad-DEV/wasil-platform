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

    const { membershipRole } = await requireOrgAccess(orgId, req);

    const stage = searchParams.get('stage');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const assignedToId = searchParams.get('assignedToId');

    const where: any = { organizationId: orgId };

    // If sales rep without admin role, can filter to own assigned leads or see all if permitted
    if (membershipRole === 'SALES_REP' && searchParams.get('onlyAssigned') === 'true') {
      where.assignedToId = user.id;
    } else if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    if (stage && stage !== 'ALL') {
      where.stage = stage;
    }

    if (priority && priority !== 'ALL') {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { areaOfInterest: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        card: true,
        campaign: true,
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ leads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      organizationId,
      name,
      phone,
      email,
      stage,
      priority,
      areaOfInterest,
      budgetRange,
      preferredContact,
      notes,
      dealValueOMR,
      assignedToId,
      cardId,
      campaignId,
    } = body;

    const orgId = organizationId || user.memberships[0]?.organizationId;
    if (!orgId) return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });

    await requireOrgAccess(orgId, req);

    const lead = await prisma.lead.create({
      data: {
        organizationId: orgId,
        cardId: cardId || null,
        campaignId: campaignId || null,
        assignedToId: assignedToId || user.id,
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        stage: stage || 'NEW',
        priority: priority || 'MEDIUM',
        areaOfInterest: areaOfInterest || null,
        budgetRange: budgetRange || null,
        preferredContact: preferredContact || 'WHATSAPP',
        notes: notes || null,
        dealValueOMR: dealValueOMR ? parseFloat(dealValueOMR) : null,
        source: 'MANUAL',
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        userId: user.id,
        type: 'STATUS_CHANGE',
        description: `Lead created manually by ${user.name}`,
        descriptionAr: `تم إنشاء الفرصة يدوياً بواسطة ${user.name}`,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
