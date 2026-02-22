// Type definitions for i18n
import 'react-i18next'

// Import your translation file type
import type en from '@/locales/en/translation.json'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false
  }
}
