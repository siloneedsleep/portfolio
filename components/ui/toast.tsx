"use client";

import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";

interface ToastProps {
  open: boolean;
  message: string;
  closeLabel: string;
  onClose: () => void;
  durationMs?: number;
}

export function Toast({
  open,
  message,
  closeLabel,
  onClose,
  durationMs = 3200,
}: ToastProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;

    const supportsPopover =
      typeof HTMLElement !== "undefined" && "popover" in HTMLElement.prototype;

    if (supportsPopover) {
      if (open) {
        if (!el.matches(":popover-open")) {
          try {
            el.showPopover();
          } catch {
            el.setAttribute("data-open", "true");
          }
        }
      } else if (el.matches(":popover-open")) {
        try {
          el.hidePopover();
        } catch {
          el.removeAttribute("data-open");
        }
      }
    } else if (open) {
      el.setAttribute("data-open", "true");
    } else {
      el.removeAttribute("data-open");
    }
  }, [open, message]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      onCloseRef.current();
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [open, message, durationMs]);

  return (
    <div
      ref={popoverRef}
      popover="manual"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="silo-toast fixed bottom-5 right-5 z-[90] hidden max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground shadow-lg"
    >
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Check className="size-3.5" aria-hidden="true" />
      </span>
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
