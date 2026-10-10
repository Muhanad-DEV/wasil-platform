'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LeadPipeline } from '@/components/crm/LeadPipeline';
import { RefreshCw, Plus, Briefcase } from 'lucide-react';

export default function LeadsCrmPage() {
  const { lang, t } = useLanguage();
  const [leads, setLeads] = useState<any[]>([]);
  const [orgId, setOrgId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = () => {
    setIsLoading(true);
    fetch('/api/leads')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.leads) {
          setLeads(data.leads);
          if (data.leads[0]) setOrgId(data.leads[0].organizationId);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 text-start">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-wasil-navy">
              {lang === 'ar' ? 'إدارة العملاء والفرص البيعية (CRM)' : 'Sales CRM & Lead Pipeline'}
            </h1>
            <p className="text-xs text-wasil-muted mt-1">
              {lang === 'ar'
                ? 'تتبع الفرص عبر ٨ مراحل، تحديث الحالة فورياً، وإسناد الصفقات للمسؤولين.'
                : 'Manage prospective buyers across 8 pipeline stages with live timeline updates.'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-wasil-violet" />
          </div>
        ) : (
          <LeadPipeline
            initialLeads={leads}
            organizationId={orgId}
            onRefresh={fetchLeads}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
