# Component Conversion Checklist

## Priority Order for Conversion

### Phase 1: Authentication & Core (High Priority)
- [ ] app/login/page.tsx
- [ ] app/register/page.tsx
- [ ] app/page.tsx (Landing page)
- [ ] frontend/components/dashboard-sidebar.tsx
- [ ] frontend/components/dashboard-header.tsx

### Phase 2: Donor Features
- [ ] app/donor/page.tsx
- [ ] app/donor/appointments/page.tsx
- [ ] app/donor/book/page.tsx
- [ ] app/donor/history/page.tsx
- [ ] app/donor/profile/page.tsx
- [ ] app/donor/emergency/page.tsx
- [ ] frontend/components/appointment-card.tsx

### Phase 3: Blood Bank Features
- [ ] app/blood-bank/page.tsx
- [ ] app/blood-bank/inventory/page.tsx
- [ ] app/blood-bank/appointments/page.tsx
- [ ] app/blood-bank/slots/page.tsx
- [ ] app/blood-bank/drives/page.tsx
- [ ] app/blood-bank/scan/page.tsx
- [ ] app/blood-bank/emergency/page.tsx
- [ ] frontend/components/qr-scanner.tsx
- [ ] frontend/components/inventory-grid.tsx

### Phase 4: Hospital Features
- [ ] app/hospital/page.tsx
- [ ] app/hospital/search/page.tsx
- [ ] app/hospital/inventory/page.tsx
- [ ] app/hospital/emergency/page.tsx

### Phase 5: Institution Features
- [ ] app/institution/dashboard/page.tsx
- [ ] app/institution/drives/page.tsx
- [ ] app/institution/history/page.tsx
- [ ] app/institution/settings/page.tsx

### Phase 6: Admin Features
- [ ] app/admin/page.tsx
- [ ] app/admin/users/page.tsx
- [ ] app/admin/blood-banks/page.tsx
- [ ] app/admin/analytics/page.tsx
- [ ] app/admin/emergencies/page.tsx
- [ ] app/admin/rare-donors/page.tsx

### Phase 7: Shared Components
- [ ] frontend/components/stat-card.tsx
- [ ] frontend/components/blood-group-badge.tsx
- [ ] frontend/components/emergency-alert-card.tsx
- [ ] frontend/components/rare-blood-network-card.tsx
- [ ] frontend/components/rare-donor-card.tsx
- [ ] frontend/components/qr-display.tsx

## Conversion Steps for Each Component

1. **Add "use client" directive** (if not already present)
   ```tsx
   "use client"
   ```

2. **Import useTranslation**
   ```tsx
   import { useTranslation } from 'react-i18next'
   ```

3. **Initialize in component**
   ```tsx
   const { t } = useTranslation()
   ```

4. **Replace hardcoded strings**
   - Find all user-facing text
   - Replace with `t('key.path')`
   - Add keys to all translation files

5. **Test in all languages**
   - Switch language and verify
   - Check for layout issues
   - Verify mobile responsiveness

## Common Patterns

### Button Text
```tsx
// Before
<Button>Submit</Button>

// After
<Button>{t('common.submit')}</Button>
```

### Form Labels
```tsx
// Before
<Label>Email</Label>

// After
<Label>{t('auth.email')}</Label>
```

### Placeholders
```tsx
// Before
<Input placeholder="Enter your email" />

// After
<Input placeholder={t('auth.email')} />
```

### Conditional Text
```tsx
// Before
<span>{isActive ? 'Active' : 'Inactive'}</span>

// After
<span>{isActive ? t('common.active') : t('common.inactive')}</span>
```

### Dynamic Text with Variables
```tsx
// Before
<p>Welcome back, {userName}</p>

// After
<p>{t('donor.welcome', { name: userName })}</p>

// In translation file:
// "welcome": "Welcome back, {{name}}"
```

## Testing Checklist

For each converted component:
- [ ] All text is translated
- [ ] No hardcoded strings remain
- [ ] Layout works in all languages
- [ ] Mobile view is correct
- [ ] Placeholders are translated
- [ ] Error messages are translated
- [ ] Success messages are translated
- [ ] Tooltips are translated
- [ ] Alt text is translated

## Notes

- Keep translation keys consistent across similar components
- Group related translations together
- Use descriptive key names
- Test with longest language (usually Telugu or Kannada)
- Ensure proper spacing around dynamic content
