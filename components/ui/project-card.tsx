"use client";

import Image from "next/image";
import { Ban, ExternalLink, Github, Lock } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Skeleton } from "./skeleton";
import { Button } from "./button";
import { TiltCard } from "@/components/animations/portfolio-motion";

export interface ProjectCardItem {
  id: string;
  title: string;
  description: string;
  tags: readonly string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  discontinued?: boolean;
}

interface ProjectCardProps {
  project: ProjectCardItem;
  view: string;
  live: string;
  source: string;
  discontinuedBadge: string;
  discontinuedAction: string;
  onSelectDiscontinued?: (project: ProjectCardItem) => void;
}

export function ProjectCard({
  project,
  view,
  live,
  source,
  discontinuedBadge,
  discontinuedAction,
  onSelectDiscontinued,
}: ProjectCardProps) {
  const [loaded, setLoaded] = useState(false);

  if (project.discontinued) {
    return (
      <Card className="group relative overflow-hidden border-dashed border-border/80 bg-card/70 transition-colors hover:border-muted-foreground/40 has-focus-visible:border-ring">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {!loaded && <Skeleton className="absolute inset-0" />}
          <Image
            src={project.image}
            alt={project.title}
            fill
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

        <div className="flex flex-col gap-4 p-6">
          <div>
            <h3 className="text-card-title text-2xl text-foreground/75">
              {project.title}
            </h3>
            <p className="mt-2 text-muted-foreground/80">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 opacity-65">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div aria-hidden="true" className="flex gap-4">
              <span className="inline-flex items-center gap-1 text-muted-foreground/50 line-through">
                <ExternalLink className="size-4" />
                {live}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground/50 line-through">
                <Github className="size-4" />
                {source}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectDiscontinued?.(project)}
              aria-label={`${project.title} — ${discontinuedBadge}`}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground after:absolute after:inset-0 after:z-10 after:content-['']"
            >
              <Lock className="size-3.5" aria-hidden="true" />
              <span>{discontinuedBadge}</span>
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <TiltCard>
      <Card className="group overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {!loaded && <Skeleton className="absolute inset-0" />}
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onLoad={() => setLoaded(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
            <Button asChild variant="outline" className="bg-background/90">
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                {view}
              </a>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-6">
          <div>
            <h3 className="text-card-title text-2xl">{project.title}</h3>
            <p className="mt-2 text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4 text-sm">
            <a
              className="inline-flex items-center gap-1 text-primary hover:underline"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="size-4" />
              {live}
            </a>
            <a
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Github className="size-4" />
              {source}
            </a>
          </div>
        </div>
      </Card>
    </TiltCard>
  );
}
