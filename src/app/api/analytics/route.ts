import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, requireOrgAccess } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const orgId = searchParams.get('orgId') || user.memberships[0]?.organizationId;

    if (!orgId) return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });

    await requireOrgAccess(orgId, req);

    const [
      cardsCount,
      leads,
      events,
      walletPasses,
      loyaltyMembersCount,
      cards,
      campaigns,
    ] = await Promise.all([
      prisma.businessCard.count({ where: { organizationId: orgId } }),
      prisma.lead.findMany({ where: { organizationId: orgId } }),
      prisma.analyticsEvent.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.walletPass.findMany({ where: { organizationId: orgId } }),
      prisma.loyaltyMember.count({
        where: { program: { organizationId: orgId } },
      }),
      prisma.businessCard.findMany({
        where: { organizationId: orgId },
        select: {
          id: true,
          title: true,
          ownerName: true,
          viewCount: true,
          scanCount: true,
          saveContactCount: true,
          slug: true,
        },
        orderBy: { viewCount: 'desc' },
        take: 5,
      }),
      prisma.campaign.findMany({
        where: { organizationId: orgId },
        include: { _count: { select: { leads: true } } },
        orderBy: { scansCount: 'desc' },
      }),
    ]);

    // Aggregate metrics
    const totalViews = cards.reduce((acc, c) => acc + c.viewCount, 0);
    const qrScans = events.filter((e) => e.eventType === 'QR_SCAN').length +
      cards.reduce((acc, c) => acc + c.scanCount, 0);
    const vcardDownloads = cards.reduce((acc, c) => acc + c.saveContactCount, 0);
    const walletAdds = walletPasses.reduce((acc, w) => acc + w.downloadCount, 0);

    const leadsCount = leads.length;
    const wonLeads = leads.filter((l) => l.stage === 'WON');
    const wonLeadsCount = wonLeads.length;
    const wonRevenueOMR = wonLeads.reduce((acc, l) => acc + (l.dealValueOMR || 0), 0);
    const conversionRate = leadsCount > 0 ? ((wonLeadsCount / leadsCount) * 100).toFixed(1) : '0';

    // Group leads by stage
    const stages = ['NEW', 'CONTACTED', 'QUALIFIED', 'APPOINTMENT_SCHEDULED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST'];
    const leadsByStage = stages.map((st) => ({
      stage: st,
      count: leads.filter((l) => l.stage === st).length,
    }));

    // Group leads by source
    const sources = ['DIGITAL_CARD', 'QR_SCAN', 'PUBLIC_PROFILE', 'DIRECT', 'REFERRAL', 'MANUAL'];
    const leadsBySource = sources.map((src) => ({
      source: src,
      count: leads.filter((l) => l.source === src).length,
    }));

    // Group recent 7 days trends
    const dailyMap: Record<string, { date: string; views: number; scans: number; leads: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = { date: key, views: 0, scans: 0, leads: 0 };
    }

    events.forEach((ev) => {
      const day = ev.createdAt.toISOString().split('T')[0];
      if (dailyMap[day]) {
        if (ev.eventType === 'PAGE_VIEW') dailyMap[day].views++;
        if (ev.eventType === 'QR_SCAN') dailyMap[day].scans++;
        if (ev.eventType === 'INQUIRY_SUBMIT') dailyMap[day].leads++;
      }
    });

    const trendDays = Object.values(dailyMap);

    return NextResponse.json({
      metrics: {
        totalCards: cardsCount,
        totalViews,
        qrScans,
        vcardDownloads,
        walletAdds,
        leadsCount,
        wonLeadsCount,
        wonRevenueOMR,
        conversionRate,
        loyaltyMembersCount,
      },
      leadsByStage,
      leadsBySource,
      trendDays,
      topPerformingCards: cards,
      topCampaigns: campaigns,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
