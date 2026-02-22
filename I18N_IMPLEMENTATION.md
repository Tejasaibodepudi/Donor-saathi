# Multilingual (i18n) Implementation Guide

## Overview
This document describes the complete multilingual implementation for Donor Saathi, supporting English, Telugu, Hindi, Tamil, and Kannada.

## Installation

First, install the required dependencies:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

## Architecture

### File Structure
```
├── locales/
│   ├── en/translation.json    # English (default)
│   ├── te/translation.json    # Telugu
│   ├── hi/translation.json    # Hindi
│   ├── ta/translation.json    # Tamil
│   └── kn/translation.json    # Kannada
├── frontend/
│   ├── lib/
│   │   └── i18n.ts           # i18n configuration
│   └── components/
│       ├── i18n-provider.tsx  # Client-side provider
│       └── language-switcher.tsx  # Language selector component
└── app/
    └── layout.tsx            # Root layout with I18nProvider
```

## Usage in Components

### 1. Using translations in Client Components

```tsx
"use client"

import { useTranslation } from 'react-i18next'

export function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <p>{t('home.hero.description')}</p>
      <button>{t('common.submit')}</button>
    </div>
  )
}
```

### 2. Using translations with interpolation

```tsx
const { t } = useTranslation()

// In translation file: "welcome": "Welcome back, {{name}}"
<p>{t('donor.welcome', { name: userName })}</p>
```

### 3. Adding the Language Switcher

Add the LanguageSwitcher component to your navigation:

```tsx
import { LanguageSwitcher } from '@/components/language-switcher'

export function Navigation() {
  return (
    <nav>
      {/* Other nav items */}
      <LanguageSwitcher />
    </nav>
  )
}
```

## Translation Keys Structure

The translation files are organized into logical sections:

- `common`: Shared UI elements (buttons, labels, etc.)
- `nav`: Navigation items
- `auth`: Authentication related text
- `roles`: User role names
- `register`: Registration form
- `donor`: Donor dashboard and features
- `bloodBank`: Blood bank dashboard and features
- `hospital`: Hospital dashboard and features
- `institution`: Institution dashboard and features
- `admin`: Admin dashboard and features
- `appointment`: Appointment related text
- `inventory`: Inventory management
- `emergency`: Emergency alerts
- `validation`: Form validation messages
- `messages`: System messages
- `features`: Feature descriptions
- `home`: Landing page content

## Adding New Translations

### Step 1: Add to English (en/translation.json)
```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

### Step 2: Add to all other language files
Translate the same key in te, hi, ta, and kn translation files.

### Step 3: Use in component
```tsx
const { t } = useTranslation()
<p>{t('mySection.myKey')}</p>
```

## Converting Existing Components

### Before (Hardcoded):
```tsx
export function MyComponent() {
  return (
    <div>
      <h1>Welcome</h1>
      <button>Submit</button>
    </div>
  )
}
```

### After (Translated):
```tsx
"use client"

import { useTranslation } from 'react-i18next'

export function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('common.submit')}</button>
    </div>
  )
}
```

## Language Persistence

Language preference is automatically saved to localStorage and persists across sessions. The system also auto-detects the browser language on first visit.

## Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en   | English  | English     |
| te   | Telugu   | తెలుగు      |
| hi   | Hindi    | हिंदी       |
| ta   | Tamil    | தமிழ்       |
| kn   | Kannada  | ಕನ್ನಡ       |

## Best Practices

1. **Always use translation keys**: Never hardcode user-facing text
2. **Keep keys organized**: Use logical nesting (e.g., `donor.dashboard.title`)
3. **Consistent naming**: Use camelCase for keys
4. **Provide context**: Use descriptive key names
5. **Test all languages**: Verify UI doesn't break with longer text
6. **Handle plurals**: Use i18next plural features when needed
7. **Date/Time formatting**: Use date-fns with locale support

## Example: Converting a Page

Here's how to convert the register page:

```tsx
"use client"

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('register.title')}</h1>
      <p>{t('register.subtitle')}</p>
      
      <form>
        <Label>{t('register.fullName')}</Label>
        <Input placeholder={t('register.fullName')} />
        
        <Label>{t('auth.email')}</Label>
        <Input type="email" placeholder={t('auth.email')} />
        
        <Label>{t('auth.password')}</Label>
        <Input type="password" placeholder={t('auth.password')} />
        
        <Button type="submit">
          {t('register.registerAsDonor')}
        </Button>
      </form>
    </div>
  )
}
```

## Testing

1. Switch between languages using the language switcher
2. Verify all text is translated
3. Check for layout issues with longer translations
4. Test on mobile devices
5. Verify localStorage persistence

## Performance

- Translations are loaded lazily per language
- Only the active language is loaded in memory
- No impact on initial page load
- Language switching is instant (no page reload)

## Troubleshooting

### Translation not showing
- Check if the key exists in all translation files
- Verify the component is wrapped in I18nProvider
- Check browser console for i18next errors

### Language not persisting
- Check localStorage is enabled
- Verify i18next-browser-languagedetector is installed

### Layout breaking
- Some languages have longer text
- Use CSS text-overflow or adjust container widths
- Test with all languages during development

## Next Steps

1. Convert all existing components to use translations
2. Add language switcher to all dashboards
3. Test thoroughly in all supported languages
4. Consider adding more languages based on user demand
5. Implement backend API localization if needed

## API Localization (Optional)

If you need to localize API error messages:

```tsx
// In API route
export async function POST(req: Request) {
  const lang = req.headers.get('Accept-Language') || 'en'
  
  // Return localized error
  return Response.json({
    error: getLocalizedMessage('error.notFound', lang)
  })
}
```

## Maintenance

- Keep all translation files in sync
- Use a translation management tool for larger teams
- Regular audits to find missing translations
- Community contributions for translation improvements
