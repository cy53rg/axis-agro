export const SITE_NAME = "JRN Agro LTD";
export const SITE_NAME_FORMAL = "JRN Agro Limited";
export const SITE_RC_NUMBER = "9679462";
export const SITE_LOGO_PATH = "/jrn-agro-logo.png";
export const SITE_CAC_CERTIFICATE_PATH = "/CAC_certificate.png";

export const SITE_CONTACT = {
  address: "Kaduna, Kaduna State, Nigeria",
  phone: "+2348000000000",
  phoneDisplay: "+234 800 000 0000",
  email: "admin@jrnagro.ng",
  hours: "Mon – Sat, 7:00am – 6:00pm",
};

export const SITE_SOCIAL = {
  facebook: "https://facebook.com/jrnagro",
  instagram: "https://instagram.com/jrnagro",
};

export const SITE_COMPLIANCE = {
  legalName: SITE_NAME_FORMAL,
  tradingName: SITE_NAME,
  rcNumber: SITE_RC_NUMBER,
  certificatePath: SITE_CAC_CERTIFICATE_PATH,
  incorporatedUnder: "Companies and Allied Matters Act 2020",
} as const;

export const FOOTER_TAGLINE = "Healthy Livestock, Consistent Quality.";

/** Primary public navigation — shared by header, mobile menu, and footer. */
export const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/what-we-do", label: "What We Do" },
  { href: "/animals", label: "Animals" },
  { href: "/gallery", label: "Our Farm" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_QUICK_LINKS = [
  ...PUBLIC_NAV_LINKS,
  { href: "/get-a-quote", label: "Get a Quote" },
] as const;

export const FOOTER_SERVICES = [
  "Cattle & Goats",
  "Poultry Farming",
  "Broiler Chickens",
  "Layers",
  "Turkeys & Ducks",
  "AI Services",
  "Farmer Training",
] as const;
