'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  CreditCard,
  Briefcase,
  Gift,
  BarChart3,
  Smartphone,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Scan,
  Users,
} from 'lucide-react';

export default function FeaturesPage() {
  const { lang, t, isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <section className="bg-gradient-to-b from-white to-wasil-bg py-16 sm:py-20 text-center border-b border-wasil-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="rounded-full bg-wasil-violet/10 px-3 py-1 text-xs font-bold text-wasil-violet">
            {lang === 'ar' ? 'مميزات منصة واصل' : 'Platform Features'}
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'أربعة ركائز تقنية لدفع نمو أعمالك في سلطنة عُمان' : 'Four Technical Pillars Powering Your Business Growth'}
          </h1>
          <p className="mt-4 text-base text-wasil-muted max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'صممت المنصة لربط الهوية الرقمية الذكية بإدارة المبيعات وبرامج الولاء في واجهة موحدة سهلة الاستخدام.'
              : 'Designed to unite digital cards, lead capture, loyalty mechanics, and enterprise management into one cohesive system.'}
          </p>
        </div>
      </section>

      {/* Pillar 1 Detail */}
      <section id="cards" className="py-16 bg-white border-b border-wasil-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-navy text-wasil-turquoise mb-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-wasil-navy mb-3">{t('pillar1Title')}</h2>
              <p className="text-xs leading-relaxed text-wasil-muted mb-6">{t('pillar1Desc')}</p>
              <div className="space-y-2.5 text-xs text-wasil-text">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'تحديث فوري للمعلومات بدون تغيير الروابط أو رموز QR' : 'Instant live updates without changing QR codes'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'تصدير ملفات vCard 3.0 المتوافقة مع أجهزة iPhone و Android' : 'RFC vCard 3.0 download supported across iOS & Android'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'تصميم ثنائي اللغة (عربي / إنجليزي) متجاوب تماماً' : 'Fully responsive bilingual (Arabic RTL & English LTR)'}</span>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-wasil-border bg-wasil-bg p-8 shadow-subtle text-center">
              <Smartphone className="h-24 w-24 text-wasil-violet mx-auto mb-4" />
              <h4 className="text-sm font-bold text-wasil-navy">
                {lang === 'ar' ? 'حفظ بلمسة واحدة في المحفظة الإلكترونية' : 'One-Tap Wallet Pass Saving'}
              </h4>
              <p className="text-xs text-wasil-muted mt-1 max-w-xs mx-auto">
                {lang === 'ar'
                  ? 'ملفات .pkpass معتمدة لـ Apple Wallet وروابط Google Pay للوصول السريع حتى بدون اتصال بالإنترنت.'
                  : 'Standards-compliant .pkpass bundles and Google Pay pass JWTs for offline-ready access.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillar 2 Detail */}
      <section id="acquisition" className="py-16 bg-wasil-bg border-b border-wasil-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-3xl border border-wasil-border bg-white p-8 shadow-subtle">
              <div className="space-y-3">
                <div className="rounded-xl border border-wasil-border bg-wasil-bg/60 p-3 text-xs">
                  <span className="font-bold text-wasil-navy">{lang === 'ar' ? 'مراحل خط أنابيب المبيعات (8 مراحل):' : '8 Pipeline Stages:'}</span>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-wasil-text/80">
                    <div>1. {lang === 'ar' ? 'جديد (New)' : 'New'}</div>
                    <div>2. {lang === 'ar' ? 'تم التواصل (Contacted)' : 'Contacted'}</div>
                    <div>3. {lang === 'ar' ? 'مؤهل (Qualified)' : 'Qualified'}</div>
                    <div>4. {lang === 'ar' ? 'موعد محدد (Appointment Set)' : 'Appointment Set'}</div>
                    <div>5. {lang === 'ar' ? 'عرض مرسل (Proposal Sent)' : 'Proposal Sent'}</div>
                    <div>6. {lang === 'ar' ? 'مفاوضات (Negotiation)' : 'Negotiation'}</div>
                    <div>7. {lang === 'ar' ? 'صفقة ناجحة (Won)' : 'Won'}</div>
                    <div>8. {lang === 'ar' ? 'فرصة خاسرة (Lost)' : 'Lost'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-violet text-white mb-4">
                <Briefcase className="h-6 w-6 text-wasil-amber-light" />
              </div>
              <h2 className="text-2xl font-bold text-wasil-navy mb-3">{t('pillar2Title')}</h2>
              <p className="text-xs leading-relaxed text-wasil-muted mb-6">{t('pillar2Desc')}</p>
              <div className="space-y-2.5 text-xs text-wasil-text">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'إسناد مصدر العميل للحملة الإعلانية أو البطاقة المعنية' : 'Automatic UTM campaign and card source attribution'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'كشف الأرقام المكررة وتحديث السجل بدلاً من تشتيت البيانات' : 'Smart phone duplicate detection and thread merging'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'تصدير كامل لقائمة العملاء بصيغة CSV تدعم اللغة العربية' : 'Full CSV export with UTF-8 Arabic Excel compatibility'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillar 3 Detail */}
      <section id="loyalty" className="py-16 bg-white border-b border-wasil-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-turquoise text-wasil-navy mb-4">
                <Gift className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-wasil-navy mb-3">{t('pillar3Title')}</h2>
              <p className="text-xs leading-relaxed text-wasil-muted mb-6">{t('pillar3Desc')}</p>
              <div className="space-y-2.5 text-xs text-wasil-text">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'برامج النقاط لكل ريال عُماني يتم إنفاقه أو طوابع الزيارة' : 'Points per OMR spent or visit-based digital stamps'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'كتالوج مكافآت مرن يدعم الخصومات أو الهدايا المجانية' : 'Custom rewards catalog (percentages, fixed OMR, free gifts)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'واجهة فحص خاصة بالموظفين في نقاط البيع (POS)' : 'Dedicated POS staff redemption token validator'}</span>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-wasil-border bg-wasil-bg p-8 shadow-subtle text-center">
              <Scan className="h-24 w-24 text-wasil-turquoise mx-auto mb-4" />
              <h4 className="text-sm font-bold text-wasil-navy">
                {lang === 'ar' ? 'رموز استرداد فريدة ومحمية' : 'Tamper-Proof QR Redemption'}
              </h4>
              <p className="text-xs text-wasil-muted mt-1 max-w-xs mx-auto">
                {lang === 'ar'
                  ? 'يتم توليد رمز استرداد مشفر لكل مكافأة، ويمنع الخادم استرداده أكثر من مرة.'
                  : 'Every claim gets an atomic one-time token, preventing duplicate redemption.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
