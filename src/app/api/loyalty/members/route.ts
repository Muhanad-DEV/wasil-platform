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

    const program = await prisma.loyaltyProgram.findFirst({
      where: { organizationId: orgId },
    });

    if (!program) return NextResponse.json({ members: [] });

    const members = await prisma.loyaltyMember.findMany({
      where: { programId: program.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        redemptions: {
          include: { reward: true },
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: { joinedAt: 'desc' },
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
    const { programId, name, phone, email, initialPoints, tier, amountSpentOMR } = body;

    const program = await prisma.loyaltyProgram.findUnique({
      where: { id: programId },
    });

    if (!program) return NextResponse.json({ error: 'Program not found' }, { status: 404 });

    await requireOrgAccess(program.organizationId, req);

    const membershipNumber = `WSL-OM-${Math.floor(1000 + Math.random() * 9000)}`;
    const pts = initialPoints ? parseInt(initialPoints) : 0;
    const spent = amountSpentOMR ? parseFloat(amountSpentOMR) : 0;

    const member = await prisma.$transaction(async (tx) => {
      const createdMember = await tx.loyaltyMember.create({
        data: {
          programId: program.id,
          membershipNumber,
          name: name.trim(),
          phone: phone.trim(),
          email: email ? email.trim() : null,
          pointsBalance: pts,
          tier: tier || 'SILVER',
          totalSpentOMR: spent,
        },
      });

      if (pts > 0) {
        await tx.loyaltyTransaction.create({
          data: {
            memberId: createdMember.id,
            type: 'EARN',
            points: pts,
            amountOMR: spent || null,
            description: 'Welcome bonus / Initial points allocation',
            descriptionAr: 'نقاط ترحيبية / رصيد أولي',
          },
        });
      }

      return createdMember;
    });

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
