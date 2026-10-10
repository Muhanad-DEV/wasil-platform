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

    const branches = await prisma.branch.findMany({
      where: { organizationId: orgId },
      include: {
        _count: { select: { cards: true } },
      },
      orderBy: { isMainBranch: 'desc' },
    });

    return NextResponse.json({ branches });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { organizationId, name, nameAr, city, address, addressAr, phone, email, isMainBranch } = body;

    const orgId = organizationId || user.memberships[0]?.organizationId;
    if (!orgId) return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });

    await requireOrgAccess(orgId, req);

    const branch = await prisma.branch.create({
      data: {
        organizationId: orgId,
        name: name.trim(),
        nameAr: nameAr ? nameAr.trim() : null,
        city: city || 'Muscat',
        address: address || null,
        addressAr: addressAr || null,
        phone: phone || null,
        email: email || null,
        isMainBranch: Boolean(isMainBranch),
      },
    });

    return NextResponse.json({ success: true, branch });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
