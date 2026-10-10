'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import {
  CreditCard,
  LayoutDashboard,
  Users,
  Compass,
  QrCode,
  Megaphone,
  Briefcase,
  Calendar,
  Gift,
  ScanLine,
  BarChart3,
  UserCheck,
  Building2,
  DollarSign,
  Settings,
  ShieldAlert,
  LogOut,
  Globe,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  FileCheck,
} from 'lucide-react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t, isRtl } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/auth/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
          setOrganization(data.organization);
        }
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  const menuSections = [
    {
      title: lang === 'ar' ? 'الرئيسية والإعداد' : 'Main & Setup',
      items: [
        { href: '/dashboard', label: t('menuOverview'), icon: LayoutDashboard },
        { href: '/dashboard/onboarding', label: lang === 'ar' ? 'معالج الإعداد الأولي' : 'Onboarding Wizard', icon: FileCheck },
      ],
    },
    {
      title: lang === 'ar' ? 'الهوية والبطاقات' : 'Identity & Cards',
      items: [
        { href: '/dashboard/cards', label: t('menuCards'), icon: CreditCard },
        { href: '/dashboard/cards/new', label: t('menuCardBuilder'), icon: Layers },
        { href: '/dashboard/profile', label: t('menuProfile'), icon: Compass },
        { href: '/dashboard/wallet', label: t('menuWallet'), icon: Sparkles },
      ],
    },
    {
      title: lang === 'ar' ? 'النمو والعملاء' : 'Growth & Sales',
      items: [
        { href: '/dashboard/leads', label: t('menuLeads'), icon: Briefcase },
        { href: '/dashboard/appointments', label: t('menuAppointments'), icon: Calendar },
        { href: '/dashboard/qr', label: t('menuQr'), icon: QrCode },
        { href: '/dashboard/campaigns', label: t('menuCampaigns'), icon: Megaphone },
      ],
    },
    {
      title: lang === 'ar' ? 'برامج الولاء' : 'Loyalty & Rewards',
      items: [
        { href: '/dashboard/loyalty', label: t('menuLoyalty'), icon: Gift },
        { href: '/dashboard/loyalty/scanner', label: t('menuScanner'), icon: ScanLine },
      ],
    },
    {
      title: lang === 'ar' ? 'الإدارة والتقارير' : 'Management & Reports',
      items: [
        { href: '/dashboard/analytics', label: t('menuAnalytics'), icon: BarChart3 },
        { href: '/dashboard/team', label: t('menuTeam'), icon: Users },
        { href: '/dashboard/branches', label: t('menuBranches'), icon: Building2 },
        { href: '/dashboard/billing', label: t('menuBilling'), icon: DollarSign },
        { href: '/dashboard/settings', label: t('menuSettings'), icon: Settings },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-wasil-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-wasil-violet border-t-transparent" />
          <span className="text-xs font-bold text-wasil-navy">
            {lang === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading Wasil Dashboard...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-wasil-bg">
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed inset-y-0 z-40 flex w-64 flex-col border-r border-wasil-border bg-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-wasil-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-wasil-navy text-white shadow-sm">
              <CreditCard className="h-4 w-4 text-wasil-turquoise" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg text-wasil-navy">
                  {lang === 'ar' ? 'واصل' : 'Wasil'}
                </span>
                <span className="rounded bg-wasil-violet/10 px-1 py-0.2 text-[9px] font-bold text-wasil-violet">
                  OMAN
                </span>
              </div>
              <span className="text-[10px] text-wasil-muted -mt-0.5 truncate max-w-[130px]">
                {organization?.name || 'Muscat Business'}
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-wasil-muted hover:text-wasil-navy"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx}>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-wasil-muted">
                {section.title}
              </span>
              <div className="mt-1 space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-wasil-violet text-white shadow-sm'
                          : 'text-wasil-text hover:bg-wasil-bg hover:text-wasil-navy'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-wasil-muted'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Super Admin Quick Link */}
          {user?.isSuperAdmin && (
            <div className="pt-2">
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-500/20"
              >
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <span>{lang === 'ar' ? 'لوحة المشرف العام' : 'Platform Super Admin'}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-wasil-border p-3">
          <div className="flex items-center justify-between rounded-xl bg-wasil-bg p-2 text-xs">
            <div className="flex flex-col truncate pr-2">
              <span className="font-bold text-wasil-navy truncate">{user?.name}</span>
              <span className="text-[10px] text-wasil-muted truncate">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-wasil-border bg-white/95 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-wasil-navy p-1"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Public profile quick link */}
            {organization?.slug && (
              <a
                href={`/b/${organization.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-wasil-border bg-wasil-bg/60 px-3 py-1.5 text-xs font-semibold text-wasil-navy hover:bg-wasil-bg transition-colors"
              >
                <span>{lang === 'ar' ? 'الملف التعريفي العام' : 'Public Profile'}</span>
                <ExternalLink className="h-3 w-3 text-wasil-violet" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 rounded-lg border border-wasil-border px-2.5 py-1.5 text-xs font-bold text-wasil-navy hover:bg-wasil-bg transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-wasil-turquoise" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <div className="hidden md:flex items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'ar' ? 'سلطنة عُمان (OMR)' : 'Oman (OMR)'}</span>
            </div>
          </div>
        </header>

        {/* Global Sandbox Mode Alert Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              {lang === 'ar'
                ? 'وضع التجربة الآمن (Sandbox Mode): بطاقات Apple Wallet وبوابات الدفع تعمل بوضع المحاكاة المعتمد.'
                : 'Active Sandbox Mode: Apple Wallet passes and payment gateways are running in compliant simulation mode.'}
            </span>
          </div>
          <Link
            href="/dashboard/wallet"
            className="text-[11px] font-bold text-wasil-violet hover:underline shrink-0"
          >
            {lang === 'ar' ? 'إعدادات المفاتيح' : 'Configure Keys'} →
          </Link>
        </div>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
