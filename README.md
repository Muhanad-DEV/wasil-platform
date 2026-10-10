# Wasil (واصل) — Smart Digital Business Cards, Customer Growth & Loyalty Platform

> **حوّل كل تواصل إلى فرصة نمو**  
> *All-in-one digital business identity, customer acquisition, sales conversion, and loyalty platform built for businesses in the Sultanate of Oman & the GCC.*

[![Next.js](https://img.shields.io/badge/Next.js-14.2_App_Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.21-2D3748?logo=prisma)](https://www.prisma.io/)
[![Netlify Ready](https://img.shields.io/badge/Netlify-Ready-00C7B7?logo=netlify)](https://www.netlify.com/)

---

## 🌟 The Four Core Pillars

1. **Smart Digital Business Cards**: Live split-pane card builder, RFC 6350 UTF-8 vCard generation, Apple Wallet `.pkpass` bundles, and Google Wallet passes.
2. **Customer Acquisition & CRM**: Public inquiries capture with smart duplicate phone detection, 8-stage interactive Kanban pipeline, UTM campaign attribution, and UTF-8 BOM CSV exports for Microsoft Excel.
3. **Loyalty & Rewards Engine**: Points and stamps ledger, non-guessable single-use QR redemption tokens, and front-desk/cashier POS verification scanner.
4. **Multi-Tenant Business Management**: Multi-branch directory, team RBAC, OMR subscription billing, official Omani MoCIIP C.R. records, and Platform Super Admin telemetry.

---

## 🚀 Deploying to Netlify

This repository is pre-configured for Netlify with [`netlify.toml`](file:///Users/stan/Documents/oman.real.estate/netlify.toml) and Next.js 14 App Router integration.

### Quick Deployment Steps:

1. **Import Repository in Netlify**:
   - Log in to your [Netlify Dashboard](https://app.netlify.com/).
   - Click **Add new site** > **Import an existing project**.
   - Select **GitHub** and choose `Muhanad-DEV/wasil-platform`.

2. **Build Settings** (automatically read from `netlify.toml`):
   - **Build command**: `npx prisma generate && npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `20`

3. **Configure Environment Variables in Netlify**:
   Go to **Site configuration** > **Environment variables** and configure:

   | Variable | Recommended Value | Notes |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `file:./dev.db` *(or PostgreSQL URL for production)* | SQLite works with pre-seeded data. For persistent serverless writes, connect Supabase / Neon PostgreSQL. |
   | `JWT_SECRET` | *(Any random 32+ char string)* | Used for session signing. |
   | `NEXT_PUBLIC_APP_URL` | `https://your-site-name.netlify.app` | Your public Netlify domain. |
   | `NEXT_PUBLIC_DEFAULT_CURRENCY` | `OMR` | Default currency. |
   | `ENABLE_DEMO_MODE` | `true` | Runs Apple & Google Wallet in transparent sandbox mode. |

4. **Click Deploy**: Netlify will generate the Prisma Client, compile all 55 Next.js routes, and deploy the application.

---

## 🔑 Pre-Seeded Evaluation Accounts

Once deployed, the database includes pre-configured demo accounts for instant evaluation:

| Role | Email | Password | Scope & Dashboard Access |
| :--- | :--- | :--- | :--- |
| **Platform Super Admin** | `admin@wasil.om` | `Password123!` | `/admin` — Platform telemetry, MRR in OMR, tenant suspension, global audit logs |
| **Organization Owner** | `ahmed@almouj.om` | `Password123!` | `/dashboard` — Al Mouj Muscat (Cards, CRM Kanban, Loyalty, Branches, Billing) |
| **Sales Consultant** | `fatima@almouj.om` | `Password123!` | `/dashboard/leads` — Lead management, appointments, personal card |

*Note: The sign-in page at `/auth/login` includes 1-click evaluation buttons to log into any of these accounts instantly.*

---

## 🛠️ Local Development & Testing

```bash
# 1. Clone repository
git clone https://github.com/Muhanad-DEV/wasil-platform.git
cd wasil-platform

# 2. Install dependencies
npm install

# 3. Generate Prisma client & seed demo data
npm run prisma:generate
npm run prisma:seed

# 4. Run automated test suite (28/28 tests)
npm run test

# 5. Start development server
npm run dev
# Or build for production
npm run build && npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

```
wasil-platform/
├── prisma/
│   ├── schema.prisma         # 21 multi-tenant models (Cards, Leads, Loyalty, Invoices, etc.)
│   └── dev.db                # Pre-seeded SQLite database
├── scripts/
│   ├── seed.mjs              # Full Oman real estate seed script (Al Mouj Muscat)
│   └── test-runner.mjs       # 28 automated integration tests
├── src/
│   ├── app/
│   │   ├── (public pages)    # /, /features, /industries, /pricing, /about, /contact
│   │   ├── admin/            # Platform Super Admin Portal
│   │   ├── b/[slug]/         # Public Organization Profile
│   │   ├── c/[slug]/         # Public Digital Business Card & vCard
│   │   ├── dashboard/        # Multi-Tenant Business Management Dashboard
│   │   └── api/              # 30+ REST & Pass generation API endpoints
│   ├── components/
│   │   ├── card/             # Live card builder & smartphone preview
│   │   ├── crm/              # 8-stage Kanban CRM with CSV export
│   │   ├── loyalty/          # POS redemption scanner terminal
│   │   └── layout/           # Bilingual navbar, footer, sidebar
│   └── lib/
│       ├── auth.ts           # JWT & RBAC helpers
│       ├── i18n.ts           # Complete Arabic/English dictionary & OMR currency formatters
│       ├── vcard.ts          # RFC 6350 UTF-8 contact generator
│       └── wallet.ts         # Apple Wallet PKPass & Google Wallet JWT engines
├── netlify.toml              # Netlify Next.js runtime configuration
└── package.json
```

---

## 📄 License
Proprietary SaaS architecture — Wasil Sultanate of Oman.
