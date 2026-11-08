import "./globals.css";
import type { Metadata, Viewport } from "next";
import { profile } from "@/data/profile";

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#141416" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: `${profile.brand} — ${profile.name} · ${profile.title}`,
  description:
    "Portfolio của Đỗ Trường Thịnh (@siloneedsleep) — lập trình viên Full-stack, AI Engineer và phần mềm Desktop với Next.js, TypeScript, Rust và Tauri.",
  openGraph: {
    type: "website",
    siteName: profile.brand,
    title: `${profile.brand} — ${profile.name}`,
    images: [
      {
        url: "/og-image.png",
        width: 1424,
        height: 752,
        alt: `${profile.brand} — ${profile.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
