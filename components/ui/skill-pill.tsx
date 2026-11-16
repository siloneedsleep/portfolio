"use client";

import { Code2 } from "lucide-react";
import { motion } from "motion/react";

export function SkillPill({
  name,
}: {
  name: string;
  icon: string;
}) {
  return (
    <motion.span
      whileHover={{
        y: -2,
        scale: 1.02,
        transition: { type: "spring", stiffness: 420, damping: 20 },
      }}
      whileTap={{ scale: 0.96 }}
      className="group inline-flex cursor-default items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm shadow-2xs transition-colors hover:border-primary/50 hover:bg-accent"
    >
      <Code2
        className="size-4 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
        aria-hidden="true"
      />
      <span>{name}</span>
    </motion.span>
  );
}
