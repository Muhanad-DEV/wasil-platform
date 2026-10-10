import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOrgAccess } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const original = await prisma.businessCard.findUnique({
      where: { id: params.id },
    });

    if (!original) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

    const { user } = await requireOrgAccess(original.organizationId, req);

    const baseSlug = `${original.slug}-copy-${Math.floor(100 + Math.random() * 900)}`;

    const copy = await prisma.businessCard.create({
      data: {
        organizationId: original.organizationId,
        branchId: original.branchId,
        slug: baseSlug,
        title: `${original.title} (Copy)`,
        ownerName: original.ownerName,
        ownerNameAr: original.ownerNameAr,
        jobTitle: original.jobTitle,
        jobTitleAr: original.jobTitleAr,
        companyName: original.companyName,
        companyNameAr: original.companyNameAr,
        avatarUrl: original.avatarUrl,
        logoUrl: original.logoUrl,
        phone: original.phone,
        secondaryPhone: original.secondaryPhone,
        whatsapp: original.whatsapp,
        email: original.email,
        website: original.website,
        locationText: original.locationText,
        locationTextAr: original.locationTextAr,
        mapsUrl: original.mapsUrl,
        bio: original.bio,
        bioAr: original.bioAr,
        badgeText: original.badgeText,
        theme: original.theme,
        primaryColor: original.primaryColor,
        accentColor: original.accentColor,
        customActions: original.customActions,
        socialLinks: original.socialLinks,
        isPrimary: false,
        isPublished: false,
      },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: original.organizationId,
        userId: user.id,
        action: 'CARD_DUPLICATED',
        resource: 'BusinessCard',
        resourceId: copy.id,
      },
    });

    return NextResponse.json({ success: true, card: copy });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
