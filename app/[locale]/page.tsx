import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { profile } from "@/data/profile";
import { Hero } from "@/components/sections/hero";
import { SelectedWork } from "@/components/sections/selected-work";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const meta = await getTranslations({ locale, namespace: "metadata" });
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${profile.siteUrl}/#person`,
        name: profile.name,
        alternateName: profile.brand,
        url: profile.siteUrl,
        image: `${profile.siteUrl}${profile.avatar}`,
        jobTitle: profile.title,
        sameAs: [profile.githubUrl, profile.facebookUrl],
      },
      {
        "@type": "WebSite",
        "@id": `${profile.siteUrl}/#website`,
        url: profile.siteUrl,
        name: `${profile.brand} — ${profile.name}`,
        description: meta("description"),
        inLanguage: locale === "vi" ? "vi-VN" : "en-US",
        author: { "@id": `${profile.siteUrl}/#person` },
      },
    ],
  };

  const jsonLd = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Hero />
      <SelectedWork />
      <Skills />
      <Contact />
    </>
  );
}
