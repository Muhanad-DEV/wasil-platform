'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RedemptionScanner } from '@/components/loyalty/RedemptionScanner';

export default function StaffScannerPage() {
  const { lang, t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'واجهة فحص واسترداد المكافآت للموظفين' : 'Staff POS Voucher Redemption Terminal'}
          </h1>
          <p className="text-xs text-wasil-muted mt-1">
            {lang === 'ar'
              ? 'تحقق فوري من أهلية المكافأة وخصم النقاط ومنع الاسترداد المزدوج في نقاط البيع.'
              : 'Real-time voucher validation and server-side duplicate redemption prevention at checkout.'}
          </p>
        </div>

        <RedemptionScanner />
      </div>
    </DashboardLayout>
  );
}
