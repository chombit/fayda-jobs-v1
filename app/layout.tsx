import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Fayda Jobs - Find Your Career Opportunity in Ethiopia",
  description: "Discover thousands of verified jobs from top companies, NGOs, and government institutions across Ethiopia. Your next career opportunity awaits.",
  keywords: "jobs ethiopia, careers ethiopia, employment ethiopia, job vacancies ethiopia, ethiopian jobs, fayda jobs",
  authors: [{ name: "Fayda Jobs Team" }],
  creator: "Fayda Jobs",
  publisher: "Fayda Jobs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://faydajobs.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ET',
    url: 'https://faydajobs.com',
    title: 'Fayda Jobs - Find Your Career Opportunity in Ethiopia',
    description: 'Discover thousands of verified jobs from top companies, NGOs, and government institutions across Ethiopia. Your next career opportunity awaits.',
    siteName: 'Fayda Jobs',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fayda Jobs - Ethiopian Job Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fayda Jobs - Find Your Career Opportunity in Ethiopia',
    description: 'Discover thousands of verified jobs from top companies, NGOs, and government institutions across Ethiopia.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
