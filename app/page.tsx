"use client"

import Link from "next/link"
import { Droplets, Heart, Shield, Clock, Users, Building2, Activity, ArrowRight, Zap } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LandingPage() {
  const { t } = useTranslation()
  
  const features = [
    {
      icon: Heart,
      title: t('features.donorManagement'),
      description: t('features.donorManagementDesc'),
    },
    {
      icon: Building2,
      title: t('features.bloodBankNetwork'),
      description: t('features.bloodBankNetworkDesc'),
    },
    {
      icon: Activity,
      title: t('features.hospitalIntegration'),
      description: t('features.hospitalIntegrationDesc'),
    },
    {
      icon: Shield,
      title: t('admin.dashboard'),
      description: t('features.donorManagementDesc'),
    },
    {
      icon: Clock,
      title: t('features.realTimeInventory'),
      description: t('features.realTimeInventoryDesc'),
    },
    {
      icon: Zap,
      title: t('features.qrCodeSystem'),
      description: t('features.qrCodeSystemDesc'),
    },
  ]

  const stats = [
    { value: "10,000+", label: t('roles.donor') + "s" },
    { value: "500+", label: t('roles.bloodBank') + "s" },
    { value: "200+", label: t('roles.hospital') + "s" },
    { value: "50,000+", label: "Lives Saved" },
  ]
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">{t('common.appName')}</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('home.features')}</a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impact</a>
            <a href="#roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('home.hero.getStarted')}</a>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" asChild>
              <Link href="/login">{t('auth.signIn')}</Link>
            </Button>
            <Button asChild>
              <Link href="/register">{t('home.hero.getStarted')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Saving lives through smart blood supply management
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
              {t('home.hero.title')}
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl leading-relaxed">
              {t('home.hero.description')}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="h-12 px-8">
                <Link href="/register">
                  {t('home.hero.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8">
                <Link href="/login">{t('auth.signIn')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              {t('home.features')}
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
              {t('home.hero.description')}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map(f => (
              <Card key={f.title} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/15 transition-colors">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles / Get Started */}
      <section id="roles" className="border-t bg-card py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              {t('home.joinUs')}
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
              {t('home.hero.description')}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: t('roles.donor'), desc: t('features.donorManagementDesc'), icon: Heart, href: "/register?role=donor" },
              { title: t('roles.bloodBank'), desc: t('features.bloodBankNetworkDesc'), icon: Building2, href: "/register?role=blood_bank" },
              { title: t('roles.hospital'), desc: t('features.hospitalIntegrationDesc'), icon: Activity, href: "/register?role=hospital" },
              { title: t('roles.admin'), desc: t('admin.systemHealth'), icon: Shield, href: "/login" },
            ].map(role => (
              <Card key={role.title} className="group relative overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                    <role.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{role.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{role.desc}</p>
                  <Button variant="ghost" size="sm" className="mt-4 -ml-2" asChild>
                    <Link href={role.href}>
                      {t('home.hero.getStarted')} <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{t('common.appName')}</span>
          </div>
          <p className="text-xs text-muted-foreground">{t('common.description')}</p>
        </div>
      </footer>
    </div>
  )
}
