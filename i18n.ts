import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales, routing, type Locale } from "./i18n/routing";

export { defaultLocale, locales, routing, type Locale };

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const resolvedLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  };
});
