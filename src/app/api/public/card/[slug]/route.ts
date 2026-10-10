import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const card = await prisma.businessCard.findUnique({
      where: { slug: params.slug },
      include: {
        organization: true,
        branch: true,
      },
    });

    if (!card || !card.isPublished) {
      return NextResponse.json({ error: 'Card not found or not published' }, { status: 404 });
    }

    // Increment card view count
    await prisma.businessCard.update({
      where: { id: card.id },
      data: { viewCount: { increment: 1 } },
    });

    // Record analytics event
    await prisma.analyticsEvent.create({
      data: {
        organizationId: card.organizationId,
        cardId: card.id,
        eventType: 'PAGE_VIEW',
        device: 'MOBILE',
      },
    });

    return NextResponse.json({ card });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
