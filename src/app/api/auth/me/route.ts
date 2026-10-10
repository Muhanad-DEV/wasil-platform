import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const primaryMembership = user.memberships[0];

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isSuperAdmin: user.isSuperAdmin,
        phone: user.phone,
      },
      organization: primaryMembership?.organization || null,
      membershipRole: primaryMembership?.role || null,
      memberships: user.memberships.map((m) => ({
        orgId: m.organizationId,
        orgName: m.organization.name,
        role: m.role,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
