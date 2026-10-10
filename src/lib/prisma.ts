import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function getEffectiveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // If a PostgreSQL / MySQL / external database is configured, use it directly
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  // Detect serverless environment (Netlify, Vercel, AWS Lambda)
  const isServerless = Boolean(
    process.env.NETLIFY ||
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    process.env.AWS_REGION
  );

  if (isServerless) {
    const tmpDbPath = path.join('/tmp', 'dev.db');

    // If /tmp/dev.db doesn't exist yet in this lambda execution container, copy from bundle
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'public', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.join(__dirname, 'prisma', 'dev.db'),
        path.join(__dirname, '..', 'prisma', 'dev.db'),
        path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
        path.join('/var/task', 'prisma', 'dev.db'),
        path.join('/var/task', 'public', 'dev.db'),
        path.join('/var/task', 'dev.db'),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            console.log(`[Wasil] Successfully copied database from ${candidate} to ${tmpDbPath}`);
            break;
          } catch (err) {
            console.warn(`[Wasil] Failed to copy database from ${candidate}:`, err);
          }
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  // Standard local environment fallback
  return envUrl || 'file:./dev.db';
}

const activeDbUrl = getEffectiveDatabaseUrl();

// Ensure process.env.DATABASE_URL is aligned for runtime
process.env.DATABASE_URL = activeDbUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
