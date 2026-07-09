# AXIS AGRO — COMPLETE WEBSITE PROJECT BRIEF
*Reference document for all build phases. Keep this open throughout development.*

---

## 1. PROJECT OVERVIEW

| Field | Detail |
|---|---|
| **Client** | Axis Agro Farm |
| **Location** | Kaduna, Nigeria |
| **Project Type** | Custom website + admin CMS |
| **Build Tool** | Cursor (AI-assisted) |
| **Deadline** | As agreed with client |

### What the site must do:
1. Establish credibility and trust for a serious farming operation
2. Clearly explain what services are available (livestock, poultry, AI services)
3. Allow visitors to request a quotation via a form
4. Show the farm location and give visitors directions
5. Showcase the farm through photos
6. Let the farm owner update content without touching code (CMS admin)

---

## 2. TARGET AUDIENCE

The people visiting this site are **not Gen Z**. Think:
- Farmers and smallholders aged 30–65 looking to buy breeding stock
- Restaurant owners and caterers looking for meat supply
- Agricultural businesses exploring partnerships
- Local farmers seeking training or AI (artificial insemination) services
- NGOs or government bodies in agriculture

**Design implication:** Prioritise clarity over cleverness. Large readable text, obvious buttons, phone number prominently visible, no parallax-heavy tricks, no autoplay audio. The site must feel trustworthy and established — like dealing with a serious business.

---

## 3. BRAND IDENTITY

### 3.1 Color Palette
*(Extracted from logo and refined for web)*

```
--color-forest:    #1E5631   /* Deep forest green — primary brand color */
--color-navy:      #1B2E3C   /* Dark navy/charcoal — headings, nav */
--color-gold:      #9B7E2F   /* Warm gold — accent, highlights, borders */
--color-sage:      #8FB89A   /* Sage green — subtle backgrounds, card borders */
--color-cream:     #F5F2EB   /* Warm cream — page backgrounds, section alternates */
--color-white:     #FFFFFF   /* Pure white — cards, header */
--color-body:      #2C2C2C   /* Near-black — body text */
--color-muted:     #6B7280   /* Medium grey — labels, meta, captions */
--color-divider:   #E4DED3   /* Light warm grey — HR lines, card borders */
```

