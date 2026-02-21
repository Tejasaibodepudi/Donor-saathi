import Link from "next/link"
import { Droplets, Heart, Shield, Clock, Users, Building2, Activity, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Heart,
    title: "Donor Management",
    description: "Register, track donations, earn trust scores, and receive emergency alerts matching your blood type.",
  },
  {
    icon: Building2,
    title: "Blood Bank Network",
    description: "Manage inventory, schedule donation slots, verify donors with QR codes, and broadcast emergency needs.",
  },
  {
    icon: Activity,
    title: "Hospital Integration",
    description: "Search available blood units, place emergency requests, and connect with nearby blood banks instantly.",
  },
  {
    icon: Shield,
    title: "Admin Oversight",
    description: "Platform-wide analytics, user verification, emergency monitoring, and comprehensive audit trails.",
  },
  {
    icon: Clock,
    title: "Real-time Tracking",
    description: "Live inventory updates, appointment status changes, and emergency request progress in real time.",
  },
  {
    icon: Zap,
    title: "QR Code System",
    description: "Secure appointment verification with QR codes for seamless donor check-in at blood banks.",
  },
]

const stats = [
  { value: "10,000+", label: "Registered Donors" },
  { value: "500+", label: "Blood Banks" },
  { value: "200+", label: "Partner Hospitals" },
  { value: "50,000+", label: "Lives Saved" },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">BloodConnect</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impact</a>
            <a href="#roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Get Started</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
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
              Every Drop Counts. Every Second{" "}
              <span className="text-primary">Matters.</span>
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl leading-relaxed">
              BloodConnect bridges the gap between donors, blood banks, and hospitals with real-time inventory tracking,
              smart scheduling, QR verification, and emergency broadcast system.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="h-12 px-8">
                <Link href="/register">
                  Start Saving Lives
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8">
                <Link href="/login">Sign In to Dashboard</Link>
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
              A Complete Blood Supply Ecosystem
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
              From donor registration to emergency fulfillment, every step is streamlined and transparent.
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
              Choose Your Role
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
              Whether you want to donate blood, manage a blood bank, or coordinate hospital needs, we have you covered.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Donor", desc: "Register as a donor, book appointments, track donations, and respond to emergencies.", icon: Heart, href: "/register?role=donor" },
              { title: "Blood Bank", desc: "Manage inventory, create donation slots, verify donors, and broadcast needs.", icon: Building2, href: "/register?role=blood_bank" },
              { title: "Hospital", desc: "Search blood availability, request emergency units, and coordinate with blood banks.", icon: Activity, href: "/register?role=hospital" },
              { title: "Admin", desc: "Monitor the entire platform, verify institutions, and manage emergency responses.", icon: Shield, href: "/login" },
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
                      Get Started <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <Card className="mx-auto max-w-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Demo Credentials</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Use these accounts to explore all dashboards:</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { role: "Donor", email: "donor@demo.com" },
                  { role: "Blood Bank", email: "bloodbank@demo.com" },
                  { role: "Hospital", email: "hospital@demo.com" },
                  { role: "Admin", email: "admin@demo.com" },
                ].map(cred => (
                  <div key={cred.role} className="rounded-lg bg-muted px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground">{cred.role}</p>
                    <p className="text-sm font-mono">{cred.email}</p>
                    <p className="text-xs text-muted-foreground">Password: password</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">BloodConnect</span>
          </div>
          <p className="text-xs text-muted-foreground">Blood Supply Network Platform. Built for saving lives.</p>
        </div>
      </footer>
    </div>
  )
}
