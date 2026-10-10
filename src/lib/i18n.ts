export type Language = 'ar' | 'en';

export interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations = {
  // Brand & General
  brandName: { ar: 'واصل', en: 'Wasil' },
  brandTagline: {
    ar: 'منصة الهوية الرقمية الذكية ونمو العملاء وبرامج الولاء في سلطنة عُمان',
    en: 'Smart Digital Business Cards, Customer Growth & Loyalty Platform in Oman',
  },
  heroHeadline: {
    ar: 'حوّل كل تواصل إلى فرصة نمو',
    en: 'Turn Every Connection Into a Growth Opportunity',
  },
  heroSubheadline: {
    ar: 'منصة واحدة متكاملة لبطاقات الأعمال الرقمية، وجذب العملاء، وبرامج الولاء، وإدارة المبيعات للشركات العُمانية والخليجية.',
    en: 'An all-in-one platform for digital business cards, customer acquisition, loyalty programs, and sales CRM for businesses in Oman and the GCC.',
  },
  startFree: { ar: 'ابدأ مجاناً', en: 'Start Free' },
  exploreFeatures: { ar: 'استكشف المميزات', en: 'Explore Features' },
  signIn: { ar: 'تسجيل الدخول', en: 'Sign In' },
  signUp: { ar: 'إنشاء حساب جديد', en: 'Create Account' },
  signOut: { ar: 'تسجيل الخروج', en: 'Sign Out' },
  dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  admin: { ar: 'إدارة المنصة', en: 'Platform Admin' },
  demoModeNotice: {
    ar: 'وضع التجربة النشط: المحفظة الإلكترونية وبوابات الدفع تعمل بوضع المحاكاة الآمن (Sandbox Mode).',
    en: 'Active Sandbox Mode: Digital wallet passes and payment gateways are running in secure simulation mode.',
  },

  // Navigation
  navFeatures: { ar: 'المميزات', en: 'Features' },
  navIndustries: { ar: 'القطاعات', en: 'Industries' },
  navPricing: { ar: 'الأسعار', en: 'Pricing' },
  navAbout: { ar: 'عن واصل', en: 'About Wasil' },
  navContact: { ar: 'تواصل معنا', en: 'Contact' },

  // Dashboard Navigation
  menuOverview: { ar: 'نظرة عامة', en: 'Overview' },
  menuCards: { ar: 'بطاقات الأعمال', en: 'Digital Cards' },
  menuCardBuilder: { ar: 'منشئ البطاقات', en: 'Card Builder' },
  menuProfile: { ar: 'ملف الشركة العام', en: 'Public Profile' },
  menuWallet: { ar: 'محافظ الجوال', en: 'Wallet Passes' },
  menuQr: { ar: 'رموز QR الذكية', en: 'Smart QR Codes' },
  menuCampaigns: { ar: 'الحملات التسويقية', en: 'Campaigns' },
  menuLeads: { ar: 'إدارة العملاء والفرص', en: 'Leads & CRM' },
  menuAppointments: { ar: 'طلبات المواعيد', en: 'Appointments' },
  menuLoyalty: { ar: 'برامج الولاء والمكافآت', en: 'Loyalty & Rewards' },
  menuScanner: { ar: 'مسح استرداد المكافأة', en: 'Reward Scanner' },
  menuAnalytics: { ar: 'التحليلات والتقارير', en: 'Analytics & Reports' },
  menuTeam: { ar: 'فريق العمل والصلاحيات', en: 'Team & Permissions' },
  menuBranches: { ar: 'الفروع والمواقع', en: 'Branches' },
  menuBilling: { ar: 'الاشتراك والفواتير', en: 'Subscription & Billing' },
  menuSettings: { ar: 'إعدادات المنظمة', en: 'Settings' },

  // Four Pillars
  pillar1Title: { ar: 'بطاقات الأعمال الرقمية', en: 'Digital Business Cards' },
  pillar1Desc: {
    ar: 'أنشئ بطاقات ذكية وتفاعلية لأعضاء فريقك، واحفظها مباشرة في Apple Wallet و Google Wallet مع مشاركة فورية برمز QR ورابط مخصص.',
    en: 'Create smart, interactive digital cards for your team, save them directly to Apple & Google Wallet with instant QR and custom link sharing.',
  },
  pillar2Title: { ar: 'جذب العملاء وتحويل المبيعات', en: 'Customer Acquisition & Sales CRM' },
  pillar2Desc: {
    ar: 'التقط استفسارات العملاء المحتملين تلقائياً عبر نماذج مخصصة، وتتبع مسار المبيعات عبر خط أنابيب كانبان مع إسناد مصدر الحملة.',
    en: 'Automatically capture qualified buyer inquiries through tailored forms, and manage sales pipelines via Kanban with full campaign attribution.',
  },
  pillar3Title: { ar: 'برامج الولاء والمكافآت', en: 'Loyalty & Reward Programs' },
  pillar3Desc: {
    ar: 'أطلق بطاقات ولاء رقمية بنقاط أو طوابع، مع دفتر حسابات غير قابل للتلاعب، ورموز استرداد مؤمنة تفحص في نقاط البيع.',
    en: 'Launch digital loyalty cards with points or stamps, immutable transaction ledgers, and tamper-proof QR redemption tokens validated at POS.',
  },
  pillar4Title: { ar: 'إدارة الأعمال والتحليلات المتكاملة', en: 'Business Management & Analytics' },
  pillar4Desc: {
    ar: 'أدر الفروع والموظفين والحملات الإعلانية وقس العائد على الاستثمار مع إحصائيات دقيقة في لوحة موحدة تدعم العزل الآمن للمنظمات.',
    en: 'Manage multi-branch locations, staff cards, promotional campaigns, and measure exact ROI with multi-tenant secure isolation.',
  },

  // Metrics
  totalCards: { ar: 'إجمالي البطاقات', en: 'Total Cards' },
  totalViews: { ar: 'مشاهدات الملفات', en: 'Profile Views' },
  qrScans: { ar: 'مرات المسح (QR)', en: 'QR Scans' },
  leadsCaptured: { ar: 'العملاء المحتملون', en: 'Leads Captured' },
  walletPassesCount: { ar: 'بطاقات المحفظة الصادرة', en: 'Issued Wallet Passes' },
  loyaltyMembersCount: { ar: 'أعضاء برنامج الولاء', en: 'Loyalty Members' },
  conversionRate: { ar: 'معدل التحويل', en: 'Conversion Rate' },
  revenueWon: { ar: 'المبيعات المحققة', en: 'Won Deal Value' },

  // Currency
  currencySymbol: { ar: 'ر.ع.', en: 'OMR' },
  omrPerMonth: { ar: 'ر.ع. / شهرياً', en: 'OMR / month' },
  omrPerYear: { ar: 'ر.ع. / سنوياً', en: 'OMR / year' },

  // Lead Pipeline Stages
  stageNew: { ar: 'جديد', en: 'New' },
  stageContacted: { ar: 'تم التواصل', en: 'Contacted' },
  stageQualified: { ar: 'مؤهل', en: 'Qualified' },
  stageAppointmentScheduled: { ar: 'موعد محدد', en: 'Appointment Set' },
  stageProposalSent: { ar: 'تم إرسال العرض', en: 'Proposal Sent' },
  stageNegotiation: { ar: 'مفاوضات', en: 'Negotiation' },
  stageWon: { ar: 'تمت الصفقة', en: 'Won' },
  stageLost: { ar: 'خسارة الفرصة', en: 'Lost' },

  // Actions
  saveChanges: { ar: 'حفظ التغييرات', en: 'Save Changes' },
  createCard: { ar: 'إنشاء بطاقة جديدة', en: 'Create Card' },
  publishCard: { ar: 'نشر البطاقة', en: 'Publish Card' },
  previewCard: { ar: 'معاينة البطاقة', en: 'Preview Card' },
  downloadVCard: { ar: 'حفظ جهة الاتصال (vCard)', en: 'Save Contact (vCard)' },
  addToAppleWallet: { ar: 'إضافة إلى Apple Wallet', en: 'Add to Apple Wallet' },
  addToGoogleWallet: { ar: 'إضافة إلى Google Wallet', en: 'Save to Google Wallet' },
  callNow: { ar: 'اتصال مباشر', en: 'Call Now' },
  sendWhatsApp: { ar: 'محادثة واتساب', en: 'Chat on WhatsApp' },
  sendEmail: { ar: 'إرسال بريد إلكتروني', en: 'Send Email' },
  openLocation: { ar: 'الموقع الجغرافي', en: 'Directions / Map' },
  shareCard: { ar: 'مشاركة البطاقة', en: 'Share Card' },
  bookAppointment: { ar: 'حجز موعد أو معاينة', en: 'Book Appointment' },
  submitInquiry: { ar: 'إرسال استفسار', en: 'Submit Inquiry' },
  filterAll: { ar: 'الكل', en: 'All' },
  searchPlaceholder: { ar: 'بحث...', en: 'Search...' },
  exportCsv: { ar: 'تصدير كملف CSV', en: 'Export CSV' },
  verifyRedemption: { ar: 'التحقق واسترداد المكافأة', en: 'Verify & Redeem' },

  // Industries
  indRealEstate: { ar: 'التطوير والوساطة العقارية', en: 'Real Estate & Property' },
  indHospitality: { ar: 'الفنادق والضيافة والمنتجعات', en: 'Hotels & Hospitality' },
  indRetail: { ar: 'المتاجر والمطاعم والمقاهي', en: 'Retail & Dining' },
  indServices: { ar: 'الخدمات المهنية والاستشارات', en: 'Professional Services' },
  indTourism: { ar: 'السياحة وتنظيم الفعاليات', en: 'Tourism & Events' },

  // Plans
  planFree: { ar: 'الباقة المجانية', en: 'Free Plan' },
  planBusiness: { ar: 'باقة الأعمال', en: 'Business Plan' },
  planProfessional: { ar: 'الباقة الاحترافية', en: 'Professional Plan' },
  planEnterprise: { ar: 'باقة المؤسسات', en: 'Enterprise Plan' },
} as const;

export function t(key: keyof typeof translations, lang: Language): string {
  if (!translations[key]) return key;
  return translations[key][lang] || translations[key].ar;
}

export function formatCurrency(amount: number, lang: Language = 'ar'): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  if (lang === 'ar') {
    return `${formatted} ر.ع.`;
  }
  return `OMR ${formatted}`;
}

export function formatDate(date: string | Date, lang: Language = 'ar'): string {
  const d = new Date(date);
  return d.toLocaleDateString(lang === 'ar' ? 'ar-OM' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
