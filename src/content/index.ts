import { pt } from './pt';
import { en } from './en';
import type { Content, Locale } from './types';

export const locales: Locale[] = ['pt', 'en'];

const dictionaries: Record<Locale, Content> = { pt, en };

export function getContent(locale: Locale): Content {
  return dictionaries[locale];
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export type { Content, Locale };
