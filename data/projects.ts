export type ProjectCategory = "web" | "ai" | "desktop" | "tools";
export type ProjectStatus = "production" | "beta" | "in-development" | "archived";

export interface ProjectImage {
  src: string;
  altKey: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  stack: readonly string[];
  category: ProjectCategory;
  images: readonly ProjectImage[];
  repositoryUrl?: string;
  demoUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  discontinued?: boolean;
  hasCaseStudy?: boolean;
}

export const projects = [
  {
    id: "auratype",
    slug: "auratype",
    title: "AuraType",
    description:
      "Studio luyện gõ phím song ngữ Việt — Anh yên tĩnh, hỗ trợ bộ gõ Telex/VNI chuẩn grapheme, đấu với Ghost replay và tạo đoạn văn bằng Gemini AI.",
    stack: ["Next.js", "TypeScript", "Zustand", "Dexie", "Gemini AI", "Upstash Redis"],
    category: "web",
    images: [
      {
        src: "/auratype-preview.png",
        altKey: "auratypePreviewAlt",
        width: 1600,
        height: 900,
      },
    ],
    demoUrl: "https://auratype.duckdns.org/",
    repositoryUrl: "https://github.com/siloneedsleep/auratype",
    status: "production",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "orbis",
    slug: "orbis-agent",
    title: "Orbis Agent",
    description:
      "Autonomous AI Desktop Companion — trợ lý AI điều khiển máy tính, tích hợp Hybrid LLM (Local Ollama & Cloud) với giao diện floating overlay mượt mà.",
    stack: ["Rust", "Tauri", "TypeScript", "React", "Tailwind CSS", "Ollama"],
    category: "desktop",
    images: [
      {
        src: "/orbis-preview.png",
        altKey: "orbisPreviewAlt",
        width: 1376,
        height: 768,
      },
    ],
    status: "archived",
    featured: true,
    discontinued: true,
    hasCaseStudy: false,
  },
  {
    id: "antigravity-mod",
    slug: "antigravity-mod",
    title: "Antigravity Mod",
    description:
      "Bộ công cụ tùy biến giao diện & Việt hóa cho Google Antigravity 2.0, tích hợp nhân vật 3D Chibi Furina (Three.js/WebGL) tương tác theo từng chữ đang gõ.",
    stack: ["PowerShell", "Three.js", "WebGL", "JavaScript", "CSS", "CDP"],
    category: "tools",
    images: [
      {
        src: "/antigravity-mod-preview.png",
        altKey: "antigravityModPreviewAlt",
        width: 1920,
        height: 1128,
      },
      {
        src: "/furina-3d-preview.png",
        altKey: "antigravityModFurinaAlt",
        width: 400,
        height: 400,
      },
    ],
    repositoryUrl: "https://github.com/siloneedsleep/antigravity-mod",
    status: "beta",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "nimbora",
    slug: "nimbora",
    title: "Nimbora",
    description: "Workspace tích hợp AI Agent — nơi agent và con người cùng làm việc.",
    stack: ["JavaScript", "TypeScript", "CSS", "SQL"],
    category: "ai",
    images: [
      {
        src: "/nimbora-preview.png",
        altKey: "nimboraPreviewAlt",
        width: 1376,
        height: 768,
      },
    ],
    status: "archived",
    featured: true,
    discontinued: true,
    hasCaseStudy: false,
  },
] as const satisfies readonly Project[];

export function isValidHttpUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function isValidProject(project: Project): boolean {
  return Boolean(
    project.id.trim() &&
      project.slug.trim() &&
      project.title.trim() &&
      project.description.trim() &&
      project.stack.length > 0 &&
      project.images.length > 0 &&
      project.images[0]?.src.trim(),
  );
}

export function getCaseStudySlugs(): string[] {
  return projects
    .filter(
      (project) =>
        isValidProject(project) &&
        !("discontinued" in project && project.discontinued) &&
        project.hasCaseStudy,
    )
    .map((project) => project.slug);
}

export function getCaseStudyProject(slug: string): Project | undefined {
  return projects.find(
    (project) =>
      project.slug === slug &&
      isValidProject(project) &&
      !("discontinued" in project && project.discontinued) &&
      project.hasCaseStudy,
  );
}
