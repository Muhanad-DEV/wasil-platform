'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import {
  CreditCard,
  Building,
  User,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export default function RegisterPage() {
  const { lang, t, isRtl } = useLanguage();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    industry: 'REAL_ESTATE',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/dashboard/onboarding');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="flex min-h-screen bg-wasil-bg flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-navy text-white shadow-md">
            <CreditCard className="h-6 w-6 text-wasil-turquoise" />
          </div>
          <div className="flex flex-col text-start">
            <span className="font-extrabold text-2xl text-wasil-navy">
              {lang === 'ar' ? 'واصل | Wasil' : 'Wasil | واصل'}
            </span>
            <span className="text-[10px] text-wasil-muted -mt-1">
              {lang === 'ar' ? 'سلطنة عُمان' : 'Sultanate of Oman'}
            </span>
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-wasil-navy">
          {lang === 'ar' ? 'إنشاء حساب جديد لمنظمتك' : 'Create an Account for Your Business'}
        </h2>
        <p className="mt-1 text-xs text-wasil-muted">
          {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link href="/auth/login" className="font-bold text-wasil-violet hover:underline">
            {t('signIn')}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-card sm:rounded-3xl border border-wasil-border text-start">
          {errorMsg && (
            <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'اسمك الكريم *' : 'Your Full Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ahmed Al Balushi"
                className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'اسم الشركة أو العلامة التجارية *' : 'Company or Business Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Al Mouj Real Estate"
                className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'قطاع العمل' : 'Industry Sector'}
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
              >
                <option value="REAL_ESTATE">{t('indRealEstate')}</option>
                <option value="HOSPITALITY">{t('indHospitality')}</option>
                <option value="RETAIL">{t('indRetail')}</option>
                <option value="PROFESSIONAL_SERVICES">{t('indServices')}</option>
                <option value="TOURISM">{t('indTourism')}</option>
                <option value="GENERAL">{lang === 'ar' ? 'قطاعات أخرى' : 'Other Businesses'}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'رقم الهاتف *' : 'Phone / WhatsApp *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+968 ..."
                  className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.om"
                  className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'كلمة المرور *' : 'Password *'}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-wasil-violet py-3 px-4 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 disabled:opacity-50 transition-all mt-4"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowIcon className="h-4 w-4" />
              )}
              <span>
                {isLoading
                  ? lang === 'ar'
                    ? 'جاري إنشاء الحساب...'
                    : 'Setting up...'
                  : lang === 'ar'
                  ? 'إنشاء الحساب ومتابعة الإعداد'
                  : 'Create Business Account'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
