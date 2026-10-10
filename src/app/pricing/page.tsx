'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Check, X, Sparkles, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function PricingPage() {
  const { lang, t, formatCurrency, isRtl } = useLanguage();
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      code: 'FREE',
      nameAr: 'الباقة المجانية',
      nameEn: 'Free Starter',
      descAr: 'للأفراد وأصحاب الأعمال الراغبين في تجربة الهوية الرقمية الذكية.',
      descEn: 'For individual entrepreneurs trying smart digital business identity.',
      priceMonthlyOMR: 0,
      priceYearlyOMR: 0,
      cards: 1,
      team: 1,
      branches: 1,
      wallet: false,
      crm: false,
      loyalty: false,
      analytics: 'Basic',
      highlight: false,
    },
    {
      code: 'BUSINESS',
      nameAr: 'باقة الأعمال',
      nameEn: 'Business Pro',
      descAr: 'للشركات الصغيرة والمتوسطة التي تسعى لتعزيز المبيعات وبرامج الولاء.',
      descEn: 'For growing businesses seeking active lead capture and loyalty programs.',
      priceMonthlyOMR: 12.0,
      priceYearlyOMR: 120.0,
      cards: 5,
      team: 5,
      branches: 2,
      wallet: true,
      crm: true,
      loyalty: true,
      analytics: 'Advanced',
      highlight: true,
    },
    {
      code: 'PROFESSIONAL',
      nameAr: 'الباقة الاحترافية',
      nameEn: 'Professional Team',
      descAr: 'لفرق المبيعات المتعددة والفروع والشركات العقارية النشطة.',
      descEn: 'For full sales teams, multi-branch operations, and active real estate developers.',
      priceMonthlyOMR: 29.0,
      priceYearlyOMR: 290.0,
      cards: 25,
      team: 20,
      branches: 10,
      wallet: true,
      crm: true,
      loyalty: true,
      analytics: 'Enterprise CRM + CSV Export',
      highlight: false,
    },
    {
      code: 'ENTERPRISE',
      nameAr: 'باقة المؤسسات',
      nameEn: 'Enterprise Suite',
      descAr: 'للشركات الكبرى والجهات الحكومية التي تتطلب تكاملاً مخصصاً وSLA.',
      descEn: 'For large enterprises and government entities needing custom API integrations.',
      priceMonthlyOMR: 79.0,
      priceYearlyOMR: 790.0,
      cards: 200,
      team: 100,
      branches: 50,
      wallet: true,
      crm: true,
      loyalty: true,
      analytics: 'Full BI & Custom API Adapter',
      highlight: false,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <section className="bg-gradient-to-b from-white to-wasil-bg py-16 text-center border-b border-wasil-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="rounded-full bg-wasil-amber/15 px-3 py-1 text-xs font-bold text-wasil-amber">
            {lang === 'ar' ? 'الريال العُماني (OMR)' : 'Omani Rial (OMR)'}
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'خطط أسعار واضحة وبسيطة' : 'Transparent, Scalable Pricing'}
          </h1>
          <p className="mt-3 text-base text-wasil-muted max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'لا توجد رسوم خفية. يمكنك الترقية أو الإلغاء في أي وقت من لوحة التحكم.'
              : 'No hidden fees. Switch plans, upgrade, or cancel directly from your billing portal.'}
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 inline-flex items-center rounded-2xl bg-wasil-bg p-1.5 border border-wasil-border shadow-subtle">
            <button
              onClick={() => setInterval('monthly')}
              className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
                interval === 'monthly'
                  ? 'bg-wasil-navy text-white shadow'
                  : 'text-wasil-muted hover:text-wasil-navy'
              }`}
            >
              {lang === 'ar' ? 'الدفع الشهري' : 'Monthly Billing'}
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`rounded-xl px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                interval === 'yearly'
                  ? 'bg-wasil-violet text-white shadow'
                  : 'text-wasil-muted hover:text-wasil-navy'
              }`}
            >
              <span>{lang === 'ar' ? 'الدفع السنوي (خصم ٢٠٪)' : 'Annual (Save 20%)'}</span>
              <span className="rounded bg-wasil-amber px-1.5 py-0.2 text-[9px] font-bold text-wasil-navy">
                SAVE
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p) => {
              const price = interval === 'yearly' ? p.priceYearlyOMR : p.priceMonthlyOMR;
              return (
                <div
                  key={p.code}
                  className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                    p.highlight
                      ? 'border-2 border-wasil-violet bg-wasil-violet/5 shadow-elevated relative'
                      : 'border-wasil-border bg-white shadow-subtle hover:border-wasil-violet/40'
                  }`}
                >
                  {p.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-wasil-violet px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      {lang === 'ar' ? 'الأكثر طلباً' : 'Popular'}
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-wasil-navy">
                      {lang === 'ar' ? p.nameAr : p.nameEn}
                    </h3>
                    <p className="text-[11px] text-wasil-muted mt-1 min-h-[32px]">
                      {lang === 'ar' ? p.descAr : p.descEn}
                    </p>

                    <div className="my-5 border-y border-wasil-border/60 py-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-wasil-navy font-mono">
                          {price.toFixed(3)}
                        </span>
                        <span className="text-xs font-semibold text-wasil-muted">
                          {t('currencySymbol')}
                        </span>
                      </div>
                      <span className="text-[10px] text-wasil-muted">
                        {interval === 'yearly' ? t('omrPerYear') : t('omrPerMonth')}
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-wasil-text mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                        <span>{p.cards} {lang === 'ar' ? 'بطاقة رقمية' : 'Digital Cards'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                        <span>{p.team} {lang === 'ar' ? 'عضو فريق' : 'Team Members'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                        <span>{p.branches} {lang === 'ar' ? 'فرع / موقع' : 'Branches'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {p.wallet ? (
                          <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        )}
                        <span className={p.wallet ? '' : 'text-wasil-muted/60'}>
                          Apple & Google Wallet
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {p.crm ? (
                          <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        )}
                        <span className={p.crm ? '' : 'text-wasil-muted/60'}>
                          {lang === 'ar' ? 'إدارة المبيعات وكانبان' : 'Sales CRM Pipeline'}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {p.loyalty ? (
                          <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        )}
                        <span className={p.loyalty ? '' : 'text-wasil-muted/60'}>
                          {lang === 'ar' ? 'برامج الولاء والمكافآت' : 'Loyalty & Rewards'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Link
                    href={`/auth/register?plan=${p.code}`}
                    className={`w-full text-center rounded-xl py-2.5 text-xs font-bold transition-all ${
                      p.highlight
                        ? 'bg-wasil-violet text-white shadow-md hover:bg-wasil-violet/90'
                        : 'border border-wasil-border bg-white text-wasil-navy hover:bg-wasil-bg'
                    }`}
                  >
                    {p.priceMonthlyOMR === 0
                      ? t('startFree')
                      : lang === 'ar'
                      ? 'اختيار هذه الباقة'
                      : 'Select Plan'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
