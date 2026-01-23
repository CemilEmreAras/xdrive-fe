import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslations from './locales/en.json'
import trTranslations from './locales/tr.json'
import deTranslations from './locales/de.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      tr: {
        translation: trTranslations
      },
      de: {
        translation: deTranslations
      }
    },
    lng: 'en', // Default language is English
    fallbackLng: 'en',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'querystring'],
      caches: ['localStorage'],
      lookupLocalStorage: 'xdrive_language',
      // Don't use navigator language, always default to English if not in localStorage
      checkWhitelist: true
    }
  })

export default i18n
