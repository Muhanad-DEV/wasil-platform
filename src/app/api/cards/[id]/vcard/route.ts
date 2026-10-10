import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateVCardString } from '@/lib/vcard';
import { getFallbackCard } from '@/lib/demo-data';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    let card: any = null;

    try {
      card = await prisma.businessCard.findFirst({
        where: {
          OR: [{ id: params.id }, { slug: params.id }],
        },
        include: { organization: true },
      });
    } catch (dbError) {
      console.warn('[vCard API] Database query failed or unavailable, using fallback:', dbError);
    }

    if (!card) {
      card = getFallbackCard(params.id);
    }

    // Non-fatal recording in DB
    try {
      if (card.id && !card.id.startsWith('card-')) {
        await prisma.businessCard.update({
          where: { id: card.id },
          data: { saveContactCount: { increment: 1 } },
        });

        await prisma.analyticsEvent.create({
          data: {
            organizationId: card.organizationId,
            cardId: card.id,
            eventType: 'VCARD_DOWNLOAD',
            device: 'MOBILE',
          },
        });
      }
    } catch (writeErr) {
      console.warn('[vCard API] Non-fatal analytics write skipped:', writeErr);
    }

    const vCardText = generateVCardString({
      name: card.ownerName,
      nameAr: card.ownerNameAr,
      jobTitle: card.jobTitle,
      jobTitleAr: card.jobTitleAr,
      companyName: card.companyName,
      companyNameAr: card.companyNameAr,
      phone: card.phone,
      secondaryPhone: card.secondaryPhone,
      whatsapp: card.whatsapp,
      email: card.email,
      website: card.website,
      location: card.locationText,
      bio: card.bio,
    });

    const safeName = (card.ownerName || 'contact').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeName}_contact.vcf`;

    return new NextResponse(vCardText, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'vCard generation failed' }, { status: 500 });
  }
}
