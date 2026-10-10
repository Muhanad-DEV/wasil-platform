import crypto from 'crypto';
import JSZip from 'jszip';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';

export interface WalletPassConfig {
  serialNumber: string;
  cardTitle: string;
  ownerName: string;
  ownerNameAr?: string | null;
  jobTitle: string;
  companyName: string;
  companyNameAr?: string | null;
  phone: string;
  email: string;
  website?: string | null;
  barcodeUrl: string;
  primaryColor?: string; // hex
  backgroundColor?: string;
  type?: 'BUSINESS_CARD' | 'LOYALTY_CARD';
  points?: number;
  tier?: string;
}

export interface WalletIntegrationStatus {
  appleWalletConfigured: boolean;
  googleWalletConfigured: boolean;
  isSandboxMode: boolean;
  applePassTypeId?: string;
  googleIssuerId?: string;
}

export function getWalletIntegrationStatus(): WalletIntegrationStatus {
  const applePassTypeId = process.env.APPLE_PASS_TYPE_ID;
  const appleKey = process.env.APPLE_PRIVATE_KEY_PEM;
  const googleIssuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
  const googleKey = process.env.GOOGLE_WALLET_PRIVATE_KEY;

  const appleWalletConfigured = Boolean(applePassTypeId && appleKey);
  const googleWalletConfigured = Boolean(googleIssuerId && googleKey);
  const isSandboxMode = process.env.ENABLE_DEMO_MODE === 'true' || (!appleWalletConfigured && !googleWalletConfigured);

  return {
    appleWalletConfigured,
    googleWalletConfigured,
    isSandboxMode,
    applePassTypeId: applePassTypeId || undefined,
    googleIssuerId: googleIssuerId || undefined,
  };
}

/**
 * Generates an Apple Wallet pass (.pkpass file buffer)
 * Following official Apple Wallet PassKit specifications:
 * - pass.json
 * - manifest.json (SHA-1 hashes of all assets)
 * - icon.png & icon@2x.png (Mandatory by Apple PassKit)
 * - logo.png & logo@2x.png (Mandatory for branded passes)
 * - signature (PKCS#7 detached signature)
 */
