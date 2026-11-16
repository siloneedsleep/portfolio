"use client";

import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "motion/react";
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
        <div className="absolute -left-24 top-16 size-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-12 right-0 size-96 rounded-full bg-blue-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_240px] md:py-24">
        <div className="max-w-2xl">
          <motion.p
            initial={{ y: 8 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 text-sm font-medium text-primary"
          >
            {t("greeting")}
          </motion.p>
          <h1 className="text-display hero-name text-foreground" aria-label={t("name")}>
            {t("name").split(" ").map((word, index) => (
              <span key={index} aria-hidden="true" className="hero-word-mask">
                <span className="hero-word" style={{ animationDelay: `${index * 70}ms` }}>{word}</span>
                {" "}
              </span>
            ))}
          </h1>
          <motion.div
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground"
          >
            <span className="font-mono">{t("handle")}</span>
            <span aria-hidden="true">·</span>
            <span>{t("title")}</span>
          </motion.div>

          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-xl font-medium leading-snug text-foreground sm:text-2xl"
          >
            {t("headline")}
          </motion.p>
          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground"
          >
            {t("summary")}
          </motion.p>

          <motion.blockquote
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 border-l-2 border-primary/35 pl-4"
          >
            <p lang="zh-Hans" className="text-base italic text-foreground/85">
              {t("tagline")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t("taglineSub")}</p>
          </motion.blockquote>

          <motion.div
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Magnetic>
              <Button
                size="lg"
                className="group spring-lift min-h-11 active:scale-[0.98]"
                asChild
              >
                <a href="#work">
                  {t("ctaWork")}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </Button>
            </Magnetic>
            <Button
              size="lg"
              variant="outline"
              className="group spring-lift min-h-11 active:scale-[0.98]"
              asChild
            >
              <a href="#contact">
                <Mail
                  className="size-4 transition-transform duration-300 group-hover:-rotate-6"
                  aria-hidden="true"
                />
                {t("ctaContact")}
              </a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.94, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="relative mx-auto md:mx-0 md:justify-self-end"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-5 rounded-full bg-primary/15 blur-2xl"
          />
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="relative"
          >

            <div className="relative size-36 overflow-hidden rounded-full border-4 border-background shadow-2xl ring-4 ring-primary/20 sm:size-44">
              <Image
                src={profile.avatar}
                alt={t("avatarAlt")}
                width={176}
                height={176}
                priority
                className="size-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
