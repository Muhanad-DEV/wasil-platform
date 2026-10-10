import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Wasil database seed for Sultanate of Oman...');

  // Clean existing non-plan records for repeatable seed
  await prisma.auditLog.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.rewardRedemption.deleteMany();
  await prisma.loyaltyTransaction.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.loyaltyMember.deleteMany();
  await prisma.loyaltyProgram.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.appointmentRequest.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.qRCode.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.walletPass.deleteMany();
  await prisma.businessCard.deleteMany();
  await prisma.businessProfile.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.organizationMembership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Subscription Plans
  const plans = [
    {
      code: 'FREE',
      name: 'Free Starter',
      nameAr: 'الباقة المجانية',
      priceMonthlyOMR: 0,
      priceYearlyOMR: 0,
      maxCards: 1,
      maxTeamMembers: 1,
      maxBranches: 1,
      featuresJson: JSON.stringify([
        '1 Digital Business Card',
        'Basic Public Profile',
        'Standard QR Code',
        'Direct Contact Actions',
        'Basic View Analytics',
      ]),
    },
    {
      code: 'BUSINESS',
      name: 'Business Pro',
      nameAr: 'باقة الأعمال المتقدمة',
      priceMonthlyOMR: 12.0,
      priceYearlyOMR: 120.0,
      maxCards: 5,
      maxTeamMembers: 5,
      maxBranches: 2,
      featuresJson: JSON.stringify([
        'Up to 5 Digital Business Cards',
        'Apple Wallet & Google Wallet Passes',
        'Custom Branding & Themes',
        'Lead Capture Forms & Lightweight CRM',
        'Smart QR Codes with UTM Attribution',
        'Loyalty & Rewards Engine (Points / Stamps)',
        'Full Analytics & CSV Export',
      ]),
    },
    {
      code: 'PROFESSIONAL',
      name: 'Professional Team',
      nameAr: 'الباقة الاحترافية للفرق',
      priceMonthlyOMR: 29.0,
      priceYearlyOMR: 290.0,
      maxCards: 25,
      maxTeamMembers: 20,
      maxBranches: 10,
      featuresJson: JSON.stringify([
        'Up to 25 Digital Business Cards',
        'Multi-Branch & Location Support',
        'Advanced 8-Stage CRM Kanban Pipeline',
        'Team Lead Assignment & Notifications',
        'Campaign Comparison & Conversion Tracking',
        'Custom Domain Support',
        'Priority Phone & WhatsApp Support in Oman',
      ]),
    },
    {
      code: 'ENTERPRISE',
      name: 'Enterprise VIP',
      nameAr: 'باقة المؤسسات الكبرى',
      priceMonthlyOMR: 79.0,
      priceYearlyOMR: 790.0,
      maxCards: 200,
      maxTeamMembers: 100,
      maxBranches: 50,
      featuresJson: JSON.stringify([
        'Unlimited Digital Cards & Branches',
        'Dedicated Account Manager in Muscat',
        'Custom SSO & Role-Based Permissions',
        'API Integration Adapter',
        'Custom SLA Guarantee',
        'On-site Training & Brand Card Design',
      ]),
    },
  ];

  for (const p of plans) {
    await prisma.plan.upsert({
      where: { code: p.code },
      update: p,
      create: p,
    });
  }
  console.log('✅ Plans seeded');

  // Password hash for demo accounts: "Password123!"
  const passwordHash = bcrypt.hashSync('Password123!', 10);

  // 2. Platform Super Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@wasil.om' },
    update: {
      passwordHash,
      role: 'SUPER_ADMIN',
      isSuperAdmin: true,
      emailVerified: true,
    },
    create: {
      email: 'admin@wasil.om',
      name: 'Said Al Harthy (سعيد الحارثي)',
      phone: '+96891234567',
      passwordHash,
      role: 'SUPER_ADMIN',
      isSuperAdmin: true,
      emailVerified: true,
    },
  });

  // 3. Organization 1: Al Mouj Muscat Real Estate
  const almoujOwner = await prisma.user.upsert({
    where: { email: 'ahmed@almouj.om' },
    update: { passwordHash, emailVerified: true },
    create: {
      email: 'ahmed@almouj.om',
      name: 'Ahmed Al Balushi (أحمد البلوشي)',
      phone: '+96894567890',
      passwordHash,
      role: 'ORGANIZATION_OWNER',
      emailVerified: true,
    },
  });

  const almoujConsultant = await prisma.user.upsert({
    where: { email: 'fatima@almouj.om' },
    update: { passwordHash, emailVerified: true },
    create: {
      email: 'fatima@almouj.om',
      name: 'Fatima Al Harthy (فاطمة الحارثية)',
      phone: '+96895123456',
      passwordHash,
      role: 'SALES_REP',
      emailVerified: true,
    },
  });

  const businessPlan = await prisma.plan.findUnique({ where: { code: 'BUSINESS' } });

  const almoujOrg = await prisma.organization.upsert({
    where: { slug: 'al-mouj-muscat' },
    update: {},
    create: {
      slug: 'al-mouj-muscat',
      name: 'Al Mouj Muscat Real Estate',
      nameAr: 'الموج مسقط العقارية',
      industry: 'REAL_ESTATE',
      country: 'Oman',
      city: 'Muscat',
      commercialRegNo: 'CR-1084920',
      phone: '+96824534444',
      email: 'sales@almouj.om',
      website: 'https://almouj.com',
      whatsapp: '+96894567890',
      description: 'Premier integrated waterfront real estate community in the Sultanate of Oman offering luxury residences, championship golf course, and a 400-berth marina.',
      descriptionAr: 'المجتمع السكني والسياحي المتكامل الرائد على الواجهة البحرية في سلطنة عُمان، يضم فللاً فاخرة وشققاً عصرية ومارينا عالمية.',
      defaultLanguage: 'ar',
      currency: 'OMR',
      isVerified: true,
    },
  });

  // Memberships
  await prisma.organizationMembership.upsert({
    where: {
      userId_organizationId: {
        userId: almoujOwner.id,
        organizationId: almoujOrg.id,
      },
    },
    update: {},
    create: {
      userId: almoujOwner.id,
      organizationId: almoujOrg.id,
      role: 'OWNER',
      title: 'Head of Sales & Development',
      status: 'ACTIVE',
    },
  });

  await prisma.organizationMembership.upsert({
    where: {
      userId_organizationId: {
        userId: almoujConsultant.id,
        organizationId: almoujOrg.id,
      },
    },
    update: {},
    create: {
      userId: almoujConsultant.id,
      organizationId: almoujOrg.id,
      role: 'SALES_REP',
      title: 'Senior Property Consultant',
      status: 'ACTIVE',
    },
  });

  // Main Branch
  const mainBranch = await prisma.branch.create({
    data: {
      organizationId: almoujOrg.id,
      name: 'Al Mouj Sales Pavilion',
      nameAr: 'مركز مبيعات الموج مسقط',
      city: 'Muscat',
      address: 'Street 6, Al Mouj Marina, Muscat',
      addressAr: 'شارع ٦، مارينا الموج، السيب، مسقط',
      phone: '+96824534444',
      email: 'sales@almouj.om',
      isMainBranch: true,
    },
  });

  // Business Profile
  await prisma.businessProfile.create({
    data: {
      organizationId: almoujOrg.id,
      headline: 'Discover Luxury Waterfront Living in Oman',
      headlineAr: 'عِش فخامة السكن على الواجهة البحرية في سلطنة عُمان',
      bio: 'Al Mouj Muscat is home to over 8,000 residents from 85 nationalities. Explore freehold residences with residency visa eligibility for international buyers.',
      bioAr: 'الموج مسقط موطن لأكثر من 8000 مقيم من 85 جنسية. اكتشف منازل التملك الحر مع أحقية الحصول على الإقامة العقارية في عُمان للمستثمرين.',
      primaryColor: '#181D48',
      secondaryColor: '#00B6B2',
      accentColor: '#E59F36',
      themeStyle: 'PREMIUM_MODERN',
      openingHours: JSON.stringify({
        saturday: '09:00 - 18:00',
        sunday: '09:00 - 18:00',
        monday: '09:00 - 18:00',
        tuesday: '09:00 - 18:00',
        wednesday: '09:00 - 18:00',
        thursday: '09:00 - 18:00',
        friday: '14:00 - 19:00',
      }),
      socialLinks: JSON.stringify({
        instagram: 'https://instagram.com/almoujmuscat',
        linkedin: 'https://linkedin.com/company/almouj-muscat',
        twitter: 'https://x.com/AlMoujMuscat',
        whatsapp: 'https://wa.me/96894567890',
      }),
      servicesJson: JSON.stringify([
        {
          title: 'Off-Plan Luxury Villas',
          titleAr: 'فلل فاخرة على المخطط',
          description: 'Contemporary 3 to 6-bedroom architectural villas with private swimming pools and private marina access.',
          descriptionAr: 'فلل هندسية معاصرة تضم من 3 إلى 6 غرف نوم مع مسابح خاصة وإطلالات مباشرة على المارينا.',
          priceFromOMR: 245000,
        },
        {
          title: 'Marina & Beach Residences',
          titleAr: 'شقق مارينا وشاطئ الموج',
          description: '1 to 3-bedroom freehold apartments offering sweeping sea views and immediate access to dining promenade.',
          descriptionAr: 'شقق تملك حر من 1 إلى 3 غرف نوم بإطلالات بحرية خلابة وقرب مباشر من الممشى التجاري والمقاهي.',
          priceFromOMR: 85000,
        },
        {
          title: 'Residency Visa Advisory',
          titleAr: 'استشارات الإقامة العقارية للمستثمرين',
          description: 'Assisting GCC and international property buyers in obtaining permanent residency in the Sultanate of Oman.',
          descriptionAr: 'مساعدة المشترين الدوليين والخليجيين في إنهاء إجراءات الإقامة العقارية الميسرة في سلطنة عُمان.',
          priceFromOMR: 0,
        },
      ]),
      propertiesJson: JSON.stringify([
        {
          id: 'prop-1',
          name: 'Zunairah Luxury Oceanfront Villa',
          nameAr: 'فيلا زنيرة الفاخرة المطلة على المحيط',
          type: 'Villa',
          bedrooms: 5,
          bathrooms: 6,
          areaSqM: 640,
          priceOMR: 420000,
          location: 'Sector 4, Al Mouj Waterfront',
          status: 'AVAILABLE',
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          features: ['Private Pool', 'Ocean View', 'Smart Home System', 'Maid & Driver Quarters', 'Direct Beach Walk'],
        },
        {
          id: 'prop-2',
          name: 'Marsa Gardens 2BR Boulevard Apartment',
          nameAr: 'شقة مرسى جاردنز غرفتين على البوليفارد',
          type: 'Apartment',
          bedrooms: 2,
          bathrooms: 3,
          areaSqM: 145,
          priceOMR: 115000,
          location: 'Marsa District, Al Mouj',
          status: 'AVAILABLE',
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          features: ['Balcony Overlooking Marina', 'Underground Parking', 'Gym & Infinity Pool Access'],
        },
        {
          id: 'prop-3',
          name: 'Golf Beach Townhouse',
          nameAr: 'تاون هاوس شاطئ الجولف',
          type: 'Townhouse',
          bedrooms: 3,
          bathrooms: 4,
          areaSqM: 290,
          priceOMR: 195000,
          location: 'Golf Greens, Al Mouj',
          status: 'RESERVED',
          imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          features: ['Adjacent to PGA Golf Course', 'Rooftop Terrace', 'Private Garden'],
        },
      ]),
      isPublished: true,
      metaTitle: 'Al Mouj Muscat Real Estate | عقارات الموج مسقط',
      metaDescription: 'Freehold luxury beachfront homes and apartments in Muscat, Oman. Contact our sales specialists today.',
    },
  });

  // Digital Cards
  const cardAhmed = await prisma.businessCard.upsert({
    where: { slug: 'ahmed-albalushi' },
    update: {},
    create: {
      organizationId: almoujOrg.id,
      branchId: mainBranch.id,
      slug: 'ahmed-albalushi',
      title: 'Ahmed Al Balushi - Head of Sales',
      ownerName: 'Ahmed Al Balushi',
      ownerNameAr: 'أحمد البلوشي',
      jobTitle: 'Head of Luxury Residential Sales',
      jobTitleAr: 'رئيس مبيعات العقارات السكنية الفاخرة',
      companyName: 'Al Mouj Muscat Real Estate',
      companyNameAr: 'الموج مسقط العقارية',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
      phone: '+96894567890',
      whatsapp: '+96894567890',
      email: 'ahmed@almouj.om',
      website: 'https://almouj.com',
      locationText: 'Al Mouj Marina, Muscat, Oman',
      locationTextAr: 'مارينا الموج، مسقط، سلطنة عُمان',
      mapsUrl: 'https://maps.google.com/?q=Al+Mouj+Muscat',
      bio: '14+ years in premium GCC real estate development. Specializing in high-net-worth acquisitions and residency-linked freehold properties.',
      bioAr: 'خبرة تزيد عن 14 عاماً في التطوير العقاري الخليجي الراقي، متخصص في استثمارات التملك الحر والإقامة الذهبية.',
      badgeText: 'Verified Real Estate Broker #OM-449',
      theme: 'navy-violet',
      primaryColor: '#181D48',
      accentColor: '#00B6B2',
      isPrimary: true,
      isPublished: true,
      viewCount: 1420,
      scanCount: 388,
      saveContactCount: 194,
      customActions: JSON.stringify([
        { label: 'View Available Villas', labelAr: 'تصفح الفلل المتاحة', url: '/b/al-mouj-muscat#properties', icon: 'home' },
        { label: 'Book VIP Viewing', labelAr: 'طلب معاينة خاصة', url: '/b/al-mouj-muscat#book', icon: 'calendar' },
        { label: 'Download Master Brochure', labelAr: 'تحميل كتالوج المشروع', url: '#brochure', icon: 'file' },
      ]),
      socialLinks: JSON.stringify({
        linkedin: 'https://linkedin.com/in/ahmed-albalushi',
        instagram: 'https://instagram.com/ahmed.realtor.om',
      }),
    },
  });

  const cardFatima = await prisma.businessCard.upsert({
    where: { slug: 'fatima-alharthy' },
    update: {},
    create: {
      organizationId: almoujOrg.id,
      branchId: mainBranch.id,
      slug: 'fatima-alharthy',
      title: 'Fatima Al Harthy - Property Consultant',
      ownerName: 'Fatima Al Harthy',
      ownerNameAr: 'فاطمة الحارثية',
      jobTitle: 'Senior Investment Consultant',
      jobTitleAr: 'مستشارة استثمار عقاري أولى',
      companyName: 'Al Mouj Muscat Real Estate',
      companyNameAr: 'الموج مسقط العقارية',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      phone: '+96895123456',
      whatsapp: '+96895123456',
      email: 'fatima@almouj.om',
      website: 'https://almouj.com',
      locationText: 'Al Mouj Marina, Muscat, Oman',
      locationTextAr: 'مارينا الموج، مسقط',
      bio: 'Advising private investors on high-yield holiday rental units and modern beachfront apartments.',
      bioAr: 'تقديم المشورة للمستثمرين حول الشقق الشاطئية ذات العائد الإيجاري المرتفع والاستثمار الآمن.',
      theme: 'luxury-gold',
      primaryColor: '#181D48',
      accentColor: '#E59F36',
      isPrimary: false,
      isPublished: true,
      viewCount: 890,
      scanCount: 215,
      saveContactCount: 112,
    },
  });

  // Wallet Passes
  await prisma.walletPass.create({
    data: {
      organizationId: almoujOrg.id,
      cardId: cardAhmed.id,
      passType: 'BUSINESS_CARD',
      platform: 'APPLE',
      serialNumber: 'WSL-OM-ALMOUJ-001-A',
      barcodeValue: 'http://localhost:3000/c/ahmed-albalushi',
      status: 'ACTIVE',
      isSimulated: true,
      downloadCount: 86,
      lastIssuedAt: new Date(),
    },
  });

  await prisma.walletPass.create({
    data: {
      organizationId: almoujOrg.id,
      cardId: cardAhmed.id,
      passType: 'BUSINESS_CARD',
      platform: 'GOOGLE',
      serialNumber: 'WSL-OM-ALMOUJ-001-G',
      barcodeValue: 'http://localhost:3000/c/ahmed-albalushi',
      status: 'ACTIVE',
      isSimulated: true,
      downloadCount: 64,
      lastIssuedAt: new Date(),
    },
  });

  // Marketing Campaign
  const campaignExpo = await prisma.campaign.create({
    data: {
      organizationId: almoujOrg.id,
      name: 'Muscat City Centre Property Expo 2026',
      nameAr: 'معرض مسقط سيتي سنتر العقاري ٢٠٢٦',
      channel: 'EXHIBITION',
      utmSource: 'city_centre_expo',
      utmMedium: 'booth_display_qr',
      utmCampaign: 'expo_march_2026',
      scansCount: 420,
      leadsCount: 38,
      wonLeadsCount: 5,
      isActive: true,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-31'),
    },
  });

  // Smart QR Code
  await prisma.qRCode.create({
    data: {
      organizationId: almoujOrg.id,
      cardId: cardAhmed.id,
      campaignId: campaignExpo.id,
      code: 'QR-ALMOUJ-EXPO-26',
      name: 'Booth Standing Banner QR',
      targetUrl: 'http://localhost:3000/c/ahmed-albalushi?utm_source=expo&utm_campaign=city_centre_expo',
      scanCount: 420,
      isActive: true,
    },
  });

  // 8 Realistic Leads across all CRM Stages
  const leadsData = [
    {
      name: 'Sheikh Hamed Al Maskari (الشيخ حامد المسكري)',
      phone: '+96899441122',
      email: 'h.maskari@investments.om',
      stage: 'WON',
      priority: 'URGENT',
      areaOfInterest: 'Zunairah Luxury Oceanfront Villa (5BR)',
      budgetRange: '400,000 - 500,000 OMR',
      dealValueOMR: 420000,
      preferredContact: 'WHATSAPP',
      source: 'QR_SCAN',
      notes: 'Down payment paid. Sales agreement signed at Al Mouj sales centre. Final deed transfer underway.',
      cardId: cardAhmed.id,
      campaignId: campaignExpo.id,
      assignedToId: almoujOwner.id,
      convertedAt: new Date(),
    },
    {
      name: 'Dr. Tariq Al Zadjali (د. طارق الزدجالي)',
      phone: '+96898765432',
      email: 'tariq.zadjali@muscatclinic.om',
      stage: 'NEGOTIATION',
      priority: 'HIGH',
      areaOfInterest: 'Marsa Gardens 2BR Boulevard Apartment',
      budgetRange: '100,000 - 120,000 OMR',
      dealValueOMR: 115000,
      preferredContact: 'PHONE',
      source: 'DIGITAL_CARD',
      notes: 'Discussed payment plan: 30% construction-linked milestone. Awaiting spouse review this evening.',
      cardId: cardAhmed.id,
      assignedToId: almoujOwner.id,
      followUpDate: new Date(Date.now() + 86400000 * 2),
    },
    {
      name: 'Eng. Salem Al Rawahi (م. سالم الرواحي)',
      phone: '+96892345678',
      email: 'salem.rawahi@pdo.co.om',
      stage: 'PROPOSAL_SENT',
      priority: 'HIGH',
      areaOfInterest: 'Golf Beach Townhouse (3BR)',
      budgetRange: '180,000 - 200,000 OMR',
      dealValueOMR: 195000,
      preferredContact: 'WHATSAPP',
      source: 'PUBLIC_PROFILE',
      notes: 'Full unit specification brochure and payment schedule sent via WhatsApp.',
      cardId: cardFatima.id,
      assignedToId: almoujConsultant.id,
      followUpDate: new Date(Date.now() + 86400000 * 3),
    },
    {
      name: 'Nasser Al Hosni (ناصر الحوسني)',
      phone: '+96897123999',
      email: 'nasser@hosni-trading.om',
      stage: 'APPOINTMENT_SCHEDULED',
      priority: 'MEDIUM',
      areaOfInterest: 'Marsa 1BR Sea View Unit',
      budgetRange: '80,000 - 95,000 OMR',
      dealValueOMR: 88000,
      preferredContact: 'PHONE',
      source: 'DIGITAL_CARD',
      notes: 'Scheduled physical site tour at Al Mouj sales centre next Tuesday 11:00 AM.',
      cardId: cardAhmed.id,
      assignedToId: almoujOwner.id,
      followUpDate: new Date(Date.now() + 86400000 * 4),
    },
    {
      name: 'Aisha Al Kiyumi (عائشة الكيومية)',
      phone: '+96896223344',
      email: 'aisha.kiyumi@gmail.com',
      stage: 'QUALIFIED',
      priority: 'MEDIUM',
      areaOfInterest: 'Beachfront 2BR Holiday Home',
      budgetRange: '110,000 - 130,000 OMR',
      preferredContact: 'WHATSAPP',
      source: 'QR_SCAN',
      notes: 'Verified purchasing capacity with Bank Muscat housing loan pre-approval.',
      cardId: cardFatima.id,
      assignedToId: almoujConsultant.id,
    },
    {
      name: 'Mohammed Al Kharusi (محمد الخروصي)',
      phone: '+96891887766',
      email: 'kharusi.m@omantel.om',
      stage: 'CONTACTED',
      priority: 'LOW',
      areaOfInterest: 'Al Mouj Commercial Retail Space',
      budgetRange: '150,000 OMR',
      preferredContact: 'EMAIL',
      source: 'DIRECT',
      notes: 'Initial contact made. Requested tenancy yields data sheet.',
      cardId: cardAhmed.id,
      assignedToId: almoujOwner.id,
    },
    {
      name: 'Khalfan Al Busaidi (خلفان البوسعيدي)',
      phone: '+96893332211',
      email: 'khalfan.b@outlook.com',
      stage: 'NEW',
      priority: 'HIGH',
      areaOfInterest: 'Zunairah Signature Villa',
      budgetRange: '350,000+ OMR',
      preferredContact: 'WHATSAPP',
      source: 'PUBLIC_PROFILE',
      notes: 'Submitted inquiry via public business profile form 15 minutes ago.',
      cardId: cardAhmed.id,
    },
    {
      name: 'Ali Al Maamari (علي المعمري)',
      phone: '+96894445566',
      email: 'ali.m@gmail.com',
      stage: 'LOST',
      priority: 'LOW',
      areaOfInterest: 'Marsa 1BR Apartment',
      budgetRange: '60,000 OMR',
      lostReason: 'PRICE',
      preferredContact: 'PHONE',
      source: 'QR_SCAN',
      notes: 'Budget was below minimum unit entry price (85,000 OMR). Archived for future phases.',
      cardId: cardAhmed.id,
      assignedToId: almoujOwner.id,
    },
  ];

  for (const lead of leadsData) {
    const createdLead = await prisma.lead.create({
      data: {
        organizationId: almoujOrg.id,
        ...lead,
      },
    });

    // Add activity
    await prisma.leadActivity.create({
      data: {
        leadId: createdLead.id,
        userId: almoujOwner.id,
        type: 'STATUS_CHANGE',
        description: `Lead created and entered stage: ${createdLead.stage}`,
        descriptionAr: `تم إنشاء فرصة العميل وتحديد المرحلة: ${createdLead.stage}`,
      },
    });
  }

  // Loyalty Program: Al Mouj Privilege Club
  const loyaltyProgram = await prisma.loyaltyProgram.create({
    data: {
      organizationId: almoujOrg.id,
      name: 'Al Mouj Privilege Club',
      nameAr: 'نادي امتيازات الموج مسقط',
      type: 'POINTS',
      pointsPerOMR: 10,
      description: 'Exclusive rewards club for Al Mouj residents, marina berth holders, and golf club members.',
      descriptionAr: 'برنامج مكافآت حصري لسكان الموج وأصحاب مراسي اليخوت ورواد ملاعب الجولف.',
      terms: 'Points expire after 24 months. Rewards can be claimed at all participating dining outlets and pro-shops in Al Mouj.',
      termsAr: 'تسري النقاط لمدة 24 شهراً. يمكن استرداد المكافآت في جميع المطاعم والمحلات المشاركة بالمشروع.',
      isActive: true,
    },
  });

  // Rewards in Catalog
  const reward1 = await prisma.reward.create({
    data: {
      programId: loyaltyProgram.id,
      title: 'PGA Golf Club 18-Hole Day Pass',
      titleAr: 'تذكرة يوم كامل ١٨ حفرة لملعب الجولف العالمي',
      pointsRequired: 800,
      discountValue: 45.0,
      discountType: 'FREE_ITEM',
      stock: 50,
      isActive: true,
    },
  });

  const reward2 = await prisma.reward.create({
    data: {
      programId: loyaltyProgram.id,
      title: 'Marina Yacht Charter 2-Hour Sunset Cruise',
      titleAr: 'رحلة غروب خاصة باليخت لمدة ساعتين في مارينا الموج',
      pointsRequired: 2500,
      discountValue: 120.0,
      discountType: 'FREE_ITEM',
      stock: 20,
      isActive: true,
    },
  });

  const reward3 = await prisma.reward.create({
    data: {
      programId: loyaltyProgram.id,
      title: '25% Dining Voucher at Kempinski / St. Regis',
      titleAr: 'قسيمة خصم ٢٥٪ في مطاعم الفنادق الفاخرة',
      pointsRequired: 400,
      discountValue: 25.0,
      discountType: 'PERCENT',
      stock: 100,
      isActive: true,
    },
  });

  // Loyalty Member & Points Ledger
  const memberHamed = await prisma.loyaltyMember.create({
    data: {
      programId: loyaltyProgram.id,
      membershipNumber: 'WSL-OM-9821',
      name: 'Sheikh Hamed Al Maskari',
      phone: '+96899441122',
      email: 'h.maskari@investments.om',
      pointsBalance: 3200,
      tier: 'PLATINUM',
      totalSpentOMR: 320.0,
    },
  });

  // Ledger Transactions
  await prisma.loyaltyTransaction.create({
    data: {
      memberId: memberHamed.id,
      type: 'EARN',
      points: 3200,
      amountOMR: 320.0,
      description: 'Points earned on Al Mouj Marina Berth renewal and dining',
      descriptionAr: 'نقاط مكتسبة عن تجديد رسو اليخت وتناول الطعام في المارينا',
      reference: 'INV-ALMOUJ-2026-89',
    },
  });

  // Sample Pending Redemption Token
  await prisma.rewardRedemption.create({
    data: {
      rewardId: reward1.id,
      memberId: memberHamed.id,
      redemptionCode: 'RDM-7749-AB',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 86400000 * 14),
    },
  });

  // Subscription for Al Mouj
  if (businessPlan) {
    const sub = await prisma.subscription.create({
      data: {
        organizationId: almoujOrg.id,
        planId: businessPlan.id,
        status: 'ACTIVE',
        billingInterval: 'MONTHLY',
        currentPeriodEnd: new Date(Date.now() + 86400000 * 28),
        isSandbox: true,
      },
    });

    await prisma.invoice.create({
      data: {
        organizationId: almoujOrg.id,
        subscriptionId: sub.id,
        invoiceNumber: 'INV-OM-2026-0042',
        amountOMR: 12.0,
        currency: 'OMR',
        status: 'PAID',
        paymentMethod: 'SANDBOX_CARD',
        paidAt: new Date(),
      },
    });
  }

  // Analytics Events
  const events = [
    { eventType: 'PAGE_VIEW', count: 120 },
    { eventType: 'QR_SCAN', count: 48 },
    { eventType: 'WHATSAPP_CLICK', count: 28 },
    { eventType: 'VCARD_DOWNLOAD', count: 19 },
    { eventType: 'WALLET_ADD_ATTEMPT', count: 14 },
    { eventType: 'WALLET_ISSUED', count: 11 },
  ];

  for (const ev of events) {
    for (let i = 0; i < 5; i++) {
      await prisma.analyticsEvent.create({
        data: {
          organizationId: almoujOrg.id,
          cardId: cardAhmed.id,
          campaignId: campaignExpo.id,
          eventType: ev.eventType,
          device: i % 2 === 0 ? 'MOBILE' : 'DESKTOP',
          browser: 'Safari',
          country: 'OM',
          city: 'Muscat',
        },
      });
    }
  }

  // Audit Logs
  await prisma.auditLog.create({
    data: {
      organizationId: almoujOrg.id,
      userId: almoujOwner.id,
      action: 'CARD_CREATED',
      resource: 'BusinessCard',
      resourceId: cardAhmed.id,
      detailsJson: JSON.stringify({ slug: cardAhmed.slug, title: cardAhmed.title }),
    },
  });

  console.log('✅ Seed completed successfully! Test users created:');
  console.log('👑 Super Admin: admin@wasil.om / Password123!');
  console.log('🏢 Business Owner (Al Mouj): ahmed@almouj.om / Password123!');
  console.log('💼 Sales Rep: fatima@almouj.om / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
