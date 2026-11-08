"use client";

import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { ProjectCard, type ProjectCardItem } from "@/components/ui/project-card";
import { DiscontinuedProjectDialog } from "@/components/ui/discontinued-project-dialog";

export function SelectedWork() {
  const t = useTranslations("work");
  const content = useTranslations("content");
  const [selectedDiscontinued, setSelectedDiscontinued] = useState<ProjectCardItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getProjectDescription = (id: string, defaultDesc: string) => {
    if (id === "auratype") {
      try {
        return content("auratypeDescription");
      } catch {
        return defaultDesc;
      }
    }
    if (id === "antigravity-mod") {
      try {
        return content("antigravityModDescription");
      } catch {
        return defaultDesc;
      }
    }
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

  const handleSelectDiscontinued = (project: ProjectCardItem) => {
    setSelectedDiscontinued(project);
    setDialogOpen(true);
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
            {projects.map((project) => {
              const isDiscontinued = "discontinued" in project && Boolean(project.discontinued);
              return (
                <ProjectCard
                  key={project.id}
                  project={{
                    id: project.id,
                    title: project.title,
                    description: getProjectDescription(project.id, project.description),
                    tags: project.tags,
                    image: project.image,
                    liveUrl: isDiscontinued ? undefined : project.liveUrl,
                    githubUrl: isDiscontinued ? undefined : project.githubUrl,
                    discontinued: isDiscontinued,
                  }}
                  view={t("viewProject")}
                  live={t("liveDemo")}
                  source={t("sourceCode")}
                  discontinuedBadge={t("discontinuedBadge")}
                  discontinuedAction={t("discontinuedAction")}
                  onSelectDiscontinued={handleSelectDiscontinued}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-14 text-center text-muted-foreground">
            <FolderOpen className="size-8 text-primary" />
            <p>{t("empty")}</p>
          </div>
        )}
      </div>

      <DiscontinuedProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectTitle={selectedDiscontinued?.title ?? ""}
        badgeLabel={t("discontinuedBadge")}
        title={t("discontinuedModalTitle")}
        description={t("discontinuedModalDescription", {
          project: selectedDiscontinued?.title ?? "",
        })}
        closeLabel={t("discontinuedModalClose")}
      />
    </motion.section>
  );
}
