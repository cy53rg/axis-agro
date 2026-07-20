import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";

import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://jrnagro.ng"
  ),
  title: {
    template: "%s | JRN Agro LTD — Kaduna Livestock Farm",
    default: "JRN Agro LTD | Quality Livestock Farm in Kaduna, Nigeria",
  },
  description:
    "JRN Agro Limited is a mixed livestock and poultry farm in Kaduna, Nigeria. We raise cattle, goats, chickens, turkeys, and ducks, and offer artificial insemination services.",
  keywords:
    "JRN Agro, livestock farm Kaduna, poultry farm Nigeria, artificial insemination cattle, breeding stock Kaduna",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "JRN Agro LTD",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JRN Agro LTD livestock farm in Kaduna, Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} ${montserrat.variable}`}
    >
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
