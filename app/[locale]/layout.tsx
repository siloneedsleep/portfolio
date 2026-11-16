import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import { profile } from "@/data/profile";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { RouteTransitions } from "@/components/animations/route-transitions";
import { MotionProvider } from "@/components/providers/motion-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PortfolioMotion } from "@/components/animations/portfolio-motion";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-jetbrains",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("title");
  const description = t("description");
  const canonicalPath = locale === "vi" ? "/" : `/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        vi: "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      siteName: profile.brand,
      url: `${profile.siteUrl}${canonicalPath === "/" ? "" : canonicalPath}`,
      title,
      description,
      images: [
        {
          url: "/og-ocean.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-ocean.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable}`}>
        <div className="portfolio-backdrop" aria-hidden="true">
          <Image
            src="/ocean-background.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[56%_center]"
          />
        </div>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider nonce={nonce}>
            <MotionProvider>
              <RouteTransitions />
              <PortfolioMotion />
              <Navbar />
              <main id="main-content" tabIndex={-1} className="outline-none">
                {children}
              </main>
              <Footer />
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
