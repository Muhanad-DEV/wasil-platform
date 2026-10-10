import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || !user.isSuperAdmin) {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const [
      totalOrgs,
      activeOrgs,
      totalUsers,
      totalCards,
      totalLeads,
      walletPasses,
      subscriptions,
    ] = await Promise.all([
      prisma.organization.count(),
      prisma.organization.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.businessCard.count(),
      prisma.lead.count(),
      prisma.walletPass.count(),
      prisma.subscription.findMany({
        where: { status: 'ACTIVE' },
        include: { plan: true },
      }),
    ]);

    const totalMRR_OMR = subscriptions.reduce((sum, s) => sum + s.plan.priceMonthlyOMR, 0);

    return NextResponse.json({
      metrics: {
        totalOrgs,
        activeOrgs,
        totalUsers,
        totalCards,
        totalLeads,
        walletPasses,
        activeSubscriptionsCount: subscriptions.length,
        totalMRR_OMR,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
