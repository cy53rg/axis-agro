# JRN Agro LTD — Deployment Checklist

Use this checklist before and after deploying to Vercel.

## Content & Assets

- [ ] Real farm photos present in `/public/`:
  - [ ] `hero-farm.jpg`
  - [ ] `about-farm.jpg`
  - [ ] `about-hero.jpg`
  - [ ] `cattle.jpg`
- [ ] Logo at `/public/jrn-agro-logo.png`
- [ ] CAC certificate at `/public/CAC_certificate.png` (RC 9679462 shown on `/about`)
- [ ] Actual phone number in `site_settings` (Admin → Settings)
- [ ] Actual email address in `site_settings`
- [ ] Actual farm address and coordinates set (`NEXT_PUBLIC_FARM_*` env vars + Admin → Settings)

## Supabase

- [ ] Supabase project created
- [ ] `supabase/schema.sql` run in SQL Editor
- [ ] Storage bucket `gallery` created (public)
- [ ] Storage policies configured for upload/delete (authenticated) and read (public)
- [ ] Admin user created in Supabase Auth
- [ ] All Supabase env vars set in Vercel:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`

## Email & Notifications

- [ ] `RESEND_API_KEY` set in Vercel env vars
- [ ] `ADMIN_EMAIL` set in Vercel env vars
- [ ] `RESEND_FROM` set and domain verified in Resend (production)
- [ ] Test quote form end-to-end (submit → appears in admin → email received)

## Vercel Deployment

- [ ] Repository connected to Vercel
- [ ] All env vars added (see `.env.example`)
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] Build succeeds (`npm run build` passes locally)
- [ ] Domain connected in Vercel
- [ ] DNS propagated and HTTPS active

## Testing

- [ ] Test admin login and all admin pages:
  - [ ] Dashboard
  - [ ] Quotes (view, filter, update status)
  - [ ] Gallery (upload, edit, delete)
  - [ ] Settings (save contact details)
- [ ] Test quote form end-to-end on production URL
- [ ] Test on mobile device (375px — iPhone SE size)
- [ ] Test Google Maps / **Visit Us** button opens correct location
- [ ] Test WhatsApp link on Contact and Get a Quote pages
- [ ] Test gallery filter tabs and image loading
- [ ] Verify Open Graph preview (share link on WhatsApp/social)

## Post-Launch

- [ ] Submit sitemap to Google Search Console (`/sitemap.xml`)
- [ ] Upload real gallery photos via Admin → Gallery
- [ ] Mark best photos as "featured" for homepage strip
- [ ] Remove or update any remaining placeholder text in `constants/site.ts`
