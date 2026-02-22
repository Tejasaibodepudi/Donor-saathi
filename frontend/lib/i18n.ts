import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enTranslation from '@/locales/en/translation.json'
import teTranslation from '@/locales/te/translation.json'
import hiTranslation from '@/locales/hi/translation.json'
import taTranslation from '@/locales/ta/translation.json'
import knTranslation from '@/locales/kn/translation.json'

const resources = {
  en: { translation: enTranslation },
  te: { translation: teTranslation },
  hi: { translation: hiTranslation },
  ta: { translation: taTranslation },
  kn: { translation: knTranslation },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'te', 'hi', 'ta', 'kn'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
