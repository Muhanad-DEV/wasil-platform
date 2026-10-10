import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, requireOrgAccess } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const orgId = searchParams.get('orgId') || user.memberships[0]?.organizationId;

    if (!orgId) return NextResponse.json({ error: 'No organization specified' }, { status: 400 });

    await requireOrgAccess(orgId, req);

    const cards = await prisma.businessCard.findMany({
      where: { organizationId: orgId },
      include: {
        branch: true,
        walletPasses: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ cards });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      organizationId,
      title,
      ownerName,
      ownerNameAr,
      jobTitle,
      jobTitleAr,
      companyName,
      companyNameAr,
      phone,
      whatsapp,
      email,
      website,
      locationText,
      locationTextAr,
      bio,
      bioAr,
      theme,
      primaryColor,
      accentColor,
      customActions,
      socialLinks,
      branchId,
      badgeText,
    } = body;

    const orgId = organizationId || user.memberships[0]?.organizationId;
    if (!orgId) return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });

    const { org } = await requireOrgAccess(orgId, req);

    // Check Plan Limits
    const sub = await prisma.subscription.findUnique({
      where: { organizationId: orgId },
      include: { plan: true },
    });

    const maxCards = sub?.plan.maxCards ?? 1;
    const currentCardCount = await prisma.businessCard.count({
      where: { organizationId: orgId },
    });

    if (currentCardCount >= maxCards) {
      return NextResponse.json(
        {
          error: `Card limit reached (${maxCards} cards allowed on ${sub?.plan.name || 'Free'} plan). Please upgrade your plan.`,
          code: 'LIMIT_EXCEEDED',
        },
        { status: 403 }
      );
    }

    const baseSlug = (ownerName || title || 'card')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const card = await prisma.businessCard.create({
      data: {
        organizationId: orgId,
        branchId: branchId || null,
        slug,
        title: title || `${ownerName} - Card`,
        ownerName: ownerName || user.name,
        ownerNameAr: ownerNameAr || null,
        jobTitle: jobTitle || 'Team Member',
        jobTitleAr: jobTitleAr || null,
        companyName: companyName || org.name,
        companyNameAr: companyNameAr || org.nameAr || null,
        phone: phone || '+96890000000',
        whatsapp: whatsapp || phone || '+96890000000',
        email: email || user.email,
        website: website || org.website || null,
        locationText: locationText || `${org.city}, Oman`,
        locationTextAr: locationTextAr || null,
        bio: bio || null,
        bioAr: bioAr || null,
        badgeText: badgeText || null,
        theme: theme || 'navy-violet',
        primaryColor: primaryColor || '#181D48',
        accentColor: accentColor || '#00B6B2',
        customActions: customActions ? (typeof customActions === 'string' ? customActions : JSON.stringify(customActions)) : null,
        socialLinks: socialLinks ? (typeof socialLinks === 'string' ? socialLinks : JSON.stringify(socialLinks)) : null,
        walletLocations: body.walletLocations ? (typeof body.walletLocations === 'string' ? body.walletLocations : JSON.stringify(body.walletLocations)) : null,
        walletDesign: body.walletDesign ? (typeof body.walletDesign === 'string' ? body.walletDesign : JSON.stringify(body.walletDesign)) : null,
        isPublished: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: orgId,
        userId: user.id,
        action: 'CARD_CREATED',
        resource: 'BusinessCard',
        resourceId: card.id,
      },
    });

    return NextResponse.json({ success: true, card });
  } catch (error: any) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
