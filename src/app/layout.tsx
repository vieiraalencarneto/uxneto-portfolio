import type { Metadata } from "next";
import { DM_Serif_Display, Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { PageIntro } from "@/components/PageIntro";
import { PostHogProvider } from "@/components/PostHogProvider";
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

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Francisco Neto — Product Designer",
    template: "%s — Francisco Neto",
  },
  description:
    "Product Designer at Havan based in Brusque, Santa Catarina. Focused on e-commerce UX, data-driven design, and measurable business impact.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://uxneto.com"),
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value === "pt" ? "pt" : "en";

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <PageIntro />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