**Usage rules:**
- Forest green (`#1E5631`): primary CTA buttons, section headlines, logo background
- Navy (`#1B2E3C`): navigation bar, footer background, H1 headings
- Gold (`#9B7E2F`): top border accent on feature cards, icon highlights, hover states on links
- Sage (`#8FB89A`): subtle section background alternates, icon backgrounds
- Cream (`#F5F2EB`): main page body background (not pure white — warmer feel)
- Never use pure black (#000) for text

### 3.2 Typography

**Display / Headings: `Playfair Display`**
- Source: Google Fonts
- Weight: 400 (regular) and 700 (bold)
- Use for: H1, H2, section titles, hero headline
- Why: Carries dignity and tradition — trustworthy for a mature audience

**Body / UI: `Inter`**
- Source: Google Fonts
- Weight: 400, 500, 600
- Use for: Body paragraphs, form labels, card descriptions
- Why: Clean, highly legible at all sizes, universally supported

**Labels / Buttons / Nav: `Montserrat`**
- Source: Google Fonts
- Weight: 500, 600, 700
- Use for: Navigation links, button text, eyebrow labels above headings, stat labels
- Why: Geometric and authoritative — reads well at small sizes

### 3.3 Type Scale

```
h1 (hero):     56px / 3.5rem  Playfair Display 700   line-height: 1.1
h2 (section):  40px / 2.5rem  Playfair Display 700   line-height: 1.2
h3 (card):     24px / 1.5rem  Playfair Display 400   line-height: 1.3
eyebrow:       13px / 0.8rem  Montserrat 600 UPPERCASE letter-spacing: 0.12em
body:          17px / 1.06rem Inter 400                line-height: 1.7
body-sm:       15px / 0.94rem Inter 400                line-height: 1.6
button:        15px / 0.94rem Montserrat 600 UPPERCASE letter-spacing: 0.06em
nav:           14px / 0.875rem Montserrat 600           letter-spacing: 0.04em
label:         13px / 0.8rem  Inter 500 UPPERCASE
caption:       13px / 0.8rem  Inter 400                 color: --color-muted
```

### 3.4 Spacing & Radius

```
--space-section:   96px top/bottom (64px on mobile)
--space-inner:     48px
--space-gap:       24px
--radius-card:     12px
--radius-btn:      6px
--radius-input:    6px
--shadow-card:     0 2px 16px rgba(0,0,0,0.07)
--shadow-elevated: 0 8px 32px rgba(0,0,0,0.12)
```

### 3.5 Signature Design Element
The **gold top-border accent** on cards: every feature/service card has a 3px solid gold line at the top edge (`border-top: 3px solid var(--color-gold)`). This ties back to the gold in the logo's crosshair and creates visual consistency without being heavy-handed.

### 3.6 Voice & Tone

- **Confident, not boastful.** "We raise healthy livestock." Not "We are the BEST farm in Nigeria."
- **Plain and direct.** Older audience appreciates clarity. No jargon.
- **Warm but professional.** This is a family-rooted business that also takes quality seriously.
- **Nigerian context.** Use "₦" for prices where applicable. Reference Kaduna and Northern Nigeria naturally.
- **Active voice.** "We deliver." Not "Delivery is provided by us."

---

## 4. TECH STACK

```
Framework:      Next.js 14 (App Router)
Language:       TypeScript
Styling:        Tailwind CSS v3
Components:     Shadcn/UI (for admin panels and forms)
Database/Auth:  Supabase (PostgreSQL + Row-Level Security + Storage)
Auth:           Supabase Auth (email/password for admin login)
Forms:          React Hook Form + Zod
Email:          Resend (for quotation notifications to admin)
Maps:           Google Maps Embed API (no API key needed for basic embed)
               + Google Maps link for directions
Images:         Next.js Image component + Supabase Storage
Icons:          Lucide React
Fonts:          Google Fonts via next/font
Deploy:         Vercel (recommended) or Netlify
```

### 4.1 Why these choices?
- **Supabase**: Free tier is generous. Easy auth. Storage for farm photos. Real-time if needed later.
- **Next.js App Router**: Server components mean fast page loads even with slower Nigerian connections.
- **Tailwind**: Fast styling, consistent, easy for Cursor to reason about.
- **Shadcn/UI**: Pre-built accessible components speed up admin panel build.

---

## 5. SITE ARCHITECTURE

### 5.1 Public Pages

```
/                     → Home
/about                → About Us
/what-we-do           → Services (Cattle, Poultry, AI Services)
/gallery              → Farm Photo Gallery
/get-a-quote          → Quotation Request Form
/contact              → Contact & Visit (with map)
```

### 5.2 Admin Pages

```
/admin                → Redirect to /admin/dashboard
/admin/login          → Admin login page
/admin/dashboard      → Overview stats (quote count, recent submissions)
/admin/gallery        → Upload / delete / reorder farm photos
/admin/services       → Edit service descriptions
/admin/quotes         → View all quote requests (table + detail view)
/admin/content        → Edit page content (hero text, about text, etc.)
/admin/settings       → Update contact info, farm hours, social links
```

### 5.3 Navigation Structure

**Main Nav (sticky, collapses to hamburger on mobile):**
```
[LOGO]     Home    About Us    What We Do    Our Farm    Get a Quote    [Visit Us Button]
```

The **Visit Us** button is distinct — filled green button in the nav that opens the farm location in Google Maps (new tab). This way it's always one click away.

**Footer:**
```
Column 1: Logo + tagline + social links
Column 2: Quick Links (same as nav)
Column 3: Services list
Column 4: Contact (phone, email, address, hours)
```

---

## 6. PAGE SPECIFICATIONS

### 6.1 HOME PAGE (`/`)

**Section 1 — Hero**
```
Background: Full-width farm photo (use client's best photo here)
Overlay: Dark navy gradient from bottom, 60% opacity
Content:
  - Eyebrow label: "KADUNA, NIGERIA" in gold
  - H1: "Quality Livestock. Built on Trust." (Playfair Display, white, 56px)
  - Subheading: "Axis Agro is Kaduna's mixed livestock and poultry farm, 
    specialising in healthy breeding stock, quality meat production, 
    and artificial insemination services." (Inter, white/90, 18px)
  - CTA Buttons: [Get a Quote →] (forest green) + [View Our Farm] (outlined white)
  - Down-scroll chevron at bottom
Height: 90vh (100vh on large screens)
```

**Section 2 — Trust Bar / Stats**
```
Background: Navy (#1B2E3C)
3–4 columns:
  ├── 5+ Species | Cattle, Goats, Chickens, Turkeys, Ducks
  ├── Modern AI Services | Artificial Insemination
  ├── Kaduna Based | Northern Nigeria
  └── Farmer Training | Practical Support
Style: Dividers between columns, gold number/icon, white label, muted subtext
```

**Section 3 — About Snapshot**
```
Background: Cream
Layout: 50/50 (image left, text right) — reversed on mobile
Image: Farm exterior or animals (client photo)
Text:
  - Eyebrow: "WHO WE ARE"
  - H2: "A Farm Built on Precision and Care"
  - Body: 2-3 sentences from About Us content
  - Link: "Read our full story →" in gold
```

**Section 4 — What We Do (Services Cards)**
```
Background: White
Layout: 3 cards in a row (stack to 1 on mobile)
Each card:
  - Gold top border (3px)
  - Icon (Lucide or custom SVG)
  - H3: Service name
  - Body: 2–3 sentence description
  - "Learn more →" link
Cards:
  1. Cattle & Goats — Beef production, breeding stock, AI services
  2. Poultry — Broilers, layers, turkeys, ducks for meat and eggs  
  3. Farmer Support — Practical training for small and medium-scale farmers
Padding: 32px inside cards
Shadow: --shadow-card
```

**Section 5 — Farm Gallery Strip**
```
Background: Cream
Heading: "See Our Farm" (centered)
Layout: Masonry-style or 2-row horizontal scroll grid, 6 photos
CTA: "View Full Gallery →" button (outlined forest green)
Images: Loaded from Supabase (or static on first build)
```

**Section 6 — Why Axis Agro (Feature List)**
```
Background: Forest green (#1E5631)
Text: White
Layout: Left — large heading. Right — 4 feature points
Feature points (icon + title + 1 sentence):
  ├── Health-First Breeding — Proper nutrition, housing, and vet care
  ├── Modern AI Services — Improving herd genetics for better yields
  ├── Consistent Quality — Strict health records and production standards
  └── Farmer Training — Practical knowledge transfer to local farmers
```

**Section 7 — Quote CTA Banner**
```
Background: Cream with gold accent line top and bottom
Centered content:
  - H2: "Ready to Work With Us?"
  - Body: "Tell us what you need and we'll get back to you with a quote."
  - CTA: [Request a Quote] button — large, forest green
```

**Section 8 — Footer**
See navigation section above.

---

### 6.2 ABOUT PAGE (`/about`)

**Section 1 — Page Hero**
```
Background: Farm photo with dark overlay
H1: "About Axis Agro"
Eyebrow: "OUR STORY"
Subheading: "A livestock and poultry farm built on quality, care, and community."
Height: 50vh
```

**Section 2 — Our Story**
```
Background: White
Layout: Full-width text (max 760px centered)
Content: 3–4 paragraphs telling the Axis Agro story
  Para 1: What the farm is, where it is, what they raise
  Para 2: The focus on breeding stock and quality
  Para 3: AI services and innovation angle
  Para 4: Commitment to training local farmers
```

**Section 3 — Vision & Mission**
```
Background: Cream
Layout: 2 columns side by side
Left Card — Vision:
  - Gold top border
  - Icon: Eye/target
  - Title: "Our Vision"
  - Content: Full vision statement
Right Card — Mission:
  - Gold top border
  - Icon: List/check
  - Title: "Our Mission"
  - 4 numbered mission points as bullet list
```

**Section 4 — Farm Facts / Photo Strip**
```
Background: Navy
2-column: Stats/facts left, stacked farm photos right
Stats:
  - Year established
  - Species raised: 5+
  - Services offered
  - Location: Kaduna State
```

**Section 5 — CTA to What We Do**
```
Background: Cream
Centered: Heading "What We Offer" + brief text + button to /what-we-do
```

---

### 6.3 WHAT WE DO PAGE (`/what-we-do`)

**Section 1 — Page Hero**
```
H1: "What We Do"
Eyebrow: "OUR SERVICES"
Subheading: "From livestock breeding to poultry farming and farmer training."
Height: 45vh
Background: Farm photo with overlay
```

**Section 2 — Cattle & Goats**
```
Background: White
Layout: 50/50 image + text (alternating for each service)
Content:
  - Eyebrow: "CATTLE & GOATS"
  - H2: "Beef Production, Breeding & AI Services"
  - Body: Full description
  - Key points list (bullet):
    • Breeding stock sales
    • Beef production
    • Artificial insemination services
    • Herd improvement consultations
  - CTA: [Request a Quote →]
```

**Section 3 — Poultry**
```
Background: Cream
Layout: Text left, image right
Content:
  - Eyebrow: "POULTRY"
  - H2: "Broilers, Layers, Turkeys & Ducks"
  - Body: Full description
  - Key points list:
    • Broiler chickens for meat
    • Layers for egg production
    • Turkeys for meat and festive season supply
    • Ducks for meat and eggs
  - CTA: [Request a Quote →]
```

**Section 4 — Farmer Support**
```
Background: White
Layout: 50/50 image + text
Content:
  - Eyebrow: "FARMER SUPPORT"
  - H2: "Training & Support for Local Farmers"
  - Body: Description of training services
  - Key points list:
    • Practical livestock management training
    • AI technique training
    • Farm record-keeping guidance
    • Advisory visits
  - CTA: [Get in Touch →]
```

**Section 5 — Quote CTA**
```
Same as home page quote CTA banner
```

---

### 6.4 GALLERY PAGE (`/gallery`)

**Section 1 — Page Hero (short)**
```
H1: "Our Farm"
Eyebrow: "GALLERY"
Height: 35vh
Background: Farm photo
```

**Section 2 — Gallery Grid**
```
Background: Cream
Filter tabs: All | Cattle & Goats | Poultry | Farm Facilities
Grid: Masonry or uniform 3-column grid (2 on tablet, 1 on mobile)
Each image: hover shows caption overlay
Images loaded from Supabase storage via API
```

---

### 6.5 GET A QUOTE PAGE (`/get-a-quote`)

**Section 1 — Short Hero**
```
H1: "Request a Quote"
Subheading: "Fill in the form and we'll get back to you within 24 hours."
Background: Cream (no photo hero — clean form focus)
```

**Section 2 — Quote Form**
```
Background: White, max-width 680px, centered, card with shadow

Form Fields:
  ├── Full Name *           [text input]
  ├── Phone Number *        [tel input — most important contact method]
  ├── Email Address         [email input — optional]
  ├── Service Interested In * [select dropdown]:
  │     Options: Cattle Purchase | Goat Purchase | Broiler Chickens | 
  │              Layers | Turkeys | Ducks | AI Services | Farmer Training | Other
  ├── Quantity / Scale      [text — e.g. "50 broilers", "2 breeding bulls"]
  ├── Your Message / Details [textarea, 4 rows]
  └── [Submit Quote Request] button — full width, forest green

On Submit:
  - Store in Supabase `quote_requests` table
  - Send email to admin via Resend
  - Show success message: "Thank you! We'll contact you within 24 hours."
  - Form resets

Validation (Zod):
  - Name: required, min 2 chars
  - Phone: required, Nigerian format validation
  - Email: valid email if provided
  - Service: required
  - Message: min 10 chars
```

**Section 3 — Side Info (on desktop: 2-column layout)**
```
Right column (or below form on mobile):
  - Card: "Prefer to call?" → phone number, large and clickable
  - Card: "Email us directly" → email link
  - Card: "Visit the farm" → address + small map embed + button
```

---

### 6.6 CONTACT & VISIT PAGE (`/contact`)

**Section 1 — Short Hero**
```
H1: "Contact & Visit"
Subheading: "We're based in Kaduna. Come see us — or reach out any way that suits you."
Background: Cream
```

**Section 2 — Contact Info + Map**
```
Layout: 40% contact info | 60% embedded Google Map
Contact Info Cards:
  ├── 📍 Address: [Farm address, Kaduna]
  ├── 📞 Phone: [Client phone] — large, tappable link
  ├── ✉️ Email: [Client email]
  └── 🕐 Hours: Mon–Sat, 7:00am – 6:00pm

Google Maps:
  - Embed iframe with farm coordinates
  - "Get Directions" button: links to
    https://maps.google.com?q=[FARM_LAT],[FARM_LNG]
    Opens in new tab
```

**Section 3 — Social / WhatsApp**
```
If client has WhatsApp business:
  "Message us on WhatsApp" button with WhatsApp green color
  Link: https://wa.me/[PHONE]
```

---

## 7. CMS / ADMIN PANEL SPECIFICATIONS

### 7.1 Admin Architecture

The admin panel lives at `/admin/*` routes. Protected by Supabase Auth middleware.

**Admin login flow:**
```
1. Visit /admin → middleware checks for session
2. No session → redirect to /admin/login
3. /admin/login → email + password form
4. Successful login → redirect to /admin/dashboard
5. Logout button → clear session → redirect to /admin/login
```

**Only ONE admin account** (the farm owner or their designate). Supabase Auth handles this — admin email/password set during setup via Supabase dashboard, not a sign-up form.

### 7.2 Admin Dashboard (`/admin/dashboard`)

```
Stats cards at top:
  ├── Total Quote Requests (count)
  ├── New Quotes (unread/pending)
  ├── Gallery Images (count)
  └── Last login time

Recent Quotes table (5 most recent):
  ├── Name | Service | Date | Status
  └── "View All" link

Quick action buttons:
  ├── [Upload Photos]
  ├── [View New Quotes]
  └── [Edit Site Content]
```

### 7.3 Gallery Manager (`/admin/gallery`)

```
Features:
  ├── Upload new photos (drag-drop or file picker)
  │     ├── Upload to Supabase Storage
  │     ├── Save to gallery_images table (url, caption, category)
  │     └── Show progress indicator
  ├── View all images in grid
  ├── Edit caption and category per image
  ├── Delete image (removes from storage and DB)
  └── Set featured/hero image flag

Categories available:
  Cattle & Goats | Poultry | Farm Facilities | General
```

### 7.4 Services Manager (`/admin/services`)

```
For each service (Cattle, Poultry, Farmer Support):
  ├── Edit title
  ├── Edit description (rich text or textarea)
  ├── Edit key points (list of bullet points)
  └── Toggle visibility (show/hide)
Save button updates Supabase services table.
```

### 7.5 Quote Requests Manager (`/admin/quotes`)

```
Table view:
  ├── Columns: Name | Phone | Email | Service | Date | Status | Actions
  ├── Status options: New | In Progress | Responded | Closed
  ├── Click row → expand detail view
  ├── "Mark as Responded" button per row
  ├── Export to CSV button
  └── Filter by status / service

Detail view:
  ├── Full message
  ├── All contact details
  ├── Quick action: "Call" (tel link) | "Email" (mailto)
  └── Internal note field (text area, saves to DB, not visible to public)
```

### 7.6 Site Content Editor (`/admin/content`)

```
Sections editable:
  ├── Home hero: Headline, subheading
  ├── About us: Story paragraphs
  ├── Vision statement
  ├── Mission points (add/edit/remove)
  └── Footer tagline
Each field: simple textarea, save button → updates site_content table
```

### 7.7 Settings (`/admin/settings`)

```
Editable fields:
  ├── Farm name
  ├── Phone number
  ├── Email address
  ├── WhatsApp number
  ├── Physical address
  ├── Farm hours
  ├── Facebook URL
  ├── Instagram URL
  ├── Google Maps latitude/longitude
  └── Admin email (for quote notifications)
```

---

## 8. DATABASE SCHEMA (Supabase)

```sql
-- Gallery images
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'General',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  key_points JSONB DEFAULT '[]',
  icon_name TEXT,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote requests
CREATE TABLE quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_type TEXT NOT NULL,
  quantity TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site content (key-value)
CREATE TABLE site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (key-value)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Row Level Security (RLS):**
- `gallery_images`: Public SELECT, authenticated users can INSERT/UPDATE/DELETE
- `services`: Public SELECT, authenticated INSERT/UPDATE
- `quote_requests`: Public INSERT, authenticated SELECT/UPDATE
- `site_content`: Public SELECT, authenticated INSERT/UPDATE
- `site_settings`: Public SELECT, authenticated INSERT/UPDATE

---

## 9. ENVIRONMENT VARIABLES NEEDED

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=farm_owner@email.com

# Optional: Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
NEXT_PUBLIC_FARM_LAT=10.5000
NEXT_PUBLIC_FARM_LNG=7.4333
```

---

## 10. FOLDER STRUCTURE

```
axis-agro/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  ← Home
│   │   ├── about/page.tsx
│   │   ├── what-we-do/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── get-a-quote/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── services/page.tsx
│   │   ├── quotes/page.tsx
│   │   ├── content/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── quotes/route.ts           ← POST: save quote + send email
│   │   └── admin/
│   │       ├── gallery/route.ts
│   │       └── quotes/route.ts
│   ├── layout.tsx                    ← Root layout with fonts
│   └── globals.css                   ← Tailwind + CSS variables
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   ├── AboutSnapshot.tsx
│   │   ├── ServicesCards.tsx
│   │   ├── GalleryStrip.tsx
│   │   ├── WhyAxisAgro.tsx
│   │   └── QuoteCTA.tsx
│   ├── pages/
│   │   ├── PageHero.tsx
│   │   └── ServiceBlock.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── SectionHeader.tsx
│   │   └── Eyebrow.tsx
│   ├── forms/
│   │   └── QuoteForm.tsx
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── AdminNav.tsx
│       ├── QuotesTable.tsx
│       ├── GalleryManager.tsx
│       └── ContentEditor.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 ← Browser client
│   │   ├── server.ts                 ← Server client
│   │   └── middleware.ts             ← Auth middleware
│   ├── validations/
│   │   └── quote.ts                  ← Zod schemas
│   └── utils.ts
├── types/
│   └── index.ts
├── public/
│   ├── images/
│   │   └── placeholder.jpg
│   └── logo.png
├── middleware.ts                     ← Protect /admin/* routes
├── tailwind.config.ts
├── next.config.ts
└── .env.local
```

---

## 11. COPY / CONTENT READY TO USE

### Home Hero
> **"Quality Livestock. Built on Trust."**
> Axis Agro is Kaduna's mixed livestock and poultry farm — specialising in healthy breeding stock, quality meat production, and artificial insemination services for Northern Nigeria's farming community.

### About Snapshot
> We raise cattle, goats, chickens, turkeys, and ducks with a clear focus on health, proper nutrition, and modern breeding techniques. Our artificial insemination services help local herds perform better and produce more — and our training programmes pass that knowledge on.

### Why Axis Agro Section
> **"More Than Just a Farm."**
> We are a full livestock operation built around one principle: healthy animals produce better results. From breeding and feeding to record-keeping and training, every part of what we do is designed to deliver consistent quality — for our customers and the farmers we support.

### Quote Form Success Message
> **"Thank you for reaching out."**
> We've received your request and will contact you within 24 hours. If it's urgent, call us directly at [PHONE NUMBER].

---

## 12. SEO BASICS

Each page should have:
```typescript
// In each page.tsx
export const metadata = {
  title: "Page Name | Axis Agro — Kaduna Livestock Farm",
  description: "Page-specific description...",
  openGraph: {
    title: "...",
    description: "...",
    images: ["/og-image.jpg"]
  }
}
```

Key SEO targets:
- "livestock farm Kaduna"
- "poultry farm Northern Nigeria"
- "artificial insemination cattle Kaduna"
- "broiler chickens Kaduna"
- "buy breeding stock Kaduna"

---

## 13. MOBILE CONSIDERATIONS

- Nav: Hamburger menu on mobile, slides in from right
- Hero: Reduced height on mobile (65vh), font scales down
- Service cards: Stack to single column
- Form: Full-width inputs
- Map: Full-width on mobile
- Footer: Stack to single column
- Phone number: Large, `href="tel:..."` clickable

---
*End of Site Brief. Reference alongside the Phase Prompts document when building.*
