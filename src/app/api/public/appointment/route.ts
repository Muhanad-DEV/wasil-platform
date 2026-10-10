import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      organizationId,
      cardId,
      customerName,
      customerPhone,
      customerEmail,
      serviceName,
      requestedTime,
      notes,
    } = body;

    if (!organizationId || !customerName || !customerPhone || !requestedTime) {
      return NextResponse.json(
        { error: 'Name, phone number, organization, and requested date/time are required' },
        { status: 400 }
      );
    }

    const cleanPhone = customerPhone.trim().replace(/\s+/g, '');

    // Link with lead if exists, or create a new lead
    let lead = await prisma.lead.findFirst({
      where: { organizationId, phone: cleanPhone },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          organizationId,
          cardId: cardId || null,
          name: customerName.trim(),
          phone: cleanPhone,
          email: customerEmail?.trim() || null,
          stage: 'APPOINTMENT_SCHEDULED',
          priority: 'HIGH',
          areaOfInterest: serviceName || 'Appointment Request',
          preferredContact: 'WHATSAPP',
          source: cardId ? 'DIGITAL_CARD' : 'PUBLIC_PROFILE',
        },
      });
    } else {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { stage: 'APPOINTMENT_SCHEDULED', priority: 'HIGH' },
      });
    }

    const appointment = await prisma.appointmentRequest.create({
      data: {
        organizationId,
        cardId: cardId || null,
        leadId: lead.id,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail?.trim() || null,
        serviceName: serviceName || null,
        requestedTime: new Date(requestedTime),
        notes: notes || null,
        status: 'PENDING',
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: 'APPOINTMENT',
        description: `Customer requested an appointment for ${serviceName || 'Consultation'} on ${new Date(requestedTime).toLocaleString()}`,
        descriptionAr: `طلب العميل موعداً لـ ${serviceName || 'استشارة'} بتاريخ ${new Date(requestedTime).toLocaleDateString()}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment request received. Our team will confirm the timing with you.',
      appointmentId: appointment.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
