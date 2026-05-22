import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imaha7-profile.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: {
    default:
      "Ilham Maulana Habibie (Imaha7) — Full Stack Developer & BI Specialist",
    template: "%s | Ilham Maulana Habibie",
  },
  description:
    "Ilham Maulana Habibie aka imaha7 — Ilham Software Engineer. Full Stack Developer & BI Specialist building premium web apps, dashboards, and enterprise MotionBoard solutions. Projects, skills, and contact.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Keep default crawling behavior.
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Ilham Maulana Habibie (imaha7) — Full Stack Developer & BI Specialist",
    description:
      "Portfolio of Ilham Software Engineer: projects, skills, experience, and contact.",
    siteName: "imaha7",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ilham Maulana Habibie (imaha7) — Full Stack Developer & BI Specialist",
    description:
      "Projects, skills, and experience. Connect with Ilham: GitHub & LinkedIn.",
  },
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
    url: "https://imaha7-profile.vercel.app/",
    jobTitle: "Full Stack Developer & BI Specialist",
    sameAs: [
      "https://github.com/imaha7",
      "https://www.linkedin.com/in/imaha7",
    ],
    description:
      "Ilham Maulana Habibie (imaha7) — Ilham Software Engineer. Builds premium web applications, intelligent dashboards, and scalable BI solutions.",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          // JSON-LD is static; safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

