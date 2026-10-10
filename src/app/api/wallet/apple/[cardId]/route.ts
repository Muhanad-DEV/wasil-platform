import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAppleWalletPass } from '@/lib/wallet';

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
    const serialNumber = `WSL-APL-${card.id.substring(0, 8).toUpperCase()}`;

    const { buffer, isSimulated } = await generateAppleWalletPass({
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

    // Record or update WalletPass in database
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
        platform: 'APPLE',
        serialNumber,
        barcodeValue: cardUrl,
        status: 'ACTIVE',
        isSimulated,
        downloadCount: 1,
        lastIssuedAt: new Date(),
      },
    });

    // Log Analytics Event
    await prisma.analyticsEvent.create({
      data: {
        organizationId: card.organizationId,
        cardId: card.id,
        eventType: isSimulated ? 'WALLET_ADD_ATTEMPT' : 'WALLET_ISSUED',
        device: 'MOBILE',
        browser: 'Safari Mobile',
      },
    });

    const fileName = `${card.slug}.pkpass`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'X-Wasil-Wallet-Simulated': isSimulated ? 'true' : 'false',
      },
    });
  } catch (error: any) {
    console.error('Apple Wallet pass error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
