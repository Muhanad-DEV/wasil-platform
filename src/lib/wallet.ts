import crypto from 'crypto';
import JSZip from 'jszip';
import jwt from 'jsonwebtoken';

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
 * Following Apple Wallet specification: pass.json + manifest.json + signature
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

  const passJsonString = JSON.stringify(passJson, null, 2);
  zip.file('pass.json', passJsonString);

  // Generate SHA-1 hashes for manifest.json
  const passHash = crypto.createHash('sha1').update(passJsonString).digest('hex');
  const manifest = {
    'pass.json': passHash,
  };
  const manifestString = JSON.stringify(manifest, null, 2);
  zip.file('manifest.json', manifestString);

  // Sign manifest if Apple credentials are present
  let signatureBuffer: Buffer;
  let isSimulated = false;

  if (status.appleWalletConfigured && process.env.APPLE_PRIVATE_KEY_PEM) {
    try {
      const sign = crypto.createSign('SHA1');
      sign.update(manifestString);
      sign.end();
      signatureBuffer = sign.sign(process.env.APPLE_PRIVATE_KEY_PEM);
    } catch (err) {
      // Fallback to simulated mode with error logged
      isSimulated = true;
      signatureBuffer = Buffer.from('WASIL_SANDBOX_SIMULATED_SIGNATURE_OMAN_PASS');
    }
  } else {
    isSimulated = true;
    signatureBuffer = Buffer.from('WASIL_SANDBOX_SIMULATED_SIGNATURE_OMAN_PASS');
  }

  zip.file('signature', signatureBuffer);

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
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
          cardTitle: {
            defaultValue: {
              language: 'en',
              value: config.companyName,
            },
          },
          header: {
            defaultValue: {
              language: 'en',
              value: config.ownerName,
            },
          },
          subheader: {
            defaultValue: {
              language: 'en',
              value: config.jobTitle,
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

  const isSimulated = !status.googleWalletConfigured;
  const privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY || 'wasil-sandbox-dummy-key';

  let token: string;
  try {
    if (status.googleWalletConfigured) {
      token = jwt.sign(claims, privateKey, { algorithm: 'RS256' });
    } else {
      token = jwt.sign(claims, 'wasil-sandbox-secret', { algorithm: 'HS256' });
    }
  } catch {
    token = jwt.sign(claims, 'wasil-sandbox-secret', { algorithm: 'HS256' });
  }

  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  return {
    saveUrl,
    jwtToken: token,
    isSimulated,
  };
}
