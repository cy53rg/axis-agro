# AXIS AGRO — CURSOR BUILD PROMPTS
*Use these prompts in Cursor in order. Complete each phase fully before moving to the next. Always have the Site Brief (Document 1) open as a reference.*

---

## HOW TO USE THIS DOCUMENT

1. Open Cursor in your project folder
2. Use **Ctrl/Cmd + K** (inline) or **Ctrl/Cmd + L** (chat panel) for each phase
3. Paste the prompt exactly as written
4. Review what Cursor generates before running the next phase
5. If something looks wrong, correct it before continuing — later phases build on earlier ones

---

## PHASE 0 — PROJECT SETUP

### Prompt 0.1 — Initialize Next.js Project
*Run this in your terminal BEFORE opening Cursor:*

```bash
npx create-next-app@latest axis-agro \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd axis-agro
```

### Prompt 0.2 — Install All Dependencies
*Paste into Cursor terminal:*

```bash
# UI Components
npx shadcn@latest init
npx shadcn@latest add button input textarea select label card table badge dialog dropdown-menu toast form

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Forms and validation
npm install react-hook-form zod @hookform/resolvers

# Email
npm install resend

# Icons
npm install lucide-react

# Image uploads
npm install react-dropzone

# Utilities
npm install clsx tailwind-merge date-fns
```

### Prompt 0.3 — Create Environment File
*In Cursor, create `.env.local`:*

```
Create a .env.local file in the root with these placeholder variables:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@axisagro.ng

NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=your_maps_key
NEXT_PUBLIC_FARM_LAT=10.5271
NEXT_PUBLIC_FARM_LNG=7.4397
NEXT_PUBLIC_FARM_ADDRESS=Kaduna, Kaduna State, Nigeria

Also add a .env.local entry to .gitignore if not already there.
```

---

## PHASE 1 — DESIGN SYSTEM & GLOBAL STYLES

### Prompt 1.1 — Tailwind Config & CSS Variables

```
Update tailwind.config.ts and app/globals.css for the Axis Agro farm website.

TAILWIND CONFIG:
- Add custom colors to the theme extending the default:
  forest: '#1E5631'
  navy: '#1B2E3C'
  gold: '#9B7E2F'
  sage: '#8FB89A'
  cream: '#F5F2EB'
  divider: '#E4DED3'
  body-text: '#2C2C2C'
  muted: '#6B7280'
- Add custom font families:
  display: ['Playfair Display', 'Georgia', 'serif']
  sans: ['Inter', 'system-ui', 'sans-serif']
  label: ['Montserrat', 'Arial', 'sans-serif']
- Add a custom borderRadius:
  card: '12px'
  btn: '6px'

GLOBALS.CSS:
- Import from Google Fonts: Playfair Display (400, 700), Inter (400, 500, 600), Montserrat (500, 600, 700) using @import or next/font
- Set CSS custom properties on :root matching the color palette above
- Set body background to cream (#F5F2EB), text to #2C2C2C
- Set base font to Inter
- Add a .section-padding class: padding-top: 96px, padding-bottom: 96px (64px on mobile via media query)
- Add smooth scroll: html { scroll-behavior: smooth }
- Add a .gold-border-top class: border-top: 3px solid #9B7E2F
- Add a .eyebrow class: font-family Montserrat, font-size 13px, font-weight 600, text-transform uppercase, letter-spacing 0.12em, color #9B7E2F
```

### Prompt 1.2 — Types File

```
Create types/index.ts with TypeScript interfaces for the Axis Agro site:

- GalleryImage: id, url, storage_path, caption, category, is_featured, display_order, created_at
- Service: id, slug, title, description, key_points (string array), icon_name, is_visible, display_order
- QuoteRequest: id, name, phone, email, service_type, quantity, message, status, admin_notes, created_at
- SiteContent: key, value
- SiteSetting: key, value
- ServiceType enum/union type with these values: 'Cattle Purchase' | 'Goat Purchase' | 'Broiler Chickens' | 'Layers' | 'Turkeys' | 'Ducks' | 'AI Services' | 'Farmer Training' | 'Other'
- QuoteStatus: 'new' | 'in_progress' | 'responded' | 'closed'
- GalleryCategory: 'Cattle & Goats' | 'Poultry' | 'Farm Facilities' | 'General'
```

### Prompt 1.3 — Utility Functions

```
Create lib/utils.ts with utility functions:

1. cn() - merge class names using clsx and tailwind-merge (standard shadcn pattern)
2. formatDate(dateString: string): string - formats date to "12 July 2024" style (use date-fns)
3. formatPhone(phone: string): string - returns a displayable Nigerian phone number
4. getStatusColor(status: QuoteStatus): string - returns a CSS class string for badge colors:
   - 'new' → 'bg-blue-100 text-blue-800'
   - 'in_progress' → 'bg-yellow-100 text-yellow-800'
   - 'responded' → 'bg-green-100 text-green-800'
   - 'closed' → 'bg-gray-100 text-gray-800'
5. getStatusLabel(status: QuoteStatus): string - returns human-readable label
```

---

## PHASE 2 — SUPABASE SETUP

### Prompt 2.1 — Supabase Client Files

```
Create the Supabase client setup for a Next.js 14 App Router project.

1. Create lib/supabase/client.ts:
   - Browser-side Supabase client using createBrowserClient from @supabase/ssr
   - Export as createClient function

2. Create lib/supabase/server.ts:
   - Server-side Supabase client using createServerClient from @supabase/ssr
   - Reads from cookies (Next.js App Router pattern)
   - Export as createClient async function

3. Create middleware.ts in the project root:
   - Use @supabase/ssr to create a middleware client
   - Protect all routes starting with /admin EXCEPT /admin/login
   - If user is not authenticated and tries to access /admin/*, redirect to /admin/login
   - If user IS authenticated and visits /admin/login, redirect to /admin/dashboard
   - Allow all other routes through
   - Use the standard Next.js 14 middleware pattern with NextRequest/NextResponse

Use env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Prompt 2.2 — Database Schema SQL

```
Create a file called supabase/schema.sql with the complete database setup for Axis Agro:

Tables needed:
1. gallery_images (id UUID pk, url TEXT not null, storage_path TEXT not null, caption TEXT, category TEXT default 'General', is_featured BOOLEAN default false, display_order INTEGER default 0, created_at TIMESTAMPTZ default now())

2. services (id UUID pk, slug TEXT unique not null, title TEXT not null, description TEXT, key_points JSONB default '[]', icon_name TEXT, is_visible BOOLEAN default true, display_order INTEGER default 0, updated_at TIMESTAMPTZ default now())

3. quote_requests (id UUID pk, name TEXT not null, phone TEXT not null, email TEXT, service_type TEXT not null, quantity TEXT, message TEXT, status TEXT default 'new', admin_notes TEXT, created_at TIMESTAMPTZ default now(), updated_at TIMESTAMPTZ default now())

4. site_content (key TEXT primary key, value TEXT not null, updated_at TIMESTAMPTZ default now())

5. site_settings (key TEXT primary key, value TEXT not null, updated_at TIMESTAMPTZ default now())

Then add Row Level Security policies:
- gallery_images: anyone can SELECT, only authenticated users can INSERT/UPDATE/DELETE
- services: anyone can SELECT, only authenticated users can INSERT/UPDATE
- quote_requests: anyone can INSERT, only authenticated users can SELECT/UPDATE
- site_content: anyone can SELECT, only authenticated users can INSERT/UPDATE
- site_settings: anyone can SELECT, only authenticated users can INSERT/UPDATE

