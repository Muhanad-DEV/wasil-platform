import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, requireOrgAccess } from '@/lib/auth';

// Validate redemption code before claiming
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code')?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ error: 'Redemption code is required' }, { status: 400 });
    }

    const redemption = await prisma.rewardRedemption.findUnique({
      where: { redemptionCode: code },
      include: {
        reward: true,
        member: {
          include: { program: true },
        },
      },
    });

    if (!redemption) {
      return NextResponse.json(
        { valid: false, error: 'Invalid redemption code' },
        { status: 404 }
      );
    }

    const isExpired = new Date(redemption.expiresAt) < new Date();
    const isAlreadyRedeemed = redemption.status === 'VERIFIED';
    const isValid = redemption.status === 'PENDING' && !isExpired;

    return NextResponse.json({
      valid: isValid,
      redemption: {
        code: redemption.redemptionCode,
        status: redemption.status,
        rewardTitle: redemption.reward.title,
        rewardTitleAr: redemption.reward.titleAr,
        pointsRequired: redemption.reward.pointsRequired,
        discountValue: redemption.reward.discountValue,
        memberName: redemption.member.name,
        memberPhone: redemption.member.phone,
        memberPoints: redemption.member.pointsBalance,
        expiresAt: redemption.expiresAt,
        verifiedAt: redemption.verifiedAt,
        verifiedBy: redemption.verifiedBy,
      },
      reason: isAlreadyRedeemed
        ? 'Already redeemed on ' + redemption.verifiedAt?.toLocaleString()
        : isExpired
        ? 'Redemption code has expired'
        : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Complete the redemption (Employee verification)
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Redemption code is required' }, { status: 400 });
    }

    const redemptionCode = code.trim().toUpperCase();

    const result = await prisma.$transaction(async (tx) => {
      const redemption = await tx.rewardRedemption.findUnique({
        where: { redemptionCode },
        include: {
          reward: true,
          member: {
            include: { program: true },
          },
        },
      });

      if (!redemption) {
        throw new Error('NOT_FOUND: Redemption code not found');
      }

      if (redemption.status === 'VERIFIED') {
        throw new Error(`ALREADY_REDEEMED: This reward was already redeemed on ${redemption.verifiedAt?.toLocaleString()}`);
      }

      if (new Date(redemption.expiresAt) < new Date()) {
        throw new Error('EXPIRED: This redemption code has expired');
      }

      // Check tenant access of the staff user
      const membership = user.memberships.find(
        (m) => m.organizationId === redemption.member.program.organizationId
      );

      if (!membership && !user.isSuperAdmin) {
        throw new Error('FORBIDDEN: You do not have permission to verify rewards for this organization');
      }

      // 1. Mark redemption as VERIFIED
      const updatedRedemption = await tx.rewardRedemption.update({
        where: { id: redemption.id },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
          verifiedBy: user.name,
        },
      });

      // 2. Deduct points from member balance
      const pointsToDeduct = redemption.reward.pointsRequired;
      const updatedMember = await tx.loyaltyMember.update({
        where: { id: redemption.member.id },
        data: {
          pointsBalance: { decrement: pointsToDeduct },
        },
      });

      // 3. Record transaction in immutable ledger
      await tx.loyaltyTransaction.create({
        data: {
          memberId: redemption.member.id,
          type: 'REDEEM',
          points: -pointsToDeduct,
          description: `Redeemed reward: ${redemption.reward.title} (Code: ${redemptionCode})`,
          descriptionAr: `استرداد مكافأة: ${redemption.reward.titleAr || redemption.reward.title} (الرمز: ${redemptionCode})`,
          reference: redemptionCode,
        },
      });

      // 4. Log Audit Log
      await tx.auditLog.create({
        data: {
          organizationId: redemption.member.program.organizationId,
          userId: user.id,
          action: 'REWARD_REDEEMED',
          resource: 'RewardRedemption',
          resourceId: redemption.id,
          detailsJson: JSON.stringify({
            code: redemptionCode,
            reward: redemption.reward.title,
            member: redemption.member.name,
          }),
        },
      });

      return {
        redemption: updatedRedemption,
        member: updatedMember,
        reward: redemption.reward,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Reward verified and redeemed successfully! Points updated.',
      result,
    });
  } catch (error: any) {
    const status = error.message?.includes('NOT_FOUND')
      ? 404
      : error.message?.includes('ALREADY_REDEEMED') || error.message?.includes('EXPIRED')
      ? 400
      : error.message?.includes('FORBIDDEN')
      ? 403
      : 500;

    return NextResponse.json({ error: error.message }, { status });
  }
}
