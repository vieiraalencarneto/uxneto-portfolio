import type { Metadata } from "next";
import { DM_Serif_Display, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5L8Q4WQD');`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5L8Q4WQD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <PageIntro />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
