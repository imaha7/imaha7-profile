import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imaha7.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Imaha7 — Ilham Maulana Habibie | Software Engineer & BI Specialist",
    template: "%s | Ilham Maulana Habibie",
  },
  description:
    "Imaha7 is the portfolio of Ilham Maulana Habibie, a Jakarta-based Software Engineer and BI Specialist building web apps and data dashboards.",
  keywords: [
    "Ilham Maulana Habibie",
    "Imaha7",
    "Software Engineer",
    "BI Specialist",
    "React",
    "Next.js",
    "TypeScript",
    "MotionBoard",
    "Dashboard Development",
    "Jakarta Web Developer",
    "Enterprise Software",
    "Portfolio",
    "Ritel Unyu",
    "Imaha7 Ritel Unyu",
    "Imaha7 Portfolio",
    "Imaha7 Software Engineer",
    "Imaha7 BI Specialist",
    "ilahm",
    "Imaha7 Github",
    "Imaha7 LinkedIn",
    "Imaha7 Web Developer",
    "Imaha7 React Developer",
    "Imaha7 Next.js Developer",
    "Imaha7 TypeScript Developer",
    "Imaha7 BI Specialist",
    "Imaha7 Mikroskil"
  ],
  applicationName: "Imaha7 Portfolio",
  authors: [
    {
      name: "Ilham Maulana Habibie",
      url: "https://imaha7.vercel.app",
    },
  ],
  creator: "Ilham Maulana Habibie",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Imaha7 — Ilham Maulana Habibie | Software Engineer & BI Specialist",
    description:
      "Portfolio of Ilham Maulana Habibie (Imaha7), a Jakarta-based Software Engineer and BI Specialist.",
    siteName: "Imaha7",
    images: [
      {
        url: "https://imaha7.vercel.app/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Ilham Maulana Habibie — Software Engineer and BI Specialist",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Imaha7 — Ilham Maulana Habibie | Software Engineer & BI Specialist",
    description:
      "Portfolio of Ilham Maulana Habibie (Imaha7), a Jakarta-based Software Engineer and BI Specialist.",
    creator: "@imaha7",
    images: ["https://imaha7.vercel.app/og-image.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eff8ff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ilham Maulana Habibie",
    alternateName: "Imaha7",
    url: "https://imaha7.vercel.app/",
    jobTitle: "Software Engineer & BI Specialist",
    sameAs: [
      "https://github.com/imaha7",
      "https://www.linkedin.com/in/imaha7",
    ],
    description:
      "Jakarta-based Software Engineer and BI Specialist building web applications and data dashboards.",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://imaha7.vercel.app/",
    "name": "Imaha7 — Ilham Maulana Habibie",
    "description": "Portfolio of Ilham Maulana Habibie (Imaha7), a Jakarta-based Software Engineer and BI Specialist.",
    "publisher": {
      "@type": "Organization",
      "name": "Imaha7 Portfolio",
    },
    "sameAs": [
      "https://github.com/imaha7",
      "https://www.linkedin.com/in/imaha7"
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="hZI5HPjr-o0n8RKhGkoE4plSxp6rs7xQTxOQWWw2lVM" />
        <script
          type="application/ld+json"
          // JSON-LD is static; safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd, websiteJsonLd]) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

