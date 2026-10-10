'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { CardPreview } from '@/components/card/CardPreview';
import { CreditCard, ArrowLeft, ArrowRight, RefreshCw, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function PublicCardPage({ params }: { params: { slug: string } }) {
  const { lang, t, isRtl } = useLanguage();
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick inquiry on this card
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inqName, setInqName] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqNotes, setInqNotes] = useState('');
  const [inqSubmitted, setInqSubmitted] = useState(false);
  const [inqLoading, setInqLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/public/card/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Card not found');
        return res.json();
      })
      .then((d) => setCard(d.card))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [params.slug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName || !inqPhone || !card) return;

    setInqLoading(true);
    try {
      const res = await fetch('/api/public/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: card.organizationId,
          cardId: card.id,
          name: inqName,
          phone: inqPhone,
          notes: inqNotes,
          source: 'DIGITAL_CARD',
        }),
      });

      if (res.ok) setInqSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setInqLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-wasil-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-wasil-violet border-t-transparent" />
          <span className="text-xs font-bold text-wasil-navy">
            {lang === 'ar' ? 'جاري فتح البطاقة الرقمية...' : 'Loading digital card...'}
          </span>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-wasil-bg p-4 text-center">
        <CreditCard className="h-16 w-16 text-wasil-muted mb-4" />
        <h2 className="text-xl font-bold text-wasil-navy">
          {lang === 'ar' ? 'البطاقة غير موجودة أو معطلة' : 'Card Not Found'}
        </h2>
        <p className="text-xs text-wasil-muted mt-1 max-w-sm">
          {lang === 'ar'
            ? 'تأكد من صحة الرابط أو أن صاحب البطاقة لم يقم بإلغاء نشرها.'
            : 'Please verify the link with the business card owner.'}
        </p>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-wasil-navy px-6 py-2.5 text-xs font-bold text-white"
        >
          {lang === 'ar' ? 'الصفحة الرئيسية' : 'Home'}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-wasil-bg to-wasil-bg py-8 px-4 flex flex-col items-center justify-between">
      {/* Top Bar */}
      <div className="w-full max-w-sm flex items-center justify-between mb-4">
        <Link
          href={card.organization?.slug ? `/b/${card.organization.slug}` : '/'}
          className="flex items-center gap-1.5 text-xs font-semibold text-wasil-muted hover:text-wasil-navy transition-colors"
        >
          {isRtl ? <ArrowRight className="h-3.5 w-3.5" /> : <ArrowLeft className="h-3.5 w-3.5" />}
          <span>{lang === 'ar' ? 'ملف الشركة' : 'Company Profile'}</span>
        </Link>

        <button
          onClick={() => setShowInquiryModal(true)}
          className="flex items-center gap-1.5 rounded-full bg-wasil-violet/10 border border-wasil-violet/30 px-3 py-1 text-xs font-bold text-wasil-violet hover:bg-wasil-violet hover:text-white transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{lang === 'ar' ? 'طلب استفسار' : 'Inquire'}</span>
        </button>
      </div>

      {/* Render Card Preview */}
      <div className="w-full max-w-sm">
        <CardPreview card={card} isStandalone />
      </div>

      {/* Footer Powered By */}
      <div className="mt-8 text-center text-[11px] text-wasil-muted">
        <span>{lang === 'ar' ? 'منصة واصل • الهوية الرقمية ونمو الأعمال في سلطنة عُمان' : 'Wasil Platform • Sultanate of Oman'}</span>
      </div>

      {/* Quick Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-wasil-border text-start">
            <h3 className="text-base font-bold text-wasil-navy mb-1">
              {lang === 'ar' ? `تواصل مع ${card.ownerName}` : `Inquire with ${card.ownerName}`}
            </h3>
            <p className="text-xs text-wasil-muted mb-4">
              {lang === 'ar' ? 'أرسل بياناتك وسيتم التواصل معك مباشرة.' : 'Leave your contact information for a swift reply.'}
            </p>

            {inqSubmitted ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center animate-fadeIn">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-emerald-950">
                  {lang === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Inquiry Sent!'}
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  {lang === 'ar' ? 'شكراً لتواصلك.' : 'Thank you for connecting.'}
                </p>
                <button
                  onClick={() => {
                    setShowInquiryModal(false);
                    setInqSubmitted(false);
                  }}
                  className="mt-4 rounded-xl bg-wasil-navy px-5 py-2 text-xs font-bold text-white"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'الاسم *' : 'Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={inqPhone}
                    onChange={(e) => setInqPhone(e.target.value)}
                    placeholder="+968 ..."
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'ملاحظات أو استفسار' : 'Notes / Inquiry'}
                  </label>
                  <textarea
                    rows={3}
                    value={inqNotes}
                    onChange={(e) => setInqNotes(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="flex-1 rounded-xl border border-wasil-border py-2 text-xs font-bold text-wasil-muted hover:bg-wasil-bg"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={inqLoading}
                    className="flex-1 rounded-xl bg-wasil-violet py-2 text-xs font-bold text-white hover:bg-wasil-violet/90 disabled:opacity-50"
                  >
                    {inqLoading ? '...' : lang === 'ar' ? 'إرسال' : 'Send'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
