'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Share2,
  Calendar,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Gift,
  CheckCircle2,
  Send,
  RefreshCw,
  Home,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function PublicBusinessProfilePage({ params }: { params: { slug: string } }) {
  const { lang, t, formatCurrency, isRtl } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryArea, setInquiryArea] = useState('');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  // Appointment Modal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [aptName, setAptName] = useState('');
  const [aptPhone, setAptPhone] = useState('');
  const [aptDate, setAptDate] = useState('');
  const [aptService, setAptService] = useState('');
  const [aptSent, setAptSent] = useState(false);
  const [aptLoading, setAptLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/public/profile/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Business profile not found');
        return res.json();
      })
      .then((d) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [params.slug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) return;

    setInquiryLoading(true);
    try {
      const res = await fetch('/api/public/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: data.organization.id,
          name: inquiryName,
          phone: inquiryPhone,
          email: inquiryEmail,
          areaOfInterest: inquiryArea || 'General Inquiry',
          notes: inquiryNotes,
          source: 'PUBLIC_PROFILE',
        }),
      });

      if (res.ok) {
        setInquirySent(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptName || !aptPhone || !aptDate) return;

    setAptLoading(true);
    try {
      const res = await fetch('/api/public/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: data.organization.id,
          customerName: aptName,
          customerPhone: aptPhone,
          requestedTime: aptDate,
          serviceName: aptService || 'Property Viewing',
        }),
      });

      if (res.ok) {
        setAptSent(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAptLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-wasil-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-wasil-violet border-t-transparent" />
          <span className="text-xs font-bold text-wasil-navy">
            {lang === 'ar' ? 'جاري تحميل ملف الشركة...' : 'Loading profile...'}
          </span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-wasil-bg p-4 text-center">
        <Building2 className="h-16 w-16 text-wasil-muted mb-4" />
        <h2 className="text-xl font-bold text-wasil-navy">
          {lang === 'ar' ? 'الملف التعريفي غير متوفر' : 'Business Profile Not Found'}
        </h2>
        <p className="text-xs text-wasil-muted mt-1 max-w-sm">
          {lang === 'ar'
            ? 'تأكد من صحة الرابط أو أن الشركة قامت بنشر ملفها العام.'
            : 'Please check the URL or contact the business directly.'}
        </p>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-wasil-navy px-6 py-2.5 text-xs font-bold text-white"
        >
          {lang === 'ar' ? 'العودة للرئيسية' : 'Return Home'}
        </Link>
      </div>
    );
  }

  const { organization, profile, cards, branches, loyalty } = data;

  const displayOrgName = lang === 'ar' && organization.nameAr ? organization.nameAr : organization.name;
  const displayHeadline = lang === 'ar' && profile?.headlineAr ? profile.headlineAr : profile?.headline;
  const displayBio = lang === 'ar' && profile?.bioAr ? profile.bioAr : profile?.bio;

  let servicesList: any[] = [];
  try {
    if (profile?.servicesJson) servicesList = JSON.parse(profile.servicesJson);
  } catch {}

  let propertiesList: any[] = [];
  try {
    if (profile?.propertiesJson) propertiesList = JSON.parse(profile.propertiesJson);
  } catch {}

  return (
    <div className="min-h-screen bg-wasil-bg text-wasil-text pb-20">
      {/* Top Floating Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-wasil-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-wasil-navy text-white">
              <CreditCard className="h-4 w-4 text-wasil-turquoise" />
            </div>
            <span className="text-xs font-bold text-wasil-navy truncate max-w-[200px]">
              {displayOrgName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: displayOrgName, url: window.location.href });
                }
              }}
              className="rounded-lg border border-wasil-border p-2 text-wasil-navy hover:bg-wasil-bg"
              title="Share"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <a
              href={`https://wa.me/${organization.whatsapp?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white shadow-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>واتساب</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Cover & Branding */}
      <div className="bg-gradient-to-r from-wasil-navy via-[#271658] to-wasil-violet text-white py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          {organization.isVerified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-wasil-turquoise" />
              <span>
                {lang === 'ar' ? `شركة معتمدة (سجل تجاري: ${organization.commercialRegNo || 'CR-1084920'})` : 'Verified Oman Commercial Entity'}
              </span>
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {displayOrgName}
          </h1>

          {displayHeadline && (
            <p className="mt-2 text-sm sm:text-base text-white/90 max-w-xl mx-auto font-medium">
              {displayHeadline}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-wasil-turquoise" />
              <span>{organization.city}, Sultanate of Oman</span>
            </div>
            {organization.phone && (
              <div className="flex items-center gap-1.5 font-mono" dir="ltr">
                <Phone className="h-4 w-4 text-wasil-turquoise" />
                <span>{organization.phone}</span>
              </div>
            )}
            {organization.website && (
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline text-wasil-amber-light"
              >
                <Globe className="h-4 w-4" />
                <span>{organization.website.replace('https://', '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-10">
        {/* About Bio */}
        {displayBio && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-wasil-border shadow-subtle text-start">
            <h3 className="text-base font-bold text-wasil-navy mb-2">
              {lang === 'ar' ? 'نبذة عن الشركة' : 'About the Business'}
            </h3>
            <p className="text-xs sm:text-sm text-wasil-muted leading-relaxed">
              {displayBio}
            </p>
          </div>
        )}

        {/* Real Estate Property Listings (If applicable) */}
        {propertiesList.length > 0 && (
          <div id="properties" className="space-y-4 text-start">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-wasil-navy">
                  {lang === 'ar' ? 'المشاريع والوحدات العقارية المتاحة' : 'Featured Residences & Listings'}
                </h3>
                <p className="text-xs text-wasil-muted">
                  {lang === 'ar' ? 'اكتشف الفلل والشقق الفاخرة المتاحة للتملك الحر' : 'Explore luxury freehold properties with residency eligibility.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {propertiesList.map((prop: any) => (
                <div
                  key={prop.id}
                  className="rounded-3xl border border-wasil-border bg-white shadow-subtle overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {prop.imageUrl && (
                      <div className="h-44 w-full overflow-hidden relative">
                        <img
                          src={prop.imageUrl}
                          alt={prop.name}
                          className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                        <span className="absolute top-3 right-3 rounded-full bg-wasil-navy/80 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                          {prop.type}
                        </span>
                      </div>
                    )}
                    <div className="p-5">
                      <h4 className="text-sm font-bold text-wasil-navy">
                        {lang === 'ar' && prop.nameAr ? prop.nameAr : prop.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-wasil-muted mt-1">
                        <MapPin className="h-3 w-3 text-wasil-turquoise" />
                        <span>{prop.location}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-3 text-xs text-wasil-text font-medium border-t border-wasil-border/60 pt-2">
                        <span>{prop.bedrooms} {lang === 'ar' ? 'غرف' : 'Beds'}</span>
                        <span>•</span>
                        <span>{prop.areaSqM} م²</span>
                      </div>

                      <div className="mt-3">
                        <span className="text-[10px] text-wasil-muted block font-semibold">
                          {lang === 'ar' ? 'السعر' : 'Price'}
                        </span>
                        <span className="text-base font-extrabold text-wasil-violet font-mono">
                          {formatCurrency(prop.priceOMR)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => {
                        setInquiryArea(prop.name);
                        const el = document.getElementById('inquiry-form');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full rounded-xl bg-wasil-bg py-2 text-xs font-bold text-wasil-navy hover:bg-wasil-navy hover:text-white transition-all"
                    >
                      {lang === 'ar' ? 'طلب تفاصيل الوحدة' : 'Request Unit Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Offerings */}
        {servicesList.length > 0 && (
          <div className="space-y-4 text-start">
            <h3 className="text-lg font-bold text-wasil-navy">
              {lang === 'ar' ? 'الخدمات والحلول' : 'Our Services'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {servicesList.map((srv: any, idx: number) => (
                <div key={idx} className="rounded-2xl border border-wasil-border bg-white p-5 shadow-subtle">
                  <h4 className="text-sm font-bold text-wasil-navy mb-1.5">
                    {lang === 'ar' && srv.titleAr ? srv.titleAr : srv.title}
                  </h4>
                  <p className="text-xs text-wasil-muted leading-relaxed">
                    {lang === 'ar' && srv.descriptionAr ? srv.descriptionAr : srv.description}
                  </p>
                  {srv.priceFromOMR > 0 && (
                    <div className="mt-3 text-xs font-mono font-bold text-wasil-turquoise">
                      {lang === 'ar' ? 'يبدأ من: ' : 'From: '} {formatCurrency(srv.priceFromOMR)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Digital Business Cards for Team Members */}
        {cards && cards.length > 0 && (
          <div className="space-y-4 text-start">
            <h3 className="text-lg font-bold text-wasil-navy">
              {lang === 'ar' ? 'فريق العمل والبطاقات الرقمية المعتمدة' : 'Official Team Digital Cards'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cards.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/c/${c.slug}`}
                  className="flex items-center gap-4 rounded-2xl border border-wasil-border bg-white p-4 shadow-subtle hover:border-wasil-violet hover:shadow-card transition-all group"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-wasil-bg border-2 border-wasil-border overflow-hidden shrink-0">
                    {c.avatarUrl ? (
                      <img src={c.avatarUrl} alt={c.ownerName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-bold text-wasil-violet">{c.ownerName.slice(0, 2)}</span>
                    )}
                  </div>
                  <div className="flex-1 truncate">
                    <h4 className="text-sm font-bold text-wasil-navy group-hover:text-wasil-violet transition-colors truncate">
                      {lang === 'ar' && c.ownerNameAr ? c.ownerNameAr : c.ownerName}
                    </h4>
                    <p className="text-xs text-wasil-muted truncate">
                      {lang === 'ar' && c.jobTitleAr ? c.jobTitleAr : c.jobTitle}
                    </p>
                    <span className="text-[10px] text-wasil-turquoise font-medium">
                      wasil.om/c/{c.slug}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-wasil-muted group-hover:text-wasil-violet transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Working Customer Inquiry Form */}
        <div id="inquiry-form" className="rounded-3xl border border-wasil-border bg-white p-6 sm:p-8 shadow-card text-start">
          <h3 className="text-lg font-bold text-wasil-navy mb-1">
            {lang === 'ar' ? 'إرسال استفسار مباشر للشركة' : 'Send an Inquiry to Sales'}
          </h3>
          <p className="text-xs text-wasil-muted mb-6">
            {lang === 'ar'
              ? 'أدخل بياناتك وسيتم توجيه طلبك مباشرة إلى الفريق المختص.'
              : 'Submit your contact details and our team will get in touch immediately.'}
          </p>

          {inquirySent ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center animate-fadeIn">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-base font-bold text-emerald-950">
                {lang === 'ar' ? 'تم استلام استفسارك بنجاح!' : 'Inquiry Submitted!'}
              </h4>
              <p className="text-xs text-emerald-800 mt-1">
                {lang === 'ar' ? 'سيتواصل معك ممثل المبيعات خلال ساعات العمل.' : 'A sales representative will contact you shortly.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'الاسم *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="+968 ..."
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'الاهتمام أو الوحدة المطلوبة' : 'Area of Interest'}
                  </label>
                  <input
                    type="text"
                    value={inquiryArea}
                    onChange={(e) => setInquiryArea(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: فيلا زنيرة الفاخرة' : 'e.g. Zunairah Villa'}
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'تفاصيل إضافية أو وقت التواصل المفضل' : 'Additional Notes'}
                </label>
                <textarea
                  rows={3}
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3.5 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                />
              </div>

              <button
                type="submit"
                disabled={inquiryLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-wasil-violet py-3 px-4 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 transition-all disabled:opacity-50"
              >
                {inquiryLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span>{lang === 'ar' ? 'إرسال الاستفسار' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
