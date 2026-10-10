'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  CreditCard,
  Plus,
  Eye,
  QrCode,
  Download,
  Copy,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  Sparkles,
  Smartphone,
  RefreshCw,
} from 'lucide-react';

export default function CardsManagementPage() {
  const { lang, t, isRtl } = useLanguage();
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [qrModalCard, setQrModalCard] = useState<any>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchCards = () => {
    setIsLoading(true);
    fetch('/api/cards')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCards(data.cards || []);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleDuplicate = async (cardId: string) => {
    try {
      const res = await fetch(`/api/cards/${cardId}/duplicate`, { method: 'POST' });
      if (res.ok) {
        setActionMsg(lang === 'ar' ? 'تم نسخ البطاقة بنجاح' : 'Card duplicated successfully');
        fetchCards();
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (cardId: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه البطاقة؟' : 'Are you sure you want to delete this card?')) return;
    try {
      const res = await fetch(`/api/cards/${cardId}`, { method: 'DELETE' });
      if (res.ok) {
        setActionMsg(lang === 'ar' ? 'تم حذف البطاقة' : 'Card deleted');
        fetchCards();
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-start">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-wasil-navy">
              {lang === 'ar' ? 'إدارة بطاقات الأعمال الرقمية' : 'Digital Business Cards'}
            </h1>
            <p className="text-xs text-wasil-muted mt-1">
              {lang === 'ar'
                ? 'أنشئ وخصص بطاقات أعضاء فريقك، وراقب أداء كل بطاقة على حدة.'
                : 'Manage team member digital cards, issue wallet passes, and monitor engagement.'}
            </p>
          </div>

          <Link
            href="/dashboard/cards/new"
            className="flex items-center gap-1.5 rounded-xl bg-wasil-violet px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{t('createCard')}</span>
          </Link>
        </div>

        {actionMsg && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 animate-fadeIn">
            {actionMsg}
          </div>
        )}

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-wasil-violet" />
          </div>
        ) : cards.length === 0 ? (
          <div className="rounded-3xl border border-wasil-border bg-white p-12 text-center shadow-subtle">
            <CreditCard className="h-12 w-12 text-wasil-muted mx-auto mb-3" />
            <h3 className="text-base font-bold text-wasil-navy">
              {lang === 'ar' ? 'لا توجد بطاقات حتى الآن' : 'No Digital Cards Yet'}
            </h3>
            <p className="text-xs text-wasil-muted mt-1 max-w-sm mx-auto mb-6">
              {lang === 'ar'
                ? 'ابدأ بإنشاء بطاقتك الرقمية الأولى لتوزيعها عبر رمز QR ومحفظة آبل.'
                : 'Create your first card to share via QR code and Apple Wallet.'}
            </p>
            <Link
              href="/dashboard/cards/new"
              className="inline-flex items-center gap-2 rounded-xl bg-wasil-violet px-5 py-2.5 text-xs font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              <span>{t('createCard')}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="rounded-3xl border border-wasil-border bg-white p-5 shadow-subtle hover:border-wasil-violet/50 hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        card.isPublished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {card.isPublished
                        ? lang === 'ar'
                          ? 'منشورة'
                          : 'Published'
                        : lang === 'ar'
                        ? 'مسودة'
                        : 'Draft'}
                    </span>

                    {card.isPrimary && (
                      <span className="rounded-full bg-wasil-amber/15 text-wasil-amber px-2 py-0.5 text-[10px] font-bold">
                        {lang === 'ar' ? 'البطاقة الرئيسية' : 'Primary'}
                      </span>
                    )}
                  </div>

                  {/* Card Avatar & Identity */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-wasil-bg border-2 border-wasil-border overflow-hidden shrink-0">
                      {card.avatarUrl ? (
                        <img
                          src={card.avatarUrl}
                          alt={card.ownerName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-extrabold text-wasil-violet text-lg">
                          {card.ownerName.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="truncate flex-1">
                      <h3 className="text-sm font-bold text-wasil-navy truncate">
                        {lang === 'ar' && card.ownerNameAr ? card.ownerNameAr : card.ownerName}
                      </h3>
                      <p className="text-xs font-semibold text-wasil-violet truncate">
                        {lang === 'ar' && card.jobTitleAr ? card.jobTitleAr : card.jobTitle}
                      </p>
                      <p className="text-[11px] text-wasil-muted truncate">
                        {card.companyName}
                      </p>
                    </div>
                  </div>

                  {/* Card Metrics Summary */}
                  <div className="grid grid-cols-3 gap-2 rounded-2xl bg-wasil-bg p-2.5 text-center text-xs mb-4">
                    <div>
                      <span className="block text-[10px] text-wasil-muted">{lang === 'ar' ? 'مشاهدات' : 'Views'}</span>
                      <span className="font-mono font-bold text-wasil-navy">{card.viewCount}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-wasil-muted">{lang === 'ar' ? 'مسح QR' : 'Scans'}</span>
                      <span className="font-mono font-bold text-wasil-turquoise">{card.scanCount}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-wasil-muted">{lang === 'ar' ? 'حفظ جهة' : 'Saves'}</span>
                      <span className="font-mono font-bold text-wasil-amber">{card.saveContactCount}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-2 pt-2 border-t border-wasil-border/60">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/c/${card.slug}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-wasil-bg py-2 text-[11px] font-bold text-wasil-navy hover:bg-wasil-navy hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>{lang === 'ar' ? 'عرض الرابط' : 'View Link'}</span>
                    </Link>

                    <button
                      onClick={() => setQrModalCard(card)}
                      className="rounded-xl border border-wasil-border p-2 text-wasil-navy hover:bg-wasil-bg"
                      title="Show QR Code"
                    >
                      <QrCode className="h-4 w-4" />
                    </button>

                    <a
                      href={`/api/cards/${card.id}/vcard`}
                      download
                      className="rounded-xl border border-wasil-border p-2 text-wasil-navy hover:bg-wasil-bg"
                      title="Download vCard"
                    >
                      <Download className="h-4 w-4" />
                    </a>

                    <button
                      onClick={() => handleDuplicate(card.id)}
                      className="rounded-xl border border-wasil-border p-2 text-wasil-navy hover:bg-wasil-bg"
                      title="Duplicate Card"
                    >
                      <Copy className="h-4 w-4" />
                    </button>

                    <Link
                      href={`/dashboard/cards/${card.id}/edit`}
                      className="rounded-xl border border-wasil-border p-2 text-wasil-violet hover:bg-wasil-violet/10"
                      title="Edit Card"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(card.id)}
                      className="rounded-xl border border-wasil-border p-2 text-rose-600 hover:bg-rose-50"
                      title="Delete Card"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QR Code Inspection Modal */}
        {qrModalCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-wasil-border text-center">
              <div className="p-4 bg-white rounded-2xl shadow-card border border-wasil-border mb-3 inline-block">
                <img
                  src={`/api/cards/${qrModalCard.id}/qr?format=png`}
                  alt="QR Code"
                  className="h-48 w-48 object-contain mx-auto"
                />
              </div>
              <h4 className="text-sm font-bold text-wasil-navy">{qrModalCard.ownerName}</h4>
              <p className="text-xs text-wasil-muted font-mono mt-1">wasil.om/c/{qrModalCard.slug}</p>

              <div className="mt-4 flex gap-2">
                <a
                  href={`/api/cards/${qrModalCard.id}/qr?format=png`}
                  download
                  className="flex-1 rounded-xl bg-wasil-violet py-2 text-xs font-bold text-white"
                >
                  {lang === 'ar' ? 'تحميل PNG عالي الدقة' : 'Download PNG'}
                </a>
                <button
                  onClick={() => setQrModalCard(null)}
                  className="rounded-xl border border-wasil-border px-4 py-2 text-xs font-bold text-wasil-navy hover:bg-wasil-bg"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
