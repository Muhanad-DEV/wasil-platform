'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Megaphone,
  Plus,
  RefreshCw,
  QrCode,
  TrendingUp,
  Briefcase,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export default function CampaignsPage() {
  const { lang, t } = useLanguage();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Campaign Form
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [channel, setChannel] = useState('EXHIBITION');
  const [utmSource, setUtmSource] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCampaigns = () => {
    setIsLoading(true);
    fetch('/api/campaigns')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setCampaigns(data.campaigns || []);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          channel,
          utmSource: utmSource || name.toLowerCase().replace(/\s+/g, '_'),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setName('');
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-start max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-wasil-navy">
              {lang === 'ar' ? 'إدارة الحملات التسويقية والإسناد' : 'Campaign Attribution & ROI'}
            </h1>
            <p className="text-xs text-wasil-muted mt-1">
              {lang === 'ar'
                ? 'قياس العائد على المعارض، الإعلانات، وبطاقات الموظفين بدقة من المسحة وحتى إتمام الصفقة.'
                : 'Measure exhibition ROI and campaign channels from initial QR scan to closed deal.'}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-wasil-violet px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{lang === 'ar' ? 'إنشاء حملة جديدة' : 'New Campaign'}</span>
          </button>
        </div>

        {/* Campaign List */}
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-wasil-violet" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="rounded-3xl border border-wasil-border bg-white p-6 shadow-subtle hover:border-wasil-violet/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-wasil-bg px-2.5 py-0.5 text-[10px] font-bold text-wasil-navy border border-wasil-border">
                    {camp.channel}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{camp.isActive ? (lang === 'ar' ? 'نشطة' : 'Active') : 'Inactive'}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-wasil-navy mb-1">{camp.name}</h3>
                <div className="text-[11px] font-mono text-wasil-muted mb-4">
                  utm_source={camp.utmSource}
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-2xl bg-wasil-bg p-3 text-center text-xs">
                  <div>
                    <span className="block text-[10px] text-wasil-muted">{lang === 'ar' ? 'مسحات QR' : 'Scans'}</span>
                    <span className="font-mono font-bold text-wasil-navy text-sm">{camp.scansCount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-wasil-muted">{lang === 'ar' ? 'العملاء' : 'Leads'}</span>
                    <span className="font-mono font-bold text-wasil-violet text-sm">{camp.leadsCount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-wasil-muted">{lang === 'ar' ? 'الصفقات' : 'Won'}</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">{camp.wonLeadsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-wasil-border text-start">
              <h3 className="text-base font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'إنشاء حملة تسويقية جديدة' : 'Create New Campaign'}
              </h3>
              <p className="text-xs text-wasil-muted mb-4">
                {lang === 'ar' ? 'حدد القناة واسم المصدر لإسناد العملاء تلقائياً.' : 'Set channel and UTM source for automated lead attribution.'}
              </p>

              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'اسم الحملة *' : 'Campaign Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muscat City Centre Expo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'قناة التسويق' : 'Marketing Channel'}
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  >
                    <option value="EXHIBITION">معرض أو مؤتمر (Exhibition / Expo)</option>
                    <option value="QR_PHYSICAL">رمز مطبوع (Physical Print QR)</option>
                    <option value="WHATSAPP">محادثات واتساب (WhatsApp Campaign)</option>
                    <option value="SOCIAL">شبكات التواصل (Social Media)</option>
                    <option value="BROCHURE">كتالوج ورقي (Brochure)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'معرف المصدر (UTM Source)' : 'UTM Source Tag'}
                  </label>
                  <input
                    type="text"
                    placeholder="expo_2026"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-xl border border-wasil-border py-2 text-xs font-bold text-wasil-muted hover:bg-wasil-bg"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-wasil-violet py-2 text-xs font-bold text-white hover:bg-wasil-violet/90 disabled:opacity-50"
                  >
                    {isSubmitting ? '...' : lang === 'ar' ? 'حفظ الحملة' : 'Create'}
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
