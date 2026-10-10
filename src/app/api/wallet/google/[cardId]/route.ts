import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateGoogleWalletLink } from '@/lib/wallet';

export async function GET(req: NextRequest, { params }: { params: { cardId: string } }) {
  try {
    const card = await prisma.businessCard.findFirst({
      where: {
        OR: [{ id: params.cardId }, { slug: params.cardId }],
      },
      include: { organization: true },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const cardUrl = `${baseUrl}/c/${card.slug}`;
    const serialNumber = `WSL-GGL-${card.id.substring(0, 8).toUpperCase()}`;

    const { saveUrl, jwtToken, isSimulated } = generateGoogleWalletLink({
      serialNumber,
      cardTitle: card.title,
      ownerName: card.ownerName,
      ownerNameAr: card.ownerNameAr,
      jobTitle: card.jobTitle,
      companyName: card.companyName,
      companyNameAr: card.companyNameAr,
      phone: card.phone,
      email: card.email,
      website: card.website,
      barcodeUrl: cardUrl,
      primaryColor: card.primaryColor,
      backgroundColor: card.primaryColor,
      type: 'BUSINESS_CARD',
    });

    // Record in DB
    await prisma.walletPass.upsert({
      where: { serialNumber },
      update: {
        downloadCount: { increment: 1 },
        lastIssuedAt: new Date(),
        isSimulated,
      },
      create: {
        organizationId: card.organizationId,
        cardId: card.id,
        platform: 'GOOGLE',
        serialNumber,
        barcodeValue: cardUrl,
        status: 'ACTIVE',
        isSimulated,
        downloadCount: 1,
        lastIssuedAt: new Date(),
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        organizationId: card.organizationId,
        cardId: card.id,
        eventType: isSimulated ? 'WALLET_ADD_ATTEMPT' : 'WALLET_ISSUED',
        device: 'MOBILE',
        browser: 'Chrome Android',
      },
    });

    return NextResponse.json({
      success: true,
      saveUrl,
      jwtToken,
      isSimulated,
      serialNumber,
      message: isSimulated
        ? 'Pass generated in Sandbox/Demo mode. For production issuance, configure Google Wallet Issuer ID in settings.'
        : 'Google Wallet pass generated successfully.',
    });
  } catch (error: any) {
    console.error('Google Wallet pass error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
