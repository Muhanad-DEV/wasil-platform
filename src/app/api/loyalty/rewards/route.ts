import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, requireOrgAccess } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const programId = searchParams.get('programId');

    if (!programId) {
      return NextResponse.json({ error: 'Program ID is required' }, { status: 400 });
    }

    const rewards = await prisma.reward.findMany({
      where: { programId },
      include: {
        _count: { select: { redemptions: true } },
      },
      orderBy: { pointsRequired: 'asc' },
    });

    return NextResponse.json({ rewards });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { programId, title, titleAr, description, descriptionAr, pointsRequired, discountValue, discountType, stock } = body;

    const program = await prisma.loyaltyProgram.findUnique({ where: { id: programId } });
    if (!program) return NextResponse.json({ error: 'Program not found' }, { status: 404 });

    await requireOrgAccess(program.organizationId, req);

    const reward = await prisma.reward.create({
      data: {
        programId,
        title,
        titleAr: titleAr || null,
        description: description || null,
        descriptionAr: descriptionAr || null,
        pointsRequired: parseInt(pointsRequired) || 100,
        discountValue: discountValue ? parseFloat(discountValue) : null,
        discountType: discountType || 'FIXED_OMR',
        stock: stock ? parseInt(stock) : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, reward });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