Also add seed data:
- Insert 3 services: cattle-goats, poultry, farmer-support with their descriptions from the Axis Agro brief
- Insert default site_settings: phone, email, address, whatsapp, farm_hours, facebook_url, instagram_url
- Insert default site_content entries: home_hero_headline, home_hero_subheading, about_story, footer_tagline

Add this note at the top: "-- Run this in your Supabase SQL editor to set up the database"
```

### Prompt 2.3 — Data Fetching Functions

```
Create lib/supabase/queries.ts with server-side data fetching functions for Next.js Server Components:

1. getGalleryImages(category?: string): Promise<GalleryImage[]>
   - Fetch from gallery_images table, ordered by display_order
   - Filter by category if provided

2. getFeaturedGalleryImages(limit?: number): Promise<GalleryImage[]>
   - Fetch images where is_featured = true, limit to 6 by default

3. getServices(): Promise<Service[]>
   - Fetch from services table where is_visible = true, ordered by display_order

4. getSiteContent(): Promise<Record<string, string>>
   - Fetch all from site_content table
   - Return as a key-value object

5. getSiteSettings(): Promise<Record<string, string>>
   - Fetch all from site_settings
   - Return as key-value object

Each function should use the server Supabase client and handle errors gracefully (return empty array/object on error, log error to console).
Import types from @/types
```

---

## PHASE 3 — LAYOUT COMPONENTS

### Prompt 3.1 — Root Layout

```
Update app/layout.tsx for Axis Agro:

1. Import Playfair Display, Inter, and Montserrat from next/font/google:
   - Playfair Display: subsets ['latin'], weights ['400', '700'], variable '--font-display'
   - Inter: subsets ['latin'], weights ['400', '500', '600'], variable '--font-sans'
   - Montserrat: subsets ['latin'], weights ['500', '600', '700'], variable '--font-label'

2. Apply all font variables to the html element's className

3. Set metadata:
   - title template: '%s | Axis Agro — Kaduna Livestock Farm'
   - default title: 'Axis Agro | Quality Livestock Farm in Kaduna, Nigeria'
   - description: 'Axis Agro is a mixed livestock and poultry farm in Kaduna, Nigeria. We raise cattle, goats, chickens, turkeys, and ducks, and offer artificial insemination services.'
   - keywords: 'livestock farm Kaduna, poultry farm Nigeria, artificial insemination cattle, breeding stock Kaduna'

4. Set <html lang="en"> 

5. Wrap children in a simple div (not the Header/Footer — those go in a separate layout for public pages)

Make sure globals.css is imported here.
```

### Prompt 3.2 — Public Route Group Layout

```
Create app/(public)/layout.tsx:

This layout wraps all public-facing pages (home, about, what-we-do, gallery, get-a-quote, contact).

Import and render:
1. <Header /> component (to be created next)
2. <main className="min-h-screen">{children}</main>
3. <Footer /> component

Also create the (public) route group folder: app/(public)/
Move (or note to move) the home page to app/(public)/page.tsx
```

### Prompt 3.3 — Header Component

```
Create components/layout/Header.tsx as a sticky navigation header for Axis Agro.

