import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HabitProvider } from "@/contexts/HabitContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import AuthWrapper from "@/components/AuthWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Streakly - Build Better Habits",
  description: "Build better habits, one streak at a time. Track your daily habits, build consistency, and achieve your goals with beautiful, simple habit tracking.",
  keywords: ["habit tracker", "habits", "streaks", "productivity", "goals", "daily habits", "habit building"],
  authors: [{ name: "Streakly" }],
  creator: "Streakly",
  publisher: "Streakly",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://habitflow-11388uoop-mikes-projects-05744d9a.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Streakly - Build Better Habits",
    description: "Build better habits, one streak at a time. Track your daily habits, build consistency, and achieve your goals.",
    url: 'https://habitflow-11388uoop-mikes-projects-05744d9a.vercel.app',
    siteName: 'Streakly',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Streakly - Build Better Habits',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Streakly - Build Better Habits",
    description: "Build better habits, one streak at a time. Track your daily habits, build consistency, and achieve your goals.",
    images: ['/og-image.svg'],
    creator: '@streakly',
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
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Streakly" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <HabitProvider>
            <AuthWrapper>
              <div className="min-h-screen pb-24 md:pb-8 md:pl-20">
                {children}
              </div>
              <Navigation />
            </AuthWrapper>
          </HabitProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
