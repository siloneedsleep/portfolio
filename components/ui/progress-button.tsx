"use client";

import { Check, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./button";

export function ProgressButton({
  loading,
  success,
  sendingLabel,
  sentLabel,
  children,
}: {
  loading: boolean;
  success: boolean;
  sendingLabel: string;
  sentLabel: string;
  children: React.ReactNode;
}) {
  const stateKey = loading ? "loading" : success ? "success" : "idle";

  return (
    <Button
      type="submit"
      disabled={loading}
      className="spring-lift min-h-11 cursor-pointer overflow-hidden active:scale-[0.985]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span
            key={stateKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2"
          >
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            <span>{sendingLabel}</span>
          </motion.span>
        ) : success ? (
          <motion.span
            key={stateKey}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2"
          >
            <Check className="size-4" aria-hidden="true" />
            <span>{sentLabel}</span>
          </motion.span>
        ) : (
          <motion.span
            key={stateKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
