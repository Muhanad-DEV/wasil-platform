'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Sparkles,
  Smartphone,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  RefreshCw,
  FileCode,
  Key,
  Layers,
  HelpCircle,
} from 'lucide-react';

export default function WalletPassManagementPage() {
  const { lang, t } = useLanguage();
  const [walletStatus, setWalletStatus] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/wallet/status').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/cards').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([statusData, cardsData]) => {
        if (statusData) setWalletStatus(statusData);
        if (cardsData) setCards(cardsData.cards || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleTestPass = async (cardId: string, platform: 'APPLE' | 'GOOGLE') => {
    setTestResult(null);
    if (platform === 'APPLE') {
      window.open(`/api/wallet/apple/${cardId}`, '_blank');
      setTestResult(
        lang === 'ar'
          ? 'تم توليد حزمة .pkpass وتنزيلها بوضع المحاكاة الآمن (Sandbox Mode).'
          : 'Compiled and downloaded .pkpass bundle in compliant sandbox mode.'
      );
    } else {
      const res = await fetch(`/api/wallet/google/${cardId}`);
      const data = await res.json();
      setTestResult(
        lang === 'ar'
          ? `تم إنشاء رابط Google Wallet JWT: ${data.message}`
          : `Google Wallet pass created: ${data.message}`
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 text-start max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'إدارة محافظ الجوال (Apple Wallet & Google Wallet)' : 'Digital Wallet Pass Architecture'}
          </h1>
          <p className="text-xs text-wasil-muted mt-1">
            {lang === 'ar'
              ? 'إصدار بطاقات أعمال وبطاقات ولاء رسمية محفوظة مباشرة في أجهزة آبل وأندرويد.'
              : 'Issue official digital business and loyalty passes saved to Apple Wallet & Google Wallet.'}
          </p>
        </div>

        {/* Integration Status & Transparency Card */}
        <div className="rounded-3xl border border-wasil-border bg-white p-6 sm:p-8 shadow-subtle">
          <div className="flex items-center justify-between border-b border-wasil-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-wasil-violet" />
              <h3 className="text-base font-bold text-wasil-navy">
                {lang === 'ar' ? 'حالة الاعتماد والتكامل التقني' : 'Integration Architecture Status'}
              </h3>
            </div>
            <span className="rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-bold border border-amber-300">
              ⚡ Sandbox Mode Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Apple Wallet Provider Box */}
            <div className="rounded-2xl border border-wasil-border bg-wasil-bg/40 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-wasil-navy"> Apple Wallet Pass (PKPass)</span>
                  <span className="rounded-md bg-amber-200/60 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                    SIMULATED / SANDBOX
                  </span>
                </div>
                <p className="text-xs text-wasil-muted mb-4 leading-relaxed">
                  {lang === 'ar'
                    ? 'محرك واصل يجمع ملفات pass.json، والترميز، وحزمة manifest.json المشفرة بصيغة .pkpass المعيارية.'
                    : 'Wasil pass engine compiles pass.json, barcode hashes, and manifest.json into standard .pkpass packages.'}
                </p>
                <div className="space-y-1.5 text-[11px] font-mono text-wasil-muted bg-white p-3 rounded-xl border border-wasil-border">
                  <div>Type: pass.om.wasil.businesscard</div>
                  <div>TeamID: WASILOMAN01 (Demo)</div>
                  <div>Signing: SHA1 / Demo Certificate</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-wasil-border/60 text-[11px] text-wasil-muted">
                {lang === 'ar' ? 'جاهز للتنزيل الفوري والاختبار المباشر' : 'Ready for direct sandbox download'}
              </div>
            </div>

            {/* Google Wallet Provider Box */}
            <div className="rounded-2xl border border-wasil-border bg-wasil-bg/40 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-wasil-navy">G Google Wallet (Google Pay)</span>
                  <span className="rounded-md bg-amber-200/60 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                    SIMULATED / SANDBOX
                  </span>
                </div>
                <p className="text-xs text-wasil-muted mb-4 leading-relaxed">
                  {lang === 'ar'
                    ? 'يتم توليد رمز JWT آمن يتضمن Generic Pass Class و Generic Pass Object متوافق مع بروتوكول Save to Google Wallet.'
                    : 'Generates signed JWT payloads embedding Generic Pass Class and Object definitions per Google Wallet API.'}
                </p>
                <div className="space-y-1.5 text-[11px] font-mono text-wasil-muted bg-white p-3 rounded-xl border border-wasil-border">
                  <div>IssuerID: 3388000000022119988</div>
                  <div>Class: wasil_business_card_v1</div>
                  <div>Protocol: pay.google.com/gp/v/save</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-wasil-border/60 text-[11px] text-wasil-muted">
                {lang === 'ar' ? 'جاهز لتوليد روابط الحفظ الفورية' : 'Ready for immediate JWT save generation'}
              </div>
            </div>
          </div>

          {testResult && (
            <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-fadeIn flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{testResult}</span>
            </div>
          )}
        </div>

        {/* Active Cards Wallet Pass Tester */}
        <div className="rounded-3xl border border-wasil-border bg-white p-6 sm:p-8 shadow-subtle">
          <h3 className="text-base font-bold text-wasil-navy mb-1">
            {lang === 'ar' ? 'اختبار وتنزيل بطاقات المحفظة للموظفين' : 'Issue & Test Wallet Passes for Team'}
          </h3>
          <p className="text-xs text-wasil-muted mb-6">
            {lang === 'ar'
              ? 'اختر بطاقة لتنزيل حزمة Apple Wallet أو اختبار رابط Google Wallet.'
              : 'Select a published card to download .pkpass or trigger Google Pay pass links.'}
          </p>

          <div className="space-y-3">
            {cards.map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-wasil-border p-4 bg-wasil-bg/30"
              >
                <div>
                  <h4 className="text-xs font-bold text-wasil-navy">{c.ownerName}</h4>
                  <p className="text-[11px] text-wasil-muted">{c.jobTitle} • {c.companyName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestPass(c.id, 'APPLE')}
                    className="flex items-center gap-1.5 rounded-xl bg-black px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-neutral-800"
                  >
                    <span> Apple (.pkpass)</span>
                    <Download className="h-3 w-3" />
                  </button>

                  <button
                    onClick={() => handleTestPass(c.id, 'GOOGLE')}
                    className="flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 shadow-sm"
                  >
                    <span className="text-wasil-violet font-bold">G</span>
                    <span>Google Pass</span>
                    <ExternalLink className="h-3 w-3 text-wasil-muted" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation & Instructions Box */}
        <div className="rounded-3xl bg-wasil-navy text-white p-6 sm:p-8">
          <h3 className="text-base font-bold mb-2">
            {lang === 'ar' ? 'دليل إعداد المفاتيح الإنتاجية (Production Credentials Setup)' : 'Production Credentials Setup Guide'}
          </h3>
          <p className="text-xs text-white/80 leading-relaxed mb-4">
            {lang === 'ar'
              ? 'للانتقال من وضع المحاكاة (Sandbox) إلى التوقيع الإنتاجي الكامل، قم بإضافة المتغيرات البيئية التالية في ملف .env على الخادم:'
              : 'To transition from sandbox simulation to production signing, provide the following environment variables:'}
          </p>
          <div className="rounded-xl bg-black/40 p-4 font-mono text-xs text-wasil-turquoise space-y-1">
            <div>APPLE_PASS_TYPE_ID="pass.om.yourcompany.businesscard"</div>
            <div>APPLE_TEAM_ID="YOUR_TEAM_ID"</div>
            <div>APPLE_CERTIFICATE_PEM="-----BEGIN CERTIFICATE-----..."</div>
            <div>APPLE_PRIVATE_KEY_PEM="-----BEGIN PRIVATE KEY-----..."</div>
            <div>GOOGLE_WALLET_ISSUER_ID="3388000000..."</div>
            <div>GOOGLE_WALLET_CLIENT_EMAIL="service-account@iam.gserviceaccount.com"</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
