'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { CardPreview, CardPreviewData } from './CardPreview';
import {
  Save,
  Check,
  Eye,
  Smartphone,
  Monitor,
  Share2,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface CardBuilderProps {
  initialCard?: CardPreviewData;
  organizationId: string;
  onSaved?: (savedCard: any) => void;
}

export function CardBuilder({ initialCard, organizationId, onSaved }: CardBuilderProps) {
  const { lang, t, isRtl } = useLanguage();

  const [formData, setFormData] = useState<CardPreviewData>(
    initialCard || {
      slug: 'my-business-card',
      ownerName: 'Ahmed Al Balushi',
      ownerNameAr: 'أحمد البلوشي',
      jobTitle: 'Head of Luxury Sales',
      jobTitleAr: 'رئيس المبيعات العقارية الفاخرة',
      companyName: 'Al Mouj Muscat Real Estate',
      companyNameAr: 'الموج مسقط العقارية',
      phone: '+96894567890',
      whatsapp: '+96894567890',
      email: 'ahmed@almouj.om',
      website: 'https://almouj.com',
      locationText: 'Al Mouj Marina, Muscat, Oman',
      locationTextAr: 'مارينا الموج، مسقط، سلطنة عُمان',
      bio: 'Advising private investors on freehold waterfront residences and residency visas in the Sultanate of Oman.',
      bioAr: 'تقديم المشورة للمستثمرين حول عقارات التملك الحر الفاخرة وتأشيرات الإقامة في سلطنة عُمان.',
      badgeText: 'Verified Broker #OM-449',
      theme: 'navy-violet',
      primaryColor: '#181D48',
      accentColor: '#00B6B2',
      customActions: JSON.stringify([
        { label: 'View Properties', labelAr: 'تصفح المشاريع', url: '/b/al-mouj-muscat#properties', icon: 'home' },
        { label: 'Book VIP Viewing', labelAr: 'حجز موعد معاينة', url: '/b/al-mouj-muscat#book', icon: 'calendar' },
      ]),
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'styling' | 'actions'>('info');

  const themes = [
    { id: 'navy-violet', name: 'Navy & Violet (Official)', primary: '#181D48', accent: '#6317B5' },
    { id: 'turquoise-amber', name: 'Turquoise & Amber', primary: '#00B6B2', accent: '#E59F36' },
    { id: 'luxury-gold', name: 'Luxury Gold & Slate', primary: '#1B2430', accent: '#D4AF37' },
    { id: 'royal-blue', name: 'Muscat Royal Blue', primary: '#0A2540', accent: '#00D4B2' },
  ];

  const handleFieldChange = (field: keyof CardPreviewData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleThemeSelect = (themeObj: typeof themes[0]) => {
    setFormData((prev) => ({
      ...prev,
      theme: themeObj.id,
      primaryColor: themeObj.primary,
      accentColor: themeObj.accent,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const url = formData.id ? `/api/cards/${formData.id}` : '/api/cards';
      const method = formData.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          organizationId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save card');
      }

      setFormData(data.card);
      setSuccessMsg(lang === 'ar' ? 'تم حفظ وتحديث البطاقة الرقمية بنجاح!' : 'Card saved and published successfully!');
      if (onSaved) onSaved(data.card);

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Editor Controls Pane */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-wasil-border shadow-subtle p-6">
        <div className="flex items-center justify-between border-b border-wasil-border pb-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-wasil-navy">
              {lang === 'ar' ? 'محرر بطاقة الأعمال الرقمية' : 'Digital Business Card Builder'}
            </h3>
            <p className="text-xs text-wasil-muted">
              {lang === 'ar'
                ? 'خصص هوية البطاقة، معلومات التواصل، والمظهر العام مباشرة.'
                : 'Customize card identity, contact actions, and branding with live preview.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-wasil-violet px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 disabled:opacity-50 transition-all"
            >
              {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : t('saveChanges')}</span>
            </button>
          </div>
        </div>

        {/* Feedback alerts */}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 animate-fadeIn">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800 animate-fadeIn">
            {errorMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-wasil-border mb-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors ${
              activeTab === 'info'
                ? 'border-b-2 border-wasil-violet text-wasil-violet'
                : 'text-wasil-muted hover:text-wasil-navy'
            }`}
          >
            {lang === 'ar' ? 'المعلومات الشخصية والمهنية' : 'Contact & Profile'}
          </button>
          <button
            onClick={() => setActiveTab('styling')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors ${
              activeTab === 'styling'
                ? 'border-b-2 border-wasil-violet text-wasil-violet'
                : 'text-wasil-muted hover:text-wasil-navy'
            }`}
          >
            {lang === 'ar' ? 'المظهر والألوان' : 'Branding & Theme'}
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors ${
              activeTab === 'actions'
                ? 'border-b-2 border-wasil-violet text-wasil-violet'
                : 'text-wasil-muted hover:text-wasil-navy'
            }`}
          >
            {lang === 'ar' ? 'الأزرار التفاعلية والروابط' : 'Custom Action Buttons'}
          </button>
        </div>

        {/* TAB 1: Profile & Contact */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'الاسم (باللغة الإنجليزية)' : 'Full Name (English)'}
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'الاسم (باللغة العربية)' : 'Full Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={formData.ownerNameAr || ''}
                  onChange={(e) => handleFieldChange('ownerNameAr', e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'المسمى الوظيفي (بالإنجليزية)' : 'Job Title (English)'}
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'المسمى الوظيفي (بالعربية)' : 'Job Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={formData.jobTitleAr || ''}
                  onChange={(e) => handleFieldChange('jobTitleAr', e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'رقم الهاتف المباشر' : 'Direct Phone'}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'الموقع الإلكتروني' : 'Website URL'}
                </label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'الموقع الجغرافي / الفرع' : 'Location / Branch Text'}
              </label>
              <input
                type="text"
                value={formData.locationText || ''}
                onChange={(e) => handleFieldChange('locationText', e.target.value)}
                placeholder="Al Mouj Marina, Muscat, Oman"
                className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'نبذة تعريفية (بالعربية)' : 'Bio / Description (Arabic)'}
              </label>
              <textarea
                rows={3}
                value={formData.bioAr || ''}
                onChange={(e) => handleFieldChange('bioAr', e.target.value)}
                className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'شارة التحقق أو الترخيص' : 'Verification Badge Text'}
              </label>
              <input
                type="text"
                value={formData.badgeText || ''}
                onChange={(e) => handleFieldChange('badgeText', e.target.value)}
                placeholder="Verified Broker #OM-449"
                className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Themes & Colors */}
        {activeTab === 'styling' && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-wasil-navy mb-2">
                {lang === 'ar' ? 'نماذج الهوية الجاهزة' : 'Theme Presets'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((tItem) => (
                  <button
                    key={tItem.id}
                    onClick={() => handleThemeSelect(tItem)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-start transition-all ${
                      formData.theme === tItem.id
                        ? 'border-wasil-violet bg-wasil-violet/5 ring-2 ring-wasil-violet/20'
                        : 'border-wasil-border hover:bg-wasil-bg'
                    }`}
                  >
                    <div className="flex -space-x-1">
                      <div
                        className="h-6 w-6 rounded-full border border-white"
                        style={{ backgroundColor: tItem.primary }}
                      />
                      <div
                        className="h-6 w-6 rounded-full border border-white"
                        style={{ backgroundColor: tItem.accent }}
                      />
                    </div>
                    <span className="text-xs font-bold text-wasil-navy">{tItem.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'اللون الأساسي' : 'Primary Brand Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor || '#181D48'}
                    onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded-lg border border-wasil-border p-0.5"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor || '#181D48'}
                    onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'لون التمييز' : 'Accent Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.accentColor || '#00B6B2'}
                    onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded-lg border border-wasil-border p-0.5"
                  />
                  <input
                    type="text"
                    value={formData.accentColor || '#00B6B2'}
                    onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'رابط الصورة الشخصية' : 'Avatar Photo URL'}
              </label>
              <input
                type="text"
                value={formData.avatarUrl || ''}
                onChange={(e) => handleFieldChange('avatarUrl', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {/* TAB 3: Custom Actions */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            <p className="text-xs text-wasil-muted">
              {lang === 'ar'
                ? 'أضف أزراراً سريعة تظهر على البطاقة الرقمية (مثل: كتالوج المشاريع، حجز موعد، أو رابط المتجر).'
                : 'Configure direct action links shown on your card (e.g. project listings, booking calendars, portfolios).'}
            </p>

            <div className="p-4 rounded-xl bg-wasil-bg border border-wasil-border text-xs">
              <span className="font-bold text-wasil-navy">
                {lang === 'ar' ? 'الأزرار التفاعلية الحالية:' : 'Active Action Buttons:'}
              </span>
              <ul className="mt-2 space-y-1.5 list-disc list-inside text-wasil-text/80">
                <li>{lang === 'ar' ? 'تصفح المشاريع المتاحة (/b/al-mouj-muscat#properties)' : 'View Available Properties'}</li>
                <li>{lang === 'ar' ? 'حجز موعد معاينة خاصة (/b/al-mouj-muscat#book)' : 'Book VIP Viewing'}</li>
                <li>{lang === 'ar' ? 'تحميل كتالوج المشروع' : 'Download Master Brochure'}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview Side Pane */}
      <div className="lg:col-span-5 sticky top-24">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-wasil-navy">
            <Eye className="h-4 w-4 text-wasil-turquoise" />
            <span>{lang === 'ar' ? 'المعاينة الحية الفورية' : 'Live Interactive Preview'}</span>
          </div>

          <a
            href={`/c/${formData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-semibold text-wasil-violet hover:underline"
          >
            <span>{lang === 'ar' ? 'فتح الرابط العام' : 'Open Public URL'}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Render Card Preview */}
        <CardPreview card={formData} />
      </div>
    </div>
  );
}
