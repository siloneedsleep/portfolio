import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { legalDocuments, legalUpdated, type LegalPage } from "@/data/legal";
import { profile } from "@/data/profile";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export type LegalPageProps = { params: Promise<{ locale: Locale }> };

export function legalMetadata(locale: Locale, page: LegalPage): Metadata {
  const document = legalDocuments[locale]?.[page];
  if (!document) return {};

  const vi = `/${page}`;
  const en = `/en/${page}`;
  const canonical = locale === "vi" ? vi : en;
  const title = `${document.title} | ${profile.brand}`;
  const description = document.introduction;

  return {
    title,
    description,
    alternates: { canonical, languages: { vi, en, "x-default": vi } },
    openGraph: { type: "article", url: canonical, title, description, siteName: profile.brand },
    twitter: { card: "summary", title, description },
  };
}

export function LegalDocument({ locale, page }: { locale: Locale; page: LegalPage }) {
  const document = legalDocuments[locale]?.[page];
  if (!document) notFound();
  setRequestLocale(locale);

  const updated = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(legalUpdated));
  const related = page === "terms" ? "privacy" : "terms";
  const linkStyle = "text-primary underline decoration-primary/45 underline-offset-4 hover:decoration-current";

  return (
    <article className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
      <header className="border-b pb-8">
        <h1 className="text-display-h2 text-balance">{document.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {locale === "vi" ? "Cập nhật ngày " : "Last updated "}<time dateTime={legalUpdated}>{updated}</time>
        </p>
        <p className="mt-6 text-lg leading-relaxed">{document.introduction}</p>
      </header>
      {document.sections.map(({ heading, paragraphs, links }) => (
        <section key={heading} className="mt-9">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{heading}</h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-base leading-7">{paragraph}</p>
          ))}
          {links && (
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-6">
              {links.map(({ label, href }) => (
                <li key={href}><a href={href} className={linkStyle}>{label}</a></li>
              ))}
            </ul>
          )}
        </section>
      ))}
      <div className="mt-10 space-y-4 border-t pt-6 text-base leading-7">
        <p>
          {document.contact}{" "}
          <a className={`${linkStyle} break-words`} href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
        <Link href={`/${related}`} className={linkStyle}>{legalDocuments[locale][related].title}</Link>
      </div>
    </article>
  );
}
