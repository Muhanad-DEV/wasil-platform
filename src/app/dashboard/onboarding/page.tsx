'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Building,
  CreditCard,
  Layers,
  ShoppingBag,
  QrCode,
  Sparkles,
  Globe,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';

export default function OnboardingWizardPage() {
  const { lang, t, isRtl } = useLanguage();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [businessData, setBusinessData] = useState({
    businessName: 'Al Mouj Muscat Real Estate',
    industry: 'REAL_ESTATE',
    city: 'Muscat',
    phone: '+96894567890',
    whatsapp: '+96894567890',
    email: 'sales@almouj.om',
    website: 'https://almouj.com',
    description: 'Premier integrated waterfront real estate community in the Sultanate of Oman.',
    template: 'real_estate_luxury',
    cardName: 'Ahmed Al Balushi',
    cardTitle: 'Head of Luxury Sales',
    cardTheme: 'navy-violet',
    serviceTitle: 'Luxury Oceanfront Residences',
    qrStyle: 'classic_dark',
    walletMode: 'sandbox',
  });

  const steps = [
    { num: 1, titleAr: 'بيانات الشركة', titleEn: 'Business Details', icon: Building },
    { num: 2, titleAr: 'اختيار القالب', titleEn: 'Industry Template', icon: Layers },
    { num: 3, titleAr: 'تخصيص البطاقة', titleEn: 'Customize Card', icon: CreditCard },
    { num: 4, titleAr: 'إضافة الخدمات', titleEn: 'Add Offerings', icon: ShoppingBag },
    { num: 5, titleAr: 'توليد رمز QR', titleEn: 'Smart QR Code', icon: QrCode },
    { num: 6, titleAr: 'محفظة الجوال', titleEn: 'Wallet Pass', icon: Sparkles },
    { num: 7, titleAr: 'النشر والمشاركة', titleEn: 'Publish & Launch', icon: Globe },
  ];

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const ArrowNext = isRtl ? ArrowLeft : ArrowRight;
  const ArrowPrev = isRtl ? ArrowRight : ArrowLeft;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 text-start">
        {/* Wizard Header */}
        <div className="text-center">
          <span className="rounded-full bg-wasil-violet/10 px-3 py-1 text-xs font-bold text-wasil-violet">
            {lang === 'ar' ? 'معالج الإعداد والتهيئة' : 'Guided Setup Wizard'}
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'إعداد هويتك الرقمية وبطاقات العمل في ٧ خطوات' : 'Configure Your Digital Identity in 7 Steps'}
          </h1>
          <p className="text-xs text-wasil-muted mt-1">
            {lang === 'ar'
              ? 'اتبع الخطوات لتجهيز بطاقتك الرقمية، رمز QR، ومحفظة الجوال لنشاطك التجاري في عُمان.'
              : 'Follow the guided path to configure your cards, QR codes, and digital wallet integration.'}
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="bg-white p-4 rounded-3xl border border-wasil-border shadow-subtle overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] px-4">
            {steps.map((st) => {
              const isCompleted = currentStep > st.num;
              const isCurrent = currentStep === st.num;
              const Icon = st.icon;

              return (
                <div key={st.num} className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-wasil-violet text-white shadow-md ring-4 ring-wasil-violet/20'
                        : 'bg-wasil-bg text-wasil-muted border border-wasil-border'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : st.num}
                  </div>
                  <span
                    className={`text-xs font-semibold whitespace-nowrap ${
                      isCurrent ? 'text-wasil-navy font-bold' : 'text-wasil-muted'
                    }`}
                  >
                    {lang === 'ar' ? st.titleAr : st.titleEn}
                  </span>
                  {st.num < 7 && <ChevronRight className="h-3.5 w-3.5 text-wasil-border mx-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Body Container */}
        <div className="bg-white rounded-3xl border border-wasil-border shadow-subtle p-6 sm:p-8">
          {/* STEP 1: Business Details */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-wasil-navy mb-4">
                {lang === 'ar' ? 'الخطوة الأولى: بيانات الشركة الأساسية' : 'Step 1: Enter Business Information'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'اسم الشركة' : 'Company Name'}
                  </label>
                  <input
                    type="text"
                    value={businessData.businessName}
                    onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'المدينة في سلطنة عُمان' : 'City in Oman'}
                  </label>
                  <select
                    value={businessData.city}
                    onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  >
                    <option value="Muscat">مسقط (Muscat)</option>
                    <option value="Salalah">صلالة (Salalah)</option>
                    <option value="Sohar">صحار (Sohar)</option>
                    <option value="Nizwa">نزوى (Nizwa)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={businessData.phone}
                    onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'رقم الواتساب' : 'WhatsApp'}
                  </label>
                  <input
                    type="text"
                    value={businessData.whatsapp}
                    onChange={(e) => setBusinessData({ ...businessData, whatsapp: e.target.value })}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'وصف مختصر لنشاط الشركة' : 'Business Description'}
                </label>
                <textarea
                  rows={3}
                  value={businessData.description}
                  onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Template Selection */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-wasil-navy mb-4">
                {lang === 'ar' ? 'الخطوة الثانية: اختيار قالب العمل' : 'Step 2: Choose Business Template'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'real_estate_luxury', title: 'عقارات وتطوير فاخر', desc: 'فلل، شقق، معاينات، ووسطاء معتمدون' },
                  { id: 'hospitality_resort', title: 'فنادق وضيافة', desc: 'كونسيرج، حجز مباشر، وبطاقات ولاء' },
                  { id: 'dining_retail', title: 'مطاعم ومقاهي وتجزئة', desc: 'قوائم طعام، طوابع ولاء، ورموز طاولات' },
                ].map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => setBusinessData({ ...businessData, template: tpl.id })}
                    className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                      businessData.template === tpl.id
                        ? 'border-2 border-wasil-violet bg-wasil-violet/5 ring-2 ring-wasil-violet/20'
                        : 'border-wasil-border hover:bg-wasil-bg'
                    }`}
                  >
                    <h4 className="text-sm font-bold text-wasil-navy mb-1">{tpl.title}</h4>
                    <p className="text-xs text-wasil-muted">{tpl.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Customize Card */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-wasil-navy mb-4">
                {lang === 'ar' ? 'الخطوة الثالثة: بطاقة الأعمال الرقمية الأولى' : 'Step 3: First Digital Business Card'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'اسم صاحب البطاقة' : 'Cardholder Name'}
                  </label>
                  <input
                    type="text"
                    value={businessData.cardName}
                    onChange={(e) => setBusinessData({ ...businessData, cardName: e.target.value })}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}
                  </label>
                  <input
                    type="text"
                    value={businessData.cardTitle}
                    onChange={(e) => setBusinessData({ ...businessData, cardTitle: e.target.value })}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Add Offerings */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-wasil-navy mb-4">
                {lang === 'ar' ? 'الخطوة الرابعة: إضافة الخدمات أو المشاريع' : 'Step 4: Offerings & Projects'}
              </h3>
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'الخدمة الرئيسية أو المشروع البارز' : 'Featured Offering / Project'}
                </label>
                <input
                  type="text"
                  value={businessData.serviceTitle}
                  onChange={(e) => setBusinessData({ ...businessData, serviceTitle: e.target.value })}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 5: QR Code */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn text-center">
              <h3 className="text-base font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'الخطوة الخامسة: توليد رمز QR الذكي' : 'Step 5: Branded Smart QR Code'}
              </h3>
              <p className="text-xs text-wasil-muted mb-4 max-w-sm mx-auto">
                {lang === 'ar'
                  ? 'تم تجهيز رمز QR ديناميكي يربط بطاقتك وملفك العام مع تتبع عمليات المسح تلقائياً.'
                  : 'A dynamic QR code is generated linking directly to your live public profile.'}
              </p>
              <div className="inline-block p-4 rounded-2xl border border-wasil-border bg-wasil-bg">
                <QrCode className="h-32 w-32 text-wasil-navy mx-auto" />
              </div>
            </div>
          )}

          {/* STEP 6: Wallet Integration */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'الخطوة السادسة: تفعيل محفظة الجوال' : 'Step 6: Digital Wallet Passes'}
              </h3>
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 leading-relaxed">
                <span className="font-bold block mb-1">
                  ⚡ {lang === 'ar' ? 'وضع التجربة النشط (Sandbox Mode):' : 'Active Sandbox Mode:'}
                </span>
                {lang === 'ar'
                  ? 'تم تفعيل وضع المحاكاة الآمن لبطاقات Apple Wallet و Google Wallet. يمكنك تنزيل واختبار البطاقات فوراً دون الحاجة لشهادات المطورين.'
                  : 'Pass generation is enabled in sandbox demo mode. You can preview and test passes immediately.'}
              </div>
            </div>
          )}

          {/* STEP 7: Publish & Done */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-fadeIn text-center py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-wasil-navy">
                {lang === 'ar' ? 'تهانينا! هويتك الرقمية جاهزة للنشر' : 'Your Digital Business Identity is Ready!'}
              </h3>
              <p className="text-xs text-wasil-muted max-w-sm mx-auto">
                {lang === 'ar'
                  ? 'تم إنشاء بطاقتك وتفعيل الروابط العامة. اضغط لإنهاء الإعداد والذهاب للوحة التحكم.'
                  : 'Your profile, card, and QR code have been created. Click below to enter your dashboard.'}
              </p>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="mt-8 pt-4 border-t border-wasil-border flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center gap-1.5 rounded-xl border border-wasil-border px-4 py-2 text-xs font-bold text-wasil-navy hover:bg-wasil-bg disabled:opacity-40"
            >
              <ArrowPrev className="h-4 w-4" />
              <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl bg-wasil-violet px-6 py-2 text-xs font-bold text-white shadow hover:bg-wasil-violet/90"
            >
              <span>{currentStep === 7 ? (lang === 'ar' ? 'الذهاب للوحة التحكم' : 'Enter Dashboard') : (lang === 'ar' ? 'التالي' : 'Next')}</span>
              <ArrowNext className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
