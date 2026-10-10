'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import {
  Sparkles,
  Globe,
  Menu,
  X,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export function Navbar() {
  const { lang, setLang, t, isRtl } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Quick check if logged in
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
    { href: '/features', label: t('navFeatures') },
    { href: '/industries', label: t('navIndustries') },
    { href: '/pricing', label: t('navPricing') },
    { href: '/about', label: t('navAbout') },
    { href: '/contact', label: t('navContact') },
  ];

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-wasil-border/80 bg-white/95 backdrop-blur-md">
      {/* Top Banner Notice for Oman Sandbox Demo Mode */}
      <div className="bg-gradient-to-r from-wasil-navy to-wasil-violet px-4 py-1.5 text-xs text-white">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-wasil-amber/20 px-2 py-0.5 text-[10px] font-semibold text-wasil-amber-light">
              OMAN GCC
            </span>
            <span>{t('demoModeNotice')}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-white/80">
            <span>مسقط • صلالة • صحار • نزوى</span>
            <span className="text-white/40">|</span>
            <span className="font-mono text-wasil-turquoise">1 OMR = 2.60 USD</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wasil-navy text-white shadow-md transition-transform group-hover:scale-105 border border-wasil-violet/30">
            <CreditCard className="h-5 w-5 text-wasil-turquoise" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-wasil-navy">
                {lang === 'ar' ? 'واصل' : 'Wasil'}
              </span>
              <span className="text-xs font-semibold text-wasil-violet bg-wasil-violet/10 px-1.5 py-0.5 rounded">
                {lang === 'ar' ? 'عُمان' : 'OMAN'}
              </span>
            </div>
            <span className="text-[10px] text-wasil-muted -mt-0.5">
              {lang === 'ar' ? 'الهوية الرقمية ونمو الأعمال' : 'Digital Identity & Growth'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-wasil-violet ${
                  isActive
                    ? 'text-wasil-violet font-semibold border-b-2 border-wasil-violet pb-0.5'
                    : 'text-wasil-text/80'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 rounded-lg border border-wasil-border px-2.5 py-1.5 text-xs font-semibold text-wasil-navy hover:bg-wasil-bg transition-colors"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5 text-wasil-turquoise" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-wasil-navy px-4 py-2 text-xs font-semibold text-white hover:bg-wasil-navy/90 transition-all shadow-sm"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-wasil-turquoise" />
                <span>{t('dashboard')}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-lg px-3.5 py-2 text-xs font-semibold text-wasil-navy hover:bg-wasil-bg transition-colors"
              >
                {t('signIn')}
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1.5 rounded-lg bg-wasil-violet px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-wasil-violet/90 transition-all"
              >
                <span>{t('startFree')}</span>
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="rounded-lg border border-wasil-border p-2 text-xs font-semibold text-wasil-navy hover:bg-wasil-bg"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-wasil-border p-2 text-wasil-navy hover:bg-wasil-bg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-wasil-border bg-white px-4 py-5 lg:hidden animate-fadeIn">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-wasil-violet font-bold' : 'text-wasil-text'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <hr className="my-2 border-wasil-border" />

            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-wasil-navy py-2.5 text-sm font-semibold text-white"
              >
                <LayoutDashboard className="h-4 w-4 text-wasil-turquoise" />
                <span>{t('dashboard')}</span>
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg border border-wasil-border py-2 text-center text-sm font-semibold text-wasil-navy"
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-wasil-violet py-2.5 text-sm font-semibold text-white"
                >
                  <span>{t('startFree')}</span>
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
