import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOrgAccess } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        card: true,
        campaign: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        activities: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        appointments: true,
      },
    });

    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    await requireOrgAccess(lead.organizationId, req);

    return NextResponse.json({ lead });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
    });

    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const { user } = await requireOrgAccess(lead.organizationId, req);

    const body = await req.json();
    const {
      stage,
      priority,
      notes,
      dealValueOMR,
      lostReason,
      assignedToId,
      followUpDate,
      areaOfInterest,
    } = body;

    const updates: any = {};
    const activitiesToCreate = [];

    if (stage && stage !== lead.stage) {
      updates.stage = stage;
      if (stage === 'WON') {
        updates.convertedAt = new Date();
      }
      activitiesToCreate.push({
        leadId: lead.id,
        userId: user.id,
        type: 'STATUS_CHANGE',
        description: `Stage updated from ${lead.stage} to ${stage} by ${user.name}`,
        descriptionAr: `تم تحديث المرحلة من ${lead.stage} إلى ${stage} بواسطة ${user.name}`,
      });
    }

    if (priority && priority !== lead.priority) {
      updates.priority = priority;
    }

    if (notes !== undefined) {
      updates.notes = notes;
    }

    if (dealValueOMR !== undefined) {
      updates.dealValueOMR = dealValueOMR ? parseFloat(dealValueOMR) : null;
    }

    if (lostReason !== undefined) {
      updates.lostReason = lostReason;
    }

    if (assignedToId !== undefined) {
      updates.assignedToId = assignedToId;
    }

    if (followUpDate !== undefined) {
      updates.followUpDate = followUpDate ? new Date(followUpDate) : null;
    }

    if (areaOfInterest !== undefined) {
      updates.areaOfInterest = areaOfInterest;
    }

    const updatedLead = await prisma.lead.update({
      where: { id: params.id },
      data: updates,
    });

    for (const act of activitiesToCreate) {
      await prisma.leadActivity.create({ data: act });
    }

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
    });

    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    await requireOrgAccess(lead.organizationId, req);

    await prisma.lead.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Lead deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
