'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Settings,
  Building2,
  Shield,
  Save,
  Check,
  Clock,
  Sparkles,
  Smartphone,
  Globe,
  FileText,
  Key,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function OrganizationSettingsPage() {
  const { lang, t, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'security'>('general');
  const [org, setOrg] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [industry, setIndustry] = useState('REAL_ESTATE');
  const [commercialRegNo, setCommercialRegNo] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [city, setCity] = useState('Muscat');
  const [defaultLanguage, setDefaultLanguage] = useState('ar');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');

  // Search in audit logs
  const [logSearch, setLogSearch] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [orgRes, logsRes] = await Promise.all([
        fetch('/api/organization'),
        fetch('/api/organization/audit-logs'),
      ]);

      if (orgRes.ok) {
        const orgData = await orgRes.json();
        const o = orgData.organization;
        if (o) {
          setOrg(o);
          setName(o.name || '');
          setNameAr(o.nameAr || '');
          setIndustry(o.industry || 'REAL_ESTATE');
          setCommercialRegNo(o.commercialRegNo || '');
          setPhone(o.phone || '');
          setWhatsapp(o.whatsapp || '');
          setEmail(o.email || '');
          setWebsite(o.website || '');
          setCity(o.city || 'Muscat');
          setDefaultLanguage(o.defaultLanguage || 'ar');
          setDescription(o.description || '');
          setDescriptionAr(o.descriptionAr || '');
        }
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org?.id) return;
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/organization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: org.id,
          name,
          nameAr,
          industry,
          commercialRegNo,
          phone,
          whatsapp,
          email,
          website,
          city,
          defaultLanguage,
          description,
          descriptionAr,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update settings');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (!logSearch) return true;
    const q = logSearch.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.resource.toLowerCase().includes(q) ||
      log.user?.name?.toLowerCase().includes(q) ||
      log.user?.email?.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-wasil-violet" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 text-start max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-wasil-navy flex items-center gap-2.5">
              <Settings className="h-6 w-6 text-wasil-violet" />
              <span>{lang === 'ar' ? 'إعدادات المنظمة والحساب' : 'Organization & Security Settings'}</span>
            </h1>
            <p className="text-xs text-wasil-muted mt-1">
              {lang === 'ar'
                ? 'إدارة الهوية الرسمية للشركة في سلطنة عُمان، ومفاتيح التكامل، وسجلات التدقيق الأمني.'
                : 'Manage official business identity in Oman, integration keys, and compliance audit logs.'}
            </p>
          </div>

          {org?.slug && (
            <a
              href={`/b/${org.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-wasil-border bg-white px-3.5 py-2 text-xs font-bold text-wasil-navy shadow-sm hover:bg-wasil-bg transition-colors"
            >
              <span>{lang === 'ar' ? 'الملف التعريفي العام' : 'Public Profile'}</span>
              <ExternalLink className="h-3.5 w-3.5 text-wasil-violet" />
            </a>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-wasil-border gap-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'general'
                ? 'border-wasil-violet text-wasil-violet'
                : 'border-transparent text-wasil-muted hover:text-wasil-navy'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>{lang === 'ar' ? 'بيانات المنظمة الرسمية' : 'Organization Profile'}</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'integrations'
                ? 'border-wasil-violet text-wasil-violet'
                : 'border-transparent text-wasil-muted hover:text-wasil-navy'
            }`}
          >
            <Key className="h-4 w-4" />
            <span>{lang === 'ar' ? 'المحافظ وبوابات الربط' : 'Wallets & Integrations'}</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'security'
                ? 'border-wasil-violet text-wasil-violet'
                : 'border-transparent text-wasil-muted hover:text-wasil-navy'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>{lang === 'ar' ? 'سجل التدقيق الأمني' : 'Security Audit Logs'}</span>
            <span className="rounded-full bg-wasil-bg px-2 py-0.5 text-[10px] text-wasil-navy">
              {logs.length}
            </span>
          </button>
        </div>

        {/* TAB 1: GENERAL PROFILE */}
        {activeTab === 'general' && (
          <form onSubmit={handleSave} className="space-y-6">
            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>
                  {lang === 'ar'
                    ? 'تم حفظ إعدادات المنظمة وتحديث سجل التدقيق بنجاح.'
                    : 'Organization settings updated and recorded to audit logs successfully.'}
                </span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-800">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="rounded-2xl border border-wasil-border bg-white p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-bold text-wasil-navy flex items-center gap-2 border-b border-wasil-border pb-3">
                <Building2 className="h-4 w-4 text-wasil-violet" />
                <span>{lang === 'ar' ? 'بيانات التسجيل التجاري في سلطنة عُمان' : 'Commercial Registration in Oman'}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'اسم المنظمة بالعربية *' : 'Organization Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    dir="rtl"
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none"
                    placeholder="مثال: الموج مسقط العقارية ش.م.م"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'اسم المنظمة بالإنجليزية *' : 'Organization Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    dir="ltr"
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none"
                    placeholder="e.g. Al Mouj Muscat Real Estate LLC"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'رقم السجل التجاري (C.R. No.)' : 'Commercial Registration (C.R. No.)'}
                  </label>
                  <input
                    type="text"
                    value={commercialRegNo}
                    onChange={(e) => setCommercialRegNo(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none font-mono"
                    placeholder="1234567"
                  />
                  <span className="text-[10px] text-wasil-muted mt-1 block">
                    {lang === 'ar' ? 'مسجل لدى وزارة التجارة والصناعة وترويج الاستثمار' : 'Registered with MoCIIP Oman'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'القطاع / الصناعة' : 'Industry Sector'}
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none"
                  >
                    <option value="REAL_ESTATE">{lang === 'ar' ? 'التطوير العقاري والوساطة' : 'Real Estate & Property'}</option>
                    <option value="HOSPITALITY">{lang === 'ar' ? 'الفنادق والضيافة والمنتجعات' : 'Hotels & Hospitality'}</option>
                    <option value="RETAIL">{lang === 'ar' ? 'التجزئة والمطاعم والمقاهي' : 'Retail, Food & Beverage'}</option>
                    <option value="SERVICES">{lang === 'ar' ? 'الخدمات المهنية والاستشارات' : 'Professional Services & Consulting'}</option>
                    <option value="TOURISM">{lang === 'ar' ? 'السياحة وتنظيم الفعاليات' : 'Tourism & Events'}</option>
                    <option value="FITNESS">{lang === 'ar' ? 'الأندية الرياضية والصحة' : 'Gyms, Clubs & Wellness'}</option>
                    <option value="OTHER">{lang === 'ar' ? 'قطاعات أخرى' : 'Other Business'}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-wasil-border bg-white p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-bold text-wasil-navy flex items-center gap-2 border-b border-wasil-border pb-3">
                <Globe className="h-4 w-4 text-wasil-turquoise" />
                <span>{lang === 'ar' ? 'معلومات التواصل والموقع الجغرافي' : 'Contact & Geographical Details'}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'رقم الهاتف الرسمي' : 'Official Phone'}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none font-mono"
                    placeholder="+968 2400 0000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'رقم واتساب الأعمال' : 'WhatsApp Business'}
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    dir="ltr"
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none font-mono"
                    placeholder="+968 9100 0000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'البريد الإلكتروني الرسمي' : 'Official Email'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none"
                    placeholder="info@company.om"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'الموقع الإلكتروني' : 'Official Website'}
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    dir="ltr"
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none"
                    placeholder="https://company.om"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'المدينة / المحافظة' : 'City / Governorate'}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none"
                  >
                    <option value="Muscat">{lang === 'ar' ? 'مسقط (Muscat)' : 'Muscat'}</option>
                    <option value="Salalah">{lang === 'ar' ? 'صلالة (Salalah)' : 'Salalah'}</option>
                    <option value="Sohar">{lang === 'ar' ? 'صحار (Sohar)' : 'Sohar'}</option>
                    <option value="Nizwa">{lang === 'ar' ? 'نزوى (Nizwa)' : 'Nizwa'}</option>
                    <option value="Sur">{lang === 'ar' ? 'صور (Sur)' : 'Sur'}</option>
                    <option value="Al Duqm">{lang === 'ar' ? 'الدقم (Duqm)' : 'Duqm'}</option>
                    <option value="Al Buraimi">{lang === 'ar' ? 'البريمي (Buraimi)' : 'Buraimi'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'اللغة الافتراضية للملفات' : 'Default Language for Profiles'}
                  </label>
                  <select
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none"
                  >
                    <option value="ar">{lang === 'ar' ? 'العربية (Arabic - RTL)' : 'Arabic (RTL)'}</option>
                    <option value="en">{lang === 'ar' ? 'الإنجليزية (English - LTR)' : 'English (LTR)'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'نبذة عن المنظمة (بالعربية)' : 'About Organization (Arabic)'}
                </label>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  dir="rtl"
                  className="w-full rounded-xl border border-wasil-border p-3 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none"
                  placeholder="اكتب نبذة رسمية تظهر في الملف التعريفي والبطاقات الرقمية..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'نبذة عن المنظمة (بالإنجليزية)' : 'About Organization (English)'}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-xl border border-wasil-border p-3 text-xs text-wasil-navy focus:border-wasil-violet focus:outline-none"
                  placeholder="Official company description in English..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-wasil-navy px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-wasil-violet disabled:opacity-50 transition-colors"
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{lang === 'ar' ? 'حفظ إعدادات المنظمة' : 'Save Organization Settings'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: INTEGRATIONS & WALLETS */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {/* Apple & Google Wallet Status Card */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900">
                    {lang === 'ar'
                      ? 'حالة تكامل المحافظ الرقمية (Apple & Google Wallet)'
                      : 'Digital Wallet Integration Status'}
                  </h3>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    {lang === 'ar'
                      ? 'يعمل النظام حالياً في وضع التجربة المعتمد (Sandbox Mode). يتم إنشاء ملفات .pkpass مطابقة لمعايير Apple Wallet مع شهادات محاكاة. لتفعيل التوقيع الحي على أجهزة iOS، قم بإدخال بيانات حساب Apple Developer.'
                      : 'The system is actively running in compliant Sandbox Mode. .pkpass files are generated strictly conforming to Apple Wallet specifications. Add Apple Developer keys below for production signing.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl border border-amber-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-wasil-navy flex items-center gap-1.5">
                      <Smartphone className="h-4 w-4 text-wasil-violet" />
                      Apple Wallet PassKit
                    </span>
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      Sandbox Active
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-wasil-muted">
                    <div>Pass Type ID: <code className="text-wasil-navy">pass.om.wasil.card</code></div>
                    <div>Team ID: <code className="text-wasil-navy">WASIL_OM_SANDBOX</code></div>
                    <div>RFC Compliant: <span className="text-emerald-600 font-bold">Yes (PKPass Zip)</span></div>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-wasil-navy flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-emerald-600" />
                      Google Wallet Passes
                    </span>
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      Simulated JWT
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-wasil-muted">
                    <div>Issuer ID: <code className="text-wasil-navy">33880000000221</code></div>
                    <div>Class ID: <code className="text-wasil-navy">wasil_generic_card</code></div>
                    <div>Save Link: <span className="text-emerald-600 font-bold">Generated</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Telecom Integration */}
            <div className="rounded-2xl border border-wasil-border bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-wasil-navy flex items-center gap-2 border-b border-wasil-border pb-3">
                <Key className="h-4 w-4 text-wasil-violet" />
                <span>{lang === 'ar' ? 'بوابات الرسائل والاتصالات المحلية (عُمان)' : 'Local SMS & WhatsApp Gateways (Oman)'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-wasil-border p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-wasil-navy">Omantel SMS Gateway</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-wasil-muted">
                    {lang === 'ar' ? 'إرسال رموز التفعيل والتنبيهات للعملاء عبر عمانتل.' : 'SMS verification for loyalty and appointments.'}
                  </p>
                </div>

                <div className="rounded-xl border border-wasil-border p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-wasil-navy">Ooredoo Oman SMS</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-wasil-muted">
                    {lang === 'ar' ? 'بوابة إرسال بديلة عالية التوافر للأرقام المحلية.' : 'High-availability fallback SMS route.'}
                  </p>
                </div>

                <div className="rounded-xl border border-wasil-border p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-wasil-navy">WhatsApp Cloud API</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Connected
                    </span>
                  </div>
                  <p className="text-[11px] text-wasil-muted">
                    {lang === 'ar' ? 'إرسال بطاقات vCard وروابط الولاء مباشرة عبر واتساب.' : 'Deliver vCard links and pass updates via WhatsApp.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === 'security' && (
          <div className="rounded-2xl border border-wasil-border bg-white shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-wasil-border pb-4">
              <div>
                <h3 className="text-sm font-bold text-wasil-navy flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'سجل التدقيق والامتثال الأمني' : 'Enterprise Audit Log'}</span>
                </h3>
                <p className="text-xs text-wasil-muted mt-0.5">
                  {lang === 'ar'
                    ? 'تسجيل دقيق وغير قابل للتعديل لجميع العمليات الحساسة، التصدير، وإنشاء البطاقات.'
                    : 'Immutable record of sensitive operations, data exports, and card publications.'}
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className={`absolute top-2.5 h-3.5 w-3.5 text-wasil-muted ${isRtl ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'بحث في السجلات...' : 'Filter audit log...'}
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className={`w-full rounded-xl border border-wasil-border py-1.5 text-xs text-wasil-navy placeholder:text-wasil-muted focus:border-wasil-violet focus:outline-none ${
                    isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'
                  }`}
                />
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-wasil-muted">
                {lang === 'ar' ? 'لا توجد سجلات تدقيق مطابقة' : 'No matching audit records found.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-wasil-border bg-wasil-bg/60 text-wasil-muted font-bold">
                      <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'الوقت' : 'Timestamp'}</th>
                      <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                      <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المورد' : 'Resource'}</th>
                      <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المستخدم' : 'User'}</th>
                      <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المعرف' : 'Resource ID'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wasil-border">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-wasil-bg/30">
                        <td className="py-2.5 px-3 text-wasil-muted font-mono whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString(lang === 'ar' ? 'ar-OM' : 'en-US', {
                            dateStyle: 'short',
                            timeStyle: 'medium',
                          })}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              log.action.includes('EXPORT')
                                ? 'bg-amber-100 text-amber-800'
                                : log.action.includes('DELETE')
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-wasil-violet/10 text-wasil-violet'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-wasil-navy whitespace-nowrap">
                          {log.resource}
                        </td>
                        <td className="py-2.5 px-3 text-wasil-text whitespace-nowrap">
                          <div>
                            <span className="font-bold">{log.user?.name || 'System'}</span>
                            <span className="text-[10px] text-wasil-muted block">{log.user?.email}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-wasil-muted">
                          {log.resourceId ? log.resourceId.slice(0, 10) + '...' : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
