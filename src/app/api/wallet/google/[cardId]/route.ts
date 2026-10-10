import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateGoogleWalletLink } from '@/lib/wallet';
import { getFallbackCard } from '@/lib/demo-data';

export async function GET(req: NextRequest, { params }: { params: { cardId: string } }) {
  try {
    let card: any = null;

    try {
      card = await prisma.businessCard.findFirst({
        where: {
          OR: [{ id: params.cardId }, { slug: params.cardId }],
        },
        include: { organization: true },
      });
    } catch (dbError) {
      console.warn('[Google Wallet API] Database query failed or unavailable, using fallback:', dbError);
    }

    if (!card) {
      card = getFallbackCard(params.cardId);
    }

    const host = req.headers.get('host') || 'wasilom.netlify.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const cardUrl = `${baseUrl}/c/${card.slug}`;
    const cleanId = (card.id || card.slug).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase();
    const serialNumber = `WSL-GGL-${cleanId}`;

    const { saveUrl, jwtToken, isSimulated } = generateGoogleWalletLink({
      serialNumber,
      cardTitle: card.title || card.ownerName,
      ownerName: card.ownerName,
      ownerNameAr: card.ownerNameAr,
      jobTitle: card.jobTitle,
      companyName: card.companyName,
      companyNameAr: card.companyNameAr,
      phone: card.phone,
      email: card.email,
      website: card.website,
      barcodeUrl: cardUrl,
      primaryColor: card.primaryColor || '#181D48',
      backgroundColor: card.primaryColor || '#181D48',
      type: 'BUSINESS_CARD',
    });

    // Non-fatal recording in DB
    try {
      if (card.organizationId) {
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
      }
    } catch (writeErr) {
      console.warn('[Google Wallet API] Non-fatal pass registration write skipped:', writeErr);
    }

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
    console.error('Google Wallet pass generation fatal error:', error);
    return NextResponse.json({ error: error.message || 'Pass generation failed' }, { status: 500 });
  }
}
