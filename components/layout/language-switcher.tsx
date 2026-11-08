"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");
  const next = locale === "vi" ? "en" : "vi";

  const handleSwitch = () => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (typeof document !== "undefined") {
      document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
    }
    router.replace(`${pathname}${hash}`, { locale: next, scroll: false });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={t("switchLanguage")}
      onClick={handleSwitch}
      className="min-h-10 min-w-10 cursor-pointer overflow-hidden px-2.5 font-mono text-xs font-medium active:scale-90"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={next}
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -6, opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {next.toUpperCase()}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
