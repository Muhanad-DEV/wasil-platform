export interface FallbackCard {
  id: string;
  slug: string;
  title: string;
  ownerName: string;
  ownerNameAr: string;
  jobTitle: string;
  jobTitleAr: string;
  companyName: string;
  companyNameAr: string;
  phone: string;
  secondaryPhone?: string;
  whatsapp: string;
  email: string;
  website: string;
  locationText: string;
  bio: string;
  bioAr?: string;
  primaryColor: string;
  secondaryColor: string;
  organizationId: string;
  isPublished: boolean;
  avatarUrl?: string;
  organization?: {
    id: string;
    slug: string;
    name: string;
    nameAr: string;
    logoUrl?: string;
    industry: string;
    city: string;
  };
}

export const FALLBACK_CARDS: Record<string, FallbackCard> = {
  'ahmed-albalushi': {
    id: 'card-ahmed-albalushi',
    slug: 'ahmed-albalushi',
    title: 'Ahmed Al Balushi - Real Estate Card',
    ownerName: 'Ahmed Al Balushi',
    ownerNameAr: 'أحمد البلوشي',
    jobTitle: 'Head of Luxury Residential Sales',
    jobTitleAr: 'رئيس مبيعات العقارات السكنية الفاخرة',
    companyName: 'Al Mouj Muscat Real Estate',
    companyNameAr: 'الموج مسقط العقارية',
    phone: '+96894567890',
    secondaryPhone: '+96824000100',
    whatsapp: '+96894567890',
    email: 'ahmed@almouj.om',
    website: 'https://almouj.com',
    locationText: 'Al Mouj Marina, Muscat, Sultanate of Oman',
    bio: '14+ years in premium GCC real estate development. Specializing in high-net-worth acquisitions and residency-linked freehold properties in Oman.',
    bioAr: 'أكثر من 14 عاماً في تطوير وتسويق العقارات الفاخرة في دول مجلس التعاون. متخصص في عقارات التملك الحر والإقامة الاستثمارية في سلطنة عُمان.',
    primaryColor: '#181D48',
    secondaryColor: '#00B6B2',
    organizationId: 'cmv2k95tb000710gg2qx2vgze',
    isPublished: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    organization: {
      id: 'cmv2k95tb000710gg2qx2vgze',
      slug: 'al-mouj-muscat',
      name: 'Al Mouj Muscat Real Estate',
      nameAr: 'الموج مسقط العقارية',
      industry: 'REAL_ESTATE',
      city: 'Muscat',
    },
  },
  'fatima-alharthy': {
    id: 'card-fatima-alharthy',
    slug: 'fatima-alharthy',
    title: 'Fatima Al Harthy - Real Estate Card',
    ownerName: 'Fatima Al Harthy',
    ownerNameAr: 'فاطمة الحارثية',
    jobTitle: 'Senior Investment Advisor',
    jobTitleAr: 'مستشارة استثمار أولى',
    companyName: 'Al Mouj Muscat Real Estate',
    companyNameAr: 'الموج مسقط العقارية',
    phone: '+96891234567',
    secondaryPhone: '+96824000101',
    whatsapp: '+96891234567',
    email: 'fatima@almouj.om',
    website: 'https://almouj.com',
    locationText: 'Al Mouj Sector 4, Muscat, Sultanate of Oman',
    bio: 'Advising international investors on Muscat luxury villas, marina apartments, and high-yield commercial assets.',
    bioAr: 'تقديم المشورة للمستثمرين الدوليين في فلل مسقط الفاخرة وشقق المارينا والأصول التجارية ذات العائد المرتفع.',
    primaryColor: '#6317B5',
    secondaryColor: '#E59F36',
    organizationId: 'cmv2k95tb000710gg2qx2vgze',
    isPublished: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    organization: {
      id: 'cmv2k95tb000710gg2qx2vgze',
      slug: 'al-mouj-muscat',
      name: 'Al Mouj Muscat Real Estate',
      nameAr: 'الموج مسقط العقارية',
      industry: 'REAL_ESTATE',
      city: 'Muscat',
    },
  },
  'ahmed-al-balushi': {
    id: 'card-ahmed-albalushi',
    slug: 'ahmed-al-balushi',
    title: 'Ahmed Al Balushi - Real Estate Card',
    ownerName: 'Ahmed Al Balushi',
    ownerNameAr: 'أحمد البلوشي',
    jobTitle: 'Head of Luxury Residential Sales',
    jobTitleAr: 'رئيس مبيعات العقارات السكنية الفاخرة',
    companyName: 'Al Mouj Muscat Real Estate',
    companyNameAr: 'الموج مسقط العقارية',
    phone: '+96894567890',
    secondaryPhone: '+96824000100',
    whatsapp: '+96894567890',
    email: 'ahmed@almouj.om',
    website: 'https://almouj.com',
    locationText: 'Al Mouj Marina, Muscat, Sultanate of Oman',
    bio: '14+ years in premium GCC real estate development. Specializing in high-net-worth acquisitions and residency-linked freehold properties in Oman.',
    bioAr: 'أكثر من 14 عاماً في تطوير وتسويق العقارات الفاخرة في دول مجلس التعاون. متخصص في عقارات التملك الحر والإقامة الاستثمارية في سلطنة عُمان.',
    primaryColor: '#181D48',
    secondaryColor: '#00B6B2',
    organizationId: 'cmv2k95tb000710gg2qx2vgze',
    isPublished: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    organization: {
      id: 'cmv2k95tb000710gg2qx2vgze',
      slug: 'al-mouj-muscat',
      name: 'Al Mouj Muscat Real Estate',
      nameAr: 'الموج مسقط العقارية',
      industry: 'REAL_ESTATE',
      city: 'Muscat',
    },
  },
  'fatima-al-harthy': {
    id: 'card-fatima-alharthy',
    slug: 'fatima-al-harthy',
    title: 'Fatima Al Harthy - Real Estate Card',
    ownerName: 'Fatima Al Harthy',
    ownerNameAr: 'فاطمة الحارثية',
    jobTitle: 'Senior Investment Advisor',
    jobTitleAr: 'مستشارة استثمار أولى',
    companyName: 'Al Mouj Muscat Real Estate',
    companyNameAr: 'الموج مسقط العقارية',
    phone: '+96891234567',
    secondaryPhone: '+96824000101',
    whatsapp: '+96891234567',
    email: 'fatima@almouj.om',
    website: 'https://almouj.com',
    locationText: 'Al Mouj Sector 4, Muscat, Sultanate of Oman',
    bio: 'Advising international investors on Muscat luxury villas, marina apartments, and high-yield commercial assets.',
    bioAr: 'تقديم المشورة للمستثمرين الدوليين في فلل مسقط الفاخرة وشقق المارينا والأصول التجارية ذات العائد المرتفع.',
    primaryColor: '#6317B5',
    secondaryColor: '#E59F36',
    organizationId: 'cmv2k95tb000710gg2qx2vgze',
    isPublished: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    organization: {
      id: 'cmv2k95tb000710gg2qx2vgze',
      slug: 'al-mouj-muscat',
      name: 'Al Mouj Muscat Real Estate',
      nameAr: 'الموج مسقط العقارية',
      industry: 'REAL_ESTATE',
      city: 'Muscat',
    },
  },
};

