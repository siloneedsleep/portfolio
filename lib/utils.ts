import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDate(date: Date | string, locale = "vi-VN") { return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(date)); }
export function getGrade(enrollYear: number) { return Math.max(1, new Date().getFullYear() - enrollYear + 10); }
