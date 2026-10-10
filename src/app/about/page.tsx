'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sparkles, Shield, Target, Compass, Globe, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <section className="bg-gradient-to-b from-white to-wasil-bg py-16 sm:py-20 text-center border-b border-wasil-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="rounded-full bg-wasil-navy/10 px-3 py-1 text-xs font-bold text-wasil-navy">
            {lang === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Vision & Heritage'}
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'عن منصة واصل (Wasil)' : 'About Wasil'}
          </h1>
          <p className="mt-4 text-base text-wasil-muted max-w-2xl mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'نهدف إلى رقمنة الهوية التجارية للشركات وتمكين قطاعات الأعمال في سلطنة عُمان من تحويل كل تواصل إلى علاقة مستدامة وفرصة نمو حقيقية.'
              : 'Empowering businesses across Oman and the GCC to transform every professional interaction into lasting customer growth and measurable sales.'}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-wasil-border bg-wasil-bg/40 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-navy text-wasil-turquoise mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'الرسالة' : 'Our Mission'}
              </h3>
              <p className="text-xs text-wasil-muted leading-relaxed">
                {lang === 'ar'
                  ? 'بناء منصة برمجيات SaaS متطورة تراعي الخصوصية وتتوافق مع بيئة الأعمال المحلية في سلطنة عُمان، تجمع بين بطاقات الأعمال الذكية، ومحافظ الجوال الرقمية، وإدارة علاقات العملاء (CRM)، وأنظمة الولاء المتقدمة.'
                  : 'Delivering modern SaaS software built specifically for Gulf regional standards, unifying digital business identity, smartphone wallet passes, CRM tracking, and loyalty mechanics.'}
              </p>
            </div>

            <div className="rounded-3xl border border-wasil-border bg-wasil-bg/40 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-violet text-white mb-4">
                <Globe className="h-6 w-6 text-wasil-amber-light" />
              </div>
              <h3 className="text-lg font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'الرؤية الإقليمية' : 'Regional Vision'}
              </h3>
              <p className="text-xs text-wasil-muted leading-relaxed">
                {lang === 'ar'
                  ? 'الانطلاق من مسقط نحو التوسع في كافة دول مجلس التعاون الخليجي (GCC) كمنصة الهوية والنمو الأكثر موثوقية واحترافية للشركات العقارية والتجارية.'
                  : 'Scaling from Muscat across the wider GCC as the premier trustworthy B2B digital identity and customer acquisition partner.'}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-wasil-navy text-white p-8 sm:p-10 text-start">
            <h3 className="text-xl font-bold mb-4">
              {lang === 'ar' ? 'التزامنا بالموثوقية وأمان البيانات' : 'Commitment to Compliance & Security'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-white/80">
              <div className="space-y-1">
                <span className="font-bold text-wasil-turquoise block text-sm">
                  {lang === 'ar' ? 'سجل تجاري معتمد' : 'CR Registered'}
                </span>
                <p>{lang === 'ar' ? 'مسجل وممتثل للأنظمة التجارية والضريبية في سلطنة عُمان.' : 'Registered in the Sultanate of Oman under commercial regulations.'}</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-wasil-turquoise block text-sm">
                  {lang === 'ar' ? 'عزل كامل لبيانات الشركات' : 'Multi-Tenant Isolation'}
                </span>
                <p>{lang === 'ar' ? 'كل منظمة تمتلك عزلاً أمنياً صارماً لبيانات عملائها ومبيعاتها.' : 'Strict server-side tenant isolation guaranteeing customer confidentiality.'}</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-wasil-turquoise block text-sm">
                  {lang === 'ar' ? 'دعم محلي مستمر' : 'Local Muscat Support'}
                </span>
                <p>{lang === 'ar' ? 'فريق دعم فني متواجد في مسقط لتقديم المساعدة والاستشارات.' : 'On-the-ground support team based in Muscat to assist your deployment.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
