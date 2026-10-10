'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Building2,
  Hotel,
  UtensilsCrossed,
  Briefcase,
  Compass,
  Check,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export default function IndustriesPage() {
  const { lang, t, isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <section className="bg-gradient-to-b from-white to-wasil-bg py-16 text-center border-b border-wasil-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="rounded-full bg-wasil-turquoise/10 px-3 py-1 text-xs font-bold text-wasil-turquoise-dark">
            {lang === 'ar' ? 'حلول متخصصة لكل قطاع' : 'Industry Solutions'}
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'مصممة خصيصاً لاحتياجات الشركات في سلطنة عُمان' : 'Tailored for Businesses Across Oman & the GCC'}
          </h1>
          <p className="mt-4 text-base text-wasil-muted max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'نظام أساسي مرن يخدم شركات التطوير العقاري، الفنادق والمنتجعات، المطاعم والمقاهي، والشركات الاستشارية.'
              : 'A single unified platform adapting to real estate developers, hospitality resorts, dining, and professional firms.'}
          </p>
        </div>
      </section>

      {/* Real Estate */}
      <section id="real-estate" className="py-16 bg-white border-b border-wasil-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-navy text-white">
              <Building2 className="h-6 w-6 text-wasil-turquoise" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-wasil-navy">{t('indRealEstate')}</h2>
              <span className="text-xs text-wasil-muted">
                {lang === 'ar' ? 'المطورون العقاريون وشركات الوساطة وإدارة الأصول' : 'Developers, brokerage agencies, and asset managers'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-wasil-border bg-wasil-bg/40 p-6">
              <h4 className="text-sm font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'عرض المشاريع والفلل' : 'Project Showcases'}
              </h4>
              <p className="text-xs text-wasil-muted">
                {lang === 'ar'
                  ? 'عرض مواصفات الوحدات، المساحة بالمتر المربع، الأسعار بالريال العُماني، والكتالوجات التفاعلية.'
                  : 'Display villa specs, floorplans, sqm dimensions, and brochure downloads.'}
              </p>
            </div>
            <div className="rounded-2xl border border-wasil-border bg-wasil-bg/40 p-6">
              <h4 className="text-sm font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'بطاقات المستشارين المعتمدة' : 'Verified Agent Cards'}
              </h4>
              <p className="text-xs text-wasil-muted">
                {lang === 'ar'
                  ? 'تزويد الوسطاء ببطاقات رقمية برقم الترخيص وربط استفسارات العملاء مباشرة بالوسيط المعني.'
                  : 'Equip brokers with digital cards carrying official license numbers and direct routing.'}
              </p>
            </div>
            <div className="rounded-2xl border border-wasil-border bg-wasil-bg/40 p-6">
              <h4 className="text-sm font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'حجز مواعيد المعاينة' : 'Viewing Bookings'}
              </h4>
              <p className="text-xs text-wasil-muted">
                {lang === 'ar'
                  ? 'تمكين المشترين والمستثمرين من حجز مواعيد المعاينة الميدانية مباشرة عبر البطاقة.'
                  : 'Allow property buyers to schedule site viewings with automatic CRM lead conversion.'}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-start">
            <Link
              href="/b/al-mouj-muscat"
              className="inline-flex items-center gap-2 rounded-xl bg-wasil-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-wasil-navy/90"
            >
              <span>{lang === 'ar' ? 'استعراض تجربة حية: الموج مسقط العقارية' : 'View Live Demo: Al Mouj Muscat'}</span>
              <ExternalLink className="h-3.5 w-3.5 text-wasil-turquoise" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hospitality */}
      <section id="hospitality" className="py-16 bg-wasil-bg border-b border-wasil-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-violet text-white">
              <Hotel className="h-6 w-6 text-wasil-amber-light" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-wasil-navy">{t('indHospitality')}</h2>
              <span className="text-xs text-wasil-muted">
                {lang === 'ar' ? 'الفنادق، المنتجعات الشاطئية، والشقق الفندقية' : 'Hotels, coastal resorts, and serviced apartments'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-wasil-border bg-white p-6 shadow-subtle">
              <h4 className="text-sm font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'بطاقة الكونسيرج الذكية' : 'Smart Concierge Pass'}
              </h4>
              <p className="text-xs text-wasil-muted">
                {lang === 'ar'
                  ? 'مشاركة معلومات المنتجع والمطاعم والأنشطة السياحية مع النزلاء بلمسة واحدة.'
                  : 'Share dining options, resort activities, and maps with guests via Apple Wallet.'}
              </p>
            </div>
            <div className="rounded-2xl border border-wasil-border bg-white p-6 shadow-subtle">
              <h4 className="text-sm font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'برامج ولاء الضيوف' : 'Guest Privilege Club'}
              </h4>
              <p className="text-xs text-wasil-muted">
                {lang === 'ar'
                  ? 'نقاط إقامة وترقية الغرف واسترداد جلسات السبا والمطاعم عبر رموز QR.'
                  : 'Earn points on stays and redeem spa passes or dining vouchers at checkout.'}
              </p>
            </div>
            <div className="rounded-2xl border border-wasil-border bg-white p-6 shadow-subtle">
              <h4 className="text-sm font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'روابط الحجز المباشر' : 'Direct Booking Routing'}
              </h4>
              <p className="text-xs text-wasil-muted">
                {lang === 'ar'
                  ? 'توجيه النزلاء للحجز المباشر دون دفع عمولات منصات الحجز الخارجية.'
                  : 'Guide guests directly to direct booking channels, reducing OTA commission fees.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Retail & Dining */}
      <section id="retail" className="py-16 bg-white border-b border-wasil-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-amber text-white">
              <UtensilsCrossed className="h-6 w-6 text-wasil-navy" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-wasil-navy">{t('indRetail')}</h2>
              <span className="text-xs text-wasil-muted">
                {lang === 'ar' ? 'المطاعم، المقاهي، ومتاجر التجزئة العُمانية' : 'Cafes, specialty dining, and retail boutiques'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-wasil-border bg-wasil-bg/40 p-6">
              <h4 className="text-sm font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'بطاقة الطوابع الرقمية' : 'Digital Stamp Card'}
              </h4>
              <p className="text-xs text-wasil-muted">
                {lang === 'ar'
                  ? 'اشتري ٧ قهوات واحصل على الثامنة مجاناً، تحفظ في المحفظة الإلكترونية بدون كروت ورقية تضيع.'
                  : 'Buy 7 coffees get 1 free pass saved in Apple Wallet, no lost paper stamp cards.'}
              </p>
            </div>
            <div className="rounded-2xl border border-wasil-border bg-wasil-bg/40 p-6">
              <h4 className="text-sm font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'رموز QR للطاولات' : 'Table Tent QR Codes'}
              </h4>
              <p className="text-xs text-wasil-muted">
                {lang === 'ar'
                  ? 'توليد رموز QR قابلة للطباعة للطاولات لعرض القائمة والانضمام الفوري لبرنامج الولاء.'
                  : 'Printable high-res table tent QR codes for instant digital menu and loyalty signup.'}
              </p>
            </div>
            <div className="rounded-2xl border border-wasil-border bg-wasil-bg/40 p-6">
              <h4 className="text-sm font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'فحص الكاشير المانع للتكرار' : 'POS Cashier Scanner'}
              </h4>
              <p className="text-xs text-wasil-muted">
                {lang === 'ar'
                  ? 'شاشة فحص بسيطة للكاشير تفحص رمز العميل وتخصم النقاط في ثانية واحدة.'
                  : 'Simple cashier terminal interface validating tokens and deducting balance in 1 second.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
