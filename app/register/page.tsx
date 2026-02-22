"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Droplets, Loader2 } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { UserRole } from "@/lib/data/types"

const roleRedirects: Record<string, string> = {
  donor: "/donor",
  blood_bank: "/blood-bank",
  hospital: "/hospital",
  institution: "/institution/dashboard",
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const defaultRole = (searchParams.get("role") as UserRole) || "donor"
  const [role, setRole] = useState<string>(defaultRole)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    bloodGroup: "O+", dateOfBirth: "", gender: "male",
    address: "", city: "", state: "",
    licenseNumber: "", registrationNumber: "",
    operatingHours: "9:00 AM - 5:00 PM",
    optInRareRegistry: false,
  })

  const update = (key: string, value: string | boolean) => setForm(f => ({ ...f, [key]: value }))

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    if (!dob) return 0
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Age verification for donors
    if (role === "donor") {
      const age = calculateAge(form.dateOfBirth)
      if (age < 18) {
        toast.error("You must be at least 18 years old to register as a donor")
        return
      }
    }

    setIsLoading(true)

    const result = await register({ ...form, role })
    setIsLoading(false)

    if (result.success) {
      toast.success(t('auth.accountCreated'))
      router.push(roleRedirects[role] || "/login")
    } else {
      toast.error(result.error || t('auth.registrationFailed'))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
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
            <CardTitle className="text-xl">{t('register.title')}</CardTitle>
            <CardDescription>{t('register.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={setRole}>
              <TabsList className="grid w-full grid-cols-4 h-auto">
                <TabsTrigger value="donor" className="text-xs px-1 py-1.5">{t('register.donor')}</TabsTrigger>
                <TabsTrigger value="blood_bank" className="text-xs px-1 py-1.5 leading-tight">{t('register.bloodBank')}</TabsTrigger>
                <TabsTrigger value="hospital" className="text-xs px-1 py-1.5">{t('register.hospital')}</TabsTrigger>
                <TabsTrigger value="institution" className="text-xs px-1 py-1.5">{t('register.institution')}</TabsTrigger>
              </TabsList>

              {/* Donor Registration */}
              <TabsContent value="donor">
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t('register.fullName')}</Label>
                      <Input value={form.name} onChange={e => update("name", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('auth.email')}</Label>
                      <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('auth.password')}</Label>
                      <Input type="password" value={form.password} onChange={e => update("password", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('register.phone')}</Label>
                      <Input value={form.phone} onChange={e => update("phone", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('register.bloodGroup')}</Label>
                      <Select value={form.bloodGroup} onValueChange={(v: string) => update("bloodGroup", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('register.gender')}</Label>
                      <Select value={form.gender} onValueChange={(v: string) => update("gender", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{t('register.male')}</SelectItem>
                          <SelectItem value="female">{t('register.female')}</SelectItem>
                          <SelectItem value="other">{t('register.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('register.dateOfBirth')}</Label>
                      <Input 
                        type="date" 
                        value={form.dateOfBirth} 
                        onChange={e => update("dateOfBirth", e.target.value)} 
                        max={new Date().toISOString().split('T')[0]}
                        required 
                      />
                      {form.dateOfBirth && calculateAge(form.dateOfBirth) < 18 && (
                        <p className="text-xs text-destructive">{t('register.ageRestriction')}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>{t('register.address')}</Label>
                      <Input value={form.address} onChange={e => update("address", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('register.city')}</Label>
                      <Input value={form.city} onChange={e => update("city", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('register.state')}</Label>
                      <Input value={form.state} onChange={e => update("state", e.target.value)} required />
                    </div>

                    {/* Rare Blood Registry - Only for A-, B-, AB+, AB- */}
                    {["A-", "B-", "AB+", "AB-"].includes(form.bloodGroup) && (
                      <div className="space-y-2 sm:col-span-2 mt-2">
                        <div className="flex items-center space-x-4 rounded-lg border p-4 bg-amber-50/30">
                          <Switch
                            id="rare-opt-in"
                            checked={form.optInRareRegistry}
                            onCheckedChange={(v: boolean) => update("optInRareRegistry", v)}
                          />
                          <div className="space-y-0.5">
                            <Label htmlFor="rare-opt-in" className="text-base font-semibold text-amber-900">
                              Join the Rare Blood Registry (Optional)
                            </Label>
                            <p className="text-sm text-amber-700/80">
                              Securely opt-in to anonymous critical alerts for rare blood types in your area. Hospitals will never see your identity.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register as Donor
                  </Button>
                </form>
              </TabsContent>

              {/* Blood Bank Registration */}
              <TabsContent value="blood_bank">
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Blood Bank Name</Label>
                      <Input value={form.name} onChange={e => update("name", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" value={form.password} onChange={e => update("password", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>License Number</Label>
                      <Input value={form.licenseNumber} onChange={e => update("licenseNumber", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={form.phone} onChange={e => update("phone", e.target.value)} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Address</Label>
                      <Input value={form.address} onChange={e => update("address", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={form.city} onChange={e => update("city", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input value={form.state} onChange={e => update("state", e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register Blood Bank
                  </Button>
                </form>
              </TabsContent>

              {/* Hospital Registration */}
              <TabsContent value="hospital">
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Hospital Name</Label>
                      <Input value={form.name} onChange={e => update("name", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" value={form.password} onChange={e => update("password", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Registration Number</Label>
                      <Input value={form.registrationNumber} onChange={e => update("registrationNumber", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={form.phone} onChange={e => update("phone", e.target.value)} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Address</Label>
                      <Input value={form.address} onChange={e => update("address", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={form.city} onChange={e => update("city", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input value={form.state} onChange={e => update("state", e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register Hospital
                  </Button>
                </form>
              </TabsContent>

              {/* Institution Registration */}
              <TabsContent value="institution">
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Institution Name</Label>
                      <Input value={form.name} onChange={e => update("name", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Official Email</Label>
                      <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" value={form.password} onChange={e => update("password", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input value={form.phone} onChange={e => update("phone", e.target.value)} required />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Campus Full Address</Label>
                      <Input value={form.address} onChange={e => update("address", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={form.city} onChange={e => update("city", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input value={form.state} onChange={e => update("state", e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register Institution
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
