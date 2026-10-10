import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const org = await prisma.organization.findUnique({
      where: { slug: params.slug },
      include: {
        profiles: { where: { isPublished: true }, take: 1 },
        cards: { where: { isPublished: true } },
        branches: true,
        loyaltyPrograms: { where: { isActive: true }, include: { rewards: { where: { isActive: true } } } },
      },
    });

    if (!org) {
      return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
    }

    const profile = org.profiles[0] || null;

    // Log view event
    await prisma.analyticsEvent.create({
      data: {
        organizationId: org.id,
        eventType: 'PAGE_VIEW',
        device: 'MOBILE',
      },
    });

    return NextResponse.json({
      organization: {
        id: org.id,
        slug: org.slug,
        name: org.name,
        nameAr: org.nameAr,
        industry: org.industry,
        country: org.country,
        city: org.city,
        commercialRegNo: org.commercialRegNo,
        phone: org.phone,
        email: org.email,
        website: org.website,
        whatsapp: org.whatsapp,
        description: org.description,
        descriptionAr: org.descriptionAr,
        defaultLanguage: org.defaultLanguage,
        currency: org.currency,
        isVerified: org.isVerified,
      },
      profile,
      cards: org.cards,
      branches: org.branches,
      loyalty: org.loyaltyPrograms[0] || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
