"use client";

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
      className="min-h-10 min-w-10 cursor-pointer px-2.5 font-mono text-xs font-medium"
    >
      {next.toUpperCase()}
    </Button>
  );
}
