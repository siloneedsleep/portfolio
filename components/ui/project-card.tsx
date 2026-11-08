"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Ban,
  BookOpen,
  ExternalLink,
  Github,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { isValidHttpUrl, type ProjectStatus } from "@/data/projects";
import { Card } from "./card";
import { Skeleton } from "./skeleton";
import { TiltCard } from "@/components/animations/portfolio-motion";

export interface ProjectCardItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  stack: readonly string[];
  image: string;
  imageAlt: string;
  demoUrl?: string;
  repositoryUrl?: string;
  status: ProjectStatus;
  discontinued?: boolean;
  hasCaseStudy?: boolean;
}

interface ProjectCardProps {
  project: ProjectCardItem;
  statusLabel: string;
  caseStudyLabel: string;
  liveDemoLabel: string;
  repositoryLabel: string;
  discontinuedBadge: string;
  discontinuedAction: string;
  onSelectDiscontinued?: (project: ProjectCardItem) => void;
}

export function ProjectCard({
  project,
  statusLabel,
  caseStudyLabel,
  liveDemoLabel,
  repositoryLabel,
  discontinuedBadge,
  discontinuedAction,
  onSelectDiscontinued,
}: ProjectCardProps) {
  const [loaded, setLoaded] = useState(false);

  if (project.discontinued) {
    return (
      <Card className="group relative flex h-full flex-col overflow-hidden border-dashed border-border/80 bg-card/70 transition-colors hover:border-muted-foreground/40 has-focus-visible:border-ring">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {!loaded && <Skeleton className="absolute inset-0" />}
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover grayscale opacity-55 transition-opacity duration-300 group-hover:opacity-45"
            onLoad={() => setLoaded(true)}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-background/25"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-3 z-[1] inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-md"
          >
            <Ban className="size-3.5" />
            <span>{discontinuedBadge}</span>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <span className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/90 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
              <Lock className="size-4" />
              {discontinuedAction}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h3 className="text-card-title text-2xl text-foreground/80">
              {project.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 opacity-70">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4 text-sm">
            <div aria-hidden="true" className="flex gap-4">
              <span className="inline-flex items-center gap-1 text-muted-foreground/50 line-through">
                <ExternalLink className="size-4" />
                {liveDemoLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground/50 line-through">
                <Github className="size-4" />
                {repositoryLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectDiscontinued?.(project)}
              aria-label={`${project.title} — ${discontinuedBadge}`}
              className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground after:absolute after:inset-0 after:z-10 after:content-['']"
            >
              <Lock className="size-3.5" aria-hidden="true" />
              <span>{discontinuedBadge}</span>
            </button>
          </div>
        </div>
      </Card>
    );
  }

  const hasDemo = isValidHttpUrl(project.demoUrl);
  const hasRepo = isValidHttpUrl(project.repositoryUrl);

  return (
    <TiltCard>
      <Card className="group flex h-full flex-col overflow-hidden transition-colors hover:border-primary/40">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {!loaded && <Skeleton className="absolute inset-0" />}
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onLoad={() => setLoaded(true)}
          />
          <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
            <span
              aria-hidden="true"
              className={
                project.status === "production"
                  ? "size-1.5 rounded-full bg-emerald-500"
                  : "size-1.5 rounded-full bg-primary"
              }
            />
            {statusLabel}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h3 className="text-card-title text-2xl text-foreground">
              {project.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-4 text-sm">
            {project.hasCaseStudy && (
              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex min-h-10 items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <BookOpen className="size-4" aria-hidden="true" />
                {caseStudyLabel}
              </Link>
            )}
            {hasDemo && (
              <a
                className="inline-flex min-h-10 items-center gap-1.5 text-foreground transition-colors hover:text-primary"
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                {liveDemoLabel}
              </a>
            )}
            {hasRepo && (
              <a
                className="inline-flex min-h-10 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" aria-hidden="true" />
                {repositoryLabel}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </Card>
    </TiltCard>
  );
}
