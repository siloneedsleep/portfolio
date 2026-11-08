"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./button";
import { Toast } from "./toast";

interface CopyLinkButtonProps {
  label: string;
  copiedLabel: string;
  toastMessage: string;
  toastCloseLabel: string;
}

export function CopyLinkButton({
  label,
  copiedLabel,
  toastMessage,
  toastCloseLabel,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const handleCopy = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setToastOpen(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failures in restricted contexts
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="default"
        onClick={handleCopy}
        className="spring-lift min-h-11 cursor-pointer active:scale-[0.98]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.16 }}
              className="inline-flex items-center gap-2"
            >
              <Check className="size-4 text-primary" aria-hidden="true" />
              <span>{copiedLabel}</span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.16 }}
              className="inline-flex items-center gap-2"
            >
              <Link2 className="size-4" aria-hidden="true" />
              <span>{label}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <Toast
        open={toastOpen}
        message={toastMessage}
        closeLabel={toastCloseLabel}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
