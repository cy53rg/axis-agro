# Axis Agro Website

Public website and admin panel for **Axis Agro** — a mixed livestock and poultry farm in Kaduna, Nigeria.

## 1. Project Overview

This is the marketing and operations site for Axis Agro. Visitors can learn about services, browse the farm gallery, request quotes, and find contact/directions. Farm staff use a password-protected admin panel to manage quotes, gallery images, and site settings.

### Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Email | Resend |
| Deployment | Vercel |
| Maps | Google Maps Embed API (optional) |

### Key routes

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/about` | Farm story, vision & mission |
| `/what-we-do` | Services detail |
| `/gallery` | Photo gallery |
| `/get-a-quote` | Quote request form |
| `/contact` | Contact info & map |
| `/admin/login` | Admin sign-in |
| `/admin/dashboard` | Admin overview |
| `/admin/quotes` | Manage quote requests |
| `/admin/gallery` | Upload & manage photos |
| `/admin/settings` | Site contact & location settings |

---

## 2. Local Setup

### Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com) account (free tier works)

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd axis-agro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create your environment file**
   ```bash
   cp .env.example .env.local
   ```
   Fill in all required values (see comments in `.env.example`).

4. **Set up Supabase** (see Section 3 below)

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

6. **Sign in to admin**
   - Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   - Use the admin credentials you created in Supabase Auth (Section 4)

### Production build (local test)

```bash
npm run build
npm run start
```

---

## 3. Supabase Setup

### 3.1 Create a project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Choose a name (e.g. `axis-agro`), set a database password, and pick a region close to Nigeria (e.g. `eu-west-1` or `eu-central-1`)
3. Wait for the project to finish provisioning

### 3.2 Run the database schema

1. In Supabase Dashboard → **SQL Editor** → **New query**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

This creates tables (`gallery_images`, `services`, `quote_requests`, `site_settings`, `site_content`), Row Level Security policies, and seed data.

### 3.3 Create the storage bucket

1. Go to **Storage** → **New bucket**
2. Name: `gallery`
3. Enable **Public bucket** (images need to be publicly readable on the website)
4. Add a storage policy allowing authenticated users to upload:
   - **INSERT** for `authenticated` role on `gallery` bucket
   - **UPDATE** and **DELETE** for `authenticated` role on `gallery` bucket
   - **SELECT** for `anon` and `authenticated` on `gallery` bucket

### 3.4 Get API keys

Go to **Project Settings → API** and copy:

| Key | Env variable |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | `SUPABASE_SERVICE_ROLE_KEY` |

> **Warning:** Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code or `NEXT_PUBLIC_*` variables.

### 3.5 Enable Auth

1. Go to **Authentication → Providers**
2. Ensure **Email** provider is enabled
3. For development, you can disable "Confirm email" under **Authentication → Settings** to skip email verification

---

## 4. Admin Access

Admin routes (`/admin/*` except `/admin/login`) are protected by middleware. Users must sign in with a Supabase Auth account.

### Create an admin user

1. Supabase Dashboard → **Authentication → Users**
2. Click **Add user → Create new user**
3. Enter the admin email and a strong password
4. Click **Create user**
5. Sign in at `/admin/login` with those credentials

There is no separate roles table — any authenticated Supabase user can access the admin panel. Only create accounts for trusted staff.

---

## 5. Deployment on Vercel

### 5.1 Connect the repository

1. Go to [vercel.com](https://vercel.com) and import your Git repository
2. Vercel auto-detects Next.js — no custom build settings needed
3. Framework preset: **Next.js**
4. Build command: `next build` (default)
5. Output directory: `.next` (default)

> **Note:** This project uses `next.config.mjs` (not `.ts`) because Next.js 14 does not support TypeScript config files. The config is typed via JSDoc (`@type {import('next').NextConfig}`). To use `next.config.ts`, upgrade to Next.js 15+.

### 5.2 Add environment variables

In Vercel → **Project → Settings → Environment Variables**, add every variable from `.env.example`:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server only |
| `NEXT_PUBLIC_SITE_URL` | Yes | e.g. `https://axisagro.ng` |
| `NEXT_PUBLIC_FARM_LAT` | Yes | |
| `NEXT_PUBLIC_FARM_LNG` | Yes | |
| `NEXT_PUBLIC_FARM_ADDRESS` | Yes | |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` | No | Fallback map works without it |
| `RESEND_API_KEY` | Yes | For quote email alerts |
| `ADMIN_EMAIL` | Yes | Where quote notifications are sent |
| `RESEND_FROM` | No | Defaults to Resend onboarding address |

Apply to **Production**, **Preview**, and **Development** environments as needed.

### 5.3 Deploy

1. Push to your main branch — Vercel deploys automatically
2. Or click **Deploy** in the Vercel dashboard
3. After deploy, visit your Vercel URL and test:
   - Public pages load
   - Quote form submits
   - Admin login works
   - Gallery upload works

### 5.4 Custom domain

1. Vercel → **Project → Settings → Domains**
2. Add your domain (e.g. `axisagro.ng`)
3. Update DNS records as instructed by Vercel
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain
5. Redeploy

---

## 6. Updating Content

### Admin panel

Sign in at `/admin/login`, then use:

| Section | What you can do |
|---|---|
| **Dashboard** | View quote stats and recent requests |
| **Quotes** | Filter, update status, add notes, export CSV, reply via WhatsApp |
| **Gallery** | Upload photos, set category, mark as featured, delete |
| **Settings** | Update phone, email, address, farm hours, coordinates, social links |

### Static images

Hero and service section images are static files in `/public/images/`. Replace these files directly (same filenames) or update the paths in the page components. See **Before Going Live** below.

### Database-driven content

Contact details shown in the footer and across the site can be updated via **Admin → Settings** (stored in `site_settings` table). The seed values in `constants/site.ts` are fallbacks used when env vars or DB settings are not set.

---

## Before Going Live

Complete these items before pointing a real domain at the site:

### Code TODOs

- [ ] **`app/(public)/page.tsx`** — Replace placeholder hero and about images (`/images/hero-farm.jpg`, `/images/about-farm.jpg`) with real farm photos
- [ ] **Placeholder image files** — Add all images to `/public/images/`:
  - `hero-farm.jpg` (homepage hero)
  - `about-farm.jpg` (homepage about section)
  - `about-hero.jpg` (about page hero)
  - `what-we-do-hero.jpg` (services page hero)
  - `gallery-hero.jpg` (gallery page hero)
  - `cattle.jpg`, `poultry.jpg`, `training.jpg` (service blocks)
- [ ] **`/public/logo.png`** — Add the Axis Agro logo (used in header and admin login)

### Placeholder contact data

- [ ] **`constants/site.ts`** — Update fallback phone (`+234 800 000 0000`), email, and address
- [ ] **`supabase/schema.sql` seed data** — Or update via Admin → Settings after deploy:
  - Phone, email, address, WhatsApp
  - Facebook and Instagram URLs
- [ ] **Environment variables** — Set real `NEXT_PUBLIC_FARM_LAT`, `NEXT_PUBLIC_FARM_LNG`, `NEXT_PUBLIC_FARM_ADDRESS`

### Missing admin pages

- [ ] **`/admin/services`** and **`/admin/content`** — Linked in admin nav but not yet built; links will 404 until implemented

### Infrastructure

- [ ] Supabase `gallery` storage bucket created and policies set
- [ ] Resend domain verified for production email sending
- [ ] Google Maps Embed API key restricted to your domain (if using)

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for the full pre-launch checklist.

---

## Project location

This is a standalone Next.js project for the Axis Agro website. Open this folder in your editor:

```
new-axis-agro/axis-agro
```
