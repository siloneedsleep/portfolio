"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  variant?: "up" | "left" | "right" | "scale";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) {
      node.dataset.revealed = "true";
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.dataset.revealed = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={variant}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}

export function PortfolioMotion() {
  const [showTop, setShowTop] = useState(false);
  const t = useTranslations("common");

  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      root.style.setProperty("--scroll-progress", `${ratio}`);
      root.classList.toggle("nav-scrolled", window.scrollY > 12);
      root.classList.toggle("nav-hidden", window.scrollY > lastY && window.scrollY > 96);
      setShowTop(window.scrollY > 500);
      lastY = window.scrollY;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <button
        type="button"
        aria-label={t("scrollToTop")}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion() ? "auto" : "smooth",
          })
        }
        className={cn("scroll-top cursor-pointer", showTop && "scroll-top-visible")}
      >
        <ArrowUp aria-hidden="true" />
      </button>
    </>
  );
}

export function Magnetic({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn("magnetic", className)}
      onPointerMove={(event) => {
        if (window.innerWidth < 768 || prefersReducedMotion() || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        ref.current.style.transform = `translate(${
          (event.clientX - rect.left - rect.width / 2) * 0.1
        }px, ${(event.clientY - rect.top - rect.height / 2) * 0.1}px)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0, 0)";
      }}
    >
      {children}
    </div>
  );
}

export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn("tilt-card h-full", className)}
      onPointerMove={(event) => {
        if (window.innerWidth < 768 || prefersReducedMotion() || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        ref.current.style.setProperty(
          "--tilt-x",
          `${((event.clientY - rect.top) / rect.height - 0.5) * -3}deg`,
        );
        ref.current.style.setProperty(
          "--tilt-y",
          `${((event.clientX - rect.left) / rect.width - 0.5) * 3}deg`,
        );
      }}
      onPointerLeave={() => {
        if (!ref.current) return;
        ref.current.style.setProperty("--tilt-x", "0deg");
        ref.current.style.setProperty("--tilt-y", "0deg");
      }}
    >
      {children}
    </div>
  );
}
