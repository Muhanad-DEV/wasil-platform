'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Globe,
  Share2,
  Download,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Calendar,
  Home,
  FileText,
  Check,
  Smartphone,
  Copy,
} from 'lucide-react';

export interface CardPreviewData {
  id?: string;
  slug: string;
  ownerName: string;
  ownerNameAr?: string | null;
  jobTitle: string;
  jobTitleAr?: string | null;
  companyName: string;
  companyNameAr?: string | null;
  avatarUrl?: string | null;
  logoUrl?: string | null;
  phone: string;
  secondaryPhone?: string | null;
  whatsapp: string;
  email: string;
  website?: string | null;
  locationText?: string | null;
  locationTextAr?: string | null;
  bio?: string | null;
  bioAr?: string | null;
  badgeText?: string | null;
  theme?: string;
  primaryColor?: string;
  accentColor?: string;
  customActions?: string | null; // JSON string
  socialLinks?: string | null; // JSON string
}

interface CardPreviewProps {
  card: CardPreviewData;
  isStandalone?: boolean;
}

export function CardPreview({ card, isStandalone = false }: CardPreviewProps) {
  const { lang, t, isRtl } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const displayName = lang === 'ar' && card.ownerNameAr ? card.ownerNameAr : card.ownerName;
  const displayTitle = lang === 'ar' && card.jobTitleAr ? card.jobTitleAr : card.jobTitle;
  const displayCompany = lang === 'ar' && card.companyNameAr ? card.companyNameAr : card.companyName;
  const displayLocation = lang === 'ar' && card.locationTextAr ? card.locationTextAr : card.locationText;
  const displayBio = lang === 'ar' && card.bioAr ? card.bioAr : card.bio;

  const primaryColor = card.primaryColor || '#181D48';
  const accentColor = card.accentColor || '#00B6B2';

  let customActionsList: any[] = [];
  try {
    if (card.customActions) {
      customActionsList = typeof card.customActions === 'string' ? JSON.parse(card.customActions) : card.customActions;
    }
  } catch (e) {
    customActionsList = [];
  }

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/c/${card.slug}` : `https://wasil.om/c/${card.slug}`;
    if (navigator.share) {
      navigator.share({
        title: `${displayName} - ${displayCompany}`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCleanPhone = (p: string) => p.replace(/[^0-9+]/g, '');

  return (
    <div className={`relative mx-auto w-full max-w-sm rounded-[36px] border-[6px] border-wasil-navy/80 bg-white shadow-elevated overflow-hidden ${isStandalone ? 'my-6' : ''}`}>
      {/* Smartphone Speaker / Camera Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-36 rounded-b-xl bg-wasil-navy/90 z-20 flex items-center justify-center gap-2">
        <div className="h-1.5 w-12 rounded-full bg-white/20"></div>
        <div className="h-2 w-2 rounded-full bg-white/30"></div>
      </div>

      {/* Card Header Background Banner */}
      <div
        className="relative h-36 w-full pt-6 px-4 flex flex-col justify-end"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, #29155C 100%)`,
        }}
      >
        <div className="absolute top-6 right-4 z-10 flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors"
            title="Share Card"
          >
            {copied ? <Check className="h-4 w-4 text-wasil-turquoise" /> : <Share2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setShowQrModal(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors"
            title="Show QR Code"
          >
            <QrCode className="h-4 w-4" />
          </button>
        </div>

        {/* Small verified badge top left */}
        <div className="absolute top-6 left-4 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
            <ShieldCheck className="h-3 w-3 text-wasil-turquoise" />
            <span>{card.badgeText || (lang === 'ar' ? 'بطاقة معتمدة' : 'Verified ID')}</span>
          </span>
        </div>
      </div>

      {/* Profile Photo & Info */}
      <div className="relative px-5 pt-0 pb-6 text-center -mt-12 z-10">
        <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-wasil-bg shadow-md overflow-hidden">
          {card.avatarUrl ? (
            <img
              src={card.avatarUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-wasil-violet/10 text-xl font-bold text-wasil-violet">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <h2 className="text-xl font-extrabold text-wasil-navy">{displayName}</h2>
        <p className="text-xs font-semibold text-wasil-violet mt-0.5">{displayTitle}</p>
        <p className="text-xs text-wasil-muted font-medium mt-0.5">{displayCompany}</p>

        {displayLocation && (
          <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-wasil-muted">
            <MapPin className="h-3 w-3 text-wasil-turquoise shrink-0" />
            <span>{displayLocation}</span>
          </div>
        )}

        {displayBio && (
          <p className="mt-3 text-xs leading-relaxed text-wasil-text/80 bg-wasil-bg/80 p-2.5 rounded-xl border border-wasil-border/60 text-start">
            {displayBio}
          </p>
        )}

        {/* Primary Contact Action Buttons Grid */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {/* Call */}
          <a
            href={`tel:${getCleanPhone(card.phone)}`}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-wasil-bg p-2.5 text-wasil-navy hover:bg-wasil-navy hover:text-white transition-all border border-wasil-border/60 shadow-subtle group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white group-hover:bg-white/20 text-wasil-navy group-hover:text-white shadow-sm transition-colors">
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold">{lang === 'ar' ? 'اتصال' : 'Call'}</span>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${getCleanPhone(card.whatsapp).replace('+', '')}?text=${encodeURIComponent(
              lang === 'ar' ? 'مرحباً، أود الاستفسار بخصوص خدماتكم.' : 'Hello, I would like to inquire about your services.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-[#25D366]/10 p-2.5 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all border border-[#25D366]/20 shadow-subtle group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white group-hover:bg-white/20 text-[#25D366] group-hover:text-white shadow-sm transition-colors">
              <MessageCircle className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold">واتساب</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${card.email}`}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-wasil-bg p-2.5 text-wasil-navy hover:bg-wasil-violet hover:text-white transition-all border border-wasil-border/60 shadow-subtle group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white group-hover:bg-white/20 text-wasil-violet group-hover:text-white shadow-sm transition-colors">
              <Mail className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold">{lang === 'ar' ? 'بريد' : 'Email'}</span>
          </a>

          {/* Location / Maps */}
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(card.locationText || card.companyName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-wasil-bg p-2.5 text-wasil-navy hover:bg-wasil-turquoise hover:text-white transition-all border border-wasil-border/60 shadow-subtle group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white group-hover:bg-white/20 text-wasil-turquoise group-hover:text-white shadow-sm transition-colors">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold">{lang === 'ar' ? 'الموقع' : 'Maps'}</span>
          </a>
        </div>

        {/* Save Contact (vCard) Main Button */}
        <div className="mt-3">
          <a
            href={`/api/cards/${card.id || card.slug}/vcard`}
            download
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-wasil-navy py-3 px-4 text-xs font-bold text-white shadow-md hover:bg-wasil-navy/90 active:scale-[0.98] transition-all"
          >
            <Download className="h-4 w-4 text-wasil-turquoise" />
            <span>{t('downloadVCard')}</span>
          </a>
        </div>

        {/* Add to Apple Wallet & Google Wallet Buttons */}
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {/* Apple Wallet */}
          <a
            href={`/api/wallet/apple/${card.id || card.slug}`}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-black py-2.5 px-3 text-[11px] font-semibold text-white shadow hover:bg-neutral-900 transition-colors"
          >
            <span className="text-sm"></span>
            <span>Apple Wallet</span>
          </a>

          {/* Google Wallet */}
          <a
            href={`/api/wallet/google/${card.id || card.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-300 bg-white py-2.5 px-3 text-[11px] font-semibold text-neutral-800 shadow hover:bg-neutral-50 transition-colors"
          >
            <span className="font-bold text-wasil-violet">G</span>
            <span>Google Wallet</span>
          </a>
        </div>

        {/* Custom Actions (e.g. View Properties, Book Viewing, Download Brochure) */}
        {customActionsList.length > 0 && (
          <div className="mt-4 space-y-2">
            {customActionsList.map((action, idx) => {
              const label = lang === 'ar' && action.labelAr ? action.labelAr : action.label;
              return (
                <a
                  key={idx}
                  href={action.url || '#'}
                  className="flex items-center justify-between rounded-xl border border-wasil-border bg-wasil-bg/50 px-3.5 py-2.5 text-xs font-semibold text-wasil-navy hover:bg-wasil-bg hover:border-wasil-violet/40 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    {action.icon === 'home' && <Home className="h-4 w-4 text-wasil-turquoise" />}
                    {action.icon === 'calendar' && <Calendar className="h-4 w-4 text-wasil-amber" />}
                    {action.icon === 'file' && <FileText className="h-4 w-4 text-wasil-violet" />}
                    {!['home', 'calendar', 'file'].includes(action.icon) && (
                      <ExternalLink className="h-4 w-4 text-wasil-muted" />
                    )}
                    <span>{label}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-wasil-muted group-hover:text-wasil-violet transition-colors" />
                </a>
              );
            })}
          </div>
        )}

        {/* Footer info in phone preview */}
        <div className="mt-5 border-t border-wasil-border/60 pt-3 text-center">
          <span className="text-[10px] text-wasil-muted">
            {lang === 'ar' ? 'واصل للبطاقات الذكية • مسقط' : 'Powered by Wasil Platform • Muscat'}
          </span>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md p-6 text-center animate-fadeIn">
          <button
            onClick={() => setShowQrModal(false)}
            className="absolute top-4 right-4 rounded-full bg-wasil-bg p-1 text-wasil-navy hover:bg-wasil-border"
          >
            <Check className="h-4 w-4" />
          </button>
          <div className="p-3 bg-white rounded-2xl shadow-card border border-wasil-border mb-3">
            <img
              src={`/api/cards/${card.id || card.slug}/qr?format=png`}
              alt="QR Code"
              className="h-44 w-44 object-contain"
            />
          </div>
          <h4 className="text-sm font-bold text-wasil-navy">{displayName}</h4>
          <p className="text-xs text-wasil-muted">{displayCompany}</p>
          <p className="text-[11px] text-wasil-violet font-mono mt-1">
            wasil.om/c/{card.slug}
          </p>
          <button
            onClick={() => setShowQrModal(false)}
            className="mt-4 rounded-xl bg-wasil-navy px-4 py-2 text-xs font-semibold text-white"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      )}
    </div>
  );
}
