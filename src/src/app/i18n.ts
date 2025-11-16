import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const isRTL = (lng: string) => ['ar', 'fa', 'he', 'ur'].includes(lng);

const resources = {
  en: { common: { hello: 'Hello', admin: 'Admin' } },
  es: { common: { hello: 'Hola', admin: 'Admin' } },
  ar: { common: { hello: 'مرحبا', admin: 'الإدارة' } },
  fr: { common: { hello: 'Bonjour', admin: 'Admin' } },
};

export function setupI18n() {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'es', 'ar', 'fr'],
      ns: ['common'],
      defaultNS: 'common',
      interpolation: { escapeValue: false },
      detection: { order: ['querystring', 'localStorage', 'navigator'], caches: ['localStorage'] },
    });
  return i18n;
}

export default i18n;
