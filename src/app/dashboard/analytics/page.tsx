'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  BarChart3,
  TrendingUp,
  Eye,
  QrCode,
  Sparkles,
  Briefcase,
  Award,
  DollarSign,
  Download,
  Calendar,
  Filter,
  RefreshCw,
} from 'lucide-react';

export default function AnalyticsReportingPage() {
  const { lang, t, formatCurrency } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-wasil-violet" />
        </div>
      </DashboardLayout>
    );
  }

  const metrics = data?.metrics || {
    totalCards: 2,
    totalViews: 1420,
    qrScans: 468,
    vcardDownloads: 194,
    walletAdds: 150,
    leadsCount: 8,
    wonLeadsCount: 1,
    wonRevenueOMR: 420000,
    conversionRate: '12.5',
    loyaltyMembersCount: 1,
  };

  const leadsByStage = data?.leadsByStage || [];
  const leadsBySource = data?.leadsBySource || [];
  const topCards = data?.topPerformingCards || [];
  const campaigns = data?.topCampaigns || [];

  return (
    <DashboardLayout>
      <div className="space-y-8 text-start max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-wasil-navy">
              {lang === 'ar' ? 'التحليلات والتقارير المتقدمة' : 'Analytics & Conversion Intelligence'}
            </h1>
            <p className="text-xs text-wasil-muted mt-1">
              {lang === 'ar'
                ? 'قياس تفاعل العملاء، أداء بطاقات المبيعات، ومعدلات تحويل الصفقات بالريال العُماني.'
                : 'Measure customer acquisition, broker performance, and closed revenue in OMR.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-white border border-wasil-border px-3 py-2 text-xs font-semibold text-wasil-navy shadow-subtle flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-wasil-turquoise" />
              <span>{lang === 'ar' ? 'آخر ٣٠ يوماً' : 'Last 30 Days'}</span>
            </span>
          </div>
        </div>

        {/* 4 Major Funnel KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-wasil-border bg-white p-5 shadow-subtle">
            <span className="text-xs font-bold text-wasil-muted block mb-1">{t('totalViews')}</span>
            <div className="text-2xl font-extrabold text-wasil-navy font-mono">
              {metrics.totalViews.toLocaleString()}
            </div>
            <span className="text-[10px] text-wasil-turquoise font-semibold mt-1 block">
              +14% vs previous period
            </span>
          </div>

          <div className="rounded-3xl border border-wasil-border bg-white p-5 shadow-subtle">
            <span className="text-xs font-bold text-wasil-muted block mb-1">{t('qrScans')}</span>
            <div className="text-2xl font-extrabold text-wasil-navy font-mono">
              {metrics.qrScans}
            </div>
            <span className="text-[10px] text-wasil-muted mt-1 block">Physical & Expo Scans</span>
          </div>

          <div className="rounded-3xl border border-wasil-border bg-white p-5 shadow-subtle">
            <span className="text-xs font-bold text-wasil-muted block mb-1">{t('conversionRate')}</span>
            <div className="text-2xl font-extrabold text-wasil-violet font-mono">
              {metrics.conversionRate}%
            </div>
            <span className="text-[10px] text-wasil-muted mt-1 block">Inquiry to Won Deal</span>
          </div>

          <div className="rounded-3xl border border-wasil-border bg-white p-5 shadow-subtle">
            <span className="text-xs font-bold text-wasil-muted block mb-1">{t('revenueWon')}</span>
            <div className="text-xl font-extrabold text-emerald-800 font-mono">
              {formatCurrency(metrics.wonRevenueOMR)}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Closed Deals (OMR)</span>
          </div>
        </div>

        {/* Lead Stages Funnel & Source Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Funnel: Leads by Stage */}
          <div className="rounded-3xl border border-wasil-border bg-white p-6 shadow-subtle">
            <h3 className="text-sm font-bold text-wasil-navy mb-4">
              {lang === 'ar' ? 'توزيع مراحل العملاء في خط الأنابيب' : 'Pipeline Stage Distribution'}
            </h3>
            <div className="space-y-3">
              {leadsByStage.map((st: any) => (
                <div key={st.stage} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-wasil-navy">{st.stage}</span>
                    <span className="font-mono text-wasil-muted">{st.count} leads</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-wasil-bg overflow-hidden">
                    <div
                      className="h-full rounded-full bg-wasil-violet"
                      style={{
                        width: `${metrics.leadsCount > 0 ? (st.count / metrics.leadsCount) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leads by Source */}
          <div className="rounded-3xl border border-wasil-border bg-white p-6 shadow-subtle">
            <h3 className="text-sm font-bold text-wasil-navy mb-4">
              {lang === 'ar' ? 'إسناد مصادر العملاء' : 'Lead Acquisition Sources'}
            </h3>
            <div className="space-y-3">
              {leadsBySource.map((src: any) => (
                <div key={src.source} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-wasil-navy">{src.source}</span>
                    <span className="font-mono text-wasil-muted">{src.count} leads</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-wasil-bg overflow-hidden">
                    <div
                      className="h-full rounded-full bg-wasil-turquoise"
                      style={{
                        width: `${metrics.leadsCount > 0 ? (src.count / metrics.leadsCount) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Cards */}
        <div className="rounded-3xl border border-wasil-border bg-white p-6 shadow-subtle">
          <h3 className="text-sm font-bold text-wasil-navy mb-4">
            {lang === 'ar' ? 'أعلى بطاقات الموظفين تفاعلاً' : 'Top Performing Digital Cards'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-wasil-bg/60 text-wasil-navy font-bold">
                <tr>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'صاحب البطاقة' : 'Card Owner'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المشاهدات' : 'Views'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'مسحات QR' : 'Scans'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'حفظ جهة الاتصال' : 'vCard Saves'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'الرابط العام' : 'Public Slug'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wasil-border/60">
                {topCards.map((c: any) => (
                  <tr key={c.id} className="hover:bg-wasil-bg/40">
                    <td className="py-2.5 px-3 font-bold text-wasil-navy">{c.ownerName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{c.viewCount}</td>
                    <td className="py-2.5 px-3 font-mono text-wasil-turquoise font-bold">{c.scanCount}</td>
                    <td className="py-2.5 px-3 font-mono text-wasil-amber font-bold">{c.saveContactCount}</td>
                    <td className="py-2.5 px-3 font-mono text-wasil-violet">/c/{c.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
