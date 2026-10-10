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

    const leads = await prisma.lead.findMany({
      where: { organizationId: orgId },
      include: {
        card: true,
        campaign: true,
        assignedTo: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Name',
      'Phone',
      'Email',
      'Stage',
      'Priority',
      'Area of Interest',
      'Budget Range',
      'Deal Value (OMR)',
      'Preferred Contact',
      'Source',
      'Card Attributed',
      'Campaign Attributed',
      'Assigned Rep',
      'Created Date',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = leads.map((l) => [
      escapeCsv(l.name),
      escapeCsv(l.phone),
      escapeCsv(l.email),
      escapeCsv(l.stage),
      escapeCsv(l.priority),
      escapeCsv(l.areaOfInterest),
      escapeCsv(l.budgetRange),
      escapeCsv(l.dealValueOMR || ''),
      escapeCsv(l.preferredContact),
      escapeCsv(l.source),
      escapeCsv(l.card?.title || ''),
      escapeCsv(l.campaign?.name || ''),
      escapeCsv(l.assignedTo?.name || ''),
      escapeCsv(new Date(l.createdAt).toLocaleDateString()),
    ]);

    // Prepend UTF-8 BOM (\uFEFF) so Excel supports Arabic characters properly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="wasil_leads_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
