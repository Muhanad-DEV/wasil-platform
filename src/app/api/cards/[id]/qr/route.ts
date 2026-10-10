import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQRCodeDataUrl, generateQRCodeSvg } from '@/lib/qrcode';
import QRCode from 'qrcode';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const card = await prisma.businessCard.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

    const searchParams = req.nextUrl.searchParams;
    const format = searchParams.get('format') || 'dataurl'; // dataurl, svg, png
    const fgColor = searchParams.get('fgColor') || card.primaryColor || '#181D48';
    const bgColor = searchParams.get('bgColor') || '#FFFFFF';

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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
      width: 500,
    });

    return NextResponse.json({
      dataUrl,
      targetUrl,
      slug: card.slug,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
