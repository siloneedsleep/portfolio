"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUp, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Reveal({ children, className, variant = "up", delay = 0 }: { children: ReactNode; className?: string; variant?: "up" | "left" | "right" | "scale"; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) { node.dataset.revealed = "true"; return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.dataset.revealed = "true"; observer.disconnect(); }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} data-reveal={variant} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties} className={cn("reveal", className)}>{children}</div>;
}

export function PortfolioMotion() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--scroll-progress", `${max > 0 ? (window.scrollY / max) * 100 : 0}%`);
      root.classList.toggle("nav-scrolled", window.scrollY > 12);
      root.classList.toggle("nav-hidden", window.scrollY > lastY && window.scrollY > 96);
      setShowTop(window.scrollY > 500);
      lastY = window.scrollY;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onMove = (event: MouseEvent) => {
      if (window.innerWidth < 768 || prefersReducedMotion()) return;
      root.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth - 0.5) * 2}`);
      root.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight - 0.5) * 2}`);
    };
    update(); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMove); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <>
    <div className="scroll-progress" aria-hidden="true" />
    <button type="button" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })} className={cn("scroll-top", showTop && "scroll-top-visible")}><ArrowUp aria-hidden="true" /></button>
    <div className="custom-cursor" aria-hidden="true"><MousePointer2 /></div>
  </>;
}

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} className={cn("magnetic", className)} onPointerMove={(event) => { if (window.innerWidth < 768 || prefersReducedMotion() || !ref.current) return; const rect = ref.current.getBoundingClientRect(); ref.current.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.12}px, ${(event.clientY - rect.top - rect.height / 2) * 0.12}px)`; }} onPointerLeave={() => { if (ref.current) ref.current.style.transform = "translate(0, 0)"; }}>{children}</div>;
}

export function Typewriter({ text }: { text: string }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => { if (prefersReducedMotion()) { setVisible(text.length); return; } const timer = window.setInterval(() => setVisible((value) => value >= text.length ? value : value + 1), 52); return () => window.clearInterval(timer); }, [text]);
  return <span aria-label={text}>{text.slice(0, visible)}<span className="typewriter-caret" aria-hidden="true" /></span>;
}

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} className={cn("tilt-card", className)} onPointerMove={(event) => { if (window.innerWidth < 768 || prefersReducedMotion() || !ref.current) return; const rect = ref.current.getBoundingClientRect(); ref.current.style.setProperty("--tilt-x", `${((event.clientY - rect.top) / rect.height - .5) * -4}deg`); ref.current.style.setProperty("--tilt-y", `${((event.clientX - rect.left) / rect.width - .5) * 4}deg`); }} onPointerLeave={() => { if (!ref.current) return; ref.current.style.setProperty("--tilt-x", "0deg"); ref.current.style.setProperty("--tilt-y", "0deg"); }}>{children}</div>;
}

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { const node = ref.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) return; const reduced = prefersReducedMotion(); if (reduced) setCurrent(value); else { const start = performance.now(); const tick = (now: number) => { const progress = Math.min((now - start) / 900, 1); setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3)))); if (progress < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); } observer.disconnect(); }, { threshold: .6 }); observer.observe(node); return () => observer.disconnect(); }, [value]);
  return <span ref={ref}>{current}{suffix}</span>;
}

export function useInteractiveCursor() { return null; }
