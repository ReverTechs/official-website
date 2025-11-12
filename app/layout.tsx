import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "./globals.css";

// Support both Vercel and Netlify deployments
function getDefaultUrl() {
  // First, check for explicitly set site URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Check for Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Check for Netlify deployment
  if (process.env.NETLIFY && process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL;
  }

  // Fallback to localhost
  return "http://localhost:3000";
}

const defaultUrl = getDefaultUrl();

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Blessings Rever Chilemba - Fullstack Developer",
  description:
    "Official website of Blessings Chilemba. Discover innovative apps and digital solutions. Download the latest mobile and web applications.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
