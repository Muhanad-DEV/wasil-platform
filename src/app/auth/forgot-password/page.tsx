'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { CreditCard, Mail, ArrowRight, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { lang, t, isRtl } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="flex min-h-screen bg-wasil-bg flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wasil-navy text-white shadow-md">
            <CreditCard className="h-6 w-6 text-wasil-turquoise" />
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-wasil-navy">
          {lang === 'ar' ? 'استعادة كلمة المرور' : 'Reset your password'}
        </h2>
        <p className="mt-1 text-xs text-wasil-muted">
          {lang === 'ar'
            ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.'
            : 'Enter your email address and we will send you a reset link.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-card sm:rounded-3xl border border-wasil-border text-start">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-emerald-950 mb-1">
                {lang === 'ar' ? 'تم إرسال رابط الاستعادة' : 'Reset link sent!'}
              </h4>
              <p className="text-xs text-emerald-800 mb-6">
                {lang === 'ar'
                  ? 'تفقد صندوق الوارد في بريدك الإلكتروني لإكمال التعيين.'
                  : 'Check your inbox for instructions to reset your password.'}
              </p>
              <Link
                href="/auth/login"
                className="rounded-xl bg-wasil-navy px-6 py-2.5 text-xs font-bold text-white"
              >
                {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-wasil-navy mb-1">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-wasil-navy py-3 px-4 text-xs font-bold text-white shadow hover:bg-wasil-navy/90 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowIcon className="h-4 w-4" />}
                <span>{lang === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}</span>
              </button>

              <div className="text-center pt-2">
                <Link href="/auth/login" className="text-xs text-wasil-violet font-semibold hover:underline">
                  {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
