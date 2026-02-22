# i18n Quick Start Guide

## Installation

Run this command to install the dependencies:

```bash
npm install
```

The following packages have been added to package.json:
- `i18next` - Core i18n library
- `react-i18next` - React bindings for i18next
- `i18next-browser-languagedetector` - Automatic language detection

## What's Been Set Up

### 1. Translation Files
Located in `locales/` directory:
- `en/translation.json` - English (default)
- `te/translation.json` - Telugu (తెలుగు)
- `hi/translation.json` - Hindi (हिंदी)
- `ta/translation.json` - Tamil (தமிழ்)
- `kn/translation.json` - Kannada (ಕನ್ನಡ)

### 2. Configuration
- `frontend/lib/i18n.ts` - i18n configuration with language detection
- `frontend/components/i18n-provider.tsx` - React provider wrapper
- `app/layout.tsx` - Updated with I18nProvider

### 3. Components
- `frontend/components/language-switcher.tsx` - Language selector dropdown
- `frontend/hooks/use-translation.ts` - Custom translation hook

## Using Translations in Your Components

### Step 1: Make Component Client-Side
Add this at the top of your component file:
```tsx
"use client"
```

### Step 2: Import and Use Translation Hook
```tsx
import { useTranslation } from 'react-i18next'

export function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <button>{t('common.submit')}</button>
    </div>
  )
}
```

### Step 3: Add Language Switcher
Add to your navigation or header:
```tsx
import { LanguageSwitcher } from '@/components/language-switcher'

<LanguageSwitcher />
```

## Common Translation Patterns

### Simple Text
```tsx
<h1>{t('home.hero.title')}</h1>
```

### With Variables
```tsx
// Translation: "Welcome back, {{name}}"
<p>{t('donor.welcome', { name: userName })}</p>
```

### Placeholders
```tsx
<Input placeholder={t('auth.email')} />
```

### Conditional Text
```tsx
<span>{isActive ? t('common.yes') : t('common.no')}</span>
```

## Available Translation Keys

### Common
- `common.appName` - "Donor Saathi"
- `common.loading` - "Loading..."
- `common.save` - "Save"
- `common.cancel` - "Cancel"
- `common.submit` - "Submit"
- And many more...

### Authentication
- `auth.signIn` - "Sign In"
- `auth.signUp` - "Create Account"
- `auth.email` - "Email"
- `auth.password` - "Password"
- And more...

### Navigation
- `nav.home` - "Home"
- `nav.dashboard` - "Dashboard"
- `nav.profile` - "Profile"
- And more...

See the full list in `locales/en/translation.json`

## Testing

1. Start your development server:
```bash
npm run dev
```

2. Open your app in the browser

3. Look for the language switcher (dropdown with language names)

4. Switch between languages to see translations in action

## Language Persistence

The selected language is automatically saved to localStorage and will persist across:
- Page refreshes
- Browser sessions
- Different pages in the app

## Browser Language Detection

On first visit, the app will:
1. Check localStorage for saved preference
2. If none, detect browser language
3. If browser language is supported, use it
4. Otherwise, fall back to English

## Next Steps

1. **Convert existing components**: See `scripts/convert-to-i18n.md` for checklist
2. **Add language switcher**: Add to navigation bars and dashboards
3. **Test thoroughly**: Switch languages and verify all text is translated
4. **Add new translations**: Follow the pattern in existing translation files

## Example: Converting a Component

Before:
```tsx
export function Welcome() {
  return <h1>Welcome to Donor Saathi</h1>
}
```

After:
```tsx
"use client"

import { useTranslation } from 'react-i18next'

export function Welcome() {
  const { t } = useTranslation()
  return <h1>{t('home.hero.title')}</h1>
}
```

## Troubleshooting

### Translations not showing?
- Check if component has `"use client"` directive
- Verify the translation key exists in all language files
- Check browser console for errors

### Language not changing?
- Ensure LanguageSwitcher is imported correctly
- Check if I18nProvider wraps your app in layout.tsx
- Clear localStorage and try again

### Layout breaking?
- Some languages have longer text
- Test with all languages during development
- Adjust CSS as needed for text overflow

## Support

For detailed documentation, see:
- `I18N_IMPLEMENTATION.md` - Complete implementation guide
- `EXAMPLE_CONVERTED_COMPONENT.tsx` - Full example of converted component
- `scripts/convert-to-i18n.md` - Component conversion checklist

## Quick Reference

```tsx
// Import
import { useTranslation } from 'react-i18next'

// Use in component
const { t } = useTranslation()

// Simple translation
{t('key.path')}

// With variables
{t('key.path', { variable: value })}

// Change language programmatically
const { i18n } = useTranslation()
i18n.changeLanguage('te') // Switch to Telugu
```

That's it! You're ready to use multilingual support in your app. 🎉
