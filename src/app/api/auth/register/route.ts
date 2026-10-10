import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signJwt, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, companyName, industry, phone } = body;

    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields (name, email, password, companyName)' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const slugBase = companyName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'company';
    const slug = `${slugBase}-${Math.floor(1000 + Math.random() * 9000)}`;

    const freePlan = await prisma.plan.findUnique({ where: { code: 'FREE' } });

    // Transactionally create User, Organization, Membership, Profile, Default Card, Subscription
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name,
          phone: phone || null,
          passwordHash,
          role: 'ORGANIZATION_OWNER',
          emailVerified: true,
        },
      });

      const org = await tx.organization.create({
        data: {
          slug,
          name: companyName,
          industry: industry || 'GENERAL',
          country: 'Oman',
          city: 'Muscat',
          phone: phone || null,
          email: email.toLowerCase().trim(),
          defaultLanguage: 'ar',
          currency: 'OMR',
        },
      });

      await tx.organizationMembership.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: 'OWNER',
          title: 'Founder / General Manager',
          status: 'ACTIVE',
        },
      });

      await tx.businessProfile.create({
        data: {
          organizationId: org.id,
          headline: `Welcome to ${companyName}`,
          headlineAr: `مرحباً بكم في ${companyName}`,
          bio: 'Innovative solutions and premier services in the Sultanate of Oman.',
          bioAr: 'حلول مبتكرة وخدمات رائدة في سلطنة عُمان.',
          isPublished: true,
        },
      });

      const cardSlug = `${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') || 'card'}-${Math.floor(1000 + Math.random() * 9000)}`;

      await tx.businessCard.create({
        data: {
          organizationId: org.id,
          slug: cardSlug,
          title: `${name} - Business Card`,
          ownerName: name,
          jobTitle: 'Founder / Managing Director',
          companyName: companyName,
          phone: phone || '+96890000000',
          whatsapp: phone || '+96890000000',
          email: email.toLowerCase().trim(),
          isPrimary: true,
          isPublished: true,
        },
      });

      if (freePlan) {
        await tx.subscription.create({
          data: {
            organizationId: org.id,
            planId: freePlan.id,
            status: 'ACTIVE',
            billingInterval: 'MONTHLY',
            currentPeriodEnd: new Date(Date.now() + 86400000 * 365),
            isSandbox: true,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          organizationId: org.id,
          userId: user.id,
          action: 'ORGANIZATION_REGISTERED',
          resource: 'Organization',
          resourceId: org.id,
        },
      });

      return { user, org };
    });

    const token = signJwt({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      isSuperAdmin: result.user.isSuperAdmin,
      defaultOrgId: result.org.id,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        isSuperAdmin: result.user.isSuperAdmin,
      },
      organization: result.org,
    });

    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
