import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAppleWalletPass } from '@/lib/wallet';
import { getFallbackCard } from '@/lib/demo-data';

export async function GET(req: NextRequest, { params }: { params: { cardId: string } }) {
  try {
    let card: any = null;

    // Attempt to query database
    try {
      card = await prisma.businessCard.findFirst({
        where: {
          OR: [{ id: params.cardId }, { slug: params.cardId }],
        },
        include: { organization: true },
      });
    } catch (dbError) {
      console.warn('[Apple Wallet API] Database query failed or unavailable, using fallback:', dbError);
    }

    // If card not found in DB or DB unreachable, use fallback demo data
    if (!card) {
      card = getFallbackCard(params.cardId);
    }

    const host = req.headers.get('host') || 'wasilom.netlify.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const cardUrl = `${baseUrl}/c/${card.slug}`;
    const cleanId = (card.id || card.slug).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase();
    const serialNumber = `WSL-APL-${cleanId}`;

    const { buffer, isSimulated } = await generateAppleWalletPass({
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

    // Non-fatal recording in DB: analytics or pass record failure must NEVER block the pass download
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
            platform: 'APPLE',
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
            browser: 'Safari Mobile',
          },
        });
      }
    } catch (writeErr) {
      // Intentionally non-fatal in serverless / read-only SQLite environments
      console.warn('[Apple Wallet API] Non-fatal pass registration write skipped:', writeErr);
    }

    const fileName = `${card.slug || 'business-card'}.pkpass`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'X-Wasil-Wallet-Simulated': isSimulated ? 'true' : 'false',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Apple Wallet pass generation fatal error:', error);
    return NextResponse.json({ error: error.message || 'Pass generation failed' }, { status: 500 });
  }
}
