"use client";
import { Facebook, Github, Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { profile } from "@/data/profile"; import { Reveal } from "@/components/animations/portfolio-motion";

export function Footer(){
  const t=useTranslations("nav"); const footer=useTranslations("footer");
  const links=[['hero',t('home')],['work',t('work')],['skills',t('skills')],['contact',t('contact')]] as const;
  return <Reveal><footer className="border-t"><div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3"><div><a href="#hero" className="text-xl font-semibold tracking-tight text-foreground">Silo<span className="text-primary">.</span></a><p className="mt-3 max-w-xs text-sm text-muted-foreground">{footer("builtWith")}</p></div><nav aria-label="Footer navigation" className="flex flex-col gap-3 text-sm text-muted-foreground">{links.map(([id,label])=><a key={id} href={`#${id}`} className="w-fit transition-colors hover:text-foreground">{label}</a>)}</nav><div className="flex items-start gap-4 text-muted-foreground"><a href="https://github.com/siloneedsleep" target="_blank" rel="noreferrer" aria-label="GitHub"><Github className="size-5"/></a><a href="https://facebook.com/siloneedsleep" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook className="size-5"/></a><a href={`mailto:${profile.email}`} aria-label="Email"><Mail className="size-5"/></a><span aria-label="Discord"><MessageCircle className="size-5"/></span></div></div><div className="mx-auto flex max-w-6xl flex-col gap-2 border-t px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6"><span>© 2026 Silo · Đỗ Trường Thịnh</span><span>{footer("rights")}</span></div></footer></Reveal>
}
