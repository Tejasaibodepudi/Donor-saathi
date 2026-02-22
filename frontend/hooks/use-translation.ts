"use client"

import { useTranslation as useI18nTranslation } from 'react-i18next'

/**
 * Custom hook for translations with TypeScript support
 * Re-exports react-i18next's useTranslation with additional utilities
 */
export function useTranslation() {
  const { t, i18n } = useI18nTranslation()

  return {
    t,
    i18n,
    language: i18n.language,
    changeLanguage: (lang: string) => i18n.changeLanguage(lang),
    isRTL: false, // All supported languages are LTR
  }
}
