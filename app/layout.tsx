import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.siloneedsleep.duckdns.org"),
  title: "Silo — Đỗ Trường Thịnh · Freelance Developer & AI Engineer",
  description: "Portfolio của Đỗ Trường Thịnh — Freelance Developer và AI Engineer.",
  openGraph: {
    title: "Silo — Đỗ Trường Thịnh",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Silo — Đỗ Trường Thịnh" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({children}:{children:React.ReactNode}){return children}
