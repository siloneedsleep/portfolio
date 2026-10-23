"use client";

import { FolderOpen } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/project-card";

export function SelectedWork() {
  const t = useTranslations("work");
  const content = useTranslations("content");

  const getProjectDescription = (id: string, defaultDesc: string) => {
    if (id === "orbis") {
      try {
        return content("orbisDescription");
      } catch {
        return defaultDesc;
      }
    }
    if (id === "nimbora") {
      try {
        return content("nimboraDescription");
      } catch {
        try {
          return content("projectDescription");
        } catch {
          return defaultDesc;
        }
      }
    }
    return defaultDesc;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      id="work"
      className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24"
    >
      <p className="text-sm text-primary">01 /</p>
      <h2 className="text-display-h2 mt-3 text-4xl sm:text-5xl">{t("title")}</h2>
      <p className="mt-4 max-w-xl text-muted-foreground">{t("subtitle")}</p>
      <div className="mt-10">
        {projects.length ? (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{
                  ...project,
                  description: getProjectDescription(project.id, project.description),
                }}
                view={t("viewProject")}
                live={t("liveDemo")}
                source={t("sourceCode")}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-14 text-center text-muted-foreground">
            <FolderOpen className="size-8 text-primary" />
            <p>{t("empty")}</p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
