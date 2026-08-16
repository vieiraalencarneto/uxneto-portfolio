import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Francisco Neto — Product Designer",
    template: "%s — Francisco Neto",
  },
  description:
    "Product Designer at Havan based in Brusque, Santa Catarina. Focused on e-commerce UX, data-driven design, and measurable business impact.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://uxneto.com",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Francisco Neto",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
