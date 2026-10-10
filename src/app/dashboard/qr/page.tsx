'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  QrCode,
  Download,
  Plus,
  RefreshCw,
  ExternalLink,
  Printer,
  Sparkles,
  Share2,
} from 'lucide-react';

export default function QrCodeManagementPage() {
  const { lang, t } = useLanguage();
  const [qrList, setQrList] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New QR Code form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [qrName, setQrName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [selectedCardId, setSelectedCardId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = () => {
    setIsLoading(true);
    Promise.all([
      fetch('/api/qr').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/cards').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([qrData, cardsData]) => {
        if (qrData) setQrList(qrData.qrCodes || []);
        if (cardsData) {
          setCards(cardsData.cards || []);
          if (cardsData.cards?.[0]) {
            setTargetUrl(`http://localhost:3000/c/${cardsData.cards[0].slug}`);
            setSelectedCardId(cardsData.cards[0].id);
          }
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateQr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrName || !targetUrl) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: qrName,
          targetUrl,
          cardId: selectedCardId || null,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setQrName('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-start max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-wasil-navy">
              {lang === 'ar' ? 'إدارة رموز QR الذكية والطباعة' : 'Smart Dynamic QR Codes'}
            </h1>
            <p className="text-xs text-wasil-muted mt-1">
              {lang === 'ar'
                ? 'رموز استجابة سريعة ديناميكية للمعارض والمطبوعات وبطاقات الطاولات مع تتبع عدد المسحات بدقة.'
                : 'Dynamic QR codes with scan counters, UTM tracking redirects, and high-res print export.'}
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-wasil-violet px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{lang === 'ar' ? 'توليد رمز QR جديد' : 'New Smart QR'}</span>
          </button>
        </div>

        {/* QR Codes Grid */}
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-wasil-violet" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrList.map((qr) => (
              <div
                key={qr.id}
                className="rounded-3xl border border-wasil-border bg-white p-6 shadow-subtle flex flex-col justify-between hover:border-wasil-violet/50 hover:shadow-card transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] font-bold text-wasil-violet bg-wasil-violet/10 px-2 py-0.5 rounded-md">
                      {qr.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {qr.scanCount} {lang === 'ar' ? 'مسحة' : 'scans'}
                    </span>
                  </div>

                  <div className="my-2 p-4 bg-wasil-bg rounded-2xl border border-wasil-border text-center">
                    <img
                      src={`/api/cards/${qr.cardId || 'ahmed-albalushi'}/qr?format=png`}
                      alt={qr.name}
                      className="h-36 w-36 object-contain mx-auto"
                    />
                  </div>

                  <h3 className="text-sm font-bold text-wasil-navy mt-3">{qr.name}</h3>
                  <p className="text-[11px] text-wasil-muted truncate mt-0.5 font-mono">
                    {qr.targetUrl}
                  </p>
                </div>

                <div className="pt-4 border-t border-wasil-border/60 mt-4 flex items-center gap-2">
                  <a
                    href={`/api/cards/${qr.cardId || 'ahmed-albalushi'}/qr?format=png`}
                    download
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-wasil-navy py-2 text-xs font-bold text-white hover:bg-wasil-navy/90"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{lang === 'ar' ? 'تحميل PNG' : 'PNG'}</span>
                  </a>

                  <a
                    href={`/api/cards/${qr.cardId || 'ahmed-albalushi'}/qr?format=svg`}
                    download
                    className="rounded-xl border border-wasil-border bg-white p-2 text-xs font-bold text-wasil-navy hover:bg-wasil-bg"
                    title="Download SVG vector"
                  >
                    SVG
                  </a>

                  <a
                    href={`/q/${qr.code}`}
                    target="_blank"
                    className="rounded-xl border border-wasil-border bg-white p-2 text-xs text-wasil-violet hover:bg-wasil-bg"
                    title="Test Redirect"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-wasil-border text-start">
              <h3 className="text-base font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'توليد رمز QR ذكي جديد' : 'Generate Smart QR Code'}
              </h3>
              <p className="text-xs text-wasil-muted mb-4">
                {lang === 'ar'
                  ? 'اختر الوجهة والاسم لتتبع المسحات بشكل منفصل.'
                  : 'Assign destination and track physical or digital campaign scans.'}
              </p>

              <form onSubmit={handleCreateQr} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'اسم الرمز (للمتابعة)' : 'Code Name / Placement *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muscat Exhibition Banner"
                    value={qrName}
                    onChange={(e) => setQrName(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'رابط الوجهة (Target URL) *' : 'Target URL *'}
                  </label>
                  <input
                    type="url"
                    required
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'ربط ببطاقة عمل (اختياري)' : 'Link to Digital Card (Optional)'}
                  </label>
                  <select
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  >
                    <option value="">{lang === 'ar' ? 'بدون ربط ببطاقة معينة' : 'None'}</option>
                    {cards.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.ownerName} ({c.title})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 rounded-xl border border-wasil-border py-2 text-xs font-bold text-wasil-muted hover:bg-wasil-bg"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 rounded-xl bg-wasil-violet py-2 text-xs font-bold text-white hover:bg-wasil-violet/90 disabled:opacity-50"
                  >
                    {isCreating ? '...' : lang === 'ar' ? 'إنشاء الرمز' : 'Generate'}
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