export function getFallbackCard(slugOrId: string): FallbackCard {
  const normalized = slugOrId.toLowerCase().trim();
  if (FALLBACK_CARDS[normalized]) {
    return FALLBACK_CARDS[normalized];
  }

  // If slug contains 'ahmed'
  if (normalized.includes('ahmed')) {
    return FALLBACK_CARDS['ahmed-albalushi'];
  }

  // If slug contains 'fatima'
  if (normalized.includes('fatima')) {
    return FALLBACK_CARDS['fatima-alharthy'];
  }

  // Format a clean name from unknown slug e.g. "salim-al-habsi" -> "Salim Al Habsi"
  const formattedName = slugOrId
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return {
    id: `card-${slugOrId}`,
    slug: slugOrId,
    title: `${formattedName} - Digital Business Card`,
    ownerName: formattedName,
    ownerNameAr: formattedName,
    jobTitle: 'Business Executive',
    jobTitleAr: 'تنفيذي أعمال',
    companyName: 'Wasil Digital Oman',
    companyNameAr: 'واصل الرقمية عُمان',
    phone: '+96894000000',
    whatsapp: '+96894000000',
    email: 'info@wasil.om',
    website: 'https://wasil.om',
    locationText: 'Muscat, Sultanate of Oman',
    bio: 'Digital Business Card powered by Wasil (واصل)',
    primaryColor: '#181D48',
    secondaryColor: '#00B6B2',
    organizationId: 'default-org',
    isPublished: true,
    organization: {
      id: 'default-org',
      slug: 'wasil-demo',
      name: 'Wasil Digital Oman',
      nameAr: 'واصل الرقمية عُمان',
      industry: 'SERVICES',
      city: 'Muscat',
    },
  };
}
