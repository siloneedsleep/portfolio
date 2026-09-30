import { getRequestConfig } from "next-intl/server";

export const locales = ["vi", "en"] as const;
export const pathnames = {} as const;

export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";
export const routing = { locales, defaultLocale, pathnames };

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const resolvedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
  return { locale: resolvedLocale, messages: (await import(`./messages/${resolvedLocale}.json`)).default };
});
