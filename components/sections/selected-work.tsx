"use client";

import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  isValidProject,
  projects,
  type ProjectStatus,
} from "@/data/projects";
import { ProjectCard, type ProjectCardItem } from "@/components/ui/project-card";
import { DiscontinuedProjectDialog } from "@/components/ui/discontinued-project-dialog";

export function SelectedWork() {
  const t = useTranslations("work");
  const content = useTranslations("content");
  const [selectedDiscontinued, setSelectedDiscontinued] =
    useState<ProjectCardItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const validProjects = projects.filter(isValidProject);

  const getProjectDescription = (id: string, defaultDesc: string) => {
    const keyMap: Record<string, string> = {
      auratype: "auratypeDescription",
      "antigravity-mod": "antigravityModDescription",
      orbis: "orbisDescription",
      nimbora: "nimboraDescription",
    };
    const key = keyMap[id];
    if (!key) return defaultDesc;
    try {
      return content(key);
    } catch {
      return defaultDesc;
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const map: Record<ProjectStatus, string> = {
      production: t("statusProduction"),
      beta: t("statusBeta"),
      "in-development": t("statusInDevelopment"),
      archived: t("statusArchived"),
    };
    return map[status];
  };

  const handleSelectDiscontinued = (project: ProjectCardItem) => {
    setSelectedDiscontinued(project);
    setDialogOpen(true);
  };

  return (
    <section
      id="work"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24"
    >
      <p className="font-mono text-sm text-primary">01 /</p>
      <h2 className="text-display-h2 mt-3">{t("title")}</h2>
      <p className="mt-4 max-w-xl text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-10">
        {validProjects.length ? (
          <div className="grid gap-8 md:grid-cols-2">
            {validProjects.map((project, index) => {
              const isDiscontinued =
                "discontinued" in project && Boolean(project.discontinued);
              const altKey = project.images[0]?.altKey;
              let imageAlt: string = project.title;
              if (altKey) {
                try {
                  imageAlt = content(altKey);
                } catch {
                  imageAlt = project.title;
                }
              }

              return (
                <ProjectCard
                  key={project.id}
                  index={index}
                  project={{
                    id: project.id,
                    slug: project.slug,
                    title: project.title,
                    description: getProjectDescription(
                      project.id,
                      project.description,
                    ),
                    stack: project.stack,
                    image: project.images[0].src,
                    imageAlt,
                    demoUrl:
                      !isDiscontinued && "demoUrl" in project
                        ? project.demoUrl
                        : undefined,
                    repositoryUrl:
                      !isDiscontinued && "repositoryUrl" in project
                        ? project.repositoryUrl
                        : undefined,
                    status: project.status,
                    discontinued: isDiscontinued,
                    hasCaseStudy: !isDiscontinued && project.hasCaseStudy,
                  }}
                  statusLabel={getStatusLabel(project.status)}
                  caseStudyLabel={t("caseStudy")}
                  liveDemoLabel={t("liveDemo")}
                  repositoryLabel={t("viewRepository")}
                  discontinuedBadge={t("discontinuedBadge")}
                  discontinuedAction={t("discontinuedAction")}
                  onSelectDiscontinued={handleSelectDiscontinued}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-14 text-center text-muted-foreground">
            <FolderOpen className="size-8 text-primary" aria-hidden="true" />
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
    </section>
  );
}
