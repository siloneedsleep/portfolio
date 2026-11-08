"use client";

import { Facebook, Github, Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/animations/portfolio-motion";

export function Footer() {
  const t = useTranslations("nav");
  const footer = useTranslations("footer");
  const pathname = usePathname();
  const isHome = pathname === "/";

  const links = [
    ["hero", t("home")],
    ["work", t("work")],
    ["skills", t("skills")],
    ["contact", t("contact")],
  ] as const;

  return (
    <Reveal>
      <footer className="border-t">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground"
            >
              <span
                aria-hidden="true"
                className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground"
              >
                S
              </span>
              <span>
                Silo<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {footer("builtWith")}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm text-muted-foreground">
            {links.map(([id, label]) =>
              isHome ? (
                <a
                  key={id}
                  href={`#${id}`}
                  className="w-fit transition-[color,transform] duration-200 hover:translate-x-1 hover:text-foreground"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={id}
                  href={`/#${id}`}
                  className="w-fit transition-[color,transform] duration-200 hover:translate-x-1 hover:text-foreground"
                >
                  {label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="spring-lift inline-flex size-10 items-center justify-center rounded-lg border border-transparent hover:border-border hover:bg-card hover:text-foreground"
              >
                <Github className="size-5" aria-hidden="true" />
              </a>
              <a
                href={profile.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="spring-lift inline-flex size-10 items-center justify-center rounded-lg border border-transparent hover:border-border hover:bg-card hover:text-foreground"
              >
                <Facebook className="size-5" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="spring-lift inline-flex size-10 items-center justify-center rounded-lg border border-transparent hover:border-border hover:bg-card hover:text-foreground"
              >
                <Mail className="size-5" aria-hidden="true" />
              </a>
            </div>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MessageCircle className="size-3.5" aria-hidden="true" />
              <span>Discord: {profile.discordHandle}</span>
            </p>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl items-center justify-between border-t px-4 py-6 text-xs text-muted-foreground sm:px-6">
          <span>{footer("rights")}</span>
        </div>
      </footer>
    </Reveal>
  );
}
