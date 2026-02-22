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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { UserRole } from "@/lib/data/types"

const roleRedirects: Record<UserRole, string> = {
  donor: "/donor",
  blood_bank: "/blood-bank",
  hospital: "/hospital",
  institution: "/institution/dashboard",
  admin: "/admin",
}

export default function LoginPage() {
  const { t } = useTranslation()
  const [role, setRole] = useState<UserRole>("donor")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const roleTabs: { value: UserRole; label: string; demoEmail: string }[] = [
    { value: "donor", label: t('roles.donor'), demoEmail: "donor@demo.com" },
    { value: "blood_bank", label: t('roles.bloodBank'), demoEmail: "bloodbank@demo.com" },
    { value: "hospital", label: t('roles.hospital'), demoEmail: "hospital@demo.com" },
    { value: "institution", label: t('roles.institution'), demoEmail: "college@demo.com" },
    { value: "admin", label: t('roles.admin'), demoEmail: "admin@donorsaathi.com" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(email, password, role)
    setIsLoading(false)

    if (result.success) {
      toast.success(t('auth.loginSuccess'))
      router.push(roleRedirects[role])
    } else {
      toast.error(result.error || t('auth.loginFailed'))
    }
  }

  const fillDemo = (r: UserRole) => {
    const tab = roleTabs.find(t => t.value === r)
    if (tab) {
      setEmail(tab.demoEmail)
      setPassword(r === "admin" ? "Donorsaathi@123" : "password")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">{t('common.appName')}</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('auth.signIn')}</CardTitle>
            <CardDescription>{t('auth.joinNetwork')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(v: string) => { setRole(v as UserRole); fillDemo(v as UserRole) }}>
              <TabsList className="grid w-full grid-cols-5 h-auto">
                {roleTabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-1 py-2">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {roleTabs.map(tab => (
                <TabsContent key={tab.value} value={tab.value}>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('auth.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={tab.demoEmail}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">{t('auth.password')}</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={t('auth.password')}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('auth.signIn')}
                    </Button>
                    <button
                      type="button"
                      onClick={() => fillDemo(tab.value)}
                      className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Fill demo credentials
                    </button>
                  </form>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('auth.dontHaveAccount')}{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            {t('nav.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}
