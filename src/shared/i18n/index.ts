import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';
import nlCommon from './locales/nl/common.json';

export const defaultNS = 'common';

export const resources = {
  en: { common: enCommon },
  nl: { common: nlCommon },
} as const;

export const i18n = i18next.createInstance();

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'nl'],
    defaultNS,
    interpolation: { escapeValue: false },
  });
