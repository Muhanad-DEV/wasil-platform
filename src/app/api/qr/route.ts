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

    const qrCodes = await prisma.qRCode.findMany({
      where: { organizationId: orgId },
      include: {
        card: true,
        campaign: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ qrCodes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { organizationId, cardId, campaignId, name, targetUrl, styleConfig } = body;

    const orgId = organizationId || user.memberships[0]?.organizationId;
    if (!orgId) return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });

    await requireOrgAccess(orgId, req);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `QR-${(name || 'WASIL').toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8)}-${randomSuffix}`;

    const qrCode = await prisma.qRCode.create({
      data: {
        organizationId: orgId,
        cardId: cardId || null,
        campaignId: campaignId || null,
        code,
        name: name.trim(),
        targetUrl: targetUrl.trim(),
        styleConfig: styleConfig ? JSON.stringify(styleConfig) : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, qrCode });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
