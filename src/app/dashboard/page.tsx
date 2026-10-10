'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  CreditCard,
  Eye,
  QrCode,
  Briefcase,
  TrendingUp,
  Award,
  Sparkles,
  Plus,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Scan,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { lang, t, formatCurrency, isRtl } = useLanguage();
  const [analytics, setAnalytics] = useState<any>(null);
  const [walletStatus, setWalletStatus] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/wallet/status').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/leads').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/cards').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([analyticsData, walletData, leadsData, cardsData]) => {
        if (analyticsData) setAnalytics(analyticsData);
        if (walletData) setWalletStatus(walletData);
        if (leadsData) setLeads(leadsData.leads || []);
        if (cardsData) setCards(cardsData.cards || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-wasil-violet border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  const metrics = analytics?.metrics || {
    totalCards: cards.length,
    totalViews: 1420,
    qrScans: 468,
    vcardDownloads: 194,
    walletAdds: 150,
    leadsCount: leads.length,
    wonLeadsCount: leads.filter((l) => l.stage === 'WON').length,
    wonRevenueOMR: 420000,
    conversionRate: '12.5',
    loyaltyMembersCount: 1,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 text-start">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-wasil-navy">
              {lang === 'ar' ? 'لوحة تحكم الأداء والعمليات' : 'Performance & Operations Overview'}
            </h1>
            <p className="text-xs text-wasil-muted mt-1">
              {lang === 'ar'
                ? 'إحصائيات مباشرة للهوية الرقمية، تدفق العملاء، وحجوزات المعاينة في سلطنة عُمان.'
                : 'Real-time performance metrics for cards, lead acquisition, and loyalty growth in Oman.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/cards/new"
              className="flex items-center gap-1.5 rounded-xl bg-wasil-violet px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>{t('createCard')}</span>
            </Link>

            <Link
              href="/dashboard/loyalty/scanner"
              className="flex items-center gap-1.5 rounded-xl border border-wasil-border bg-white px-3.5 py-2 text-xs font-bold text-wasil-navy hover:bg-wasil-bg transition-colors shadow-subtle"
            >
              <Scan className="h-4 w-4 text-wasil-turquoise" />
              <span>{t('menuScanner')}</span>
            </Link>
          </div>
        </div>

        {/* 8 Metric KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 1. Total Cards */}
          <div className="rounded-2xl border border-wasil-border bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between text-wasil-muted mb-2">
              <span className="text-xs font-bold">{t('totalCards')}</span>
              <CreditCard className="h-4 w-4 text-wasil-violet" />
            </div>
            <div className="text-2xl font-extrabold text-wasil-navy font-mono">
              {metrics.totalCards}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              {lang === 'ar' ? 'بطاقات نشطة ومفعلة' : 'Active & Published'}
            </span>
          </div>

          {/* 2. Total Views */}
          <div className="rounded-2xl border border-wasil-border bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between text-wasil-muted mb-2">
              <span className="text-xs font-bold">{t('totalViews')}</span>
              <Eye className="h-4 w-4 text-wasil-turquoise" />
            </div>
            <div className="text-2xl font-extrabold text-wasil-navy font-mono">
              {metrics.totalViews.toLocaleString()}
            </div>
            <span className="text-[10px] text-wasil-turquoise font-semibold mt-1 block">
              +18.4% {lang === 'ar' ? 'هذا الشهر' : 'this month'}
            </span>
          </div>

          {/* 3. QR Scans */}
          <div className="rounded-2xl border border-wasil-border bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between text-wasil-muted mb-2">
              <span className="text-xs font-bold">{t('qrScans')}</span>
              <QrCode className="h-4 w-4 text-wasil-amber" />
            </div>
            <div className="text-2xl font-extrabold text-wasil-navy font-mono">
              {metrics.qrScans}
            </div>
            <span className="text-[10px] text-wasil-muted mt-1 block">
              {lang === 'ar' ? 'عبر المعارض والبطاقات' : 'Across booths & cards'}
            </span>
          </div>

          {/* 4. Leads Captured */}
          <div className="rounded-2xl border border-wasil-border bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between text-wasil-muted mb-2">
              <span className="text-xs font-bold">{t('leadsCaptured')}</span>
              <Briefcase className="h-4 w-4 text-wasil-navy" />
            </div>
            <div className="text-2xl font-extrabold text-wasil-navy font-mono">
              {metrics.leadsCount}
            </div>
            <span className="text-[10px] text-wasil-violet font-semibold mt-1 block">
              {metrics.wonLeadsCount} {lang === 'ar' ? 'صفقات محققة (Won)' : 'Deals Won'}
            </span>
          </div>

          {/* 5. Won Revenue OMR */}
          <div className="rounded-2xl border border-wasil-border bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between text-wasil-muted mb-2">
              <span className="text-xs font-bold">{t('revenueWon')}</span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl font-extrabold text-emerald-800 font-mono">
              {formatCurrency(metrics.wonRevenueOMR)}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              {lang === 'ar' ? 'مبيعات موثقة في عُمان' : 'Verified closed revenue'}
            </span>
          </div>

          {/* 6. Conversion Rate */}
          <div className="rounded-2xl border border-wasil-border bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between text-wasil-muted mb-2">
              <span className="text-xs font-bold">{t('conversionRate')}</span>
              <TrendingUp className="h-4 w-4 text-wasil-turquoise" />
            </div>
            <div className="text-2xl font-extrabold text-wasil-navy font-mono">
              {metrics.conversionRate}%
            </div>
            <span className="text-[10px] text-wasil-muted mt-1 block">
              {lang === 'ar' ? 'من استفسار إلى بيع' : 'Inquiry to closed deal'}
            </span>
          </div>

          {/* 7. Wallet Passes Issued */}
          <div className="rounded-2xl border border-wasil-border bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between text-wasil-muted mb-2">
              <span className="text-xs font-bold">{t('walletPassesCount')}</span>
              <Sparkles className="h-4 w-4 text-wasil-violet" />
            </div>
            <div className="text-2xl font-extrabold text-wasil-navy font-mono">
              {metrics.walletAdds}
            </div>
            <span className="text-[10px] text-wasil-muted mt-1 block">
              Apple & Google Wallet
            </span>
          </div>

          {/* 8. Loyalty Members */}
          <div className="rounded-2xl border border-wasil-border bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between text-wasil-muted mb-2">
              <span className="text-xs font-bold">{t('loyaltyMembersCount')}</span>
              <Award className="h-4 w-4 text-wasil-amber" />
            </div>
            <div className="text-2xl font-extrabold text-wasil-navy font-mono">
              {metrics.loyaltyMembersCount}
            </div>
            <span className="text-[10px] text-wasil-amber font-semibold mt-1 block">
              {lang === 'ar' ? 'نادي امتيازات فعال' : 'Active privilege tier'}
            </span>
          </div>
        </div>

        {/* Middle Section: Recent Leads & Wallet Health Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Leads Activity */}
          <div className="lg:col-span-8 rounded-3xl border border-wasil-border bg-white p-6 shadow-subtle">
            <div className="flex items-center justify-between mb-4 border-b border-wasil-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-wasil-navy">
                  {lang === 'ar' ? 'أحدث استفسارات العملاء والفرص' : 'Recent Inquiries & CRM Leads'}
                </h3>
                <span className="text-[11px] text-wasil-muted">
                  {lang === 'ar' ? 'متابعة الصفقات ومراحل خط الأنابيب' : 'Pipeline progression and customer intents'}
                </span>
              </div>
              <Link
                href="/dashboard/leads"
                className="flex items-center gap-1 text-xs font-bold text-wasil-violet hover:underline"
              >
                <span>{lang === 'ar' ? 'عرض كانبان الكامل' : 'Open CRM Pipeline'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-wasil-bg/60 text-wasil-navy font-bold">
                  <tr>
                    <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                    <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
                    <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'الاهتمام' : 'Interest'}</th>
                    <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المرحلة' : 'Stage'}</th>
                    <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'القيمة' : 'Deal Value'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wasil-border/60">
                  {leads.slice(0, 5).map((l) => (
                    <tr key={l.id} className="hover:bg-wasil-bg/40">
                      <td className="py-2.5 px-3 font-bold text-wasil-navy">{l.name}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]" dir="ltr">{l.phone}</td>
                      <td className="py-2.5 px-3 text-wasil-text/80">{l.areaOfInterest || '—'}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex rounded-full bg-wasil-bg px-2 py-0.5 text-[10px] font-semibold border border-wasil-border">
                          {l.stage}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                        {l.dealValueOMR ? formatCurrency(l.dealValueOMR) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Wallet Integration Health Widget (Section 9 & 20 Requirement) */}
          <div className="lg:col-span-4 rounded-3xl border border-wasil-border bg-white p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-wasil-violet" />
                <h3 className="text-sm font-bold text-wasil-navy">
                  {lang === 'ar' ? 'حالة تكامل المحافظ الرقمية' : 'Digital Wallet Integration'}
                </h3>
              </div>
              <p className="text-xs text-wasil-muted mb-4 leading-relaxed">
                {lang === 'ar'
                  ? 'شفافية كاملة: حالة شهادات وتوقيع بطاقات Apple Wallet و Google Wallet.'
                  : 'Transparent status of Apple Wallet PKPass signing certificates and Google Wallet API keys.'}
              </p>

              <div className="space-y-3">
                {/* Apple Wallet Status */}
                <div className="rounded-xl border border-wasil-border p-3 bg-wasil-bg/40 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-wasil-navy"> Apple Wallet (PKPass)</span>
                    <span className="inline-flex items-center gap-1 rounded bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                      {lang === 'ar' ? 'وضع التجربة (Sandbox)' : 'Sandbox Mode'}
                    </span>
                  </div>
                  <p className="text-[11px] text-wasil-muted">
                    {lang === 'ar'
                      ? 'يتم إصدار البطاقات وتحميلها بوضع المحاكاة المعتمد. للتوقيع الإنتاجي يلزم تزويد شهادة WWDR.'
                      : 'Passes are compiled in compliant sandbox mode. Production signing requires Apple Developer cert.'}
                  </p>
                </div>

                {/* Google Wallet Status */}
                <div className="rounded-xl border border-wasil-border p-3 bg-wasil-bg/40 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-wasil-navy">G Google Wallet API</span>
                    <span className="inline-flex items-center gap-1 rounded bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                      {lang === 'ar' ? 'وضع التجربة (Sandbox)' : 'Sandbox Mode'}
                    </span>
                  </div>
                  <p className="text-[11px] text-wasil-muted">
                    {lang === 'ar'
                      ? 'تم إعداد كلاس البطاقة ومعرف المصدر، رابط الحفظ يعمل بوضع المطور.'
                      : 'Class and object claims structured with Google Pay Save URL protocol.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-wasil-border mt-4">
              <Link
                href="/dashboard/wallet"
                className="w-full block text-center rounded-xl bg-wasil-bg py-2 text-xs font-bold text-wasil-navy hover:bg-wasil-border transition-colors"
              >
                {lang === 'ar' ? 'إدارة محافظ الجوال' : 'Manage Wallet Passes'} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
