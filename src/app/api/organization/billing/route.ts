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

    const [subscription, plans, invoices, cardCount, memberCount, branchCount] = await Promise.all([
      prisma.subscription.findUnique({
        where: { organizationId: orgId },
        include: { plan: true },
      }),
      prisma.plan.findMany({ where: { isActive: true }, orderBy: { priceMonthlyOMR: 'asc' } }),
      prisma.invoice.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.businessCard.count({ where: { organizationId: orgId } }),
      prisma.organizationMembership.count({ where: { organizationId: orgId } }),
      prisma.branch.count({ where: { organizationId: orgId } }),
    ]);

    return NextResponse.json({
      subscription,
      plans,
      invoices,
      usage: {
        cardsUsed: cardCount,
        maxCards: subscription?.plan.maxCards ?? 1,
        membersUsed: memberCount,
        maxMembers: subscription?.plan.maxTeamMembers ?? 1,
        branchesUsed: branchCount,
        maxBranches: subscription?.plan.maxBranches ?? 1,
      },
      isSandboxBilling: true,
      currency: 'OMR',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { organizationId, planCode, billingInterval } = body;

    const orgId = organizationId || user.memberships[0]?.organizationId;
    if (!orgId || !planCode) {
      return NextResponse.json({ error: 'Organization ID and Plan Code are required' }, { status: 400 });
    }

    await requireOrgAccess(orgId, req);

    const targetPlan = await prisma.plan.findUnique({ where: { code: planCode } });
    if (!targetPlan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 404 });
    }

    const interval = billingInterval === 'YEARLY' ? 'YEARLY' : 'MONTHLY';
    const amountOMR = interval === 'YEARLY' ? targetPlan.priceYearlyOMR : targetPlan.priceMonthlyOMR;
    const daysToAdd = interval === 'YEARLY' ? 365 : 30;

    const invoiceNumber = `INV-WSL-${Date.now().toString().slice(-6)}`;

    const { updatedSub, invoice } = await prisma.$transaction(async (tx) => {
      const updatedSub = await tx.subscription.upsert({
        where: { organizationId: orgId },
        update: {
          planId: targetPlan.id,
          status: 'ACTIVE',
          billingInterval: interval,
          currentPeriodEnd: new Date(Date.now() + 86400000 * daysToAdd),
          isSandbox: true,
        },
        create: {
          organizationId: orgId,
          planId: targetPlan.id,
          status: 'ACTIVE',
          billingInterval: interval,
          currentPeriodEnd: new Date(Date.now() + 86400000 * daysToAdd),
          isSandbox: true,
        },
        include: { plan: true },
      });

      const invoice = await tx.invoice.create({
        data: {
          organizationId: orgId,
          subscriptionId: updatedSub.id,
          invoiceNumber,
          amountOMR,
          currency: 'OMR',
          status: 'PAID',
          paymentMethod: 'SANDBOX_GATEWAY',
          paidAt: new Date(),
        },
      });

      await tx.auditLog.create({
        data: {
          organizationId: orgId,
          userId: user.id,
          action: 'PLAN_CHANGED',
          resource: 'Subscription',
          resourceId: updatedSub.id,
          detailsJson: JSON.stringify({
            plan: targetPlan.code,
            amountOMR,
            interval,
            invoiceNumber,
          }),
        },
      });

      return { updatedSub, invoice };
    });

    return NextResponse.json({
      success: true,
      subscription: updatedSub,
      invoice,
      message: `Plan upgraded to ${targetPlan.name} (${amountOMR.toFixed(3)} OMR) in Sandbox mode.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
