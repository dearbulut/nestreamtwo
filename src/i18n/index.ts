import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import trTranslations from './locales/tr.json';
import enTranslations from './locales/en.json';

const resources = {
  tr: { translation: trTranslations },
  en: { translation: enTranslations },
};

// Get saved language from localStorage or default to Turkish
const getSavedLanguage = (): string => {
  try {
    const settings = localStorage.getItem('neostream_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      if (parsed.language && (parsed.language === 'tr' || parsed.language === 'en')) {
        return parsed.language;
      }
    }
  } catch {
    // Ignore parsing errors
  }
  return 'tr'; // Default to Turkish
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'neostream_language',
      caches: ['localStorage'],
    },
  });

export default i18n;

// Helper to change language and persist
export const changeLanguage = (lang: 'tr' | 'en'): void => {
  i18n.changeLanguage(lang);
  
  // Also update in settings storage
  try {
    const settings = localStorage.getItem('neostream_settings');
    const parsed = settings ? JSON.parse(settings) : {};
    parsed.language = lang;
    localStorage.setItem('neostream_settings', JSON.stringify(parsed));
  } catch {
    // Ignore errors
  }
};
