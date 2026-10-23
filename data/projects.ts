export const projects = [
  {
    id: "orbis",
    title: "Orbis Agent",
    description: "Autonomous AI Desktop Companion — trợ lý AI điều khiển máy tính, tích hợp Hybrid LLM (Local Ollama & Cloud) với giao diện floating overlay mượt mà.",
    tags: ["Rust", "Tauri", "TypeScript", "React", "Tailwind CSS", "Ollama"],
    image: "/orbis-preview.png",
    liveUrl: "https://github.com/siloneedsleep/orbis-agent",
    githubUrl: "https://github.com/siloneedsleep/orbis-agent",
    featured: true,
  },
  {
    id: "nimbora",
    title: "Nimbora",
    description: "Workspace tích hợp AI Agent — nơi agent và con người cùng làm việc.",
    tags: ["JavaScript", "TypeScript", "CSS", "SQL"],
    image: "/nimbora-preview.png",
    liveUrl: "https://nimbora.duckdns.org/",
    githubUrl: "https://github.com/siloneedsleep/nimbora",
    featured: true,
  },
] as const;
