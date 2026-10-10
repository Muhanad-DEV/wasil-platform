import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateVCardString } from '@/lib/vcard';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const card = await prisma.businessCard.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: { organization: true },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Record save contact event
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

    const fileName = `${card.ownerName.replace(/[^a-zA-Z0-9_-]/g, '_')}_contact.vcf`;

    return new NextResponse(vCardText, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
