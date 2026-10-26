import type { Metadata, Viewport } from "next";
import { Anton, Inter, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { IMMEDIATE_SCRIPT } from "@/lib/immediate";
import { THEME_SCRIPT } from "@/lib/theme";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// optional: if the file is not here in the first instant, the fallback paints
// and is kept. That stops a late font swap from becoming the mobile LCP.
// A preloaded Anton still wins on a fast desktop connection.
const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "optional",
  preload: true,
});

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "optional", preload: false });

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "optional", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s — Ruyalab" },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  keywords: [
    "creative technology studio",
    "web design and development",
    "Next.js development",
    "AI product development",
    "WebGL and 3D websites",
    "headless WordPress",
    "product engineering",
  ],
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f2ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The theme script sets data-theme before hydration, hence the warning opt-out.
    <html lang="en" data-ga={site.gaId} className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script dangerouslySetInnerHTML={{ __html: IMMEDIATE_SCRIPT }} />
      </body>
    </html>
  );
}
