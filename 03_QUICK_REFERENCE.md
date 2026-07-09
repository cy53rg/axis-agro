# AXIS AGRO — QUICK REFERENCE CARD
*Keep this handy while building. Copy-paste colors, fonts, and text directly.*

---

## COLORS (Copy-Paste)

| Name | Hex | Use For |
|---|---|---|
| Forest Green | `#1E5631` | Primary CTA buttons, section headlines, "Visit Us" button |
| Navy | `#1B2E3C` | Navigation, footer, H1 headings |
| Gold | `#9B7E2F` | Card top borders, hover states, eyebrow labels |
| Sage | `#8FB89A` | Icon backgrounds, secondary accents |
| Cream | `#F5F2EB` | Page body background, alternating sections |
| White | `#FFFFFF` | Cards, header |
| Body Text | `#2C2C2C` | Paragraphs |
| Muted | `#6B7280` | Labels, captions, meta text |
| Divider | `#E4DED3` | HR lines, borders |

---

## FONTS

| Role | Font | Weights | Import |
|---|---|---|---|
| Display / Headings | Playfair Display | 400, 700 | Google Fonts |
| Body / UI | Inter | 400, 500, 600 | Google Fonts |
| Nav / Labels / Buttons | Montserrat | 500, 600, 700 | Google Fonts |

---

## COPY (Ready to Use)

**Hero Headline:** "Quality Livestock. Built on Trust."

**Hero Subheading:** "Axis Agro is Kaduna's mixed livestock and poultry farm — specialising in healthy breeding stock, quality meat production, and artificial insemination services for Northern Nigeria's farming community."

**About Snippet:** "We raise cattle, goats, chickens, turkeys, and ducks with a focus on health, proper nutrition, and modern breeding techniques. Our artificial insemination services help local herds perform better."

**Why Axis Agro Heading:** "More Than Just a Farm."

**Why Body:** "We are a full livestock operation built around one principle: healthy animals produce better results."

**Quote CTA Heading:** "Ready to Work With Us?"

**Quote CTA Body:** "Tell us what you need and we'll get back to you with a quote within 24 hours."

**Quote Success Title:** "Thank you, {name}!"

**Quote Success Body:** "We've received your request and will contact you within 24 hours. If it's urgent, call us directly."

---

## SERVICE TYPES (Dropdown Options)

```
Cattle Purchase
Goat Purchase
Broiler Chickens
Layers
Turkeys
Ducks
AI Services
Farmer Training
Other
```

---

## NAVIGATION LINKS

```
Home          →  /
About Us      →  /about
What We Do    →  /what-we-do
Our Farm      →  /gallery
Get a Quote   →  /get-a-quote
Contact       →  /contact (only in footer/mobile)
Visit Us      →  Opens Google Maps (button, not a link)
```

---

## ADMIN ROUTES

```
/admin/login        ←  No auth required
/admin/dashboard    ←  Auth required
/admin/quotes       ←  Auth required
/admin/gallery      ←  Auth required
/admin/services     ←  Auth required
/admin/content      ←  Auth required
/admin/settings     ←  Auth required
```

---

## DATABASE TABLE NAMES

```
gallery_images
services
quote_requests
site_content
site_settings
```

---

## SUPABASE STORAGE

- Bucket name: `gallery`
- Set to: **Public** (so image URLs work without auth)

---

## ENV VARIABLES NEEDED

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
ADMIN_EMAIL
NEXT_PUBLIC_FARM_LAT
NEXT_PUBLIC_FARM_LNG
NEXT_PUBLIC_FARM_ADDRESS
```

---

## PACKAGE COMMANDS (Quick Copy)

```bash
# Initial setup
npx create-next-app@latest axis-agro --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd axis-agro

# All dependencies
npx shadcn@latest init
npx shadcn@latest add button input textarea select label card table badge dialog dropdown-menu toast form
npm install @supabase/supabase-js @supabase/ssr react-hook-form zod @hookform/resolvers resend lucide-react react-dropzone clsx tailwind-merge date-fns

# Dev server
npm run dev

# Build check
npm run build
```

---

## GOOGLE MAPS — VISIT US BUTTON

```
Direct link to farm on Maps:
https://maps.google.com?q=${FARM_LAT},${FARM_LNG}

Google Maps Embed (iframe):
https://maps.google.com/maps?q=${FARM_LAT},${FARM_LNG}&output=embed

(No API key needed for iframe embed)
```

---

## PHASE BUILD ORDER

```
Phase 0 → Project setup + dependencies
Phase 1 → Design system (Tailwind config, globals.css, types, utils)
Phase 2 → Supabase (clients, schema, queries)
Phase 3 → Layout (root layout, header, footer, shared UI)
Phase 4 → Home page (all 7 sections)
Phase 5 → About page
Phase 6 → What We Do page
Phase 7 → Gallery page
Phase 8 → Get a Quote page (form + API)
Phase 9 → Contact page
Phase 10 → Admin panel (login, dashboard, quotes, gallery, settings)
Phase 11 → Polish (loading states, SEO, mobile, performance)
Phase 12 → Deployment prep
```

---

## DESIGN DON'TS

- ❌ Never use pure black (#000000) for text
- ❌ Never use more than 3 font families
- ❌ No complex animations or parallax (audience is older)
- ❌ No autoplay videos or audio
- ❌ Don't hide the phone number — it should be visible everywhere
- ❌ Don't make buttons too small (minimum 44px tap target)
- ❌ No pop-ups or cookie banners (not required for this project)
- ❌ Don't use the default cream-serif-terracotta look — keep navy and forest green dominant

---

*This card lives alongside Documents 1 and 2. When in doubt, refer to Doc 1 for full detail.*
