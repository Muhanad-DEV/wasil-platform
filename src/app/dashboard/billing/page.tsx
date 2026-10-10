'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Download,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function BillingManagementPage() {
  const { lang, t, formatCurrency } = useLanguage();
  const [billingData, setBillingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upgradingCode, setUpgradingCode] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchBilling = () => {
    setIsLoading(true);
    fetch('/api/organization/billing')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setBillingData(d);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleUpgrade = async (planCode: string) => {
    setUpgradingCode(planCode);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/organization/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planCode, billingInterval: 'MONTHLY' }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message);
        fetchBilling();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpgradingCode(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-wasil-violet" />
        </div>
      </DashboardLayout>
    );
  }

  const { subscription, plans, invoices, usage } = billingData || {};

  return (
    <DashboardLayout>
      <div className="space-y-8 text-start max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'الاشتراك، الباقات، والفواتير' : 'Subscription, Plans & Billing'}
          </h1>
          <p className="text-xs text-wasil-muted mt-1">
            {lang === 'ar'
              ? 'متابعة خطة اشتراك منظمتك، استهلاك حدود البطاقات، وسجل الفواتير بالريال العُماني.'
              : 'Monitor subscription plan entitlements, resource limits, and official OMR invoices.'}
          </p>
        </div>

        {/* Sandbox Indicator Banner */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              {lang === 'ar'
                ? 'بوابات الدفع تعمل بوضع المحاكاة الآمن (Sandbox Mode). يمكنك ترقية وتخفيض الباقات وتوليد فواتير حقيقية تجريبياً.'
                : 'Payment gateways are configured in Sandbox mode. Upgrades execute instantly generating simulated paid receipts.'}
            </span>
          </div>
          <span className="font-mono font-bold text-[11px] text-amber-800 shrink-0">
            PROVIDER: SANDBOX_OMAN
          </span>
        </div>

        {successMsg && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 animate-fadeIn flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Active Plan & Usage Meters */}
        <div className="rounded-3xl border border-wasil-border bg-white p-6 sm:p-8 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-wasil-border pb-4 mb-6 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-wasil-muted">
                {lang === 'ar' ? 'الباقة الحالية النشطة' : 'Current Active Plan'}
              </span>
              <h3 className="text-xl font-extrabold text-wasil-navy">
                {subscription?.plan?.name || 'Free Starter'}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                ● {subscription?.status || 'ACTIVE'}
              </span>
              <span className="text-xs font-mono font-bold text-wasil-violet">
                {formatCurrency(subscription?.plan?.priceMonthlyOMR || 0)} / {lang === 'ar' ? 'شهر' : 'mo'}
              </span>
            </div>
          </div>

          {/* Entitlement Resource Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-wasil-navy">{lang === 'ar' ? 'البطاقات الرقمية' : 'Digital Cards'}</span>
                <span className="font-mono text-wasil-muted">{usage?.cardsUsed} / {usage?.maxCards}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-wasil-bg overflow-hidden">
                <div
                  className="h-full rounded-full bg-wasil-violet"
                  style={{ width: `${Math.min(100, (usage?.cardsUsed / (usage?.maxCards || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-wasil-navy">{lang === 'ar' ? 'أعضاء الفريق' : 'Team Members'}</span>
                <span className="font-mono text-wasil-muted">{usage?.membersUsed} / {usage?.maxMembers}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-wasil-bg overflow-hidden">
                <div
                  className="h-full rounded-full bg-wasil-turquoise"
                  style={{ width: `${Math.min(100, (usage?.membersUsed / (usage?.maxMembers || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-wasil-navy">{lang === 'ar' ? 'الفروع والمواقع' : 'Branches'}</span>
                <span className="font-mono text-wasil-muted">{usage?.branchesUsed} / {usage?.maxBranches}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-wasil-bg overflow-hidden">
                <div
                  className="h-full rounded-full bg-wasil-amber"
                  style={{ width: `${Math.min(100, (usage?.branchesUsed / (usage?.maxBranches || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade / Switch Plan Grid */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-wasil-navy">
            {lang === 'ar' ? 'الترقية أو تغيير الباقة المعتمدة' : 'Available Subscription Tiers'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {plans?.map((p: any) => {
              const isCurrent = subscription?.plan?.code === p.code;
              return (
                <div
                  key={p.code}
                  className={`rounded-3xl border p-5 flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-2 border-wasil-violet bg-wasil-violet/5 shadow-subtle'
                      : 'border-wasil-border bg-white hover:border-wasil-violet/40'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-wasil-navy">{p.name}</h4>
                    <div className="my-3">
                      <span className="text-xl font-extrabold text-wasil-navy font-mono">
                        {p.priceMonthlyOMR.toFixed(3)}
                      </span>
                      <span className="text-[10px] text-wasil-muted ml-1"> {t('omrPerMonth')}</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-wasil-muted mb-4">
                      <div>• {p.maxCards} {lang === 'ar' ? 'بطاقات' : 'Cards'}</div>
                      <div>• {p.maxTeamMembers} {lang === 'ar' ? 'أعضاء' : 'Members'}</div>
                      <div>• {p.maxBranches} {lang === 'ar' ? 'فروع' : 'Branches'}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpgrade(p.code)}
                    disabled={isCurrent || upgradingCode === p.code}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-neutral-200 text-neutral-600 cursor-default'
                        : 'bg-wasil-navy text-white hover:bg-wasil-navy/90'
                    }`}
                  >
                    {isCurrent
                      ? lang === 'ar'
                        ? 'الباقة الحالية'
                        : 'Current Plan'
                      : upgradingCode === p.code
                      ? '...'
                      : lang === 'ar'
                      ? 'ترقية فورية'
                      : 'Switch Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice Records Table */}
        <div className="rounded-3xl border border-wasil-border bg-white p-6 sm:p-8 shadow-subtle">
          <h3 className="text-base font-bold text-wasil-navy mb-4">
            {lang === 'ar' ? 'سجل الفواتير والإيصالات' : 'Billing Receipts & Invoices'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-wasil-bg/60 text-wasil-navy font-bold">
                <tr>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'رقم الفاتورة' : 'Invoice Number'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'طريقة الدفع' : 'Method'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wasil-border/60">
                {invoices?.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-wasil-bg/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-wasil-navy">{inv.invoiceNumber}</td>
                    <td className="py-2.5 px-3 text-wasil-muted">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                      {formatCurrency(inv.amountOMR)}
                    </td>
                    <td className="py-2.5 px-3 text-wasil-muted text-[11px]">{inv.paymentMethod}</td>
                    <td className="py-2.5 px-3">
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                        {inv.status}
                      </span>
                    </td>
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
