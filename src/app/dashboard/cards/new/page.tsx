'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CardBuilder } from '@/components/card/CardBuilder';

export default function NewCardPage() {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [orgId, setOrgId] = useState<string>('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.organization) {
          setOrgId(data.organization.id);
        }
      });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'إنشاء بطاقة أعمال رقمية جديدة' : 'Create New Digital Business Card'}
          </h1>
          <p className="text-xs text-wasil-muted mt-1">
            {lang === 'ar'
              ? 'صمم بطاقتك أو بطاقة أحد موظفيك مع معاينة حية للمظهر على الجوال وسطح المكتب.'
              : 'Design a digital card for yourself or a team member with real-time smartphone preview.'}
          </p>
        </div>

        {orgId && (
          <CardBuilder
            organizationId={orgId}
            onSaved={(savedCard) => {
              router.push('/dashboard/cards');
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
