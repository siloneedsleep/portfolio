"use client";

import { useEffect, useId, useRef } from "react";
import { Ban, X } from "lucide-react";

let supportsDisplayTransition: boolean | undefined;

function canTransitionDisplay(): boolean {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.("transition-behavior", "allow-discrete") || !document.body) {
    return false;
  }
  const probe = document.createElement("div");
  probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = "none";
  supportsDisplayTransition = getComputedStyle(probe).display === "block";
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit(): boolean {
  return Boolean(window.CSS?.supports?.("overlay", "auto") && canTransitionDisplay());
}

async function closeTopLayer(dialog: HTMLDialogElement): Promise<void> {
  if (!dialog.open) return;
  if (!supportsTopLayerExit()) {
    if (dialog.hasAttribute("data-closing")) return;
    dialog.setAttribute("data-closing", "");
    const animations = dialog.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((animation) => animation.finished)),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
    }
    if (!dialog.hasAttribute("data-closing")) return;
    dialog.removeAttribute("data-closing");
  }
  if (dialog.open) dialog.close();
}

interface DiscontinuedProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  badgeLabel: string;
  title: string;
  description: string;
  closeLabel: string;
}

export function DiscontinuedProjectDialog({
  open,
  onOpenChange,
  projectTitle,
  badgeLabel,
  title,
  description,
  closeLabel,
}: DiscontinuedProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.removeAttribute("data-closing");
      primaryButtonRef.current?.setAttribute("autofocus", "");
      dialog.showModal();
    } else if (!open && dialog.open) {
      void closeTopLayer(dialog);
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = "";
      dialog.removeAttribute("data-closing");
      onOpenChangeRef.current(false);
    };

    const handleCancel = (event: Event) => {
      if (!supportsTopLayerExit()) {
        event.preventDefault();
        void closeTopLayer(dialog);
      }
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("cancel", handleCancel);

    let cleanupOutside: (() => void) | undefined;
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const isOutside = (event: PointerEvent) => {
        const rect = dialog.getBoundingClientRect();
        return (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        );
      };

      let pressedOutside = false;
      const handlePointerDown = (event: PointerEvent) => {
        pressedOutside = event.target === dialog && isOutside(event);
      };
      const handlePointerUp = (event: PointerEvent) => {
        if (pressedOutside && event.target === dialog && isOutside(event)) {
          void closeTopLayer(dialog);
        }
        pressedOutside = false;
      };

      dialog.addEventListener("pointerdown", handlePointerDown);
      dialog.addEventListener("pointerup", handlePointerUp);
      cleanupOutside = () => {
        dialog.removeEventListener("pointerdown", handlePointerDown);
        dialog.removeEventListener("pointerup", handlePointerUp);
      };
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", handleCancel);
      cleanupOutside?.();
    };
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!supportsTopLayerExit()) {
      event.preventDefault();
      void closeTopLayer(dialog);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      {...({ closedby: "any" } as Record<string, string>)}
      className="discontinued-dialog m-auto w-[min(calc(100vw-2rem),28rem)] rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl"
    >
      <form method="dialog" onSubmit={handleFormSubmit} className="flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <Ban className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span>{projectTitle}</span>
            <span aria-hidden="true" className="text-muted-foreground/60">
              ·
            </span>
            <span className="text-muted-foreground">{badgeLabel}</span>
          </div>
          <button
            type="submit"
            aria-label={closeLabel}
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div>
          <h2 id={titleId} className="text-card-title text-xl sm:text-2xl">
            {title}
          </h2>
          <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            ref={primaryButtonRef}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {closeLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
}
