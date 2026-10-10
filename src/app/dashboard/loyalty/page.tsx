'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Gift,
  Award,
  Users,
  Plus,
  RefreshCw,
  ScanLine,
  Check,
  ShieldCheck,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export default function LoyaltyManagementPage() {
  const { lang, t, formatCurrency } = useLanguage();
  const [program, setProgram] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Reward Modal
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardTitleAr, setRewardTitleAr] = useState('');
  const [pointsReq, setPointsReq] = useState(500);
  const [discountVal, setDiscountVal] = useState(25);
  const [isSubmittingReward, setIsSubmittingReward] = useState(false);

  const fetchLoyaltyData = () => {
    setIsLoading(true);
    Promise.all([
      fetch('/api/loyalty/program').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/loyalty/members').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([progData, membersData]) => {
        if (progData?.program) {
          setProgram(progData.program);
          setRewards(progData.program.rewards || []);
        }
        if (membersData) {
          setMembers(membersData.members || []);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardTitle || !program) return;
    setIsSubmittingReward(true);
    try {
      const res = await fetch('/api/loyalty/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: program.id,
          title: rewardTitle,
          titleAr: rewardTitleAr || null,
          pointsRequired: pointsReq,
          discountValue: discountVal,
          discountType: 'FIXED_OMR',
        }),
      });

      if (res.ok) {
        setShowRewardModal(false);
        setRewardTitle('');
        setRewardTitleAr('');
        fetchLoyaltyData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReward(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 text-start max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-wasil-navy">
              {lang === 'ar' ? 'برامج الولاء والمكافآت الرقمية' : 'Digital Loyalty & Reward Programs'}
            </h1>
            <p className="text-xs text-wasil-muted mt-1">
              {lang === 'ar'
                ? 'بطاقات ولاء ذكية، دفتر حسابات نقاط غير قابل للتلاعب، ومكافآت تفحص في نقاط البيع.'
                : 'Customer membership tiers, tamper-proof transaction ledger, and POS redemption checks.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/loyalty/scanner"
              className="flex items-center gap-1.5 rounded-xl bg-wasil-turquoise px-4 py-2.5 text-xs font-bold text-wasil-navy shadow hover:bg-wasil-turquoise-dark hover:text-white transition-all"
            >
              <ScanLine className="h-4 w-4" />
              <span>{lang === 'ar' ? 'ماسح استرداد المكافأة' : 'Redemption Scanner'}</span>
            </Link>

            <button
              onClick={() => setShowRewardModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-wasil-violet px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>{lang === 'ar' ? 'إضافة مكافأة جديدة' : 'Add Reward'}</span>
            </button>
          </div>
        </div>

        {/* Program Overview Banner */}
        {program && (
          <div className="rounded-3xl border border-wasil-border bg-white p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-wasil-amber" />
                <h3 className="text-lg font-bold text-wasil-navy">
                  {lang === 'ar' && program.nameAr ? program.nameAr : program.name}
                </h3>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
                  {lang === 'ar' ? 'نشط' : 'Active'}
                </span>
              </div>
              <p className="text-xs text-wasil-muted max-w-xl">
                {lang === 'ar' && program.descriptionAr ? program.descriptionAr : program.description}
              </p>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-wasil-border pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="block text-[10px] text-wasil-muted">{lang === 'ar' ? 'معدل النقاط' : 'Earning Rate'}</span>
                <span className="text-sm font-mono font-bold text-wasil-navy">
                  {program.pointsPerOMR} pts / 1 OMR
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-wasil-muted">{lang === 'ar' ? 'إجمالي الأعضاء' : 'Total Members'}</span>
                <span className="text-sm font-mono font-bold text-wasil-violet">
                  {members.length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Catalogue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-wasil-navy">
              {lang === 'ar' ? 'كتالوج المكافآت المتاحة للاسترداد' : 'Available Rewards Catalog'}
            </h3>
            <span className="text-xs text-wasil-muted">
              {rewards.length} {lang === 'ar' ? 'مكافأة معتمدة' : 'rewards'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rewards.map((rew) => (
              <div
                key={rew.id}
                className="rounded-3xl border border-wasil-border bg-white p-6 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-wasil-amber/15 text-wasil-amber text-[10px] font-bold px-2 py-0.5">
                      {rew.discountType || 'Voucher'}
                    </span>
                    <span className="font-mono text-sm font-extrabold text-wasil-violet">
                      {rew.pointsRequired} pts
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-wasil-navy mb-1">
                    {lang === 'ar' && rew.titleAr ? rew.titleAr : rew.title}
                  </h4>
                  <p className="text-xs text-wasil-muted mb-4">
                    {lang === 'ar' && rew.descriptionAr ? rew.descriptionAr : rew.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-wasil-border text-xs flex justify-between items-center text-wasil-muted">
                  <span>{lang === 'ar' ? 'قيمة الخصم:' : 'Value:'}</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {rew.discountValue ? formatCurrency(rew.discountValue) : 'Special'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Members & Points Balance */}
        <div className="rounded-3xl border border-wasil-border bg-white p-6 sm:p-8 shadow-subtle">
          <h3 className="text-base font-bold text-wasil-navy mb-4">
            {lang === 'ar' ? 'أعضاء برنامج الولاء والرصيد الحالي' : 'Loyalty Members & Balances'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-wasil-bg/60 text-wasil-navy font-bold">
                <tr>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'رقم العضوية' : 'Member ID'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'اسم العضو' : 'Member Name'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'الفئة' : 'Tier'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'رصيد النقاط' : 'Points Balance'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'الإنفاق الإجمالي' : 'Total Spent'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wasil-border/60">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-wasil-bg/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-wasil-violet">{m.membershipNumber}</td>
                    <td className="py-2.5 px-3 font-bold text-wasil-navy">{m.name}</td>
                    <td className="py-2.5 px-3 font-mono" dir="ltr">{m.phone}</td>
                    <td className="py-2.5 px-3">
                      <span className="rounded-full bg-wasil-bg px-2 py-0.5 text-[10px] font-bold border border-wasil-border">
                        {m.tier}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-extrabold text-wasil-turquoise">
                      {m.pointsBalance} pts
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                      {formatCurrency(m.totalSpentOMR)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Reward Modal */}
        {showRewardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-wasil-border text-start">
              <h3 className="text-base font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'إضافة مكافأة جديدة' : 'Add New Reward'}
              </h3>
              <p className="text-xs text-wasil-muted mb-4">
                {lang === 'ar' ? 'حدد عنوان المكافأة والنقاط المطلوبة للاسترداد.' : 'Configure reward title and points threshold.'}
              </p>

              <form onSubmit={handleCreateReward} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'عنوان المكافأة (بالإنجليزية) *' : 'Title (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={rewardTitle}
                    onChange={(e) => setRewardTitle(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'عنوان المكافأة (بالعربية)' : 'Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={rewardTitleAr}
                    onChange={(e) => setRewardTitleAr(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-wasil-navy mb-1">
                      {lang === 'ar' ? 'النقاط المطلوبة' : 'Points Required'}
                    </label>
                    <input
                      type="number"
                      value={pointsReq}
                      onChange={(e) => setPointsReq(parseInt(e.target.value))}
                      className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-wasil-navy mb-1">
                      {lang === 'ar' ? 'قيمة الخصم (ر.ع.)' : 'Value (OMR)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={discountVal}
                      onChange={(e) => setDiscountVal(parseFloat(e.target.value))}
                      className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowRewardModal(false)}
                    className="flex-1 rounded-xl border border-wasil-border py-2 text-xs font-bold text-wasil-muted hover:bg-wasil-bg"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReward}
                    className="flex-1 rounded-xl bg-wasil-violet py-2 text-xs font-bold text-white hover:bg-wasil-violet/90 disabled:opacity-50"
                  >
                    {isSubmittingReward ? '...' : lang === 'ar' ? 'حفظ المكافأة' : 'Save Reward'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
