'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CardPreview } from '@/components/card/CardPreview';
import {
  CreditCard,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Building,
  Utensils,
  Briefcase,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Globe2,
  QrCode,
  Smartphone,
  BarChart,
  HelpCircle,
  Gift,
} from 'lucide-react';

export default function HomePage() {
  const { lang, t, formatCurrency, isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const sampleCard = {
    slug: 'ahmed-albalushi',
    ownerName: 'Ahmed Al Balushi',
    ownerNameAr: 'أحمد البلوشي',
    jobTitle: 'Head of Luxury Residential Sales',
    jobTitleAr: 'رئيس مبيعات العقارات السكنية الفاخرة',
    companyName: 'Al Mouj Muscat Real Estate',
    companyNameAr: 'الموج مسقط العقارية',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    phone: '+96894567890',
    whatsapp: '+96894567890',
    email: 'ahmed@almouj.om',
    website: 'https://almouj.com',
    locationText: 'Al Mouj Marina, Muscat, Oman',
    locationTextAr: 'مارينا الموج، مسقط، سلطنة عُمان',
    bio: '14+ years in premium GCC real estate development. Freehold residences with residency visa eligibility.',
    bioAr: 'خبرة تزيد عن 14 عاماً في التطوير العقاري الخليجي الراقي، وتسهيل الإقامة العقارية للمستثمرين.',
    badgeText: 'Verified Real Estate Broker #OM-449',
    theme: 'navy-violet',
    primaryColor: '#181D48',
    accentColor: '#00B6B2',
    customActions: JSON.stringify([
      { label: 'View Available Villas', labelAr: 'تصفح الفلل المتاحة', url: '/b/al-mouj-muscat#properties', icon: 'home' },
      { label: 'Book VIP Viewing', labelAr: 'طلب معاينة خاصة', url: '/b/al-mouj-muscat#book', icon: 'calendar' },
    ]),
  };

  const industries = [
    {
      icon: Building,
      titleAr: 'التطوير والوساطة العقارية',
      titleEn: 'Real Estate & Properties',
      descAr: 'عرض الفلل والمشاريع، حجز مواعيد المعاينة، وتوزيع بطاقات المستشارين العقاريين.',
      descEn: 'Showcase villa floorplans, schedule property viewings, and issue broker digital passes.',
    },
    {
      icon: Sparkles,
      titleAr: 'الفنادق والضيافة والمنتجعات',
      titleEn: 'Hotels & Hospitality',
      descAr: 'بطاقات الكونسيرج، برامج ولاء النزلاء، وروابط الحجز المباشر للمطاعم والسبا.',
      descEn: 'Concierge passes, guest privilege tiers, and direct restaurant & spa bookings.',
    },
    {
      icon: Utensils,
      titleAr: 'المطاعم والمقاهي ومتاجر التجزئة',
      titleEn: 'Restaurants & Retail',
      descAr: 'طوابع الولاء الرقمية، بطاقات الخصم، ورموز QR للطاولات ونقاط البيع.',
      descEn: 'Digital loyalty stamp cards, VIP discount passes, and POS table QR codes.',
    },
    {
      icon: Briefcase,
      titleAr: 'الخدمات المهنية والاستشارات',
      titleEn: 'Professional Services',
      descAr: 'بطاقات المحامين والمستشارين، نماذج الاستشارة الأولية، وإدارة شبكة العملاء.',
      descEn: 'Consultant & lawyer identity cards, intake inquiry forms, and client pipeline.',
    },
  ];

  const faqs = [
    {
      qAr: 'كيف يتم حفظ بطاقة الأعمال في Apple Wallet و Google Wallet؟',
      qEn: 'How are business cards saved into Apple Wallet and Google Wallet?',
      aAr: 'تنشئ المنصة بطاقة رقمية معتمدة بصيغة .pkpass لأجهزة آبل ورابط Google Pay لأجهزة أندرويد، يستطيع العميل حفظها بنقرة واحدة بدون الحاجة لتثبيت أي تطبيق إضافي.',
      aEn: 'Wasil compiles official .pkpass files for Apple Wallet and Google Pay Passes for Android. Clients tap one button to store the pass with zero app installs required.',
    },
    {
      qAr: 'هل يدعم النظام الدفع بالريال العُماني (OMR)؟',
      qEn: 'Does Wasil support payments in Omani Rial (OMR)?',
      aAr: 'نعم بالكامل، جميع خطط الاشتراك والتقارير المالية والصفقات العقارية تسعر وتدار بالريال العُماني كعملة أساسية.',
      aEn: 'Yes, fully. All subscription tiers, financial reports, and deal pipelines natively operate in OMR as the primary currency.',
    },
    {
      qAr: 'هل يمكن تحديث معلومات البطاقة دون تغيير رمز QR المطبوع؟',
      qEn: 'Can I update card details without changing printed QR codes?',
      aAr: 'نعم، الروابط ورموز QR ديناميكية، أي تعديل على رقم الهاتف، المنصب، أو الخدمات ينعكس فورياً على نفس الرابط العام دون الحاجة لإعادة طباعة البطاقات.',
      aEn: 'Yes! All QR codes use dynamic redirects. Any update to phone, job title, or services updates live without reprinting collateral.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-wasil-bg/60 to-wasil-bg pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Right Text Content */}
            <div className="lg:col-span-7 space-y-6 text-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-wasil-violet/20 bg-wasil-violet/5 px-3.5 py-1 text-xs font-bold text-wasil-violet">
                <Sparkles className="h-3.5 w-3.5 text-wasil-turquoise" />
                <span>{lang === 'ar' ? 'الجيل الجديد لهوية الأعمال في سلطنة عُمان' : 'Next-Gen B2B Digital Identity in Oman'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-wasil-navy tracking-tight leading-[1.15]">
                {t('heroHeadline')}
              </h1>

              <p className="text-base sm:text-lg text-wasil-muted max-w-xl leading-relaxed">
                {t('heroSubheadline')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 rounded-2xl bg-wasil-violet px-7 py-3.5 text-sm font-bold text-white shadow-elevated hover:bg-wasil-violet/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{t('startFree')}</span>
                  <ArrowIcon className="h-4 w-4" />
                </Link>

                <Link
                  href="/features"
                  className="flex items-center gap-2 rounded-2xl border-2 border-wasil-border bg-white px-6 py-3.5 text-sm font-bold text-wasil-navy hover:bg-wasil-bg transition-colors"
                >
                  <span>{t('exploreFeatures')}</span>
                </Link>
              </div>

              {/* Proof badges */}
              <div className="pt-6 border-t border-wasil-border/80 flex flex-wrap items-center gap-6 text-xs text-wasil-muted">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-wasil-turquoise" />
                  <span>{lang === 'ar' ? 'دعم Apple Wallet و Google Wallet' : 'Apple & Google Wallet Ready'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-wasil-turquoise" />
                  <span>{lang === 'ar' ? 'إدارة المبيعات و CRM مدمج' : 'Built-in Sales CRM Pipeline'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-wasil-turquoise" />
                  <span>{lang === 'ar' ? 'متوافق مع أنظمة سلطنة عُمان' : 'Oman CR & Data Compliant'}</span>
                </div>
              </div>
            </div>

            {/* Interactive Phone Card Preview in Hero */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Floating Badge 1 */}
                <div className="absolute -top-4 -left-4 z-30 hidden sm:flex items-center gap-2 rounded-2xl bg-white p-3 shadow-card border border-wasil-border animate-bounce">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-wasil-turquoise/10 text-wasil-turquoise">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-wasil-muted font-bold">
                      {lang === 'ar' ? 'معدل التحويل' : 'Conversion'}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-wasil-navy">
                      +42% {lang === 'ar' ? 'مبيعات' : 'Deals'}
                    </span>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -bottom-4 -right-4 z-30 hidden sm:flex items-center gap-2 rounded-2xl bg-wasil-navy text-white p-3 shadow-elevated border border-wasil-violet/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-wasil-violet text-white">
                    <ShieldCheck className="h-4 w-4 text-wasil-turquoise" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-white/70 font-medium">
                      {lang === 'ar' ? 'محفظة الجوال' : 'Digital Pass'}
                    </span>
                    <span className="text-xs font-bold text-wasil-turquoise">
                       Apple Wallet Active
                    </span>
                  </div>
                </div>

                {/* Render Interactive Live Card Preview */}
                <CardPreview card={sampleCard} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR PILLARS SECTION */}
      <section className="py-20 bg-white border-y border-wasil-border">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-5xl">
          <span className="rounded-full bg-wasil-bg px-3 py-1 text-xs font-bold text-wasil-violet border border-wasil-border">
            {lang === 'ar' ? 'ركائز المنصة المتكاملة' : 'The Four Value Pillars'}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'نظام متكامل يربط الهوية بالمبيعات والولاء' : 'One Cohesive Growth Architecture'}
          </h2>
          <p className="mt-2 text-sm text-wasil-muted max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'صممت المنصة لتعمل فيها جميع الوحدات كمنتج موحد، وليست مجرد صفحات متباعدة.'
              : 'Built so digital identity, CRM pipeline, and loyalty mechanics empower each other seamlessly.'}
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
            {/* Pillar 1 */}
            <div className="rounded-3xl border border-wasil-border bg-wasil-bg/40 p-8 shadow-subtle hover:border-wasil-violet/50 hover:shadow-card transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-navy text-white mb-6">
                <CreditCard className="h-6 w-6 text-wasil-turquoise" />
              </div>
              <h3 className="text-lg font-bold text-wasil-navy mb-2">{t('pillar1Title')}</h3>
              <p className="text-xs leading-relaxed text-wasil-muted mb-4">{t('pillar1Desc')}</p>
              <ul className="space-y-1.5 text-xs text-wasil-text/80">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'تصدير جهة الاتصال الفوري بنقرة واحدة (vCard)' : 'One-tap RFC vCard contact saving'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'حفظ البطاقة في Apple Wallet و Google Wallet' : 'Apple & Google Wallet pass downloads'}</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl border border-wasil-border bg-wasil-bg/40 p-8 shadow-subtle hover:border-wasil-violet/50 hover:shadow-card transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-violet text-white mb-6">
                <Briefcase className="h-6 w-6 text-wasil-amber-light" />
              </div>
              <h3 className="text-lg font-bold text-wasil-navy mb-2">{t('pillar2Title')}</h3>
              <p className="text-xs leading-relaxed text-wasil-muted mb-4">{t('pillar2Desc')}</p>
              <ul className="space-y-1.5 text-xs text-wasil-text/80">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'خط أنابيب مبيعات كانبان من 8 مراحل احترافية' : '8-stage visual Kanban pipeline'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'كشف التكرار وتتبع مصدر الحملة الإعلانية' : 'Duplicate detection & UTM campaign attribution'}</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl border border-wasil-border bg-wasil-bg/40 p-8 shadow-subtle hover:border-wasil-violet/50 hover:shadow-card transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-turquoise text-white mb-6">
                <Gift className="h-6 w-6 text-wasil-navy" />
              </div>
              <h3 className="text-lg font-bold text-wasil-navy mb-2">{t('pillar3Title')}</h3>
              <p className="text-xs leading-relaxed text-wasil-muted mb-4">{t('pillar3Desc')}</p>
              <ul className="space-y-1.5 text-xs text-wasil-text/80">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'دفتر حسابات غير قابل للتلاعب بالنقاط والطوابع' : 'Immutable transaction points ledger'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'واجهة فحص موظف لمنع استرداد المكافأة مرتين' : 'Staff validation scanner with duplicate prevention'}</span>
                </li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-3xl border border-wasil-border bg-wasil-bg/40 p-8 shadow-subtle hover:border-wasil-violet/50 hover:shadow-card transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-amber text-white mb-6">
                <BarChart className="h-6 w-6 text-wasil-navy" />
              </div>
              <h3 className="text-lg font-bold text-wasil-navy mb-2">{t('pillar4Title')}</h3>
              <p className="text-xs leading-relaxed text-wasil-muted mb-4">{t('pillar4Desc')}</p>
              <ul className="space-y-1.5 text-xs text-wasil-text/80">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'فروع متعددة وصلاحيات أمان صارمة للمنظمات' : 'Multi-branch & secure tenant RBAC'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                  <span>{lang === 'ar' ? 'تحليلات المسح والمشاهدات والمبيعات المحققة' : 'Scans, views & won revenue reporting in OMR'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUPPORTED INDUSTRIES SECTION */}
      <section className="py-20 bg-wasil-bg">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-5xl">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-wasil-turquoise-dark border border-wasil-border">
            {lang === 'ar' ? 'حلول مخصصة للسوق العُماني والخليجي' : 'Tailored For Regional GCC Industries'}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'قطاعات الأعمال المستهدفة' : 'Target Industries'}
          </h2>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
            {industries.map((ind, idx) => {
              const Icon = ind.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white p-6 border border-wasil-border shadow-subtle hover:border-wasil-violet transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wasil-violet/10 text-wasil-violet mb-4">
                    <Icon className="h-5 w-5 text-wasil-turquoise" />
                  </div>
                  <h4 className="text-sm font-bold text-wasil-navy mb-2">
                    {lang === 'ar' ? ind.titleAr : ind.titleEn}
                  </h4>
                  <p className="text-xs text-wasil-muted leading-relaxed">
                    {lang === 'ar' ? ind.descAr : ind.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PRICING PLANS SECTION */}
      <section className="py-20 bg-white border-t border-wasil-border">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-5xl">
          <span className="rounded-full bg-wasil-bg px-3 py-1 text-xs font-bold text-wasil-violet border border-wasil-border">
            {lang === 'ar' ? 'أسعار شفافة بالريال العُماني' : 'Transparent Pricing in OMR'}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'باقات مرنة تناسب جميع أحجام الشركات' : 'Plans Sized For Your Growth'}
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
            {/* Free */}
            <div className="rounded-3xl border border-wasil-border bg-white p-8 shadow-subtle flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-wasil-muted uppercase">Free</span>
                <h4 className="text-lg font-bold text-wasil-navy mt-1">{t('planFree')}</h4>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-wasil-navy">0</span>
                  <span className="text-xs text-wasil-muted ml-1"> {t('omrPerMonth')}</span>
                </div>
                <ul className="space-y-2 text-xs text-wasil-text/80 my-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-turquoise" />
                    <span>1 Digital Card</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-turquoise" />
                    <span>Basic Public Profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-turquoise" />
                    <span>Direct vCard Downloads</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/auth/register"
                className="w-full text-center rounded-xl border border-wasil-border py-2.5 text-xs font-bold text-wasil-navy hover:bg-wasil-bg transition-colors"
              >
                {t('startFree')}
              </Link>
            </div>

            {/* Business (Recommended) */}
            <div className="rounded-3xl border-2 border-wasil-violet bg-wasil-violet/5 p-8 shadow-elevated flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-wasil-violet px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                {lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
              </div>
              <div>
                <span className="text-xs font-bold text-wasil-violet uppercase">Business</span>
                <h4 className="text-lg font-bold text-wasil-navy mt-1">{t('planBusiness')}</h4>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-wasil-navy">12.000</span>
                  <span className="text-xs text-wasil-muted ml-1"> {t('omrPerMonth')}</span>
                </div>
                <ul className="space-y-2 text-xs text-wasil-text/80 my-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-violet" />
                    <span>Up to 5 Digital Cards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-violet" />
                    <span>Apple & Google Wallet Passes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-violet" />
                    <span>Lead CRM & Inquiry Forms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-violet" />
                    <span>Smart Branded QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-violet" />
                    <span>Loyalty & Rewards Program</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/auth/register"
                className="w-full text-center rounded-xl bg-wasil-violet py-2.5 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 transition-colors"
              >
                {lang === 'ar' ? 'اشترك في باقة الأعمال' : 'Get Business Plan'}
              </Link>
            </div>

            {/* Professional */}
            <div className="rounded-3xl border border-wasil-border bg-white p-8 shadow-subtle flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-wasil-muted uppercase">Professional</span>
                <h4 className="text-lg font-bold text-wasil-navy mt-1">{t('planProfessional')}</h4>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-wasil-navy">29.000</span>
                  <span className="text-xs text-wasil-muted ml-1"> {t('omrPerMonth')}</span>
                </div>
                <ul className="space-y-2 text-xs text-wasil-text/80 my-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-turquoise" />
                    <span>Up to 25 Cards for Teams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-turquoise" />
                    <span>Multi-Branch & Location Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-turquoise" />
                    <span>Advanced 8-Stage CRM Kanban</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-wasil-turquoise" />
                    <span>Full Analytics & CSV Export</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/auth/register"
                className="w-full text-center rounded-xl border border-wasil-border py-2.5 text-xs font-bold text-wasil-navy hover:bg-wasil-bg transition-colors"
              >
                {lang === 'ar' ? 'اشترك في الاحترافية' : 'Get Professional Plan'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-20 bg-wasil-bg">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-wasil-navy border border-wasil-border">
              {lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-wasil-navy">
              {lang === 'ar' ? 'كل ما تود معرفته عن منصة واصل' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl bg-white p-6 border border-wasil-border shadow-subtle">
                <h4 className="text-sm font-bold text-wasil-navy mb-2">
                  {lang === 'ar' ? faq.qAr : faq.qEn}
                </h4>
                <p className="text-xs leading-relaxed text-wasil-muted">
                  {lang === 'ar' ? faq.aAr : faq.aEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-20 bg-wasil-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#6317B5_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {lang === 'ar' ? 'جاهز لترقية هوية شركتك الرقمية في عُمان؟' : 'Ready to Elevate Your Digital Identity in Oman?'}
          </h2>
          <p className="mt-3 text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'ابدأ خلال دقيقتين، أنشئ بطاقتك الرقمية، واجذب أول عميل عبر واصل اليوم.'
              : 'Launch your branded digital card in under 2 minutes and start converting connections today.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="flex items-center gap-2 rounded-2xl bg-wasil-turquoise px-8 py-3.5 text-sm font-bold text-wasil-navy shadow-elevated hover:bg-wasil-turquoise-dark hover:text-white transition-all"
            >
              <span>{t('startFree')}</span>
              <ArrowIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/b/al-mouj-muscat"
              className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              {lang === 'ar' ? 'استعراض نموذج حي (الموج مسقط)' : 'Explore Live Profile (Al Mouj)'}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
