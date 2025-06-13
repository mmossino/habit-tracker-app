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
  title: "Habit Tracker",
  description: "A beautiful habit tracking app with liquid glass design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