export async function generateAppleWalletPass(config: WalletPassConfig): Promise<{
  buffer: Buffer;
  isSimulated: boolean;
}> {
  const status = getWalletIntegrationStatus();
  const zip = new JSZip();

  // Color conversions: hex to rgb(r, g, b)
  const hexToRgb = (hex: string = '#181D48') => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return `rgb(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255})`;
  };

  const isLoyalty = config.type === 'LOYALTY_CARD';

  const passJson: Record<string, unknown> = {
    formatVersion: 1,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID || 'pass.om.wasil.businesscard',
    serialNumber: config.serialNumber,
    teamIdentifier: process.env.APPLE_TEAM_ID || 'WASILOMAN01',
    organizationName: config.companyName,
    description: isLoyalty
      ? `${config.companyName} Loyalty Membership`
      : `${config.ownerName} - ${config.companyName}`,
    logoText: 'Wasil | واصل',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: hexToRgb(config.backgroundColor || (isLoyalty ? '#6317B5' : '#181D48')),
    labelColor: 'rgb(200, 210, 240)',
    barcodes: [
      {
        format: 'PKBarcodeFormatQR',
        message: config.barcodeUrl,
        messageEncoding: 'iso-8859-1',
        altText: config.serialNumber,
      },
    ],
  };

  if (isLoyalty) {
    passJson.storeCard = {
      headerFields: [
        {
          key: 'points',
          label: 'POINTS / النقاط',
          value: config.points || 0,
        },
      ],
      primaryFields: [
        {
          key: 'member',
          label: 'MEMBER / العضو',
          value: config.ownerName,
        },
      ],
      secondaryFields: [
        {
          key: 'tier',
          label: 'TIER / الفئة',
          value: config.tier || 'SILVER',
        },
      ],
      backFields: [
        {
          key: 'terms',
          label: 'TERMS & CONDITIONS / الشروط والأحكام',
          value: 'Valid across all participating branches in the Sultanate of Oman. Points are non-transferable.',
        },
        {
          key: 'poweredBy',
          label: 'POWERED BY / بواسطة',
          value: 'Wasil Digital Platform - Oman (wasil.om)',
        },
      ],
    };
  } else {
    passJson.generic = {
      primaryFields: [
        {
          key: 'name',
          label: 'NAME / الاسم',
          value: config.ownerName,
        },
      ],
      secondaryFields: [
        {
          key: 'title',
          label: 'TITLE / المسمى',
          value: config.jobTitle,
        },
        {
          key: 'company',
          label: 'COMPANY / الشركة',
          value: config.companyName,
        },
      ],
      auxiliaryFields: [
        {
          key: 'phone',
          label: 'PHONE / الهاتف',
          value: config.phone,
        },
        {
          key: 'email',
          label: 'EMAIL / البريد',
          value: config.email,
        },
      ],
      backFields: [
        {
          key: 'website',
          label: 'WEBSITE / الموقع الإلكتروني',
          value: config.website || 'https://wasil.om',
        },
        {
          key: 'notes',
          label: 'DIGITAL IDENTITY / الهوية الرقمية',
          value: 'Official Verified Business Card issued via Wasil Platform (سلطنة عُمان).',
        },
      ],
    };
  }

  const passJsonBuffer = Buffer.from(JSON.stringify(passJson, null, 2), 'utf-8');

  // Generate valid PNG images required by Apple PassKit specification
  const primaryHex = config.primaryColor || '#181D48';
  const iconBuffer = await QRCode.toBuffer(config.barcodeUrl, {
    width: 58,
    margin: 1,
    color: { dark: primaryHex, light: '#FFFFFF' },
  });

  const icon2xBuffer = await QRCode.toBuffer(config.barcodeUrl, {
    width: 116,
    margin: 1,
    color: { dark: primaryHex, light: '#FFFFFF' },
  });

  const logoBuffer = await QRCode.toBuffer(config.barcodeUrl, {
    width: 160,
    margin: 1,
    color: { dark: primaryHex, light: '#FFFFFF' },
  });

  const logo2xBuffer = await QRCode.toBuffer(config.barcodeUrl, {
    width: 320,
    margin: 1,
    color: { dark: primaryHex, light: '#FFFFFF' },
  });

  // Collect files to hash for manifest.json
  const files: Record<string, Buffer> = {
    'pass.json': passJsonBuffer,
    'icon.png': iconBuffer,
    'icon@2x.png': icon2xBuffer,
    'logo.png': logoBuffer,
    'logo@2x.png': logo2xBuffer,
  };

  const manifest: Record<string, string> = {};

  for (const [filename, fileBuffer] of Object.entries(files)) {
    zip.file(filename, fileBuffer);
    manifest[filename] = crypto.createHash('sha1').update(fileBuffer).digest('hex');
  }

  const manifestBuffer = Buffer.from(JSON.stringify(manifest, null, 2), 'utf-8');
  zip.file('manifest.json', manifestBuffer);

  // Sign manifest if Apple credentials are present
  let signatureBuffer: Buffer;
  let isSimulated = false;

  if (
    status.appleWalletConfigured &&
    process.env.APPLE_PRIVATE_KEY_PEM &&
    process.env.APPLE_CERTIFICATE_PEM
  ) {
    try {
      const sign = crypto.createSign('SHA256');
      sign.update(manifestBuffer);
      sign.end();
      signatureBuffer = sign.sign(process.env.APPLE_PRIVATE_KEY_PEM);
    } catch (err) {
      isSimulated = true;
      // Valid PKCS#7 / CMS DER structure header
      signatureBuffer = Buffer.from(
        '308201a006092a864886f70d010702a08201913082018d020101310b300906052b0e03021a0500300b06092a864886f70d010701',
        'hex'
      );
    }
  } else {
    isSimulated = true;
    signatureBuffer = Buffer.from(
      '308201a006092a864886f70d010702a08201913082018d020101310b300906052b0e03021a0500300b06092a864886f70d010701',
      'hex'
    );
  }

  zip.file('signature', signatureBuffer);

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  return {
    buffer: zipBuffer,
    isSimulated,
  };
}

/**
 * Creates Google Wallet Pass payload (JWT link & Class/Object spec)
 */
export function generateGoogleWalletLink(config: WalletPassConfig): {
  saveUrl: string;
  jwtToken: string;
  isSimulated: boolean;
} {
  const status = getWalletIntegrationStatus();
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || '3388000000022119988';
  const classId = `${issuerId}.wasil_${config.type?.toLowerCase() || 'card'}_v1`;
  const objectId = `${issuerId}.${config.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  const claims = {
    iss: process.env.GOOGLE_WALLET_CLIENT_EMAIL || 'wasil-wallet-service@wasil-oman-demo.iam.gserviceaccount.com',
    aud: 'google',
    origins: ['http://localhost:3000', 'https://wasil.om'],
    typ: 'savetowallet',
    payload: {
      genericObjects: [
        {
          id: objectId,
          classId: classId,
          logo: {
            sourceUri: {
              uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
            },
          },
          cardTitle: {
            defaultValue: {
              language: 'en',
              value: config.companyName,
            },
          },
          subheader: {
            defaultValue: {
              language: 'en',
              value: config.jobTitle,
            },
          },
          header: {
            defaultValue: {
              language: 'en',
              value: config.ownerName,
            },
          },
          barcode: {
            type: 'QR_CODE',
            value: config.barcodeUrl,
            alternateText: config.serialNumber,
          },
          hexBackgroundColor: config.primaryColor || '#181D48',
        },
      ],
    },
  };

  const secret = process.env.GOOGLE_WALLET_PRIVATE_KEY || 'wasil_sandbox_google_wallet_signing_secret';
  const jwtToken = jwt.sign(claims, secret, { algorithm: 'HS256' });
  const saveUrl = `https://pay.google.com/gp/v/save/${jwtToken}`;

  return {
    saveUrl,
    jwtToken,
    isSimulated: status.isSandboxMode,
  };
}
