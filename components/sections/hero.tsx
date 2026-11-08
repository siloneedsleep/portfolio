"use client";

import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { Magnetic } from "@/components/animations/portfolio-motion";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-4rem)] scroll-mt-20 items-center overflow-hidden pt-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-16 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-12 right-0 size-96 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_240px] md:py-24">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium text-primary">{t("greeting")}</p>
          <h1 className="text-display text-foreground">{t("name")}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-mono">{t("handle")}</span>
            <span aria-hidden="true">·</span>
            <span>{t("title")}</span>
          </div>

          <p className="mt-6 text-xl font-medium leading-snug text-foreground sm:text-2xl">
            {t("headline")}
          </p>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">
            {t("summary")}
          </p>

          <blockquote className="mt-6 border-l-2 border-primary/35 pl-4">
            <p lang="zh-Hans" className="text-base italic text-foreground/85">
              {t("tagline")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t("taglineSub")}</p>
          </blockquote>

          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button size="lg" className="min-h-11" asChild>
                <a href="#work">
                  {t("ctaWork")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </Magnetic>
            <Button size="lg" variant="outline" className="min-h-11" asChild>
              <a href="#contact">
                <Mail className="size-4" aria-hidden="true" />
                {t("ctaContact")}
              </a>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto md:mx-0 md:justify-self-end">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl"
          />
          <div className="relative size-36 overflow-hidden rounded-full border-4 border-background shadow-2xl ring-4 ring-primary/20 sm:size-44">
            <Image
              src={profile.avatar}
              alt={t("avatarAlt")}
              width={176}
              height={176}
              priority
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
