import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQRCodeDataUrl, generateQRCodeSvg } from '@/lib/qrcode';
import { getFallbackCard } from '@/lib/demo-data';
import QRCode from 'qrcode';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    let card: any = null;

    try {
      card = await prisma.businessCard.findFirst({
        where: {
          OR: [{ id: params.id }, { slug: params.id }],
        },
      });
    } catch (dbError) {
      console.warn('[QR API] Database query failed or unavailable, using fallback:', dbError);
    }

    if (!card) {
      card = getFallbackCard(params.id);
    }

    const searchParams = req.nextUrl.searchParams;
    const format = searchParams.get('format') || 'dataurl'; // dataurl, svg, png
    const fgColor = searchParams.get('fgColor') || card.primaryColor || '#181D48';
    const bgColor = searchParams.get('bgColor') || '#FFFFFF';

    const host = req.headers.get('host') || 'wasilom.netlify.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const targetUrl = `${baseUrl}/c/${card.slug}`;

    if (format === 'svg') {
      const svg = await generateQRCodeSvg({
        url: targetUrl,
        fgColor,
        bgColor,
      });

      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': `inline; filename="${card.slug}-qr.svg"`,
        },
      });
    }

    if (format === 'png') {
      const buffer = await QRCode.toBuffer(targetUrl, {
        type: 'png',
        errorCorrectionLevel: 'H',
        width: 800,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${card.slug}-qr.png"`,
        },
      });
    }

    // Default: return JSON with dataUrl
    const dataUrl = await generateQRCodeDataUrl({
      url: targetUrl,
      fgColor,
      bgColor,
    });

    return NextResponse.json({
      success: true,
      dataUrl,
      url: targetUrl,
      cardTitle: card.title || card.ownerName,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'QR generation failed' }, { status: 500 });
  }
}
