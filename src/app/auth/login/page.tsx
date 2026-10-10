'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import {
  CreditCard,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  UserCheck,
  Building,
} from 'lucide-react';

export default function LoginPage() {
  const { lang, t, isRtl } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPassword = customPass || password;

    if (!loginEmail || !loginPassword) {
      setErrorMsg(lang === 'ar' ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' : 'Email and password required');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user?.isSuperAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    handleLogin(undefined, demoEmail, 'Password123!');
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
          {lang === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'Sign in to your account'}
        </h2>
        <p className="mt-1 text-xs text-wasil-muted">
          {lang === 'ar' ? 'أو' : 'or'}{' '}
          <Link href="/auth/register" className="font-bold text-wasil-violet hover:underline">
            {lang === 'ar' ? 'أنشئ حساباً جديداً لشركتك مجاناً' : 'create a new business account'}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-card sm:rounded-3xl border border-wasil-border">
          {/* Quick Demo Credentials Box */}
          <div className="mb-6 rounded-2xl bg-wasil-bg p-4 border border-wasil-border">
            <span className="text-[11px] font-bold text-wasil-navy block mb-2">
              ⚡ {lang === 'ar' ? 'دخول سريع للتجربة والتقييم (One-Click Demo):' : 'One-Click Evaluation Accounts:'}
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ahmed@almouj.om')}
                className="flex items-center justify-between rounded-xl bg-white p-2.5 text-xs border border-wasil-border hover:border-wasil-violet transition-colors text-start shadow-subtle"
              >
                <div>
                  <span className="font-bold text-wasil-navy block">
                    {lang === 'ar' ? 'أحمد البلوشي (مالك منظمة - الموج)' : 'Ahmed Al Balushi (Business Owner - Al Mouj)'}
                  </span>
                  <span className="text-[10px] text-wasil-muted">ahmed@almouj.om</span>
                </div>
                <Building className="h-4 w-4 text-wasil-violet shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('fatima@almouj.om')}
                className="flex items-center justify-between rounded-xl bg-white p-2.5 text-xs border border-wasil-border hover:border-wasil-turquoise transition-colors text-start shadow-subtle"
              >
                <div>
                  <span className="font-bold text-wasil-navy block">
                    {lang === 'ar' ? 'فاطمة الحارثية (مندوبة مبيعات)' : 'Fatima Al Harthy (Sales Rep)'}
                  </span>
                  <span className="text-[10px] text-wasil-muted">fatima@almouj.om</span>
                </div>
                <UserCheck className="h-4 w-4 text-wasil-turquoise shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@wasil.om')}
                className="flex items-center justify-between rounded-xl bg-white p-2.5 text-xs border border-wasil-border hover:border-amber-500 transition-colors text-start shadow-subtle"
              >
                <div>
                  <span className="font-bold text-wasil-navy block">
                    {lang === 'ar' ? 'سعيد الحارثي (مشرف المنصة العام)' : 'Platform Super Admin'}
                  </span>
                  <span className="text-[10px] text-wasil-muted">admin@wasil.om</span>
                </div>
                <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.om"
                  className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-wasil-navy">
                  {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] font-semibold text-wasil-violet hover:underline"
                >
                  {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-wasil-border px-3.5 py-2.5 text-xs text-wasil-text focus:outline-none focus:border-wasil-violet"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-wasil-navy py-3 px-4 text-xs font-bold text-white shadow hover:bg-wasil-navy/90 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowIcon className="h-4 w-4 text-wasil-turquoise" />
              )}
              <span>
                {isLoading
                  ? lang === 'ar'
                    ? 'جاري التحقق...'
                    : 'Signing in...'
                  : t('signIn')}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
