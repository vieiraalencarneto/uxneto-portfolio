import type { Translations } from "./en";
import { en } from "./en";
import { pt } from "./pt";

export type Locale = "en" | "pt";

export const LOCALES: Locale[] = ["en", "pt"];
export const DEFAULT_LOCALE: Locale = "en";

const dict: Record<Locale, Translations> = { en, pt };

export function getT(locale: string): Translations {
  return dict[locale as Locale] ?? en;
}

export function isLocale(v: string): v is Locale {
  return v === "en" || v === "pt";
}
