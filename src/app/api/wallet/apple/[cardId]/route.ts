import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAppleWalletPass } from '@/lib/wallet';
import { getFallbackCard } from '@/lib/demo-data';

export async function GET(req: NextRequest, { params }: { params: { cardId: string } }) {
  try {
    const rawCardId = decodeURIComponent(params.cardId || '').replace(/\.pkpass$/i, '').trim();
    let card: any = null;

    try {
      card = await prisma.businessCard.findFirst({
        where: {
          OR: [{ id: rawCardId }, { slug: rawCardId }],
        },
        include: { organization: true },
      });
    } catch (dbError) {
      console.warn('[Apple Wallet API] Database query failed or unavailable, using fallback:', dbError);
    }

    if (!card) {
      card = getFallbackCard(rawCardId);
    }

    const searchParams = req.nextUrl.searchParams;
    const isPkpassPath = params.cardId.toLowerCase().endsWith('.pkpass');
    const isDirectDownload = isPkpassPath || searchParams.get('download') === '1' || searchParams.get('format') === 'pkpass';
    const acceptHeader = req.headers.get('accept') || '';

    // If an end-user navigates directly in browser address bar without explicit download intent or .pkpass extension,
    // redirect them to the interactive card page with wallet modal open so Safari never throws a generic error.
    if (!isDirectDownload && acceptHeader.includes('text/html')) {
      const targetSlug = card.slug || rawCardId;
      return NextResponse.redirect(new URL(`/c/${targetSlug}?wallet=apple`, req.url));
    }

    const host = req.headers.get('host') || 'wasilom.netlify.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const cardUrl = `${baseUrl}/c/${card.slug}`;
    const cleanId = (card.id || card.slug).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase();
    const serialNumber = `WSL-APL-${cleanId}`;

    let parsedLocations: any[] = [];
    try {
      if (card.walletLocations) {
        parsedLocations = typeof card.walletLocations === 'string'
          ? JSON.parse(card.walletLocations)
          : card.walletLocations;
      }
    } catch (e) {
      parsedLocations = [];
    }

    let parsedDesign: any = {};
    try {
      if (card.walletDesign) {
        parsedDesign = typeof card.walletDesign === 'string'
          ? JSON.parse(card.walletDesign)
          : card.walletDesign;
      }
    } catch (e) {
      parsedDesign = {};
    }

    // If no locations configured on custom card, provide default project/hotel coordinates
    if (parsedLocations.length === 0) {
      parsedLocations = [
        {
          name: 'Al Mouj Muscat Marina',
          nameAr: 'مارينا الموج مسقط',
          type: 'PROJECT',
          latitude: 23.6263,
          longitude: 58.2612,
          relevantText: `مرحباً بك في مشروع الموج مسقط! اضغط لفتح بطاقة ${card.ownerNameAr || card.ownerName}`,
        },
        {
          name: 'The St. Regis Al Mouj Resort',
          nameAr: 'منتجع سانت ريجيس الموج مسقط',
          type: 'HOTEL',
          latitude: 23.6295,
          longitude: 58.2678,
          relevantText: `أنت بالقرب من سانت ريجيس مسقط! تواصل مع ${card.ownerNameAr || card.ownerName}`,
        },
      ];
    }

    const { buffer, isSimulated } = await generateAppleWalletPass({
      serialNumber,
      cardTitle: card.title || card.ownerName,
      ownerName: card.ownerName,
      ownerNameAr: card.ownerNameAr,
      jobTitle: card.jobTitle,
      jobTitleAr: card.jobTitleAr,
      companyName: card.companyName,
      companyNameAr: card.companyNameAr,
      phone: card.phone,
      whatsapp: card.whatsapp,
      email: card.email,
      website: card.website,
      barcodeUrl: cardUrl,
      primaryColor: parsedDesign.primaryColor || card.primaryColor || '#181D48',
      backgroundColor: parsedDesign.primaryColor || card.primaryColor || '#181D48',
      type: (parsedDesign.passType as any) || 'BUSINESS_CARD',
      locations: parsedLocations,
      crNumber: parsedDesign.crNumber || 'CR: 1084920 / RERA OM',
      bookingUrl: parsedDesign.bookingUrl || `${baseUrl}/c/${card.slug}`,
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
      console.warn('[Apple Wallet API] Non-fatal pass registration write skipped:', writeErr);
    }

    const fileName = `${card.slug || 'business-card'}.pkpass`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'X-Wasil-Wallet-Signed': isSimulated ? 'false' : 'true',
        'X-Wasil-Wallet-Simulated': isSimulated ? 'true' : 'false',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Apple Wallet pass generation fatal error:', error);
    return NextResponse.json({ error: error.message || 'Pass generation failed' }, { status: 500 });
  }
}
