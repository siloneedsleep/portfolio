"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("common");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={t("theme")}
        className="min-h-10 min-w-10 px-2"
      >
        <span aria-hidden="true" className="text-sm leading-none">
          ◐
        </span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? t("switchToLight") : t("switchToDark");

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="min-h-10 min-w-10 cursor-pointer px-2"
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
