import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'wasil-super-secure-production-ready-jwt-secret-key-oman-2026';
const TOKEN_COOKIE_NAME = 'wasil_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  isSuperAdmin: boolean;
  defaultOrgId?: string;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signJwt(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwt(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser(req?: NextRequest) {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    const cookieStore = cookies();
    token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  }

  if (!token) return null;

  const payload = verifyJwt(token);
  if (!payload?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  return user;
}

export async function requireAuth(req?: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireOrgAccess(orgId: string, req?: NextRequest) {
  const user = await requireAuth(req);

  if (user.isSuperAdmin) {
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new Error('NOT_FOUND');
    return { user, org, membershipRole: 'SUPER_ADMIN' };
  }

  const membership = user.memberships.find((m) => m.organizationId === orgId);
  if (!membership || membership.status !== 'ACTIVE') {
    throw new Error('FORBIDDEN');
  }

  return {
    user,
    org: membership.organization,
    membershipRole: membership.role,
  };
}

export { TOKEN_COOKIE_NAME };
