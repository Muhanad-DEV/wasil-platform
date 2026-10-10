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

    const campaigns = await prisma.campaign.findMany({
      where: { organizationId: orgId },
      include: {
        qrCodes: true,
        _count: { select: { leads: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ campaigns });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { organizationId, name, nameAr, channel, utmSource, utmMedium, utmCampaign, startDate, endDate } = body;

    const orgId = organizationId || user.memberships[0]?.organizationId;
    if (!orgId) return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });

    await requireOrgAccess(orgId, req);

    const campaign = await prisma.campaign.create({
      data: {
        organizationId: orgId,
        name: name.trim(),
        nameAr: nameAr ? nameAr.trim() : null,
        channel: channel || 'QR_PHYSICAL',
        utmSource: utmSource || name.toLowerCase().replace(/\s+/g, '_'),
        utmMedium: utmMedium || 'qr_card',
        utmCampaign: utmCampaign || name.toLowerCase().replace(/\s+/g, '_'),
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
