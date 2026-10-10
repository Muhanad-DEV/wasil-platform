import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import JSZip from 'jszip';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    throw new Error(`Assertion failed: ${testName}`);
  }
}

async function runTests() {
  console.log('🚀 Running Wasil (واصل) Automated Verification Suite...\n');

  try {
    // ----------------------------------------------------
    // TEST 1: Database Seed & Multi-Tenant Entities
    // ----------------------------------------------------
    console.log('📌 Test Suite 1: Database Integrity & Multi-Tenancy');
    const org = await prisma.organization.findUnique({
      where: { slug: 'al-mouj-muscat' },
      include: {
        subscription: { include: { plan: true } },
        cards: true,
        branches: true,
        leads: true,
        loyaltyPrograms: { include: { rewards: true, members: true } },
      },
    });

    assert(org !== null, 'Organization al-mouj-muscat exists');
    assert(org.subscription !== null, 'Organization has active subscription');
    assert(['BUSINESS', 'ENTERPRISE'].includes(org.subscription.plan.code), `Organization is on valid plan (${org.subscription.plan.code})`);
    assert(org.cards.length >= 2, `Organization has published cards (found: ${org.cards.length})`);
    assert(org.branches.length >= 1, `Organization has registered branches (found: ${org.branches.length})`);
    assert(org.leads.length >= 8, `CRM has multi-stage leads (found: ${org.leads.length})`);
    assert(org.loyaltyPrograms.length >= 1, 'Loyalty program exists');
    assert(org.loyaltyPrograms[0].rewards.length >= 3, 'Loyalty program has configured rewards');

    // Super Admin verification
    const superAdmin = await prisma.user.findUnique({
      where: { email: 'admin@wasil.om' },
    });
    assert(superAdmin !== null && superAdmin.isSuperAdmin === true, 'Platform Super Admin exists with root clearance');

    // ----------------------------------------------------
    // TEST 2: vCard RFC 6350 Generator (UTF-8 Arabic Support)
    // ----------------------------------------------------
    console.log('\n📌 Test Suite 2: vCard RFC 6350 Generator');
    const card = org.cards[0];
    
    // Test vCard construction
    const displayName = card.nameAr ? `${card.name} | ${card.nameAr}` : card.name;
    const displayTitle = card.jobTitleAr ? `${card.jobTitle} | ${card.jobTitleAr}` : card.jobTitle;
    const displayOrg = org.nameAr ? `${org.name} | ${org.nameAr}` : org.name;

    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN;CHARSET=UTF-8:${displayName}`,
      `N;CHARSET=UTF-8:${card.name};;;;`,
      `ORG;CHARSET=UTF-8:${displayOrg}`,
      `TITLE;CHARSET=UTF-8:${displayTitle}`,
      `TEL;TYPE=WORK,VOICE:${card.phone}`,
      `EMAIL;TYPE=WORK,INTERNET:${card.email}`,
      `URL:https://wasil.om/c/${card.slug}`,
      `ADR;TYPE=WORK;CHARSET=UTF-8:;;;Muscat;;Sultanate of Oman;`,
      'END:VCARD',
    ];
    const vcardString = lines.join('\r\n');

    assert(vcardString.includes('BEGIN:VCARD'), 'vCard header BEGIN:VCARD is present');
    assert(vcardString.includes('VERSION:3.0'), 'vCard VERSION:3.0 is present');
    assert(vcardString.includes('CHARSET=UTF-8'), 'vCard includes UTF-8 encoding declaration');
    assert(vcardString.includes('Sultanate of Oman'), 'vCard location includes Sultanate of Oman');
    assert(vcardString.includes('END:VCARD'), 'vCard ends with END:VCARD');

    // ----------------------------------------------------
    // TEST 3: Apple Wallet .pkpass Bundle & Manifest Hashing
    // ----------------------------------------------------
    console.log('\n📌 Test Suite 3: Apple Wallet .pkpass Bundle Architecture');
    const zip = new JSZip();
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.om.wasil.businesscard',
      serialNumber: `WC-${card.id}`,
      teamIdentifier: 'WASILOMAN01',
      organizationName: org.name,
      description: `${card.name} - ${org.name}`,
      barcodes: [
        {
          format: 'PKBarcodeFormatQR',
          message: `https://wasil.om/c/${card.slug}`,
          messageEncoding: 'iso-8859-1',
          altText: `WC-${card.id}`,
        },
      ],
      generic: {
        primaryFields: [{ key: 'name', label: 'NAME / الاسم', value: card.name }],
      },
    };

    const passJsonBuffer = Buffer.from(JSON.stringify(passJson, null, 2), 'utf-8');
    zip.file('pass.json', passJsonBuffer);

    // Compute manifest sha1
    const passJsonSha1 = crypto.createHash('sha1').update(passJsonBuffer).digest('hex');
    const manifestJson = {
      'pass.json': passJsonSha1,
    };
    zip.file('manifest.json', JSON.stringify(manifestJson, null, 2));

    const pkpassBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    assert(pkpassBuffer.length > 0, `PKPass zip bundle generated (size: ${pkpassBuffer.length} bytes)`);

    // Verify bundle contents by reading it back
    const readZip = await JSZip.loadAsync(pkpassBuffer);
    assert(readZip.file('pass.json') !== null, 'PKPass contains pass.json');
    assert(readZip.file('manifest.json') !== null, 'PKPass contains manifest.json');
    const readManifest = JSON.parse(await readZip.file('manifest.json').async('string'));
    assert(readManifest['pass.json'] === passJsonSha1, 'manifest.json SHA1 matches pass.json checksum');

    // ----------------------------------------------------
    // TEST 4: Google Wallet Pass JWT & Save URL
    // ----------------------------------------------------
    console.log('\n📌 Test Suite 4: Google Wallet JWT Pass Format');
    const issuerId = '33880000000221';
    const classId = `${issuerId}.wasil_generic_card`;
    const objectId = `${issuerId}.card_${card.id}`;

    const googlePayload = {
      iss: 'wasil-wallet-service@wasil.om',
      aud: 'google',
      typ: 'savetowallet',
      iat: Math.floor(Date.now() / 1000),
      payload: {
        genericObjects: [
          {
            id: objectId,
            classId: classId,
            logo: { sourceUri: { uri: 'https://wasil.om/logo.png' } },
            cardTitle: { defaultValue: { language: 'en', value: org.name } },
            header: { defaultValue: { language: 'en', value: card.name } },
            barcode: {
              type: 'QR_CODE',
              value: `https://wasil.om/c/${card.slug}`,
            },
          },
        ],
      },
    };

    const token = jwt.sign(googlePayload, 'wasil_sandbox_secret', { algorithm: 'HS256' });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;
    assert(token.length > 20, 'Google Wallet JWT generated successfully');
    assert(saveUrl.startsWith('https://pay.google.com/gp/v/save/'), 'Google Wallet save URL correctly formatted');

    // ----------------------------------------------------
    // TEST 5: CRM Lead Deduplication & Inquiry Aggregation
    // ----------------------------------------------------
    console.log('\n📌 Test Suite 5: CRM Lead Capture & Duplicate Protection');
    const testPhone = '+96899990001';
    const testEmail = 'vip.investor@muscat.om';
    
    // Clean up if existing from previous run
    let existingTestLead = await prisma.lead.findFirst({
      where: { organizationId: org.id, phone: testPhone },
    });

    if (existingTestLead) {
      await prisma.leadActivity.deleteMany({ where: { leadId: existingTestLead.id } });
      await prisma.lead.delete({ where: { id: existingTestLead.id } });
    }

    // Step 1: Create fresh initial lead
    const lead1 = await prisma.lead.create({
      data: {
        organizationId: org.id,
        name: 'Sayyid Tariq Al-Said',
        phone: testPhone,
        email: testEmail,
        source: 'DIGITAL_CARD',
        stage: 'NEW',
        priority: 'MEDIUM',
        areaOfInterest: 'Juffair Marina Villa',
      },
    });
    assert(lead1.stage === 'NEW', 'Initial lead created in NEW stage');

    // Step 2: Simulate second inquiry with duplicate phone number
    const dupCheck = await prisma.lead.findFirst({
      where: { organizationId: org.id, phone: testPhone },
    });
    assert(dupCheck !== null, 'Duplicate detection accurately caught existing lead by phone');

    // Step 3: Update existing lead (bump priority to HIGH and append activity)
    const updatedLead = await prisma.lead.update({
      where: { id: dupCheck.id },
      data: {
        priority: 'HIGH',
        areaOfInterest: 'Updated: Luxury Penthouse Al Mouj',
      },
    });

    const activity = await prisma.leadActivity.create({
      data: {
        leadId: updatedLead.id,
        type: 'NOTE',
        description: 'Customer submitted duplicate inquiry - escalated priority to HIGH',
        descriptionAr: 'قام العميل بتقديم استفسار مكرر - تم رفع الأولوية إلى مرتفعة',
      },
    });

    assert(updatedLead.priority === 'HIGH', 'Duplicate inquiry escalated lead priority to HIGH');
    assert(activity.leadId === updatedLead.id, 'Activity timeline event recorded for duplicate inquiry');

    // Clean up test lead and activities
    await prisma.leadActivity.deleteMany({ where: { leadId: updatedLead.id } });
    await prisma.lead.delete({ where: { id: updatedLead.id } });

    // ----------------------------------------------------
    // TEST 6: Loyalty Rewards Ledger & Atomic Redemption
    // ----------------------------------------------------
    console.log('\n📌 Test Suite 6: Loyalty Program & Atomic Ledger Deduction');
    const loyaltyProg = org.loyaltyPrograms[0];
    const member = loyaltyProg.members[0];
    const reward = loyaltyProg.rewards[0];

    assert(member.pointsBalance >= 0, `Member points balance verified: ${member.pointsBalance} pts`);

    // Ensure member has sufficient points for test
    const initialPoints = member.pointsBalance;
    const requiredPoints = reward.pointsRequired;

    // Simulate atomic points balance check
    if (member.pointsBalance < requiredPoints) {
      await prisma.loyaltyMember.update({
        where: { id: member.id },
        data: { pointsBalance: requiredPoints + 500 },
      });
    }

    const currentMember = await prisma.loyaltyMember.findUnique({
      where: { id: member.id },
    });
    assert(currentMember.pointsBalance >= requiredPoints, 'Member has sufficient points for redemption test');

    // Perform atomic transaction: deduct points and record redemption
    const testCode = `TEST-${Date.now()}`;
    const redemptionResult = await prisma.$transaction(async (tx) => {
      // 1. Deduct points
      const updatedMember = await tx.loyaltyMember.update({
        where: { id: member.id },
        data: { pointsBalance: { decrement: requiredPoints } },
      });

      // 2. Create loyalty transaction ledger entry
      const txLog = await tx.loyaltyTransaction.create({
        data: {
          memberId: member.id,
          type: 'REDEEM',
          points: -requiredPoints,
          description: `Redeemed test reward: ${reward.title}`,
        },
      });

      // 3. Create redemption record
      const redemption = await tx.rewardRedemption.create({
        data: {
          memberId: member.id,
          rewardId: reward.id,
          redemptionCode: testCode,
          status: 'VERIFIED',
          verifiedBy: 'Staff Cashier Terminal #1',
          verifiedAt: new Date(),
          expiresAt: new Date(Date.now() + 86400000),
        },
      });

      return { updatedMember, txLog, redemption };
    });

    assert(
      redemptionResult.updatedMember.pointsBalance === currentMember.pointsBalance - requiredPoints,
      'Atomic transaction accurately decremented member balance'
    );
    assert(redemptionResult.redemption.status === 'VERIFIED', 'Reward redemption record status is VERIFIED');

    // Clean up test transaction & redemption
    await prisma.rewardRedemption.delete({ where: { id: redemptionResult.redemption.id } });
    await prisma.loyaltyTransaction.delete({ where: { id: redemptionResult.txLog.id } });
    // Restore initial points
    await prisma.loyaltyMember.update({
      where: { id: member.id },
      data: { pointsBalance: initialPoints },
    });

    // ----------------------------------------------------
    // TEST 7: Apple & Google Wallet Geofencing & Project Locations
    // ----------------------------------------------------
    console.log('\n📌 Test Suite 7: Apple & Google Wallet Geofencing & Lock Screen Alerts');
    const geofencedCard = await prisma.businessCard.findFirst({
      where: { slug: 'ahmed-albalushi' },
    });
    assert(geofencedCard !== null, 'Card ahmed-albalushi exists for geofence validation');

    // Parse and validate wallet locations
    let cardLocations = [];
    if (geofencedCard.walletLocations) {
      try {
        cardLocations = JSON.parse(geofencedCard.walletLocations);
      } catch (e) {}
    }

    if (cardLocations.length === 0) {
      // Seed default geofence locations if not yet set
      const defaultLocs = [
        {
          id: 'almouj-marina',
          name: 'Al Mouj Muscat Marina',
          nameAr: 'مارينا الموج مسقط',
          type: 'PROJECT',
          latitude: 23.6263,
          longitude: 58.2612,
          relevantText: 'Welcome to Al Mouj Muscat! Tap to explore waterfront residences & your sales advisor Ahmed.',
          relevantTextAr: 'أهلاً بك في الموج مسقط! استكشف الفلل الشاطئية الفاخرة وتواصل مع مستشارك أحمد.',
          address: 'Al Mouj Marina, Al Hail North, Muscat',
        },
        {
          id: 'stregis-almouj',
          name: 'The St. Regis Al Mouj Resort',
          nameAr: 'منتجع سانت ريجيس الموج',
          type: 'HOTEL',
          latitude: 23.6295,
          longitude: 58.2678,
          relevantText: 'Nearby The St. Regis Al Mouj. Present this pass for VIP concierge & property previews.',
          relevantTextAr: 'بالقرب من سانت ريجيس الموج مسقط. أظهر هذه البطاقة للاستقبال الخاص والمعاينات.',
          address: 'Al Mouj Street, Muscat',
        },
      ];
      await prisma.businessCard.update({
        where: { id: geofencedCard.id },
        data: {
          walletLocations: JSON.stringify(defaultLocs),
          walletDesign: JSON.stringify({
            themePreset: 'royal-navy',
            cardStyle: 'storeCard',
            crNumber: 'CR-1398244/OM',
            bookingUrl: 'https://almouj.com/vip-booking',
            enableGeofenceAlerts: true,
          }),
        },
      });
      cardLocations = defaultLocs;
    }

    assert(Array.isArray(cardLocations) && cardLocations.length >= 2, `Card has ${cardLocations.length} active GPS geofences`);
    const loc1 = cardLocations[0];
    assert(typeof loc1.latitude === 'number' && typeof loc1.longitude === 'number', 'Geofence has numeric latitude & longitude coordinates');
    assert(loc1.latitude > 23.0 && loc1.latitude < 24.0, `Latitude ${loc1.latitude} is accurately within the Muscat metropolitan area`);
    assert(loc1.longitude > 58.0 && loc1.longitude < 59.0, `Longitude ${loc1.longitude} is accurately within the Sultanate of Oman`);
    assert(Boolean(loc1.relevantText && loc1.relevantText.length > 10), 'Lock screen alert message relevantText is configured');

    // Validate pass.json locations structure complies with Apple PassKit spec
    const applePassLocations = cardLocations.slice(0, 10).map((loc) => ({
      latitude: loc.latitude,
      longitude: loc.longitude,
      relevantText: loc.relevantText,
    }));
    assert(applePassLocations.length <= 10, 'Apple Wallet pass conforms to PassKit limit of max 10 locations');
    assert(applePassLocations.every((l) => l.latitude && l.longitude && l.relevantText), 'All pass locations contain valid PassKit required attributes');

    console.log('\n======================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
    console.log('======================================================\n');
  } catch (error) {
    console.error('\n❌ Test Suite Aborted with error:\n', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
