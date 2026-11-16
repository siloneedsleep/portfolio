"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";

const SECTION_IDS = ["hero", "work", "skills", "contact"] as const;
type SectionId = (typeof SECTION_IDS)[number];

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProjectPage = pathname.startsWith("/projects");

  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>(
    isProjectPage ? "work" : "hero",
  );

  useEffect(() => {
    if (!isHome) {
      setActiveSection(isProjectPage ? "work" : "hero");
      return;
    }

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isHome, isProjectPage]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const links: readonly { id: SectionId; label: string; href: string }[] = [
    { id: "hero", label: t("home"), href: isHome ? "#hero" : "/#hero" },
    { id: "work", label: t("work"), href: isHome ? "#work" : "/#work" },
    { id: "skills", label: t("skills"), href: isHome ? "#skills" : "/#skills" },
    { id: "contact", label: t("contact"), href: isHome ? "#contact" : "/#contact" },
  ];

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b bg-background/80 transition-transform duration-300 backdrop-blur-xl">
      <a href="#main-content" className="skip-link">
        {t("skipToContent")}
      </a>
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link
          href="/"
          className="group inline-flex min-h-10 items-center gap-2 text-xl font-semibold tracking-tight text-foreground"
        >
          <motion.span
            aria-hidden="true"
            whileHover={{ rotate: -8, scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="inline-flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-sm"
          >
            S
          </motion.span>
          <span>
            Silo<span className="text-primary">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = activeSection === link.id;
            const className = cn(
              "relative rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            );
            return isHome ? (
              <a
                key={link.id}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveSection(link.id)}
                className={className}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                  />
                )}
              </a>
            ) : (
              <Link
                key={link.id}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={className}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-10 min-w-10 px-2 md:hidden"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((prev) => !prev)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 45, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.14 }}
                  className="inline-flex"
                >
                  <X className="size-5" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 45, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -45, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.14 }}
                  className="inline-flex"
                >
                  <Menu className="size-5" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="border-t bg-background px-4 py-3 md:hidden sm:px-6"
          >
            <div className="stagger-children flex flex-col gap-1">
              {links.map((link) => {
                const isActive = activeSection === link.id;
                const className = cn(
                  "flex min-h-11 items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                );
                return isHome ? (
                  <a
                    key={link.id}
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => {
                      setActiveSection(link.id);
                      setOpen(false);
                    }}
                    className={className}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.id}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={className}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
