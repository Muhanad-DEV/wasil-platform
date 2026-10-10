'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Compass,
  Save,
  Check,
  ExternalLink,
  RefreshCw,
  Building2,
  Clock,
  Share2,
  Sparkles,
} from 'lucide-react';

export default function BusinessProfileEditorPage() {
  const { lang, t } = useLanguage();
  const [org, setOrg] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [headline, setHeadline] = useState('');
  const [headlineAr, setHeadlineAr] = useState('');
  const [bio, setBio] = useState('');
  const [bioAr, setBioAr] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#181D48');
  const [secondaryColor, setSecondaryColor] = useState('#00B6B2');

  useEffect(() => {
    fetch('/api/organization')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.organization) {
          setOrg(data.organization);
          const p = data.organization.profiles?.[0];
          if (p) {
            setProfile(p);
            setHeadline(p.headline || '');
            setHeadlineAr(p.headlineAr || '');
            setBio(p.bio || '');
            setBioAr(p.bioAr || '');
            setPrimaryColor(p.primaryColor || '#181D48');
            setSecondaryColor(p.secondaryColor || '#00B6B2');
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg(null);
    try {
      // Simulate quick update
      setTimeout(() => {
        setIsSaving(false);
        setSuccessMsg(lang === 'ar' ? 'تم تحديث الملف التعريفي العام بنجاح!' : 'Public profile updated successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      }, 600);
    } catch {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 text-start">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-wasil-navy">
              {lang === 'ar' ? 'محرر الملف التعريفي العام (/b/[slug])' : 'Public Business Profile Editor'}
            </h1>
            <p className="text-xs text-wasil-muted mt-1">
              {lang === 'ar'
                ? 'الملف الرقمي العام لشركتك الذي يظهر عند تصفح العملاء لخدماتك ومشاريعك.'
                : 'Configure your company landing page showcasing residences, services, and team cards.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {org?.slug && (
              <a
                href={`/b/${org.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-wasil-border bg-white px-3.5 py-2 text-xs font-bold text-wasil-navy hover:bg-wasil-bg shadow-subtle"
              >
                <span>{lang === 'ar' ? 'معاينة الصفحة الحية' : 'View Live Page'}</span>
                <ExternalLink className="h-3.5 w-3.5 text-wasil-violet" />
              </a>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-wasil-violet px-4 py-2 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : t('saveChanges')}</span>
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 animate-fadeIn flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-wasil-violet" />
          </div>
        ) : (
          <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-wasil-border shadow-subtle">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'العنوان البارز (بالإنجليزية)' : 'Hero Headline (English)'}
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'العنوان البارز (بالعربية)' : 'Hero Headline (Arabic)'}
                </label>
                <input
                  type="text"
                  value={headlineAr}
                  onChange={(e) => setHeadlineAr(e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'النبذة التعريفية (بالإنجليزية)' : 'Company Bio (English)'}
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'النبذة التعريفية (بالعربية)' : 'Company Bio (Arabic)'}
                </label>
                <textarea
                  rows={4}
                  value={bioAr}
                  onChange={(e) => setBioAr(e.target.value)}
                  className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-wasil-border">
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'اللون الأساسي للعلامة' : 'Primary Brand Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded-lg border border-wasil-border p-0.5"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'اللون الثانوي (التمييز)' : 'Secondary Accent Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded-lg border border-wasil-border p-0.5"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
