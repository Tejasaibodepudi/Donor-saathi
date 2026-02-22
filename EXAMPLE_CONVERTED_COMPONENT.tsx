// This is an EXAMPLE showing how to convert a component to use i18n
// This demonstrates the login page conversion

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Droplets, Loader2 } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LoginPageExample() {
  const { t } = useTranslation() // Initialize translation hook
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(email, password)
    setIsLoading(false)

    if (result.success) {
      // Use translated success message
      toast.success(t('auth.loginSuccess'))
      router.push(result.redirectTo || "/")
    } else {
      // Use translated error message
      toast.error(result.error || t('auth.loginFailed'))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Language Switcher in top right */}
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher />
        </div>

        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="h-5 w-5" />
            </div>
            {/* Use translated app name */}
            <span className="text-xl font-bold">{t('common.appName')}</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            {/* Use translated title and description */}
            <CardTitle className="text-xl">{t('auth.signIn')}</CardTitle>
            <CardDescription>{t('auth.joinNetwork')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                {/* Use translated label */}
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.email')} // Translated placeholder
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                {/* Use translated label */}
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.password')} // Translated placeholder
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  {/* Use translated text */}
                  <span>{t('auth.rememberMe')}</span>
                </label>
                <Link href="/forgot-password" className="text-primary hover:underline">
                  {/* Use translated text */}
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {/* Use translated button text */}
                {t('auth.signIn')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {/* Use translated text */}
          {t('auth.dontHaveAccount')}{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            {t('nav.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}

/*
 * KEY CHANGES MADE:
 * 
 * 1. Added "use client" directive at the top
 * 2. Imported useTranslation from 'react-i18next'
 * 3. Initialized translation: const { t } = useTranslation()
 * 4. Replaced all hardcoded strings with t('key.path')
 * 5. Added LanguageSwitcher component
 * 6. Used translations in:
 *    - Titles and headings
 *    - Labels and placeholders
 *    - Button text
 *    - Links and descriptions
 *    - Toast messages
 * 
 * TRANSLATION KEYS USED:
 * - common.appName
 * - auth.signIn
 * - auth.joinNetwork
 * - auth.email
 * - auth.password
 * - auth.rememberMe
 * - auth.forgotPassword
 * - auth.dontHaveAccount
 * - auth.loginSuccess
 * - auth.loginFailed
 * - nav.register
 * 
 * All these keys exist in the translation files (en, te, hi, ta, kn)
 */
