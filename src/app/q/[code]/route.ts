import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const code = params.code.trim();

    const qr = await prisma.qRCode.findUnique({
      where: { code },
      include: { campaign: true, card: true },
    });

    if (!qr || !qr.isActive) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // 1. Increment scan counter on QR code
    await prisma.qRCode.update({
      where: { id: qr.id },
      data: { scanCount: { increment: 1 } },
    });

    // 2. Increment campaign scans if linked
    if (qr.campaignId) {
      await prisma.campaign.update({
        where: { id: qr.campaignId },
        data: { scansCount: { increment: 1 } },
      });
    }

    // 3. Increment card scans if linked
    if (qr.cardId) {
      await prisma.businessCard.update({
        where: { id: qr.cardId },
        data: { scanCount: { increment: 1 } },
      });
    }

    // 4. Record AnalyticsEvent with device info
    const userAgent = req.headers.get('user-agent') || '';
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);

    await prisma.analyticsEvent.create({
      data: {
        organizationId: qr.organizationId,
        cardId: qr.cardId,
        campaignId: qr.campaignId,
        qrCodeId: qr.id,
        eventType: 'QR_SCAN',
        device: isMobile ? 'MOBILE' : 'DESKTOP',
        browser: userAgent.includes('Safari') && !userAgent.includes('Chrome') ? 'Safari' : 'Chrome',
        country: 'OM',
        city: 'Muscat',
      },
    });

    // 5. Append UTM attribution parameters to destination URL
    let target = qr.targetUrl;
    if (qr.campaign) {
      const urlObj = new URL(target, req.url);
      if (qr.campaign.utmSource) urlObj.searchParams.set('utm_source', qr.campaign.utmSource);
      if (qr.campaign.utmMedium) urlObj.searchParams.set('utm_medium', qr.campaign.utmMedium);
      if (qr.campaign.utmCampaign) urlObj.searchParams.set('utm_campaign', qr.campaign.utmCampaign);
      urlObj.searchParams.set('wsl_qr', qr.code);
      target = urlObj.toString();
    }

    return NextResponse.redirect(target);
  } catch (error) {
    console.error('QR redirect error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