DESIGN:
- Background: white (#FFFFFF), with a subtle bottom border (1px solid #E4DED3) when scrolled
- Logo: Left side — display the Axis Agro logo image (img tag, src="/logo.png", height 48px) with fallback text "Axis Agro"
- Nav links (desktop): Home | About Us | What We Do | Our Farm | Get a Quote
  All in Montserrat 600, 14px, color navy (#1B2E3C), hover color forest green (#1E5631)
  Active link: forest green with a 2px bottom border
- "Visit Us" button: RIGHT side, filled button, background forest green (#1E5631), text white, Montserrat 600, 14px, border-radius 6px, padding 10px 20px
  On click: opens https://maps.google.com?q=${FARM_LAT},${FARM_LNG} in a new tab
  Use env var NEXT_PUBLIC_FARM_LAT and NEXT_PUBLIC_FARM_LNG
- Mobile: Show hamburger icon (Lucide Menu), hide nav links
  On hamburger click: show a full-width slide-down or overlay mobile menu with all nav links stacked, "Visit Us" button at bottom

BEHAVIOR:
- Sticky: position sticky top-0 z-50
- Add scroll shadow: when window.scrollY > 10, add box-shadow
- Mark active link based on current pathname (use usePathname from next/navigation)
- The component is a Client Component ('use client') for scroll detection and mobile menu

STRUCTURE:
<header> 
  <nav> [Logo] [Nav Links - desktop] [Visit Us Button] [Hamburger - mobile] </nav>
</header>
<MobileNav /> (conditional)

Create components/layout/MobileNav.tsx separately as a slide-in overlay drawer.
```

### Prompt 3.4 — Footer Component

```
Create components/layout/Footer.tsx for Axis Agro.

DESIGN:
- Background: navy (#1B2E3C)
- Text: white and muted (#9CA3AF for secondary text)
- Layout: 4 columns on desktop, 2 on tablet, 1 on mobile
- Border top: 3px solid gold (#9B7E2F)

COLUMNS:
1. Brand Column:
   - Logo (white version or text "Axis Agro" in Playfair Display, white, 24px)
   - Tagline: "Healthy Livestock, Consistent Quality." in Inter 400, muted, 14px
   - Social links: Facebook, Instagram icons (Lucide) in a row, white, hover gold

2. Quick Links:
   - Eyebrow: "NAVIGATE" (Montserrat 600, gold, uppercase, 12px)
   - List: Home, About Us, What We Do, Our Farm, Get a Quote, Contact
   - Links: Inter 400, 14px, white/80, hover white

3. Our Services:
   - Eyebrow: "WHAT WE DO"
   - List: Cattle & Goats, Poultry Farming, Broiler Chickens, Layers, Turkeys & Ducks, AI Services, Farmer Training
   - Text only (not links), Inter 400, 14px, white/60

4. Contact:
   - Eyebrow: "GET IN TOUCH"
   - Address: 📍 Kaduna State, Nigeria (use actual address from settings)
   - Phone: 📞 [phone number] — make it a clickable tel: link
   - Email: ✉️ [email] — mailto: link
   - Hours: 🕐 Mon – Sat, 7:00am – 6:00pm

BOTTOM BAR:
- Full-width divider
- Left: © 2025 Axis Agro. All rights reserved.
- Right: "Built for Nigerian Agriculture"
- Both in Inter 400, 13px, white/40

Use static data from constants for now (can be made dynamic later). Export as default.
```

### Prompt 3.5 — Reusable UI Components

```
Create these shared UI components in components/ui/:

1. components/ui/SectionHeader.tsx
   Props: eyebrow (string), title (string), subtitle? (string), centered? (boolean, default false), lightMode? (boolean — for dark backgrounds)
   Structure:
   - Eyebrow: Montserrat 600, 13px, uppercase, letter-spacing 0.12em, gold (#9B7E2F), margin-bottom 12px
   - Title: Playfair Display 700, 40px on desktop / 32px on mobile, navy (#1B2E3C), line-height 1.2
     If lightMode=true: white
   - Subtitle: Inter 400, 17px, muted (#6B7280), max-width 600px, margin-top 16px
     If lightMode=true: white/80
   - If centered: text-align center, subtitle also centered

2. components/ui/GoldBorderCard.tsx
   Props: children, className?
   A div with:
   - border-top: 3px solid #9B7E2F
   - background: white
   - border-radius: 12px
   - box-shadow: 0 2px 16px rgba(0,0,0,0.07)
   - padding: 32px
   - transition on hover: slight shadow increase

3. components/ui/Button.tsx (if not using shadcn for public-facing buttons)
   Variants: 'primary' (forest green bg, white text), 'outline' (transparent bg, forest green border + text), 'ghost' (no bg, navy text)
   Sizes: 'sm', 'md' (default), 'lg'
   Props: variant, size, children, className, href? (renders as <Link> if href provided, else <button>), onClick?

4. components/ui/Eyebrow.tsx
   Simple span: Montserrat 600, 13px, uppercase, letter-spacing 0.12em
   Props: children, color? ('gold' default | 'white' | 'sage')
```

---

## PHASE 4 — HOME PAGE

### Prompt 4.1 — Hero Section

```
Create components/home/HeroSection.tsx for the Axis Agro home page hero.

DESIGN SPEC:
- Height: 90vh on desktop, 75vh on mobile
- Background: full-bleed image (use Next.js Image with fill + object-cover)
  Image src: props.imageUrl or fallback to '/images/hero-farm.jpg'
- Overlay: CSS gradient — linear-gradient(to top, rgba(27,46,60,0.85) 0%, rgba(27,46,60,0.4) 60%, transparent 100%)
  This makes the bottom dark (where text is) and top lighter
- Content: positioned at bottom-left, padding 80px bottom, 80px left (40px on mobile)

CONTENT:
- Eyebrow: "KADUNA, NIGERIA" in Montserrat 600, 13px, gold, uppercase, letter-spacing 0.12em
- H1: "Quality Livestock. Built on Trust." 
  Playfair Display 700, 60px desktop / 38px mobile, white, line-height 1.1
  Max-width: 700px
- Subheading: "Axis Agro is Kaduna's mixed livestock and poultry farm — specialising in healthy breeding stock, quality meat production, and artificial insemination services."
  Inter 400, 18px desktop / 15px mobile, rgba(255,255,255,0.85), max-width 580px, margin-top 20px, line-height 1.6
- Button Row (margin-top 36px, gap 16px):
  - [Get a Quote →] — primary button, forest green bg, white text, large
  - [View Our Farm] — outline button, white border, white text, large
    Links to /gallery

SCROLL INDICATOR:
- Position: absolute, bottom 32px, left 50%, transform translateX(-50%)
- Animated ChevronDown icon from Lucide, white, 32px, with CSS animation bouncing up/down

This is a Client Component. Accept props: imageUrl?: string
```

### Prompt 4.2 — Stats Bar

```
Create components/home/StatsBar.tsx.

DESIGN:
- Background: navy (#1B2E3C)
- Full width
- Padding: 48px 0

CONTENT — 4 stat items in a row (2 on mobile), separated by vertical dividers:
1. Icon: CheckCircle (Lucide), gold | Label: "5 Species Raised" | Sub: "Cattle, Goats, Chickens, Turkeys, Ducks"
2. Icon: Dna (Lucide), gold | Label: "AI Services" | Sub: "Artificial Insemination Available"
3. Icon: MapPin (Lucide), gold | Label: "Kaduna Based" | Sub: "Serving Northern Nigeria"
4. Icon: GraduationCap (Lucide), gold | Label: "Farmer Training" | Sub: "Practical Knowledge Transfer"

Each item:
- Icon: 28px, gold (#9B7E2F)
- Label: Montserrat 600, 16px, white
- Sub: Inter 400, 13px, white/60
- Text and icon centered or left-aligned with icon left, text right

Dividers between items: 1px solid rgba(255,255,255,0.15), hidden on mobile

Use a max-width container (1200px centered) inside.
```

### Prompt 4.3 — About Snapshot

```
Create components/home/AboutSnapshot.tsx.

DESIGN:
- Background: cream (#F5F2EB)
- Section padding: 96px top and bottom
- Layout: 2-column CSS grid, 50% / 50%, gap 80px — reversed on mobile (image first)

LEFT — Image:
- Container: aspect-ratio 4/3, border-radius 12px, overflow hidden
- Use Next.js Image with object-cover fill
- Image src: props.imageUrl (or placeholder)
- Slight box shadow: 0 8px 32px rgba(0,0,0,0.12)

RIGHT — Text:
- SectionHeader with eyebrow "WHO WE ARE", title "A Farm Built on Precision and Care"
- Body paragraph (Inter 400, 17px, body-text, line-height 1.7, margin-top 24px):
  "We raise cattle, goats, chickens, turkeys, and ducks with a focus on health, proper nutrition, and modern breeding techniques. Our artificial insemination services help local herds perform better, and our training programmes pass that knowledge on to farmers across Kaduna State."
- "Read our full story →" link: Montserrat 600, 15px, forest green, with right arrow icon, margin-top 32px, hover underline

Wrap everything in a max-width 1200px container, centered with auto margins.
```

### Prompt 4.4 — Services Cards Section

```
Create components/home/ServicesCards.tsx.

DESIGN:
- Background: white (#FFFFFF)
- Section padding: 96px top and bottom

HEADER (centered):
- SectionHeader: eyebrow "WHAT WE DO", title "Our Core Services", centered=true

CARDS (margin-top 64px):
- 3-column CSS grid on desktop, 1 column on mobile, gap 32px

Each card uses GoldBorderCard component. Card structure:
1. Cattle & Goats:
   - Icon: cow/beef icon (use Lucide 'Beef' or 'Star' if unavailable), 36px, forest green
   - H3: "Cattle & Goats" — Playfair Display 400, 24px, navy
   - Body: "We breed and supply high-quality cattle and goats for beef production and breeding purposes. Our AI services improve herd genetics for better productivity." — Inter 400, 15px, muted
   - "Learn more →" link: Montserrat 600, 13px, forest green, href="/what-we-do"

2. Poultry:
   - Icon: Bird icon (Lucide), 36px, forest green
   - H3: "Poultry Farming"
   - Body: "Broilers, layers, turkeys, and ducks — raised for quality meat and eggs. We supply individuals, restaurants, and commercial buyers with fresh poultry produce."
   - "Learn more →" link

3. Farmer Support:
   - Icon: GraduationCap (Lucide), 36px, forest green
   - H3: "Farmer Training & Support"
   - Body: "We train small and medium-scale farmers in practical livestock management, AI techniques, and farm record-keeping to improve their operations."
   - "Learn more →" link

All cards same height (use flexbox column with "Learn more" pushed to bottom with margin-top: auto).
```

### Prompt 4.5 — Gallery Strip

```
Create components/home/GalleryStrip.tsx.

PROPS: images: GalleryImage[] (up to 6)

DESIGN:
- Background: cream (#F5F2EB)
- Section padding: 96px top and bottom

HEADER (centered):
- SectionHeader: eyebrow "OUR FARM", title "See What We Do", centered=true

GRID (margin-top 48px):
- CSS grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- Gap: 16px
- Show maximum 6 images

Each image item:
- Container: aspect-ratio 4/3, border-radius 12px, overflow hidden, cursor pointer
- Next.js Image with object-cover fill
- On hover: overlay appears with caption text (if caption exists), dark semi-transparent bg

CTA below grid (margin-top 48px, centered):
- Button variant="outline" (forest green outlined), text "View Full Gallery", href="/gallery", size="lg"

If no images passed (empty state):
- Show a placeholder grid with 6 grey boxes and "Photos coming soon" text
```

### Prompt 4.6 — Why Axis Agro Section

```
Create components/home/WhyAxisAgro.tsx.

DESIGN:
- Background: forest green (#1E5631)
- Section padding: 96px top and bottom
- Max-width container: 1200px centered

LAYOUT: 2 columns, 40% / 60% split

LEFT COLUMN:
- SectionHeader with lightMode=true:
  eyebrow: "WHY CHOOSE US"
  title: "More Than Just a Farm."
- Body paragraph (white/80, Inter 400, 17px, margin-top 24px):
  "We are a full livestock operation built around one principle: healthy animals produce better results. From breeding and feeding to record-keeping and training, every part of what we do is designed to deliver consistent quality."
- CTA Button (margin-top 40px): white background, navy text, "Request a Quote", href="/get-a-quote"

RIGHT COLUMN:
- 4 feature items stacked, each item:
  - Icon: small circle with sage (#8FB89A) background, 40px, white icon inside
  - Title: Montserrat 600, 16px, white
  - Body: Inter 400, 14px, white/70, line-height 1.6

Feature items:
1. Icon: Heart (Lucide) | Title: "Health-First Breeding" | Body: "Proper nutrition, housing, and veterinary care for all our animals."
2. Icon: Dna (Lucide) | Title: "Modern AI Services" | Body: "Improving herd genetics through professional artificial insemination."
3. Icon: ClipboardCheck (Lucide) | Title: "Consistent Quality" | Body: "Strict health records and production standards across all species."
4. Icon: Users (Lucide) | Title: "Farmer Training" | Body: "Practical knowledge transfer to farmers across Kaduna and beyond."

Items spaced 32px apart, with a subtle white/10 divider line between them.
```

### Prompt 4.7 — Quote CTA Banner

```
Create components/home/QuoteCTA.tsx.

DESIGN:
- Background: cream (#F5F2EB)
- Border-top: 3px solid gold (#9B7E2F)
- Border-bottom: 3px solid gold (#9B7E2F)
- Section padding: 80px top and bottom
- Content centered
- Max-width: 700px

CONTENT:
- H2: "Ready to Work With Us?" — Playfair Display 700, 40px, navy
- Body: "Tell us what you need and we'll get back to you with a quote within 24 hours." — Inter 400, 17px, muted, margin-top 16px
- CTA Button (margin-top 40px): primary, large, "Request a Quote →", href="/get-a-quote"

No icon needed — let the copy do the work.
```

### Prompt 4.8 — Home Page Assembly

```
Create app/(public)/page.tsx as the Axis Agro home page.

This is a Server Component. It should:

1. Import all home section components:
   HeroSection, StatsBar, AboutSnapshot, ServicesCards, GalleryStrip, WhyAxisAgro, QuoteCTA

2. Fetch data from Supabase:
   - Featured gallery images using getFeaturedGalleryImages(6) from lib/supabase/queries

3. Set page metadata:
   title: 'Axis Agro | Quality Livestock Farm in Kaduna, Nigeria'
   description: 'Mixed livestock and poultry farm in Kaduna, Nigeria. Cattle, goats, chickens, turkeys, ducks and AI services.'

4. Render all sections in order:
   <HeroSection imageUrl="/images/hero-farm.jpg" />
   <StatsBar />
   <AboutSnapshot imageUrl="/images/about-farm.jpg" />
   <ServicesCards />
   <GalleryStrip images={featuredImages} />
   <WhyAxisAgro />
   <QuoteCTA />

Add a TODO comment noting that the hero imageUrl and about imageUrl should be replaced with actual client photos.
```

---

## PHASE 5 — ABOUT PAGE

### Prompt 5.1 — About Page

```
Create app/(public)/about/page.tsx for the Axis Agro About Us page.

This is a Server Component. Build the complete page:

SECTION 1 — Page Hero (components/pages/PageHero.tsx if not created yet):
Create components/pages/PageHero.tsx first:
Props: eyebrow, title, subtitle, imageUrl, height? ('tall'=55vh | 'medium'=45vh | 'short'=35vh, default medium)
Design: Full-width image with dark overlay, content positioned center-left at 50% height
- eyebrow in gold, H1 in white Playfair Display, subtitle in white/80 Inter

Use: eyebrow="OUR STORY", title="About Axis Agro", subtitle="A livestock and poultry farm built on quality, care, and community.", height="medium"

SECTION 2 — Our Story:
Background: white
Max-width: 760px, centered, padding: 96px 24px

SectionHeader: eyebrow "OUR STORY", title "Who We Are"

Paragraphs (Inter 400, 17px, body-text, line-height 1.7, gap 24px between paras):
Para 1: "Axis Agro is a mixed livestock and poultry farm based in Kaduna, Nigeria. We raise cattle, goats, ducks, chickens, and turkeys with a clear focus on producing healthy, high-performing animals for meat and dairy, while maintaining a strong breeding stock programme."
Para 2: "Our approach combines good nutrition, proper housing, and modern breeding techniques — including artificial insemination — to ensure our animals are not just healthy but productive. We believe the quality of an animal starts long before it reaches the market."
Para 3: "Beyond our own production, we actively support local farmers through practical training in livestock management, AI techniques, and farm record-keeping. Kaduna's agricultural community grows stronger when knowledge is shared."

SECTION 3 — Vision & Mission:
Background: cream
Section padding: 96px
Header: SectionHeader eyebrow="OUR DIRECTION" title="Vision & Mission" centered=true

2-column grid (1 column mobile), gap 40px, margin-top 64px:

Left Card (GoldBorderCard):
- Title: "Our Vision" — H3 Playfair Display 700, 24px, navy
- Body: "To be Kaduna's leading livestock farm for healthy breeding stock and sustainable meat and dairy production, setting the standard for quality, innovation, and trust in Northern Nigeria."
- Icon: Eye (Lucide), 32px, forest green, at top

Right Card (GoldBorderCard):
- Title: "Our Mission" — H3
- 4 mission points as a numbered list (Inter 400, 16px, body-text):
  1. Raise healthy, high-performing livestock through good nutrition, proper housing, and modern breeding techniques including AI.
  2. Deliver consistent quality through strict health and record-keeping practices.
  3. Train and support local farmers with practical knowledge.
  4. Grow profitably and sustainably by reducing waste and protecting animal welfare.
Number style: Montserrat 700, forest green, 20px — acts as a decorative number

SECTION 4 — CTA:
Background: navy
Centered content, padding 80px:
- "Discover Our Services" heading (white, Playfair Display, 36px)
- Body: "We offer livestock sales, poultry farming, artificial insemination services, and farmer training." (white/70)
- Button: white bg, navy text, "See What We Do", href="/what-we-do"

Set page metadata: title 'About Us', description for About page.
```

---

## PHASE 6 — WHAT WE DO PAGE

### Prompt 6.1 — Service Block Component

```
Create components/pages/ServiceBlock.tsx.

A reusable section for the What We Do page showing one service with alternating layout.

PROPS:
- eyebrow: string
- title: string
- description: string
- keyPoints: string[]
- imageUrl: string
- imageAlt: string
- imageOnLeft: boolean (true = image left, text right; false = text left, image right)
- ctaText: string
- ctaHref: string
- bgColor: 'white' | 'cream'

DESIGN:
- Full-width section, section-padding
- 2-column grid (1 on mobile), gap 80px, items centered vertically
- Image column: aspect-ratio 4/3, border-radius 12px, overflow hidden, Next.js Image object-cover, shadow
- Text column:
  - SectionHeader: eyebrow + title
  - Body paragraph (Inter 400, 17px, margin-top 20px)
  - Key points list (margin-top 28px):
    Each point: row with CheckCircle icon (20px, forest green) + text (Inter 400, 16px, body-text)
    Gap: 12px between items
  - CTA Button (margin-top 36px): primary variant, ctaText, href=ctaHref

Column order swaps based on imageOnLeft prop (use CSS order property on mobile: image always first).
```

### Prompt 6.2 — What We Do Page

```
Create app/(public)/what-we-do/page.tsx for Axis Agro.

Server Component. Use ServiceBlock component.

Structure:
1. PageHero: eyebrow="OUR SERVICES", title="What We Do", subtitle="From livestock breeding to poultry farming and farmer training."

2. ServiceBlock:
   eyebrow="CATTLE & GOATS"
   title="Beef Production, Breeding & AI Services"
   description="Our cattle and goat operations focus on quality breeding stock and beef production. Whether you need animals for your own farm or quality meat supply, we maintain strict health and nutrition standards throughout."
   keyPoints: ['Breeding stock sales — cattle and goats', 'Quality beef production', 'Artificial insemination services', 'Herd improvement consultations', 'Sourcing of quality breeds']
   imageOnLeft=true, bgColor='white'
   ctaText="Request a Quote" ctaHref="/get-a-quote"
   imageUrl="/images/cattle.jpg"

3. ServiceBlock:
   eyebrow="POULTRY"
   title="Broilers, Layers, Turkeys & Ducks"
   description="Our poultry operations produce a wide range of birds for meat and eggs. We maintain hygienic housing, proper vaccination schedules, and balanced feeding to deliver birds that are healthy and market-ready."
   keyPoints: ['Broiler chickens for meat', 'Layers for egg production', 'Turkeys for meat supply', 'Ducks for meat and eggs', 'Supply to individuals, restaurants, and markets']
   imageOnLeft=false, bgColor='cream'
   ctaText="Request a Quote" ctaHref="/get-a-quote"
   imageUrl="/images/poultry.jpg"

4. ServiceBlock:
   eyebrow="FARMER SUPPORT"
   title="Training & Support for Local Farmers"
   description="We believe in sharing knowledge. Our practical training programmes help small and medium-scale farmers in Kaduna improve their operations — from basic livestock management to advanced AI techniques."
   keyPoints: ['Practical livestock management training', 'Artificial insemination technique training', 'Farm record-keeping and business management', 'On-farm advisory visits', 'Support for small and medium-scale farmers']
   imageOnLeft=true, bgColor='white'
   ctaText="Get in Touch" ctaHref="/contact"
   imageUrl="/images/training.jpg"

5. QuoteCTA component

Set metadata appropriately.
```

---

## PHASE 7 — GALLERY PAGE

### Prompt 7.1 — Gallery Page

```
Create app/(public)/gallery/page.tsx for the Axis Agro farm gallery.

This is a Server Component that fetches data. Create a client component for the filter tabs.

1. Fetch all gallery images from Supabase using getGalleryImages()

2. Page structure:
   - PageHero: eyebrow="GALLERY", title="Our Farm", subtitle="Photos from our livestock and poultry operations in Kaduna.", height="short"

3. Gallery section:
   Background: cream
   Section padding: 96px

   Create a Client Component at components/gallery/GalleryGrid.tsx that:
   PROPS: images: GalleryImage[]
   
   a) Filter tabs at the top:
      - Buttons: "All" | "Cattle & Goats" | "Poultry" | "Farm Facilities"
      - Active tab: filled forest green, inactive: outlined or ghost
      - On click: filter images by category
      - Style: Montserrat 600, 13px, border-radius 100px (pill shape), padding 8px 20px
   
   b) Image Grid:
      - CSS grid: 3 columns desktop (gap 16px), 2 tablet, 1 mobile
      - Each item: aspect-ratio 4/3, overflow hidden, border-radius 12px
      - Next.js Image with object-cover fill
      - Hover: image zooms slightly (transform scale 1.05, transition 0.4s)
      - If caption: show on hover as overlay (semi-transparent navy bg at bottom, white Inter 400 13px text)
   
   c) Empty state:
      If no images for selected category: centered message "No photos in this category yet."
   
   Pass images as prop from server component.

4. Below gallery, a contact CTA section:
   Background: navy, centered
   "Want to visit the farm? Get in touch." — white heading
   Two buttons: "Contact Us" (white outline) | "Get Directions" (gold filled, opens Google Maps)

Set metadata: title 'Our Farm Gallery'
```

---

## PHASE 8 — QUOTE FORM PAGE

### Prompt 8.1 — Quote Validation Schema

```
Create lib/validations/quote.ts with Zod validation schema for the quote request form.

Fields and rules:
- name: string, required, min 2 chars, max 100 chars, error "Please enter your full name"
- phone: string, required, regex for Nigerian phone numbers (07x, 08x, 09x, +234 formats), error "Please enter a valid Nigerian phone number"
- email: string, optional (but if provided must be valid email), error "Please enter a valid email address"
- service_type: enum of exactly these values: 'Cattle Purchase' | 'Goat Purchase' | 'Broiler Chickens' | 'Layers' | 'Turkeys' | 'Ducks' | 'AI Services' | 'Farmer Training' | 'Other', required, error "Please select a service"
- quantity: string, optional, max 200 chars
- message: string, required, min 10 chars, max 2000 chars, error "Please provide more detail (at least 10 characters)"

Export:
- quoteSchema (the Zod schema)
- QuoteFormData type (inferred from schema)
```

### Prompt 8.2 — Quote API Route

```
Create app/api/quotes/route.ts — a POST endpoint to handle quote form submissions.

LOGIC:
1. Parse and validate request body against quoteSchema
2. If validation fails: return 400 with error details
3. Insert the quote into Supabase quote_requests table using the service role client (for server-side insert)
4. Send an email notification using Resend to the ADMIN_EMAIL env var:
   From: Axis Agro Website <noreply@axisagro.ng> (or use Resend's test domain initially)
   To: process.env.ADMIN_EMAIL
   Subject: "New Quote Request — {service_type} from {name}"
   HTML body:
   - Name, Phone, Email
   - Service interested in
   - Quantity
   - Message
   - Date submitted
   - Note: "Log in to admin panel to view and respond"
5. Return 200 JSON { success: true, message: "Quote submitted successfully" }
6. Handle all errors gracefully — return 500 on unexpected errors

Use Supabase server client for DB operations. Import quoteSchema from lib/validations/quote.ts
```

### Prompt 8.3 — Quote Form Component

```
Create components/forms/QuoteForm.tsx — a Client Component.

Use react-hook-form with zodResolver and the quoteSchema.

DESIGN:
- White card, border-radius 12px, padding 40px (24px on mobile)
- Box shadow: 0 8px 32px rgba(0,0,0,0.10)
- Max-width: 680px

FORM LAYOUT (stack all fields vertically, gap 24px):

1. Full Name * 
   - Label (Inter 500, 14px, navy) + required asterisk in gold
   - Input (full width, border 1px solid #E4DED3, border-radius 6px, padding 12px 16px, focus: border-color forest green)
   - Error message (red, 13px) below

2. Phone Number *
   - Label + required marker
   - Input type="tel", placeholder="08x xxx xxxx"
   - Error message

3. Email Address
   - Label (no required marker — "optional" in muted text)
   - Input type="email"
   - Error message

4. Service Interested In *
   - Label + required
   - Select dropdown (same style as inputs) with placeholder "Select a service..."
   - Options: Cattle Purchase | Goat Purchase | Broiler Chickens | Layers | Turkeys | Ducks | AI Services | Farmer Training | Other
   - Error message

5. Quantity / Scale
   - Label: "Quantity or Scale (optional)"
   - Input placeholder="e.g. 50 broilers, 2 breeding bulls"

6. Your Message *
   - Label + required
   - Textarea, 4 rows, resize-y
   - Placeholder: "Tell us more about what you need..."
   - Character counter: "0 / 2000" shown below right in muted 12px
   - Error message

7. Submit Button:
   - Full width, large, primary style, "Submit Request →"
   - When submitting: disabled, show loading spinner inside button, text "Submitting..."

SUBMISSION STATES:
- On success: replace form with a success message:
  ✅ Icon (CheckCircle, forest green, 48px, centered)
  H3: "Thank you, {name}!"
  Body: "We've received your request and will contact you within 24 hours. If it's urgent, call us directly."
  Phone number link (large, clickable)
  Button: "Submit Another Request" (resets form)

- On error: show error message banner at top of form:
  "Something went wrong. Please try again or contact us directly."

API call: POST to /api/quotes with form data as JSON
```

### Prompt 8.4 — Get a Quote Page

```
Create app/(public)/get-a-quote/page.tsx.

Background: cream for outer page

LAYOUT — 2 columns on desktop (1 on mobile):
Left (60%): QuoteForm component
Right (40%): Contact info sidebar

HEADER above the 2-column layout:
- Short hero (no image, just text, padding 64px top):
  eyebrow: "LET'S TALK"
  H1: "Request a Quote" — Playfair Display 700, 48px, navy
  Subheading: "Fill in the form and we'll get back to you within 24 hours." — Inter 400, 17px, muted

RIGHT SIDEBAR — 3 info cards stacked (GoldBorderCard, smaller padding 24px):

Card 1: Prefer to Call?
  - Phone icon (Lucide Phone), forest green
  - "Call Us Directly"
  - Phone number as large clickable link (href="tel:...")
  - Sub: "Mon – Sat, 7:00am – 6:00pm"

Card 2: WhatsApp
  - MessageCircle icon, green (#25D366)
  - "Message on WhatsApp"
  - Button: "Open WhatsApp →" (href="https://wa.me/[NUMBER]")
  - Sub: "Quick responses during business hours"

Card 3: Visit the Farm
  - MapPin icon, forest green
  - "Our Location"
  - Address text
  - Small embedded map (Google Maps iframe, 200px height)
  - "Get Directions →" link

Set metadata: title 'Get a Quote'
```

---

## PHASE 9 — CONTACT PAGE

### Prompt 9.1 — Contact Page

```
Create app/(public)/contact/page.tsx for Axis Agro.

SECTION 1: Short hero (no image, cream background, centered):
- eyebrow: "FIND US"
- H1: "Contact & Visit"
- Subtitle: "We're based in Kaduna, Nigeria. Come visit the farm or reach out any way that suits you."

SECTION 2: Main content, 2-column layout:
Left 40% — Contact Info:
SectionHeader: eyebrow "GET IN TOUCH", title "Reach Out"

4 contact cards (spaced 24px apart, no card border, just icon + text):
Each card has: Lucide icon (32px, forest green) | Title (Montserrat 600, 16px, navy) | Detail (Inter 400, 15px, body-text) | Sub-detail (Inter 400, 13px, muted)

1. Phone: 📞 title="Call Us" detail=[phone number as tel: link] sub="Mon – Sat, 7:00am – 6:00pm"
2. WhatsApp: 💬 title="WhatsApp" detail="Message us on WhatsApp" sub="Quick responses during business hours" — as wa.me link
3. Email: ✉️ title="Email Us" detail=[email as mailto: link]
4. Address: 📍 title="Our Location" detail=[farm address] sub="Kaduna State, Nigeria"

Below contact cards:
"Get Directions" button — primary, large, with ExternalLink icon, opens Google Maps in new tab
URL: https://maps.google.com/?q={NEXT_PUBLIC_FARM_LAT},{NEXT_PUBLIC_FARM_LNG}

Right 60% — Google Maps:
Create a MapEmbed component:
- Props: lat: number, lng: number, address: string
- Render a Google Maps iframe embed
- URL: https://www.google.com/maps/embed/v1/place?key={GOOGLE_MAPS_EMBED_KEY}&q={lat},{lng}&zoom=14
- If no API key, use a static link embed: https://maps.google.com/maps?q={lat},{lng}&output=embed
- Height: 480px, width: 100%, border-radius 12px, border none, box-shadow

SECTION 3: Business Hours Table
Background: cream
Centered, max-width 600px

Title: "Business Hours" — H2 Playfair Display
Table or card showing hours:
Monday – Friday: 7:00 AM – 6:00 PM
Saturday: 7:00 AM – 4:00 PM
Sunday: Closed

Note below: "* Hours may vary during public holidays"

Set metadata: title 'Contact & Visit'
```

---

## PHASE 10 — ADMIN PANEL

### Prompt 10.1 — Admin Layout

```
Create app/admin/layout.tsx for the admin panel.

This layout should:
1. NOT include the public Header/Footer
2. Check if current path is /admin/login — if so, just render children without admin UI
3. For all other /admin/* paths, wrap children in AdminLayout component

Create components/admin/AdminLayout.tsx:
PROPS: children

DESIGN:
- Full-height, flex row
- Background: #F8FAFC (very light grey-blue, different from public site)

Left sidebar:
- Width: 240px, fixed height, background white, border-right 1px solid #E2E8F0
- Top: Axis Agro logo + "Admin Panel" label (small, muted)
- Nav items:
  ├── Dashboard (LayoutDashboard icon, href="/admin/dashboard")
  ├── Quotes (MessageSquare icon, href="/admin/quotes")
  ├── Gallery (Image icon, href="/admin/gallery")
  ├── Services (List icon, href="/admin/services")
  ├── Content (FileText icon, href="/admin/content")
  └── Settings (Settings icon, href="/admin/settings")
  
  Each nav item: flex row, icon 18px, text Montserrat 500 14px navy
  Active (usePathname): bg-green-50, text forest green, border-left 3px forest green
  Hover: bg-gray-50
  Padding: 12px 16px, gap 12px, border-radius 0 8px 8px 0

Bottom of sidebar:
- "Logout" button: LogOut icon, text "Sign Out", onClick calls Supabase signOut() then redirects to /admin/login

Main content area:
- flex-1, overflow-y auto
- Top bar: 64px height, bg white, border-bottom, flex space-between
  Left: Page title (dynamic — from context or just "Admin")
  Right: Admin email label (muted, small) + logged-in indicator dot (green)
- Content: padding 32px

Also create components/admin/AdminNav.tsx as the sidebar component if needed.
```

### Prompt 10.2 — Admin Login Page

```
Create app/admin/login/page.tsx.

This is a Client Component (needs form interactivity).

DESIGN:
- Background: cream (#F5F2EB)
- Centered vertically and horizontally (min-height 100vh, flex center)
- Card: white, max-width 420px, padding 48px, border-radius 12px, shadow

CONTENT:
- Logo at top (centered, 64px height)
- "Admin Login" — Playfair Display 700, 28px, navy, centered
- Subtitle: "Axis Agro Management Panel" — Inter 400, 14px, muted, centered, margin-bottom 36px

FORM:
- Email field (label + input, full width)
- Password field (label + input type="password", full width, with show/hide toggle using Eye/EyeOff Lucide icons)
- "Sign In" button — primary, full width, large
- Loading state: disabled button with spinner
- Error state: red error message banner above button

LOGIC:
1. On submit: call Supabase signInWithPassword({ email, password })
2. On success: router.push('/admin/dashboard')
3. On error: show error "Invalid email or password. Please try again."

Note at bottom: "Contact your administrator if you cannot log in." (muted, 13px, centered)

This page should NOT be wrapped by AdminLayout. It has its own standalone design.
No back link needed (no public users should reach this page accidentally).
```

### Prompt 10.3 — Admin Dashboard

```
Create app/admin/dashboard/page.tsx as a Server Component.

Fetch:
- Count of all quote_requests from Supabase
- Count of quote_requests where status = 'new'
- Count of gallery_images
- 5 most recent quote_requests (id, name, service_type, status, created_at)

LAYOUT:

1. Page title: "Dashboard" (shown in admin top bar via AdminLayout)

2. Stats row (4 cards, CSS grid 2x2 on mobile, 4 cols on desktop):

Each stat card (white, border-radius 8px, padding 24px, shadow-sm):
- Icon top-left in colored circle
- Big number: Montserrat 700, 36px, navy
- Label: Inter 400, 14px, muted below
- Optional delta or context text

Cards:
a) 📋 Total Quotes — count — "All time"
b) 🔔 New Quotes — new count — "Awaiting response" (badge in amber if > 0)
c) 🖼️ Gallery Photos — image count — "Active in gallery"
d) ⚡ Last Updated — today's date — "System status: Active"

3. Recent Quotes table (margin-top 32px):
Section title: "Recent Quote Requests" — Montserrat 600, 18px, navy

Table (white, rounded, shadow-sm, full width):
Columns: Name | Service | Date | Status | Action
Row data from fetched quotes
Status column: color-coded badge (use getStatusColor from utils)
Action: "View" link → /admin/quotes?id={quote.id}

Below table: "View All Quotes →" link (forest green)

4. Quick Actions (margin-top 24px):
Row of 3 buttons:
- "Upload Photos" → href="/admin/gallery"
- "View All Quotes" → href="/admin/quotes"
- "Edit Site Content" → href="/admin/content"
```

### Prompt 10.4 — Quote Requests Manager

```
Create app/admin/quotes/page.tsx — the quotes management page.

This is a Client Component (needs filtering and status updates).

FETCH: All quote_requests from Supabase, ordered by created_at DESC

LAYOUT:

1. Header row:
- Title: "Quote Requests"
- Right: Export CSV button (downloads quotes as CSV using JavaScript)

2. Filter bar:
- Status filter buttons (pill style): All | New | In Progress | Responded | Closed
- Search input: search by name or phone
- Active filters shown as chips

3. Quotes table:
Columns: # | Name | Phone | Service | Date | Status | Actions

Each row:
- Click anywhere on row → expand detail panel below (accordion style) OR open a side panel
- Status badge (color coded)
- Actions cell: dropdown menu with:
  - "Mark as In Progress"
  - "Mark as Responded"
  - "Mark as Closed"
  
4. Expanded detail view (on row click, slides down):
- All fields: name, phone, email, service, quantity, message, date
- "Call" button (tel: link), "Email" button (mailto: link), "WhatsApp" button (wa.me link)
- Admin notes textarea: "Internal Notes (not visible to client)" — save button → PATCH to Supabase

5. Empty state: "No quote requests yet. Requests will appear here when submitted."

6. Update status via Supabase client:
On status change: UPDATE quote_requests SET status = newStatus, updated_at = now() WHERE id = id
Optimistic update in UI (update state immediately, then confirm from Supabase response)

Add this page title to AdminLayout context or hardcode.
```

### Prompt 10.5 — Gallery Manager

```
Create app/admin/gallery/page.tsx — the gallery management page.

Mix of Server Component for initial fetch + Client Component for interactions.

Create as a Client Component that fetches data on mount.

LAYOUT:

1. Header: "Gallery Manager" title + "Upload Photos" button (primary, right side)

2. Upload area (top of page, collapsible):
  react-dropzone zone:
  - Dashed border, cream background, centered text
  - "Drag photos here or click to browse"
  - Accepts: image/jpeg, image/png, image/webp
  - Max file size: 5MB per file, max 10 files at once
  - Upload progress bar per file
  - On upload:
    a) Upload to Supabase Storage bucket 'gallery'
    b) Get public URL from Supabase
    c) Insert row into gallery_images table
    d) Add to local state

3. Filter tabs: All | Cattle & Goats | Poultry | Farm Facilities | General

4. Image grid (4 columns desktop, 2 mobile):
Each image card:
  - Thumbnail (aspect 4/3, object-cover, border-radius 8px)
  - Below: Category badge, Caption text (editable inline on click)
  - Top-right: ⭐ toggle (is_featured) + 🗑️ delete icon
  - Delete: confirm dialog before deleting from DB + storage

5. Edit caption modal:
On caption click: modal with textarea for caption + category select + save button

6. Featured images badge: Star icon, gold color when featured
Clicking star toggles is_featured in DB

Upload to Supabase:
const { data, error } = await supabase.storage.from('gallery').upload(`${Date.now()}_${file.name}`, file)
const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(data.path)
```

### Prompt 10.6 — Site Settings Manager

```
Create app/admin/settings/page.tsx — the settings management page.

Client Component. Fetch all from site_settings table on mount.

LAYOUT:
1. Header: "Site Settings"
2. Form with sections (card per section, white, rounded, shadow-sm, padding 24px, gap 24px between cards):

Card 1: "Contact Information"
Fields:
- Farm Name (text)
- Phone Number (tel)
- WhatsApp Number (tel)
- Email Address (email)
- Physical Address (textarea, 2 rows)
- Business Hours (textarea — freeform, e.g. "Mon–Sat 7am–6pm")

Card 2: "Farm Location"
Fields:
- Latitude (number input, step 0.0001)
- Longitude (number input, step 0.0001)
- Google Maps Link (text — paste full share link)
- Note below: "Tip: Right-click your location on Google Maps → 'What's here?' to get coordinates."

Card 3: "Social Media"
Fields:
- Facebook URL (url input)
- Instagram URL (url input)

Card 4: "Notification Settings"
Fields:
- Admin Email for Quote Notifications (email)
- Note: "Quote requests will be emailed to this address."

SAVE BEHAVIOR:
Each card has its own "Save Changes" button at bottom right.
On save: UPSERT all settings in that card to site_settings table (key-value pairs).
Show success toast: "Settings saved successfully." on success.
Show error toast on failure.

On load: pre-populate all fields from fetched settings.
```

---

## PHASE 11 — POLISH & FINAL DETAILS

### Prompt 11.1 — Loading States & Error Boundaries

```
Add loading states and error handling throughout the Axis Agro site:

1. Create app/(public)/loading.tsx — skeleton loading state for public pages:
   - Cream background
   - Skeleton bars in navy/cream colors showing roughly a hero + some content
   - Use CSS animation: opacity pulse 1.5s ease-in-out infinite

2. Create app/(public)/error.tsx — error boundary for public pages:
   - Simple centered page: "Something went wrong loading this page."
   - Try again button
   - Contact info so they can still reach the farm

3. Create app/(public)/not-found.tsx — 404 page:
   - Keep the nav/footer
   - Centered: "Page Not Found" heading
   - Body: "This page doesn't exist. Maybe start from the home page."
   - Button: "Back to Home"
   - Optional: small farm-themed illustration or the logo large

4. In QuoteForm: ensure the form submit button has a disabled state during submission with spinner

5. In GalleryGrid: add a loading skeleton for when images are being filtered (brief transition)

6. Wrap the admin data fetches in try-catch throughout and show appropriate error states in admin pages
```

### Prompt 11.2 — SEO & Metadata

```
Add proper metadata to all pages of the Axis Agro site.

For each page, update the metadata export:

1. app/(public)/page.tsx (Home):
   title: 'Axis Agro | Quality Livestock Farm in Kaduna, Nigeria'
   description: 'Axis Agro is a mixed livestock and poultry farm in Kaduna, Nigeria. We raise cattle, goats, chickens, turkeys and ducks. AI services and farmer training available.'

2. app/(public)/about/page.tsx:
   title: 'About Us'
   description: 'Learn about Axis Agro — our vision, mission, and approach to mixed livestock and poultry farming in Kaduna, Northern Nigeria.'

3. app/(public)/what-we-do/page.tsx:
   title: 'What We Do — Services'
   description: 'Cattle breeding, goat farming, broilers, layers, turkeys, ducks, and artificial insemination services. Based in Kaduna, Nigeria.'

4. app/(public)/gallery/page.tsx:
   title: 'Our Farm Gallery'
   description: 'Photos from Axis Agro farm — our cattle, goats, poultry operations and farm facilities in Kaduna, Nigeria.'

5. app/(public)/get-a-quote/page.tsx:
   title: 'Request a Quote'
   description: 'Request a quote from Axis Agro for livestock, poultry, or AI services. We serve Kaduna and Northern Nigeria.'

6. app/(public)/contact/page.tsx:
   title: 'Contact & Visit'
   description: 'Get in touch with Axis Agro. Visit our farm in Kaduna or contact us by phone, WhatsApp, or email.'

Also:
- Add a basic og-image.jpg to public/ (use a farm photo)
- Add the shared openGraph base to the root layout metadata
- Add a robots.txt file in public/ that allows all crawlers
- Add a simple sitemap at app/sitemap.ts:
  Return static routes for all public pages with lastModified = new Date()
```

### Prompt 11.3 — Mobile Responsiveness Audit

```
Review and fix mobile responsiveness across the entire Axis Agro site.

Check and fix the following specifically:

1. Header / MobileNav:
   - Hamburger menu opens cleanly on mobile
   - Mobile nav closes when a link is clicked
   - "Visit Us" button visible in mobile nav
   - Logo size appropriate on mobile (not too large)

2. Hero Section:
   - Text readable on small screens (font scaling down)
   - Buttons don't overflow on 375px screens
   - Hero height appropriate on mobile (65vh)

3. Services cards:
   - Stack to single column on mobile
   - Card padding reduces on mobile (24px vs 32px)

4. 2-column layouts (ServiceBlock, AboutSnapshot, Contact):
   - Stack to single column on mobile
   - Image comes first on mobile in all cases

5. Admin sidebar:
   - On mobile: sidebar becomes a top hamburger-toggle drawer or bottom tab bar
   - Admin table: horizontal scroll or card view on mobile

6. Quote form:
   - Full-width inputs on all screen sizes
   - Adequate tap targets (min 44px height for all form elements)

7. Footer:
   - 2-column on tablet, 1-column on mobile
   - Phone number large and clearly tappable

8. Gallery grid:
   - 2 columns on tablet, 1 on mobile (images still clear)

Use Tailwind responsive prefixes (sm: md: lg:) throughout. 
Screen sizes to support: 375px (iPhone SE), 768px (tablet), 1024px (laptop), 1440px (desktop).
```

### Prompt 11.4 — Performance Optimizations

```
Optimize the Axis Agro Next.js site for performance, especially for Nigerian mobile connections.

1. Images:
   - Ensure ALL images use Next.js <Image> component (never plain <img> for main images)
   - Add proper sizes prop to all images for responsive loading
   - Add priority prop to hero image only (above-the-fold)
   - Ensure all images have alt text that describes the image meaningfully
   - Set quality={80} for gallery images (reduce size)

2. Fonts:
   - Confirm fonts use display: 'swap' in next/font config
   - Preload is handled automatically by next/font

3. Server vs Client components:
   - Confirm all data-fetching pages are Server Components
   - Only components with useState/onClick should be 'use client'
   - Gallery filter tabs: client. Gallery images: server-fetched, passed as props.

4. Lazy loading:
   - Gallery images below the fold: add loading="lazy" to Next.js Image
   - Hero image: loading="eager" with priority={true}

5. next.config.ts:
   - Add Supabase storage domain to images.remotePatterns so Next.js can optimize them
   - Pattern: { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }

6. API routes:
   - Add proper error handling and status codes
   - Avoid fetching unnecessary data (select only needed columns)

Review the build output with `npm run build` and fix any type errors or build warnings shown.
```

---

## PHASE 12 — DEPLOYMENT

### Prompt 12.1 — Vercel Deployment Prep

```
Prepare the Axis Agro Next.js project for deployment on Vercel.

1. Update next.config.ts:
   - Ensure it's valid TypeScript
   - Add image remote patterns for Supabase storage
   - No experimental features that might cause build issues

2. Create a .env.example file (NOT .env.local) with all required env vars listed with empty values and comments explaining each

3. Update package.json scripts if needed:
   - Confirm "build": "next build" exists
   - Add "start": "next start"

4. Create a README.md with:
   Section 1 — Project Overview: what this is, tech stack
   Section 2 — Local Setup: step-by-step from clone to running locally
     (includes: npm install, create .env.local from .env.example, Supabase setup, run schema.sql, npm run dev)
   Section 3 — Supabase Setup: create project, create storage bucket 'gallery' (public), run schema.sql, set up auth
   Section 4 — Admin Access: how to create the admin user in Supabase Auth dashboard (email + password)
   Section 5 — Deployment on Vercel: connect repo, add env vars, deploy
   Section 6 — Updating Content: how to use the admin panel

5. Verify the middleware.ts is correctly protecting /admin/* routes before deployment

6. Check all TODOs left in the code (e.g. placeholder image paths, phone numbers) and list them in README under "Before Going Live"

7. Add a DEPLOYMENT_CHECKLIST.md with checkboxes:
   - [ ] Real farm photos added to /public/images/
   - [ ] Actual phone number in site_settings
   - [ ] Actual email address in site_settings
   - [ ] Actual farm address and coordinates set
   - [ ] Admin user created in Supabase Auth
   - [ ] RESEND_API_KEY and ADMIN_EMAIL set in Vercel env vars
   - [ ] All Supabase env vars set in Vercel
   - [ ] Test quote form end-to-end
   - [ ] Test admin login and all admin pages
   - [ ] Test on mobile device
   - [ ] Test Google Maps / Visit Us button
   - [ ] Domain connected in Vercel
```

---

## TROUBLESHOOTING REFERENCE

### Common Issues & Fixes

**Supabase RLS blocking public insert (quote form):**
Make sure the policy for `quote_requests` allows `anon` role to INSERT. Check Supabase Auth → Policies.

**Images not loading from Supabase:**
Check that the storage bucket is set to "Public" in Supabase dashboard. Verify the domain is in `next.config.ts` remotePatterns.

**Admin middleware redirect loop:**
Ensure `/admin/login` is explicitly excluded from the redirect check in middleware.ts.

**Fonts not loading:**
Confirm the font variables are applied on both `<html>` tag AND the `tailwind.config.ts` fontFamily extension uses the same CSS variable names.

**Google Maps embed blocked:**
Some browsers block iframes. Add a direct "Get Directions" link as fallback for all users.

**Build error — 'use client' missing:**
Any component using hooks (useState, useEffect, usePathname, useRouter) MUST have 'use client' at the top.

**Resend email not sending:**
Verify your Resend API key and that the FROM email domain is verified in Resend. Use Resend's test address (onboarding@resend.dev) for initial testing.

---
*End of Cursor Build Prompts. Run each phase in order. Keep the Site Brief open as your reference.*
