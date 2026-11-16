import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Layers,
  Lightbulb,
  Wrench,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { Link } from "@/i18n/navigation";
import { profile } from "@/data/profile";
import {
  getCaseStudyProject,
  getCaseStudySlugs,
  isValidHttpUrl,
  type ProjectStatus,
} from "@/data/projects";
import { getCaseStudyContent } from "@/data/case-studies";
import { Button } from "@/components/ui/button";
import { CopyLinkButton } from "@/components/ui/copy-link-button";

export function generateStaticParams() {
  const slugs = getCaseStudySlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const project = getCaseStudyProject(slug);
  const content = getCaseStudyContent(locale as Locale, slug);
  if (!project || !content) {
    return {};
  }

  const viPath = `/projects/${slug}`;
  const enPath = `/en/projects/${slug}`;
  const canonicalPath = locale === "vi" ? viPath : enPath;
  const title = `${project.title} — ${profile.brand} Case Study`;
  const description = content.overview;
  const primaryImage = project.images[0];

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        vi: viPath,
        en: enPath,
        "x-default": viPath,
      },
    },
    openGraph: {
      type: "article",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      siteName: profile.brand,
      url: `${profile.siteUrl}${canonicalPath}`,
      title,
      description,
      images: primaryImage
        ? [
            {
              url: primaryImage.src,
              width: primaryImage.width,
              height: primaryImage.height,
              alt: project.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: primaryImage ? [primaryImage.src] : undefined,
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const project = getCaseStudyProject(slug);
  const content = getCaseStudyContent(locale as Locale, slug);
  if (!project || !content) {
    notFound();
  }

  setRequestLocale(locale);

  const [tCase, tWork, tContent, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "caseStudy" }),
    getTranslations({ locale, namespace: "work" }),
    getTranslations({ locale, namespace: "content" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  const statusMap: Record<ProjectStatus, string> = {
    production: tWork("statusProduction"),
    beta: tWork("statusBeta"),
    "in-development": tWork("statusInDevelopment"),
    archived: tWork("statusArchived"),
  };

  const hasDemo = isValidHttpUrl(project.demoUrl);
  const hasRepo = isValidHttpUrl(project.repositoryUrl);
  const canonicalPath =
    locale === "vi" ? `/projects/${slug}` : `/${locale}/projects/${slug}`;
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const creativeWorkLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: content.overview,
    url: `${profile.siteUrl}${canonicalPath}`,
    inLanguage: locale === "vi" ? "vi-VN" : "en-US",
    author: {
      "@type": "Person",
      name: profile.name,
      alternateName: profile.brand,
      url: profile.siteUrl,
    },
    keywords: project.stack.join(", "),
    ...(hasRepo ? { codeRepository: project.repositoryUrl } : {}),
  };

  const jsonLd = JSON.stringify(creativeWorkLd).replace(/</g, "\\u003c");

  return (
    <article className="mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-6 sm:pb-24 sm:pt-28">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/#work"
          className="group inline-flex min-h-10 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft
            className="size-4 transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span>{tCase("backToWork")}</span>
        </Link>

        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
          <span
            className="relative flex size-2 items-center justify-center"
            aria-hidden="true"
          >
            <span
              className={
                project.status === "production"
                  ? "animate-beacon absolute inset-0 rounded-full bg-emerald-500/75"
                  : "animate-beacon absolute inset-0 rounded-full bg-primary/75"
              }
            />
            <span
              className={
                project.status === "production"
                  ? "relative size-1.5 rounded-full bg-emerald-500"
                  : "relative size-1.5 rounded-full bg-primary"
              }
            />
          </span>
          {statusMap[project.status]}
        </span>
      </div>

      <header className="animate-hero-glide mt-8 border-b pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          {tWork("caseStudy")}
        </p>
        <h1 className="text-display mt-2 text-foreground">{project.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {content.overview}
        </p>

        {content.notice && (
          <div
            role="note"
            className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-foreground"
          >
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <p>{content.notice}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {hasDemo && (
            <Button
              size="default"
              className="spring-lift group min-h-11 active:scale-[0.98]"
              asChild
            >
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink
                  className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
                <span>{tCase("openDemo")}</span>
              </a>
            </Button>
          )}
          {hasRepo && (
            <Button
              size="default"
              variant="outline"
              className="spring-lift group min-h-11 active:scale-[0.98]"
              asChild
            >
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github
                  className="size-4 transition-transform duration-200 group-hover:-rotate-6"
                  aria-hidden="true"
                />
                <span>{tCase("openRepository")}</span>
                <ArrowUpRight
                  className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </Button>
          )}
          <CopyLinkButton
            label={tCase("copyLink")}
            copiedLabel={tCommon("copied")}
            toastMessage={tCase("linkCopied")}
            toastCloseLabel={tCommon("toastClose")}
          />
        </div>
      </header>

      <section aria-labelledby="section-screenshots" className="mt-12">
        <h2
          id="section-screenshots"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          {tCase("sections.screenshots")}
        </h2>
        <div
          className={
            project.images.length > 1
              ? "mt-5 grid gap-6 md:grid-cols-[2fr_1fr]"
              : "mt-5"
          }
        >
          {project.images.map((image, index) => {
            let altText = project.title;
            try {
              altText = tContent(image.altKey);
            } catch {
              altText = project.title;
            }
            const isSquare = image.width === image.height;
            return (
              <figure
                key={image.src}
                className="scroll-card-enter spring-lift group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-colors hover:border-primary/35"
              >
                <div
                  data-project-image={index === 0 ? project.slug : undefined}
                  className={
                    isSquare
                      ? "flex aspect-square items-center justify-center overflow-hidden bg-muted/40 p-6"
                      : "relative aspect-[16/9] overflow-hidden bg-muted/40"
                  }
                >
                  {isSquare ? (
                    <Image
                      src={image.src}
                      alt={altText}
                      width={image.width}
                      height={image.height}
                      className="max-h-full w-auto object-contain transition-transform duration-500 ease-[var(--ease-silo)] group-hover:scale-[1.03]"
                    />
                  ) : (
                    <Image
                      src={image.src}
                      alt={altText}
                      width={image.width}
                      height={image.height}
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 900px"
                      className="size-full object-cover transition-transform duration-500 ease-[var(--ease-silo)] group-hover:scale-[1.025]"
                    />
                  )}
                </div>
                <figcaption className="border-t border-border/60 px-4 py-2.5 text-xs text-muted-foreground">
                  {altText}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section
          aria-labelledby="section-problem"
          className="scroll-card-enter spring-lift rounded-2xl border border-border bg-card p-6 hover:border-primary/35"
        >
          <h2
            id="section-problem"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            {tCase("sections.problem")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {content.problem}
          </p>
        </section>

        <section
          aria-labelledby="section-solution"
          className="scroll-card-enter spring-lift rounded-2xl border border-border bg-card p-6 hover:border-primary/35"
        >
          <h2
            id="section-solution"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            {tCase("sections.solution")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {content.solution}
          </p>
        </section>
      </div>

      <section aria-labelledby="section-features" className="mt-12">
        <h2
          id="section-features"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          {tCase("sections.features")}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {content.features.map((feature) => (
            <div
              key={feature.title}
              className="scroll-card-enter spring-lift rounded-2xl border border-border bg-card p-5 hover:border-primary/35"
            >
              <h3 className="flex items-start gap-2.5 text-base font-medium text-foreground">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{feature.title}</span>
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {feature.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="section-stack" className="scroll-card-enter mt-12">
        <h2
          id="section-stack"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          {tCase("sections.stack")}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2.5" aria-label={tCase("sections.stack")}>
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="spring-lift rounded-full border border-border bg-secondary px-3.5 py-1.5 font-mono text-xs font-medium text-secondary-foreground hover:border-primary/40 hover:text-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="section-architecture" className="mt-12">
        <h2
          id="section-architecture"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          <Layers className="size-5 text-primary" aria-hidden="true" />
          <span>{tCase("sections.architecture")}</span>
        </h2>
        <div className="mt-5 grid gap-4">
          {content.architecture.map((item) => (
            <div
              key={item.layer}
              className="scroll-card-enter spring-lift rounded-2xl border border-border bg-card p-5 hover:border-primary/35"
            >
              <h3 className="font-mono text-sm font-medium text-foreground">
                {item.layer}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="section-challenges" className="mt-12">
        <h2
          id="section-challenges"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          <Wrench className="size-5 text-primary" aria-hidden="true" />
          <span>{tCase("sections.challenges")}</span>
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {content.challenges.map((item) => (
            <div
              key={item.title}
              className="scroll-card-enter spring-lift rounded-2xl border border-border bg-card p-5 hover:border-primary/35"
            >
              <h3 className="text-base font-medium text-foreground">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="section-lessons" className="scroll-card-enter mt-12">
        <h2
          id="section-lessons"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          <Lightbulb className="size-5 text-primary" aria-hidden="true" />
          <span>{tCase("sections.lessons")}</span>
        </h2>
        <ul className="spring-lift mt-4 space-y-3 rounded-2xl border border-border bg-card p-6 hover:border-primary/35">
          {content.lessons.map((lesson) => (
            <li
              key={lesson}
              className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
              />
              <span>{lesson}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="section-scope"
        className="scroll-card-enter spring-lift mt-12 rounded-2xl border border-border bg-muted/30 p-6 hover:border-primary/35"
      >
        <h2
          id="section-scope"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          {tCase("sections.scope")}
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {content.currentScope}
        </p>
      </section>

      <div className="mt-12 border-t pt-8">
        <Link
          href="/#work"
          className="group inline-flex min-h-10 items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft
            className="size-4 transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span>{tCase("backToWork")}</span>
        </Link>
      </div>
    </article>
  );
}
