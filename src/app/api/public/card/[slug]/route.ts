import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFallbackCard } from '@/lib/demo-data';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    let card: any = null;

    try {
      card = await prisma.businessCard.findUnique({
        where: { slug: params.slug },
        include: {
          organization: true,
          branch: true,
        },
      });
    } catch (dbError) {
      console.warn('[Public Card API] Database query failed or unavailable, using fallback:', dbError);
    }

    if (!card) {
      card = getFallbackCard(params.slug);
    }

    // Non-fatal view count increment and analytics recording
    try {
      if (card.id && !card.id.startsWith('card-')) {
        await prisma.businessCard.update({
          where: { id: card.id },
          data: { viewCount: { increment: 1 } },
        });

        await prisma.analyticsEvent.create({
          data: {
            organizationId: card.organizationId,
            cardId: card.id,
            eventType: 'PAGE_VIEW',
            device: 'MOBILE',
          },
        });
      }
    } catch (writeErr) {
      console.warn('[Public Card API] Non-fatal view count update skipped:', writeErr);
    }

    return NextResponse.json({ card });
  } catch (error: any) {
    // Ultimate resilience: return fallback card rather than 500
    const fallback = getFallbackCard(params.slug);
    return NextResponse.json({ card: fallback });
  }
}
