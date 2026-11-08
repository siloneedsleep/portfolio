"use client";

import { Code2 } from "lucide-react";
import { motion } from "motion/react";

export function SkillPill({
  name,
  index = 0,
}: {
  name: string;
  icon: string;
  index?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index, 12) * 0.035,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -3,
        scale: 1.05,
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
