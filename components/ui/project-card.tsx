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
import { motion } from "motion/react";
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
  index?: number;
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
  index = 0,
  statusLabel,
  caseStudyLabel,
  liveDemoLabel,
  repositoryLabel,
  discontinuedBadge,
  discontinuedAction,
  onSelectDiscontinued,
}: ProjectCardProps) {
  const [loaded, setLoaded] = useState(false);

  const revealProps = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.05 },
    transition: {
      duration: 0.48,
      delay: Math.min(index % 2, 1) * 0.07,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };

  if (project.discontinued) {
    return (
      <motion.div {...revealProps} className="h-full">
        <Card className="spring-lift group relative flex h-full flex-col overflow-hidden border-dashed border-border/80 bg-card/70 transition-colors hover:border-muted-foreground/40 has-focus-visible:border-ring">
          <div data-project-image={project.hasCaseStudy ? project.slug : undefined}
            className="relative aspect-[16/9] overflow-hidden bg-muted">
            {!loaded && <Skeleton className="absolute inset-0" />}
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale opacity-55 transition-[opacity,transform] duration-500 ease-[var(--ease-silo)] group-hover:scale-[1.025] group-hover:opacity-45"
              onLoad={() => setLoaded(true)}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-background/25"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-3 z-[1] inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              <Ban className="size-3.5" />
              <span>{discontinuedBadge}</span>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <span className="inline-flex translate-y-2 scale-95 items-center gap-2 rounded-lg border border-border/70 bg-background/95 px-4 py-2 text-sm font-medium text-muted-foreground shadow-md transition-all duration-300 ease-[var(--ease-spring)] group-hover:translate-y-0 group-hover:scale-100">
                <Lock className="size-4 transition-transform duration-300 group-hover:scale-110" />
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
                <Lock className="size-3.5 transition-transform duration-300 group-hover:-rotate-6" aria-hidden="true" />
                <span>{discontinuedBadge}</span>
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  const hasDemo = isValidHttpUrl(project.demoUrl);
  const hasRepo = isValidHttpUrl(project.repositoryUrl);

  return (
    <motion.div {...revealProps} className="h-full">
      <TiltCard>
        <Card className="tilt-spotlight group flex h-full flex-col overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-primary/45 hover:shadow-xl">
          <div data-project-image={project.hasCaseStudy ? project.slug : undefined}
            className="relative aspect-[16/9] overflow-hidden bg-muted">
            {!loaded && <Skeleton className="absolute inset-0" />}
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-[var(--ease-silo)] group-hover:scale-[1.03]"
              onLoad={() => setLoaded(true)}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-0.5">
              <span
                className="relative flex size-2 items-center justify-center"
                aria-hidden="true"
              >
                <span
                  className={
                    project.status === "production"
                      ? "animate-beacon absolute inset-0 rounded-full bg-emerald-500/75"
                      : "animate-beacon absolute inset-0 rounded-full bg-primary/75"
                  }
                />
                <span
                  className={
                    project.status === "production"
                      ? "relative size-1.5 rounded-full bg-emerald-500"
                      : "relative size-1.5 rounded-full bg-primary"
                  }
                />
              </span>
              {statusLabel}
            </span>
          </div>

          <div className="relative z-[2] flex flex-1 flex-col gap-4 p-6">
            <div>
              <h3 className="text-card-title text-2xl text-foreground transition-colors duration-200 group-hover:text-primary">
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
                  className="spring-lift rounded-full border border-transparent bg-secondary px-2.5 py-1 text-xs text-secondary-foreground hover:border-primary/35 hover:text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-4 text-sm">
              {project.hasCaseStudy && (
                <Link
                  href={`/projects/${project.slug}`}
                  data-project-transition={project.slug}
                  className="group/link inline-flex min-h-10 items-center gap-1.5 font-medium text-primary hover:underline"
                >
                  <BookOpen
                    className="size-4 transition-transform duration-200 group-hover/link:scale-110"
                    aria-hidden="true"
                  />
                  {caseStudyLabel}
                </Link>
              )}
              {hasDemo && (
                <a
                  className="group/link inline-flex min-h-10 items-center gap-1.5 text-foreground transition-colors hover:text-primary"
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink
                    className="size-4 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    aria-hidden="true"
                  />
                  {liveDemoLabel}
                </a>
              )}
              {hasRepo && (
                <a
                  className="group/link inline-flex min-h-10 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github
                    className="size-4 transition-transform duration-200 group-hover/link:-rotate-6"
                    aria-hidden="true"
                  />
                  {repositoryLabel}
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>
          </div>
        </Card>
      </TiltCard>
    </motion.div>
  );
}
