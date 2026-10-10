'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import {
  ShieldAlert,
  Building2,
  Users,
  CreditCard,
  Briefcase,
  DollarSign,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Activity,
  Globe,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server,
  Layers,
} from 'lucide-react';

export default function PlatformAdminDashboardPage() {
  const { lang, setLang, t, isRtl } = useLanguage();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/auth/login');
        return;
      }
      const authData = await authRes.json();
      if (!authData?.user?.isSuperAdmin) {
        // Not super admin - redirect to normal dashboard
        router.push('/dashboard');
        return;
      }
      setCurrentUser(authData.user);

      const [metricsRes, orgsRes, logsRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/organizations'),
        fetch('/api/admin/audit-logs'),
      ]);

      if (metricsRes.ok) {
        const m = await metricsRes.json();
        setMetrics(m.metrics);
      }
      if (orgsRes.ok) {
        const o = await orgsRes.json();
        setOrganizations(o.organizations || []);
      }
      if (logsRes.ok) {
        const l = await logsRes.json();
        setAuditLogs(l.auditLogs || []);
      }
    } catch {
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleOrgStatus = async (orgId: string, currentStatus: boolean) => {
    setActionLoadingId(orgId);
    try {
      const res = await fetch('/api/admin/organizations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, isActive: !currentStatus }),
      });
      if (res.ok) {
        await loadData();
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredOrgs = organizations.filter((org) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      org.name?.toLowerCase().includes(q) ||
      org.nameAr?.toLowerCase().includes(q) ||
      org.slug?.toLowerCase().includes(q) ||
      org.city?.toLowerCase().includes(q) ||
      org.commercialRegNo?.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-wasil-bg">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-wasil-violet" />
          <span className="text-xs font-bold text-wasil-navy">
            {lang === 'ar' ? 'جاري التحقق من صلاحيات المشرف العام...' : 'Verifying Super Admin clearance...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col text-start">
      {/* Top Super Admin Navigation */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 sm:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide text-white">
                {lang === 'ar' ? 'بوابة المشرف العام' : 'Platform Super Admin'}
              </span>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                ROOT
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Wasil Cloud Sultanate of Oman
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Globe className="h-3.5 w-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition-colors"
          >
            <span>{lang === 'ar' ? 'العودة للمنظمة' : 'Org Dashboard'}</span>
            {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
          </Link>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Platform Overview Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <div>
            <h1 className="text-2xl font-black text-white">
              {lang === 'ar' ? 'إدارة المنظومة والسلطنة' : 'Wasil Platform Operations & Metrics'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {lang === 'ar'
                ? 'مراقبة كافة المنظمات، الاشتراكات الشهرية، بطاقات المحافظ الرقمية المصدرة، وحالة تكامل البوابات في سلطنة عُمان.'
                : 'Real-time telemetry across all multi-tenant organizations, recurring OMR revenues, digital wallet passes, and gateway health.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{lang === 'ar' ? 'كافة الخدمات تعمل بكفاءة' : 'All Systems Operational'}</span>
          </div>
        </div>

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                {lang === 'ar' ? 'إجمالي المنظمات' : 'Total Organizations'}
              </span>
              <Building2 className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {metrics?.totalOrgs || 0}
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">
              {metrics?.activeOrgs || 0} {lang === 'ar' ? 'منظمة نشطة' : 'active orgs'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                {lang === 'ar' ? 'الإيراد الشهري (MRR)' : 'Monthly Recurring (MRR)'}
              </span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white font-mono">
              {metrics?.totalMRR_OMR?.toFixed(3) || '0.000'} <span className="text-xs text-emerald-400">OMR</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {metrics?.activeSubscriptionsCount || 0} {lang === 'ar' ? 'اشتراك نشط' : 'active subs'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                {lang === 'ar' ? 'البطاقات والمحافظ الرقمية' : 'Cards & Wallet Passes'}
              </span>
              <CreditCard className="h-4 w-4 text-sky-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {metrics?.totalCards || 0}
            </div>
            <span className="text-[11px] text-sky-400 mt-1 block">
              {metrics?.walletPasses || 0} {lang === 'ar' ? 'بطاقة محفظة منشأة' : 'wallet passes issued'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                {lang === 'ar' ? 'إجمالي العملاء والفرص' : 'Total CRM Leads'}
              </span>
              <Briefcase className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {metrics?.totalLeads || 0}
            </div>
            <span className="text-[11px] text-purple-400 mt-1 block">
              {metrics?.totalUsers || 0} {lang === 'ar' ? 'مستخدم مسجل' : 'platform users'}
            </span>
          </div>
        </div>

        {/* System & Adapter Infrastructure Status */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="h-4 w-4 text-amber-400" />
            <span>{lang === 'ar' ? 'مراقبة تكامل البوابات والخدمات الخارجية' : 'External Integrations & Gateway Health'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Apple Wallet PKPass</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                  Sandbox RFC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Generates signed zip bundles with manifest checksums.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Google Wallet API</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                  JWT Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Issuer: 33880000000221. Instant save URLs enabled.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Database Engine</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  Healthy
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Prisma ORM with active multi-tenant connection pool.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Oman SMS Gateway</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Omantel / Ooredoo local telecom dispatch adapter.
              </p>
            </div>
          </div>
        </div>

        {/* Organizations Management Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-sky-400" />
                <span>{lang === 'ar' ? 'سجل المنظمات والشركات' : 'Managed Organizations'}</span>
              </h2>
              <span className="text-xs text-slate-400 mt-0.5 block">
                {lang === 'ar'
                  ? 'إيقاف وتفعيل المنظمات وإدارة خطط الاشتراكات والوصول.'
                  : 'Manage tenant activation, subscription status, and business directory.'}
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className={`absolute top-2.5 h-3.5 w-3.5 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'بحث بالاسم أو السجل...' : 'Search organization or C.R...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-xl border border-slate-700 bg-slate-900 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none ${
                  isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'
                }`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-bold">
                  <th className="py-3 px-3 text-start">{lang === 'ar' ? 'المنظمة' : 'Organization'}</th>
                  <th className="py-3 px-3 text-start">{lang === 'ar' ? 'السجل / المدينة' : 'C.R. / City'}</th>
                  <th className="py-3 px-3 text-start">{lang === 'ar' ? 'البطاقات' : 'Cards'}</th>
                  <th className="py-3 px-3 text-start">{lang === 'ar' ? 'العملاء' : 'Leads'}</th>
                  <th className="py-3 px-3 text-start">{lang === 'ar' ? 'الخطة' : 'Plan'}</th>
                  <th className="py-3 px-3 text-start">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-3 text-start">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredOrgs.map((org) => {
                  const isSuspended = !org.isActive;
                  return (
                    <tr key={org.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">
                            {lang === 'ar' ? org.nameAr || org.name : org.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            /{org.slug}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        <div>
                          <span className="font-mono text-[11px] text-slate-400">
                            {org.commercialRegNo || 'CR Pending'}
                          </span>
                          <span className="block text-[10px] text-slate-400">{org.city || 'Muscat'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-200">
                        {org._count?.cards || 0}
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-200">
                        {org._count?.leads || 0}
                      </td>

                      <td className="py-3 px-3">
                        <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                          {org.subscription?.plan?.name || 'FREE'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {org.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            {lang === 'ar' ? 'نشطة' : 'Active'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                            <XCircle className="h-3 w-3" />
                            {lang === 'ar' ? 'موقوفة' : 'Suspended'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleOrgStatus(org.id, org.isActive)}
                            disabled={actionLoadingId === org.id}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                              org.isActive
                                ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                            }`}
                          >
                            {actionLoadingId === org.id ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : org.isActive ? (
                              lang === 'ar' ? 'إيقاف المنظمة' : 'Suspend'
                            ) : (
                              lang === 'ar' ? 'تفعيل المنظمة' : 'Reactivate'
                            )}
                          </button>

                          <a
                            href={`/b/${org.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1 text-slate-400 hover:text-white"
                            title="View Public Profile"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Platform Audit Logs */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'سجل العمليات والتدقيق الأمني الموحد' : 'Unified Platform Audit Log'}</span>
            </h2>
            <span className="text-[11px] text-slate-400">
              {auditLogs.length} {lang === 'ar' ? 'عملية مسجلة' : 'events'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-bold">
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'التوقيت' : 'Timestamp'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'الحدث' : 'Event Action'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المنظمة' : 'Organization'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المستخدم' : 'Operator'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المورد' : 'Resource'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                      {log.organization?.name || 'Global'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {log.user?.email || 'System'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {log.resource}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
