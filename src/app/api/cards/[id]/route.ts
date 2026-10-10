import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, requireOrgAccess } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const card = await prisma.businessCard.findUnique({
      where: { id: params.id },
      include: {
        branch: true,
        walletPasses: true,
        organization: true,
      },
    });

    if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

    await requireOrgAccess(card.organizationId, req);

    return NextResponse.json({ card });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existing = await prisma.businessCard.findUnique({
      where: { id: params.id },
    });

    if (!existing) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

    const { user } = await requireOrgAccess(existing.organizationId, req);

    const body = await req.json();
    const {
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
      mapsUrl,
      bio,
      bioAr,
      badgeText,
      theme,
      primaryColor,
      accentColor,
      customActions,
      socialLinks,
      branchId,
      isPublished,
    } = body;

    const updated = await prisma.businessCard.update({
      where: { id: params.id },
      data: {
        title: title !== undefined ? title : existing.title,
        ownerName: ownerName !== undefined ? ownerName : existing.ownerName,
        ownerNameAr: ownerNameAr !== undefined ? ownerNameAr : existing.ownerNameAr,
        jobTitle: jobTitle !== undefined ? jobTitle : existing.jobTitle,
        jobTitleAr: jobTitleAr !== undefined ? jobTitleAr : existing.jobTitleAr,
        companyName: companyName !== undefined ? companyName : existing.companyName,
        companyNameAr: companyNameAr !== undefined ? companyNameAr : existing.companyNameAr,
        phone: phone !== undefined ? phone : existing.phone,
        whatsapp: whatsapp !== undefined ? whatsapp : existing.whatsapp,
        email: email !== undefined ? email : existing.email,
        website: website !== undefined ? website : existing.website,
        locationText: locationText !== undefined ? locationText : existing.locationText,
        locationTextAr: locationTextAr !== undefined ? locationTextAr : existing.locationTextAr,
        mapsUrl: mapsUrl !== undefined ? mapsUrl : existing.mapsUrl,
        bio: bio !== undefined ? bio : existing.bio,
        bioAr: bioAr !== undefined ? bioAr : existing.bioAr,
        badgeText: badgeText !== undefined ? badgeText : existing.badgeText,
        theme: theme !== undefined ? theme : existing.theme,
        primaryColor: primaryColor !== undefined ? primaryColor : existing.primaryColor,
        accentColor: accentColor !== undefined ? accentColor : existing.accentColor,
        customActions: customActions !== undefined ? (typeof customActions === 'string' ? customActions : JSON.stringify(customActions)) : existing.customActions,
        socialLinks: socialLinks !== undefined ? (typeof socialLinks === 'string' ? socialLinks : JSON.stringify(socialLinks)) : existing.socialLinks,
        walletLocations: body.walletLocations !== undefined ? (typeof body.walletLocations === 'string' ? body.walletLocations : JSON.stringify(body.walletLocations)) : existing.walletLocations,
        walletDesign: body.walletDesign !== undefined ? (typeof body.walletDesign === 'string' ? body.walletDesign : JSON.stringify(body.walletDesign)) : existing.walletDesign,
        branchId: branchId !== undefined ? branchId : existing.branchId,
        isPublished: isPublished !== undefined ? isPublished : existing.isPublished,
      },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: existing.organizationId,
        userId: user.id,
        action: 'CARD_UPDATED',
        resource: 'BusinessCard',
        resourceId: params.id,
      },
    });

    return NextResponse.json({ success: true, card: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existing = await prisma.businessCard.findUnique({
      where: { id: params.id },
    });

    if (!existing) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

    const { user } = await requireOrgAccess(existing.organizationId, req);

    await prisma.businessCard.delete({
      where: { id: params.id },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: existing.organizationId,
        userId: user.id,
        action: 'CARD_DELETED',
        resource: 'BusinessCard',
        resourceId: params.id,
      },
    });

    return NextResponse.json({ success: true, message: 'Card deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
