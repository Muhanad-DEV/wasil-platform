import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOrgAccess } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
    });

    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const { user } = await requireOrgAccess(lead.organizationId, req);

    const body = await req.json();
    const { type, description, descriptionAr } = body;

    if (!description) {
      return NextResponse.json({ error: 'Activity description is required' }, { status: 400 });
    }

    const activity = await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        userId: user.id,
        type: type || 'NOTE',
        description,
        descriptionAr: descriptionAr || null,
      },
    });

    return NextResponse.json({ success: true, activity });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
