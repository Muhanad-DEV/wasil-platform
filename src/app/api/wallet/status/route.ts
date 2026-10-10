import { NextResponse } from 'next/server';
import { getWalletIntegrationStatus } from '@/lib/wallet';

export async function GET() {
  const status = getWalletIntegrationStatus();

  return NextResponse.json({
    status,
    documentation: {
      appleWallet: {
        description: 'Apple Wallet requires a Pass Type Identifier certificate signed by Apple Developer Program (WWDR).',
        requiredEnvVars: ['APPLE_PASS_TYPE_ID', 'APPLE_TEAM_ID', 'APPLE_CERTIFICATE_PEM', 'APPLE_PRIVATE_KEY_PEM'],
        setupGuide: 'Export your Apple Pass certificate as .pem and configure environment variables.',
      },
      googleWallet: {
        description: 'Google Wallet API uses Google Cloud Service Account with Google Pay Business Console Issuer Account.',
        requiredEnvVars: ['GOOGLE_WALLET_ISSUER_ID', 'GOOGLE_WALLET_CLIENT_EMAIL', 'GOOGLE_WALLET_PRIVATE_KEY'],
        setupGuide: 'Create a Generic Pass Class in Google Pay Business Console and grant edit permissions to your service account.',
      },
    },
  });
}
