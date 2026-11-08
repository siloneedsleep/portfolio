"use client";

import { ArrowLeft, FolderGit2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="animate-hero-glide mx-auto flex min-h-[70svh] max-w-3xl flex-col items-start justify-center px-4 pb-20 pt-28 sm:px-6">
      <p className="font-mono text-sm font-semibold text-primary">404 /</p>
      <h1 className="text-display mt-3 text-foreground">{t("title")}</h1>
      <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
        {t("subtitle")}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" className="spring-lift group min-h-11 active:scale-[0.98]" asChild>
          <Link href="/">
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
            <span>{t("backHome")}</span>
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="spring-lift group min-h-11 active:scale-[0.98]" asChild>
          <Link href="/#work">
            <FolderGit2 className="size-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
            <span>{t("viewProjects")}</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
