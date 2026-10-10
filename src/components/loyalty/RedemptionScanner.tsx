'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Gift,
  User,
  Phone,
  ShieldCheck,
  Award,
} from 'lucide-react';

export function RedemptionScanner() {
  const { lang, t, formatCurrency } = useLanguage();
  const [code, setCode] = useState('RDM-7749-AB'); // Seed default code
  const [isValidating, setIsValidating] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLookup = async (lookupCode?: string) => {
    const targetCode = (lookupCode || code).trim().toUpperCase();
    if (!targetCode) return;

    setIsValidating(true);
    setErrorMsg(null);
    setRedeemSuccess(null);
    setVerificationResult(null);

    try {
      const res = await fetch(`/api/loyalty/redeem?code=${encodeURIComponent(targetCode)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Redemption code not found');
      }

      setVerificationResult(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirmRedemption = async () => {
    if (!verificationResult?.redemption?.code) return;
    setIsRedeeming(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationResult.redemption.code }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to redeem reward');
      }

      setRedeemSuccess(data);
      setVerificationResult(null);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-wasil-border shadow-card p-6 sm:p-8">
      <div className="text-center mb-6">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-wasil-violet/10 text-wasil-violet">
          <QrCode className="h-7 w-7 text-wasil-turquoise" />
        </div>
        <h3 className="text-xl font-extrabold text-wasil-navy">
          {lang === 'ar' ? 'ماسح والتحقق من استرداد المكافآت' : 'Staff Reward Redemption Terminal'}
        </h3>
        <p className="text-xs text-wasil-muted mt-1 max-w-md mx-auto">
          {lang === 'ar'
            ? 'أدخل رمز الاسترداد أو امسح الرمز المقدم من العميل للتحقق من الأهلية وخصم النقاط بأمان.'
            : 'Enter the customer redemption voucher code to verify eligibility and deduct points securely.'}
        </p>
      </div>

      {/* Code Input Form */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. RDM-7749-AB"
            className="w-full rounded-2xl border-2 border-wasil-border bg-wasil-bg/40 px-4 py-3 text-sm font-mono font-bold text-wasil-navy tracking-wider uppercase focus:outline-none focus:border-wasil-violet"
          />
        </div>
        <button
          onClick={() => handleLookup()}
          disabled={isValidating || !code.trim()}
          className="flex items-center gap-2 rounded-2xl bg-wasil-navy px-6 py-3 text-xs font-bold text-white shadow hover:bg-wasil-navy/90 disabled:opacity-50 transition-colors"
        >
          {isValidating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span>{lang === 'ar' ? 'فحص الرمز' : 'Verify Code'}</span>
        </button>
      </div>

      {/* Quick Test Codes */}
      <div className="mb-6 flex items-center justify-center gap-2 text-xs text-wasil-muted">
        <span>{lang === 'ar' ? 'رمز تجريبي:' : 'Sample code:'}</span>
        <button
          onClick={() => {
            setCode('RDM-7749-AB');
            handleLookup('RDM-7749-AB');
          }}
          className="rounded-lg bg-wasil-bg px-2 py-1 font-mono text-[11px] font-bold text-wasil-violet hover:bg-wasil-border"
        >
          RDM-7749-AB
        </button>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Confirmation */}
      {redeemSuccess && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center animate-fadeIn">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h4 className="text-base font-bold text-emerald-900 mb-1">
            {lang === 'ar' ? 'تم استرداد المكافأة بنجاح!' : 'Reward Successfully Redeemed!'}
          </h4>
          <p className="text-xs text-emerald-700">
            {redeemSuccess.message}
          </p>
          <div className="mt-4 rounded-xl bg-white p-3 border border-emerald-200 text-xs inline-block text-start">
            <div className="flex justify-between gap-6">
              <span className="text-wasil-muted">{lang === 'ar' ? 'العميل:' : 'Member:'}</span>
              <span className="font-bold">{redeemSuccess.result?.member?.name}</span>
            </div>
            <div className="flex justify-between gap-6 mt-1">
              <span className="text-wasil-muted">{lang === 'ar' ? 'رصيد النقاط المتبقي:' : 'Remaining Points:'}</span>
              <span className="font-bold text-wasil-violet">{redeemSuccess.result?.member?.pointsBalance} pts</span>
            </div>
          </div>
        </div>
      )}

      {/* Verification Card Result */}
      {verificationResult && (
        <div className="rounded-2xl border border-wasil-border bg-wasil-bg/40 p-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-wasil-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-wasil-turquoise" />
              <h4 className="text-sm font-bold text-wasil-navy">
                {lang === 'ar' && verificationResult.redemption.rewardTitleAr
                  ? verificationResult.redemption.rewardTitleAr
                  : verificationResult.redemption.rewardTitle}
              </h4>
            </div>

            {verificationResult.valid ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{lang === 'ar' ? 'صالح للاسترداد' : 'Valid'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{verificationResult.reason || 'Invalid'}</span>
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs mb-5">
            <div className="flex justify-between">
              <span className="text-wasil-muted">{lang === 'ar' ? 'اسم العضو:' : 'Customer Name:'}</span>
              <span className="font-bold text-wasil-navy">{verificationResult.redemption.memberName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wasil-muted">{lang === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
              <span className="font-mono" dir="ltr">{verificationResult.redemption.memberPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wasil-muted">{lang === 'ar' ? 'النقاط المطلوبة للخصم:' : 'Points Required:'}</span>
              <span className="font-mono font-bold text-rose-700">
                -{verificationResult.redemption.pointsRequired} pts
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-wasil-muted">{lang === 'ar' ? 'رصيد العضو الحالي:' : 'Current Balance:'}</span>
              <span className="font-mono font-bold text-wasil-violet">
                {verificationResult.redemption.memberPoints} pts
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-wasil-muted">{lang === 'ar' ? 'تاريخ الانتهاء:' : 'Expires:'}</span>
              <span>{new Date(verificationResult.redemption.expiresAt).toLocaleDateString()}</span>
            </div>
          </div>

          {verificationResult.valid && (
            <button
              onClick={handleConfirmRedemption}
              disabled={isRedeeming}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-wasil-violet py-3 px-4 text-xs font-bold text-white shadow-md hover:bg-wasil-violet/90 transition-all"
            >
              {isRedeeming ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              <span>{lang === 'ar' ? 'تأكيد الخصم والاسترداد الفوري' : 'Confirm & Redeem Reward Now'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
