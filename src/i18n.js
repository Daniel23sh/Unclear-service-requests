import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationHE from './locales/he/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  he: {
    translation: translationHE
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',       // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false  // React already escapes values
    }
  });

export default i18n;
