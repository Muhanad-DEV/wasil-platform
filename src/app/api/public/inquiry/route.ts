import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      organizationId,
      cardId,
      campaignId,
      name,
      phone,
      email,
      areaOfInterest,
      budgetRange,
      preferredContact,
      notes,
      source,
      marketingConsent,
    } = body;

    if (!organizationId || !name || !phone) {
      return NextResponse.json(
        { error: 'Name, phone number, and organization ID are required' },
        { status: 400 }
      );
    }

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Duplicate detection: check if this phone number already exists for this org
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const existingLead = await prisma.lead.findFirst({
      where: {
        organizationId,
        phone: cleanPhone,
      },
    });

    let lead;

    if (existingLead) {
      // Update existing lead with latest inquiry details
      lead = await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          name: name.trim(),
          email: email?.trim() || existingLead.email,
          areaOfInterest: areaOfInterest || existingLead.areaOfInterest,
          budgetRange: budgetRange || existingLead.budgetRange,
          notes: notes ? `${existingLead.notes || ''}\n[New Inquiry]: ${notes}` : existingLead.notes,
          priority: 'HIGH', // bump priority on repeat inquiry
        },
      });

      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: 'NOTE',
          description: `Customer submitted an additional inquiry for: ${areaOfInterest || 'General Inquiry'}`,
          descriptionAr: `قام العميل بإرسال استفسار إضافي حول: ${areaOfInterest || 'استفسار عام'}`,
        },
      });
    } else {
      // Create new lead
      lead = await prisma.lead.create({
        data: {
          organizationId,
          cardId: cardId || null,
          campaignId: campaignId || null,
          name: name.trim(),
          phone: cleanPhone,
          email: email?.trim() || null,
          source: source || (cardId ? 'DIGITAL_CARD' : 'PUBLIC_PROFILE'),
          stage: 'NEW',
          priority: 'MEDIUM',
          areaOfInterest: areaOfInterest || null,
          budgetRange: budgetRange || null,
          preferredContact: preferredContact || 'WHATSAPP',
          notes: notes || null,
          marketingConsent: marketingConsent !== false,
        },
      });

      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: 'STATUS_CHANGE',
          description: `Inquiry received via ${source || 'Public Profile'}. Stage set to NEW.`,
          descriptionAr: `تم استلام الاستفسار وتحديد الحالة كعميل جديد.`,
        },
      });
    }

    // Log analytics event
    await prisma.analyticsEvent.create({
      data: {
        organizationId,
        cardId: cardId || null,
        campaignId: campaignId || null,
        eventType: 'INQUIRY_SUBMIT',
        device: 'MOBILE',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully. A representative will contact you shortly.',
      leadId: lead.id,
    });
  } catch (error: any) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
