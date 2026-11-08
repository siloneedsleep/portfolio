"use client";

import { useTranslations } from "next-intl";
import { skills } from "@/data/skills";
import { SkillPill } from "@/components/ui/skill-pill";

export function Skills() {
  const t = useTranslations("skills");
  const groups = [
    [t("languages"), skills.languages],
    [t("frameworks"), skills.frameworks],
    [t("tools"), skills.tools],
  ] as const;

  return (
    <section
      id="skills"
      className="scroll-mt-20 border-y bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <p className="font-mono text-sm text-primary">02 /</p>
        <h2 className="text-display-h2 mt-3">{t("title")}</h2>
        <p className="mt-4 max-w-xl text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {groups.map(([title, items]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                {title}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <li key={item.name}>
                    <SkillPill {...item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
