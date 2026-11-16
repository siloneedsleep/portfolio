"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export function RouteTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const complete = useRef<(() => void) | null>(null);

  useEffect(() => {
    complete.current?.();
  }, [pathname]);

  useEffect(() => {
    let busy = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    let active: { skipTransition: () => void } | undefined;
    const cleanups: (() => void)[] = [];

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor || anchor.hasAttribute("download") || anchor.target || anchor.dataset.noTransition !== undefined) return;
      const url = new URL(anchor.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || url.search !== location.search) return;
      if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (busy) {
        active?.skipTransition();
        complete.current?.();
        return;
      }

      event.preventDefault();
      busy = true;
      document.documentElement.dataset.viewTransition = "true";
      const slug = anchor.dataset.projectTransition;
      const setImageName = () => {
        if (!slug || !matchMedia("(min-width: 768px)").matches) return;
        const image = Array.from(document.querySelectorAll<HTMLElement>("[data-project-image]"))
          .find(node => node.dataset.projectImage === slug);
        if (image) {
          image.style.viewTransitionName = "project-preview";
          cleanups.push(() => { image.style.viewTransitionName = ""; });
        }
      };
      setImageName();
      const transition = document.startViewTransition(async () => {
        await new Promise<void>(resolve => {
          const finish = () => {
            clearTimeout(timer);
            complete.current = null;
            resolve();
          };
          complete.current = finish;
          timer = setTimeout(finish, 2500);
          router.push(`${url.pathname}${url.search}${url.hash}`);
        });
        if (!cancelled) {
          setImageName();
          const images = Array.from(document.querySelectorAll<HTMLImageElement>('[style*="project-preview"] img'));
          await Promise.race([
            Promise.all(images.map(image => image.decode().catch(() => {}))),
            new Promise(resolve => setTimeout(resolve, 300)),
          ]);
        }
      });
      active = transition;
      void transition.finished.catch(() => {}).finally(() => {
        cleanups.splice(0).forEach(cleanup => cleanup());
        delete document.documentElement.dataset.viewTransition;
        busy = false;
      });
    };

    document.addEventListener("click", onClick, true);
    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick, true);
      complete.current?.();
      active?.skipTransition();
      cleanups.splice(0).forEach(cleanup => cleanup());
      delete document.documentElement.dataset.viewTransition;
    };
  }, [router]);

  return null;
}
