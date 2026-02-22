# i18n Setup Instructions

## Step-by-Step Setup

### Step 1: Install Dependencies

Run the following command in your project root:

```bash
npm install
```

This will install:
- `i18next` (v23.17.5)
- `react-i18next` (v15.2.0)
- `i18next-browser-languagedetector` (v8.0.2)

### Step 2: Verify File Structure

Ensure these files exist (they should already be created):

```
✓ locales/en/translation.json
✓ locales/te/translation.json
✓ locales/hi/translation.json
✓ locales/ta/translation.json
✓ locales/kn/translation.json
✓ frontend/lib/i18n.ts
✓ frontend/lib/i18n.d.ts
✓ frontend/components/i18n-provider.tsx
✓ frontend/components/language-switcher.tsx
✓ frontend/hooks/use-translation.ts
```

### Step 3: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Create a test page to verify i18n is working:

```tsx
// app/test-i18n/page.tsx
"use client"

import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function TestI18nPage() {
  const { t } = useTranslation()
  
  return (
    <div className="p-8">
      <div className="mb-4">
        <LanguageSwitcher />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">
        {t('common.appName')}
      </h1>
      
      <p className="mb-2">
        {t('home.hero.description')}
      </p>
      
      <div className="space-y-2">
        <p>Common Submit: {t('common.submit')}</p>
        <p>Auth Sign In: {t('auth.signIn')}</p>
        <p>Donor Dashboard: {t('donor.dashboard')}</p>
      </div>
    </div>
  )
}
```

3. Navigate to `http://localhost:3000/test-i18n`

4. Use the language switcher to change languages

5. Verify that all text changes to the selected language

### Step 4: Add Language Switcher to Your App

Add the language switcher to your main navigation. Here are examples for different locations:

#### Option A: Landing Page Header

```tsx
// app/page.tsx
import { LanguageSwitcher } from '@/components/language-switcher'

export default function LandingPage() {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo and nav items */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {/* Other header items */}
        </div>
      </div>
    </header>
  )
}
```

#### Option B: Dashboard Sidebar

```tsx
// frontend/components/dashboard-sidebar.tsx
import { LanguageSwitcher } from '@/components/language-switcher'

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        {/* Logo and title */}
      </SidebarHeader>
      
      <SidebarContent>
        {/* Navigation items */}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2">
          <LanguageSwitcher />
        </div>
        {/* User profile */}
      </SidebarFooter>
    </Sidebar>
  )
}
```

#### Option C: Settings Page

```tsx
// app/settings/page.tsx
import { LanguageSwitcher } from '@/components/language-switcher'

export default function SettingsPage() {
  return (
    <div>
      <h2>Language Preferences</h2>
      <LanguageSwitcher />
    </div>
  )
}
```

### Step 5: Convert Your First Component

Let's convert the login page as an example:

1. Open `app/login/page.tsx`

2. Add `"use client"` at the top if not present

3. Import the translation hook:
```tsx
import { useTranslation } from 'react-i18next'
```

4. Initialize in your component:
```tsx
const { t } = useTranslation()
```

5. Replace hardcoded strings:
```tsx
// Before
<h1>Sign In</h1>

// After
<h1>{t('auth.signIn')}</h1>
```

6. Test by switching languages

### Step 6: Verify Everything Works

Checklist:
- [ ] Dependencies installed successfully
- [ ] Dev server starts without errors
- [ ] Language switcher appears on page
- [ ] Can switch between all 5 languages
- [ ] Text changes when language changes
- [ ] Language preference persists after refresh
- [ ] No console errors

## Common Issues and Solutions

### Issue: "Cannot find module '@/locales/en/translation.json'"

**Solution**: Make sure the locales folder is in your project root, not inside app or frontend.

### Issue: "useTranslation hook not working"

**Solution**: 
1. Ensure component has `"use client"` directive
2. Verify I18nProvider wraps your app in layout.tsx
3. Check that i18n.ts is properly configured

### Issue: "Language not changing"

**Solution**:
1. Clear browser localStorage
2. Hard refresh the page (Ctrl+Shift+R)
3. Check browser console for errors

### Issue: "Translation key not found"

**Solution**:
1. Verify the key exists in all translation files
2. Check for typos in the key path
3. Ensure JSON syntax is correct

## Next Steps

1. **Convert Priority Components**
   - Start with authentication pages (login, register)
   - Then landing page
   - Then dashboards
   - See `scripts/convert-to-i18n.md` for full checklist

2. **Add Language Switcher Everywhere**
   - Landing page header
   - All dashboard sidebars
   - Settings pages
   - Mobile navigation

3. **Test Thoroughly**
   - Test each page in all 5 languages
   - Check mobile responsiveness
   - Verify no layout breaking
   - Test with longer text strings

4. **Monitor and Improve**
   - Collect user feedback
   - Fix any translation issues
   - Add more translations as needed
   - Consider adding more languages

## Resources

- **Quick Start Guide**: `I18N_QUICK_START.md`
- **Full Documentation**: `I18N_IMPLEMENTATION.md`
- **Example Component**: `EXAMPLE_CONVERTED_COMPONENT.tsx`
- **Conversion Checklist**: `scripts/convert-to-i18n.md`
- **Summary**: `I18N_SUMMARY.md`

## Support

If you encounter any issues:

1. Check the documentation files listed above
2. Review the example converted component
3. Verify all files are in the correct locations
4. Check browser console for specific errors
5. Ensure all dependencies are installed

## Success Criteria

Your i18n setup is successful when:

✅ Language switcher appears and works
✅ All 5 languages are selectable
✅ Text changes when language changes
✅ Language preference persists
✅ No console errors
✅ Layout looks good in all languages
✅ Mobile view works correctly

Congratulations! Your app now supports 5 languages! 🎉
