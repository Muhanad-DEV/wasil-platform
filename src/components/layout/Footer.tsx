'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { CreditCard, MapPin, Phone, Mail, MessageSquare, Shield, CheckCircle } from 'lucide-react';

export function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="border-t border-wasil-border bg-white text-wasil-text pt-14 pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wasil-navy text-white shadow-md">
                <CreditCard className="h-5 w-5 text-wasil-turquoise" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-wasil-navy">
                  {lang === 'ar' ? 'واصل | Wasil' : 'Wasil | واصل'}
                </span>
                <span className="text-[10px] text-wasil-muted">
                  {lang === 'ar' ? 'منصة الهوية الرقمية ونمو الأعمال' : 'Digital Business Cards & Loyalty'}
                </span>
              </div>
            </Link>
            <p className="text-sm text-wasil-muted mb-6 max-w-sm leading-relaxed">
              {lang === 'ar'
                ? 'المنصة الرائدة في سلطنة عُمان لبطاقات الأعمال الذكية، حفظ البطاقات في Apple Wallet و Google Wallet، جذب العملاء، برامج الولاء وإدارة المبيعات.'
                : 'Oman’s leading platform for smart digital business cards, Apple & Google Wallet passes, customer acquisition, loyalty rewards, and sales CRM.'}
            </p>
            <div className="flex flex-col gap-2 text-xs text-wasil-muted">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-wasil-turquoise shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'مسقط، الموج، مجمع الأعمال، سلطنة عُمان'
                    : 'Muscat, Al Mouj Business Park, Sultanate of Oman'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-wasil-turquoise shrink-0" />
                <span dir="ltr">+968 2453 4444 / +968 9456 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-wasil-turquoise shrink-0" />
                <span>contact@wasil.om</span>
              </div>
            </div>
          </div>

          {/* Core Pillars */}
          <div>
            <h4 className="text-sm font-bold text-wasil-navy mb-4">
              {lang === 'ar' ? 'الأركان الأربعة' : 'Core Pillars'}
            </h4>
            <ul className="space-y-2.5 text-xs text-wasil-muted">
              <li>
                <Link href="/features#cards" className="hover:text-wasil-violet transition-colors">
                  {t('pillar1Title')}
                </Link>
              </li>
              <li>
                <Link href="/features#acquisition" className="hover:text-wasil-violet transition-colors">
                  {t('pillar2Title')}
                </Link>
              </li>
              <li>
                <Link href="/features#loyalty" className="hover:text-wasil-violet transition-colors">
                  {t('pillar3Title')}
                </Link>
              </li>
              <li>
                <Link href="/features#management" className="hover:text-wasil-violet transition-colors">
                  {t('pillar4Title')}
                </Link>
              </li>
              <li>
                <Link href="/features#wallet" className="hover:text-wasil-violet transition-colors">
                  {lang === 'ar' ? 'محافظ Apple و Google' : 'Apple & Google Wallets'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-sm font-bold text-wasil-navy mb-4">
              {lang === 'ar' ? 'القطاعات المتخصصة' : 'Industries'}
            </h4>
            <ul className="space-y-2.5 text-xs text-wasil-muted">
              <li>
                <Link href="/industries#real-estate" className="hover:text-wasil-violet transition-colors">
                  {t('indRealEstate')}
                </Link>
              </li>
              <li>
                <Link href="/industries#hospitality" className="hover:text-wasil-violet transition-colors">
                  {t('indHospitality')}
                </Link>
              </li>
              <li>
                <Link href="/industries#retail" className="hover:text-wasil-violet transition-colors">
                  {t('indRetail')}
                </Link>
              </li>
              <li>
                <Link href="/industries#services" className="hover:text-wasil-violet transition-colors">
                  {t('indServices')}
                </Link>
              </li>
              <li>
                <Link href="/industries#tourism" className="hover:text-wasil-violet transition-colors">
                  {t('indTourism')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-sm font-bold text-wasil-navy mb-4">
              {lang === 'ar' ? 'الشركة والامتثال' : 'Company & Legal'}
            </h4>
            <ul className="space-y-2.5 text-xs text-wasil-muted">
              <li>
                <Link href="/about" className="hover:text-wasil-violet transition-colors">
                  {t('navAbout')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-wasil-violet transition-colors">
                  {t('navPricing')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-wasil-violet transition-colors">
                  {t('navContact')}
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-wasil-violet transition-colors">
                  {lang === 'ar' ? 'تسجيل دخول العملاء' : 'Client Portal'}
                </Link>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1 rounded bg-wasil-bg px-2 py-1 text-[11px] text-wasil-navy font-semibold border border-wasil-border">
                  <Shield className="h-3 w-3 text-wasil-turquoise" />
                  <span>{lang === 'ar' ? 'سجل تجاري رقم 1084920' : 'CR: 1084920'}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-wasil-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-wasil-muted gap-4">
          <p>
            © {new Date().getFullYear()} Wasil (واصل).{' '}
            {lang === 'ar' ? 'جميع الحقوق محفوظة. سلطنة عُمان.' : 'All rights reserved. Sultanate of Oman.'}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-wasil-turquoise font-medium">
              {lang === 'ar' ? 'العملة الرسمية: الريال العُماني (OMR)' : 'Default Currency: Omani Rial (OMR)'}
            </span>
            <span>•</span>
            <span>{lang === 'ar' ? 'خصوصية البيانات وحماية المستهلك' : 'Data Privacy Compliant'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
