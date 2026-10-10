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
  MapPin,
  Bell,
  Building2,
  Hotel,
  Navigation,
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
  const [activeTab, setActiveTab] = useState<'info' | 'styling' | 'actions' | 'wallet'>('info');

  const themes = [
    { id: 'navy-violet', name: 'Navy & Violet (Official)', primary: '#181D48', accent: '#6317B5' },
    { id: 'turquoise-amber', name: 'Turquoise & Amber', primary: '#00B6B2', accent: '#E59F36' },
    { id: 'luxury-gold', name: 'Luxury Gold & Slate', primary: '#1B2430', accent: '#D4AF37' },
    { id: 'royal-blue', name: 'Muscat Royal Blue', primary: '#0A2540', accent: '#00D4B2' },
  ];

  const PRESET_LOCATIONS = [
    {
      id: 'almouj-marina',
      name: 'Al Mouj Muscat Marina',
      nameAr: 'مارينا الموج مسقط',
      type: 'PROJECT',
      latitude: 23.6263,
      longitude: 58.2612,
      relevantText: 'Welcome to Al Mouj Muscat! Tap to explore waterfront residences & your sales advisor Ahmed.',
      relevantTextAr: 'أهلاً بك في الموج مسقط! استكشف الفلل الشاطئية الفاخرة وتواصل مع مستشارك أحمد.',
      address: 'Al Mouj Marina, Al Hail North, Muscat',
    },
    {
      id: 'stregis-almouj',
      name: 'The St. Regis Al Mouj Resort',
      nameAr: 'منتجع سانت ريجيس الموج',
      type: 'HOTEL',
      latitude: 23.6295,
      longitude: 58.2678,
      relevantText: 'Nearby The St. Regis Al Mouj. Present this pass for VIP concierge & property previews.',
      relevantTextAr: 'بالقرب من سانت ريجيس الموج مسقط. أظهر هذه البطاقة للاستقبال الخاص والمعاينات.',
      address: 'Al Mouj Street, Muscat',
    },
    {
      id: 'muscat-bay',
      name: 'Muscat Bay Residences',
      nameAr: 'مشاريع خليج مسقط',
      type: 'PROJECT',
      latitude: 23.5482,
      longitude: 58.6521,
      relevantText: 'Welcome to Muscat Bay! Discover parkside & seaside freehold villas.',
      relevantTextAr: 'أهلاً بك في خليج مسقط! استكشف فلل التملك الحر بين البحر والجبال.',
      address: 'Qantab Road, Muscat Bay',
    },
    {
      id: 'jumeirah-muscat-bay',
      name: 'Jumeirah Muscat Bay Resort',
      nameAr: 'منتجع جميرا خليج مسقط',
      type: 'HOTEL',
      latitude: 23.5490,
      longitude: 58.6535,
      relevantText: 'Nearby Jumeirah Muscat Bay. Book exclusive resort viewings with Wasil.',
      relevantTextAr: 'بالقرب من منتجع جميرا خليج مسقط. احجز موعد معاينة خاصة مع واصل.',
      address: 'Bandar Jissah, Muscat Bay',
    },
    {
      id: 'mall-of-oman',
      name: 'Mall of Oman Flagship Lounge',
      nameAr: 'مول عُمان - صالة المبيعات الرئيسية',
      type: 'OFFICE',
      latitude: 23.5786,
      longitude: 58.4069,
      relevantText: 'Nearby Mall of Oman. Visit our VIP real estate lounge on Level 1.',
      relevantTextAr: 'بالقرب من مول عُمان. تفضل بزيارة صالة الاستشارات العقارية في الطابق الأول.',
      address: 'Bawshar, Muscat',
    },
    {
      id: 'muscat-airport',
      name: 'Muscat International Airport VIP',
      nameAr: 'مطار مسقط الدولي (صالة كبار الشخصيات)',
      type: 'LANDMARK',
      latitude: 23.5880,
      longitude: 58.2844,
      relevantText: 'Welcome to the Sultanate of Oman! Tap to connect with your private advisor.',
      relevantTextAr: 'أهلاً بك في سلطنة عُمان! تواصل مباشرة مع مستشارك الاستثماري والخاص.',
      address: 'Airport Heights, Muscat',
    },
  ];

  const [locations, setLocations] = useState<any[]>(() => {
    if (formData.walletLocations) {
      try {
        return typeof formData.walletLocations === 'string'
          ? JSON.parse(formData.walletLocations)
          : formData.walletLocations;
      } catch (e) {}
    }
    return [PRESET_LOCATIONS[0], PRESET_LOCATIONS[1]];
  });

  const [walletDesign, setWalletDesign] = useState<any>(() => {
    if (formData.walletDesign) {
      try {
        return typeof formData.walletDesign === 'string'
          ? JSON.parse(formData.walletDesign)
          : formData.walletDesign;
      } catch (e) {}
    }
    return {
      themePreset: 'royal-navy',
      cardStyle: 'storeCard',
      crNumber: 'CR-1398244/OM',
      bookingUrl: 'https://almouj.com/vip-booking',
      enableGeofenceAlerts: true,
    };
  });

  const [customLoc, setCustomLoc] = useState({
    name: '',
    nameAr: '',
    type: 'PROJECT' as 'PROJECT' | 'HOTEL' | 'OFFICE' | 'LANDMARK',
    latitude: '',
    longitude: '',
    relevantText: '',
    relevantTextAr: '',
    address: '',
  });

  const handleFieldChange = (field: keyof CardPreviewData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPresetLocation = (preset: typeof PRESET_LOCATIONS[0]) => {
    if (locations.some((l) => l.name === preset.name || (l.latitude === preset.latitude && l.longitude === preset.longitude))) {
      return;
    }
    const updated = [...locations, preset];
    setLocations(updated);
    handleFieldChange('walletLocations', JSON.stringify(updated));
  };

  const handleRemoveLocation = (index: number) => {
    const updated = locations.filter((_, idx) => idx !== index);
    setLocations(updated);
    handleFieldChange('walletLocations', JSON.stringify(updated));
  };

  const handleAddCustomLocation = () => {
    const lat = parseFloat(customLoc.latitude);
    const lng = parseFloat(customLoc.longitude);
    if (!customLoc.name || isNaN(lat) || isNaN(lng)) {
      alert(lang === 'ar' ? 'يرجى إدخال اسم الموقع وإحداثيات خط الطول والعرض بشكل صحيح' : 'Please provide a valid location name and latitude/longitude coordinates.');
      return;
    }

    const newLoc = {
      id: `custom-${Date.now()}`,
      name: customLoc.name,
      nameAr: customLoc.nameAr || customLoc.name,
      type: customLoc.type,
      latitude: lat,
      longitude: lng,
      relevantText: customLoc.relevantText || `Welcome to ${customLoc.name}! Tap to open your VIP pass.`,
      relevantTextAr: customLoc.relevantTextAr || `أهلاً بك في ${customLoc.nameAr || customLoc.name}! افتح بطاقتك الرقمية للتواصل.`,
      address: customLoc.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    };

    const updated = [...locations, newLoc];
    setLocations(updated);
    handleFieldChange('walletLocations', JSON.stringify(updated));
    setCustomLoc({
      name: '',
      nameAr: '',
      type: 'PROJECT',
      latitude: '',
      longitude: '',
      relevantText: '',
      relevantTextAr: '',
      address: '',
    });
  };

  const handleWalletDesignChange = (key: string, value: any) => {
    const updated = { ...walletDesign, [key]: value };
    setWalletDesign(updated);
    handleFieldChange('walletDesign', JSON.stringify(updated));
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
          walletLocations: JSON.stringify(locations),
          walletDesign: JSON.stringify(walletDesign),
          organizationId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save card');
      }

      setFormData(data.card);
      if (data.card.walletLocations) {
        try {
          setLocations(typeof data.card.walletLocations === 'string' ? JSON.parse(data.card.walletLocations) : data.card.walletLocations);
        } catch (e) {}
      }
      if (data.card.walletDesign) {
        try {
          setWalletDesign(typeof data.card.walletDesign === 'string' ? JSON.parse(data.card.walletDesign) : data.card.walletDesign);
        } catch (e) {}
      }
      setSuccessMsg(lang === 'ar' ? 'تم حفظ وتحديث البطاقة الرقمية وإعدادات المحفظة بنجاح!' : 'Card and wallet geofence settings saved successfully!');
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
          <button
            onClick={() => setActiveTab('wallet')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'wallet'
                ? 'border-b-2 border-wasil-violet text-wasil-violet'
                : 'text-wasil-muted hover:text-wasil-navy'
            }`}
          >
            <Bell className="h-3.5 w-3.5 text-wasil-turquoise" />
            <span>{lang === 'ar' ? 'المحفظة والتنبيه الجغرافي' : 'Wallet & Geofence'}</span>
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

        {/* TAB 4: Wallet & Geofencing */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            {/* Feature Banner Explaining Apple / Google Wallet Lock Screen Geofence Notifications */}
            <div className="rounded-2xl bg-gradient-to-br from-wasil-navy to-slate-900 p-5 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-wasil-turquoise/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wasil-turquoise/20 text-wasil-turquoise shrink-0 border border-wasil-turquoise/30">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{lang === 'ar' ? 'تنبيهات شاشة القفل التلقائية بالقرب من المشاريع والفنادق' : 'Native Lock Screen Geofencing Alerts'}</span>
                    <span className="rounded-full bg-wasil-turquoise px-2 py-0.5 text-[9px] font-black text-wasil-navy uppercase">
                      PassKit GPS
                    </span>
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    {lang === 'ar'
                      ? 'عندما يحفظ العميل بطاقتك في Apple Wallet أو Google Wallet، يتعرف الهاتف على إحداثيات GPS المدمجة. بمجرد اقترابه من الفندق أو المشروع العقاري (ضمن مسافة 150 متراً)، يضيء الهاتف تلقائياً على شاشة القفل برسالة التنبيه التي تحددها هنا دون الحاجة لفتح أي تطبيق!'
                      : 'When clients save your card to Apple Wallet or Google Wallet, iOS & Android natively trigger lock screen notifications within 150m of linked projects or hotels without needing an app installed.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Presets for Oman's Iconic Landmarks & Hotels */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-wasil-navy">
                    {lang === 'ar' ? 'مشاريع وفنادق عُمانية شهيرة (إضافة بنقرة واحدة)' : 'Popular Omani Projects & Hotels (1-Click Add)'}
                  </span>
                  <p className="text-[11px] text-wasil-muted">
                    {lang === 'ar'
                      ? 'اختر من المعالم الجاهزة بإحداثياتها الدقيقة ورسائل التنبيه الذكية:'
                      : 'Instantly attach pre-mapped luxury projects and resorts:'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_LOCATIONS.map((preset) => {
                  const isAdded = locations.some(
                    (l) => l.name === preset.name || (l.latitude === preset.latitude && l.longitude === preset.longitude)
                  );
                  const title = lang === 'ar' ? preset.nameAr : preset.name;
                  const alertPreview = lang === 'ar' ? preset.relevantTextAr : preset.relevantText;

                  return (
                    <div
                      key={preset.id}
                      className={`flex flex-col justify-between p-3 rounded-xl border transition-all ${
                        isAdded
                          ? 'border-wasil-turquoise/50 bg-wasil-turquoise/5'
                          : 'border-wasil-border bg-white hover:border-wasil-violet/40 hover:shadow-subtle'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-wasil-bg text-wasil-navy shrink-0">
                            {preset.type === 'HOTEL' ? (
                              <Hotel className="h-3.5 w-3.5 text-wasil-amber" />
                            ) : (
                              <Building2 className="h-3.5 w-3.5 text-wasil-violet" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-wasil-navy line-clamp-1">{title}</div>
                            <div className="text-[10px] text-wasil-muted font-mono" dir="ltr">
                              {preset.latitude.toFixed(4)}, {preset.longitude.toFixed(4)}
                            </div>
                          </div>
                        </div>

                        {isAdded ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-wasil-turquoise/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <Check className="h-3 w-3" />
                            {lang === 'ar' ? 'مضاف' : 'Linked'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddPresetLocation(preset)}
                            className="inline-flex items-center gap-1 rounded-lg bg-wasil-bg px-2.5 py-1 text-[11px] font-bold text-wasil-navy hover:bg-wasil-violet hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            {lang === 'ar' ? 'ربط' : 'Add'}
                          </button>
                        )}
                      </div>

                      <div className="text-[10px] text-wasil-muted bg-white/70 p-1.5 rounded-lg border border-wasil-border/40 line-clamp-2">
                        <span className="font-semibold text-wasil-navy">{lang === 'ar' ? 'التنبيه: ' : 'Alert: '}</span>
                        {alertPreview}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Currently Linked Locations List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-wasil-navy flex items-center gap-1.5">
                  <Navigation className="h-4 w-4 text-wasil-turquoise" />
                  <span>
                    {lang === 'ar'
                      ? `المواقع المربوطة حالياً بالبطاقة (${locations.length} من 10 مسموح بها)`
                      : `Currently Linked Coordinates (${locations.length} of 10 max)`}
                  </span>
                </span>
                {locations.length > 0 && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {lang === 'ar' ? 'مزامنة مع Apple & Google' : 'Synced with Wallets'}
                  </span>
                )}
              </div>

              {locations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-wasil-border p-6 text-center text-xs text-wasil-muted">
                  {lang === 'ar'
                    ? 'لم يتم ربط أي موقع بعد. اختر من القائمة أعلاه أو أضف مشروعك الخاص أدناه.'
                    : 'No locations linked yet. Select from presets above or add custom coordinates below.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {locations.map((loc, idx) => {
                    const locName = lang === 'ar' && loc.nameAr ? loc.nameAr : loc.name;
                    const alertMsg = lang === 'ar' && loc.relevantTextAr ? loc.relevantTextAr : loc.relevantText;

                    return (
                      <div
                        key={loc.id || idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-wasil-bg/60 border border-wasil-border hover:border-wasil-violet/40 transition-all text-xs"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-wasil-navy shadow-sm shrink-0 mt-0.5">
                            {loc.type === 'HOTEL' ? (
                              <Hotel className="h-4 w-4 text-wasil-amber" />
                            ) : (
                              <Building2 className="h-4 w-4 text-wasil-violet" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-wasil-navy">{locName}</span>
                              <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-mono text-wasil-muted border border-wasil-border/60" dir="ltr">
                                {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-wasil-muted flex items-center gap-1">
                              <Bell className="h-3 w-3 text-wasil-turquoise shrink-0" />
                              <span className="truncate">{alertMsg}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(idx)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors shrink-0 mr-1 cursor-pointer"
                          title={lang === 'ar' ? 'حذف الموقع' : 'Remove location'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Custom Location Builder */}
            <div className="rounded-2xl border border-wasil-border bg-white p-4 space-y-4">
              <div>
                <h5 className="text-xs font-bold text-wasil-navy flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-wasil-violet" />
                  <span>{lang === 'ar' ? 'إضافة مشروع عقاري أو فندق مخصص' : 'Add Custom Project or Hotel Location'}</span>
                </h5>
                <p className="text-[11px] text-wasil-muted">
                  {lang === 'ar'
                    ? 'أدخل اسم المشروع وإحداثيات GPS ونص التنبيه الذي سيظهر على شاشة قفل هاتف العميل.'
                    : 'Specify name, GPS coordinates, and the exact lock screen notification message.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'اسم المشروع / الفندق (بالإنجليزية)' : 'Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={customLoc.name}
                    onChange={(e) => setCustomLoc({ ...customLoc, name: e.target.value })}
                    placeholder="e.g. Marina Tower Waterfront"
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'اسم المشروع / الفندق (بالعربية)' : 'Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={customLoc.nameAr}
                    onChange={(e) => setCustomLoc({ ...customLoc, nameAr: e.target.value })}
                    placeholder="مثال: برج مارينا السكني الفاخر"
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'نوع الموقع' : 'Location Type'}
                  </label>
                  <select
                    value={customLoc.type}
                    onChange={(e) => setCustomLoc({ ...customLoc, type: e.target.value as any })}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs bg-white text-wasil-navy focus:outline-none focus:border-wasil-violet"
                  >
                    <option value="PROJECT">{lang === 'ar' ? 'مشروع عقاري (Project)' : 'Real Estate Project'}</option>
                    <option value="HOTEL">{lang === 'ar' ? 'فندق / منتجع (Hotel/Resort)' : 'Hotel & Resort'}</option>
                    <option value="OFFICE">{lang === 'ar' ? 'صالة مبيعات / مكتب (Office)' : 'Sales Lounge'}</option>
                    <option value="LANDMARK">{lang === 'ar' ? 'معلم رئيسي (Landmark)' : 'Landmark'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'خط العرض (Latitude)' : 'Latitude'}
                  </label>
                  <input
                    type="text"
                    value={customLoc.latitude}
                    onChange={(e) => setCustomLoc({ ...customLoc, latitude: e.target.value })}
                    placeholder="23.6263"
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-wasil-violet"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'خط الطول (Longitude)' : 'Longitude'}
                  </label>
                  <input
                    type="text"
                    value={customLoc.longitude}
                    onChange={(e) => setCustomLoc({ ...customLoc, longitude: e.target.value })}
                    placeholder="58.2612"
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-wasil-violet"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-wasil-navy mb-1 flex items-center justify-between">
                  <span>{lang === 'ar' ? 'نص تنبيه شاشة القفل عند الاقتراب (عربي)' : 'Lock Screen Alert Message (Arabic)'}</span>
                  <span className="text-[10px] text-wasil-muted font-normal">{lang === 'ar' ? 'يظهر فورياً على شاشة القفل' : 'Shows natively on lock screen'}</span>
                </label>
                <input
                  type="text"
                  value={customLoc.relevantTextAr}
                  onChange={(e) => setCustomLoc({ ...customLoc, relevantTextAr: e.target.value })}
                  placeholder="أهلاً بك بالقرب من المشروع! اضغط هنا للتواصل مع مستشارك وحجز معاينة."
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'نص تنبيه شاشة القفل (إنجليزي)' : 'Lock Screen Alert Message (English)'}
                </label>
                <input
                  type="text"
                  value={customLoc.relevantText}
                  onChange={(e) => setCustomLoc({ ...customLoc, relevantText: e.target.value })}
                  placeholder="Welcome! Tap to explore available residences with your sales advisor."
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                  dir="ltr"
                />
              </div>

              <button
                type="button"
                onClick={handleAddCustomLocation}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-wasil-navy py-2.5 px-4 text-xs font-bold text-white shadow hover:bg-wasil-navy/90 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 text-wasil-turquoise" />
                <span>{lang === 'ar' ? 'إضافة هذا الموقع للبطاقة والتنبيه الجغرافي' : 'Attach Geofenced Location to Pass'}</span>
              </button>
            </div>

            {/* Wallet Back-Fields & Compliance */}
            <div className="rounded-2xl border border-wasil-border bg-white p-4 space-y-3">
              <h5 className="text-xs font-bold text-wasil-navy">
                {lang === 'ar' ? 'بيانات ظهر البطاقة والروابط التفاعلية (Back of Card Fields)' : 'Wallet Back Fields & Direct Booking'}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'رقم السجل التجاري / رخصة الوساطة' : 'CR / Broker License Number'}
                  </label>
                  <input
                    type="text"
                    value={walletDesign.crNumber || ''}
                    onChange={(e) => handleWalletDesignChange('crNumber', e.target.value)}
                    placeholder="CR-1398244/OM"
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs font-mono"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'رابط الحجز المباشر أو المعاينة VIP' : 'VIP Direct Booking URL'}
                  </label>
                  <input
                    type="text"
                    value={walletDesign.bookingUrl || ''}
                    onChange={(e) => handleWalletDesignChange('bookingUrl', e.target.value)}
                    placeholder="https://almouj.com/vip-booking"
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                    dir="ltr"
                  />
                </div>
              </div>
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
