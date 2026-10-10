import QRCode from 'qrcode';

export interface QRCodeOptions {
  url: string;
  fgColor?: string;
  bgColor?: string;
  width?: number;
  margin?: number;
}

export async function generateQRCodeDataUrl(options: QRCodeOptions): Promise<string> {
  const { url, fgColor = '#181D48', bgColor = '#FFFFFF', width = 400, margin = 2 } = options;

  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    width,
    margin,
    color: {
      dark: fgColor,
      light: bgColor,
    },
  });
}

export async function generateQRCodeSvg(options: QRCodeOptions): Promise<string> {
  const { url, fgColor = '#181D48', bgColor = '#FFFFFF', width = 400, margin = 2 } = options;

  return QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    width,
    margin,
    color: {
      dark: fgColor,
      light: bgColor,
    },
  });
}
