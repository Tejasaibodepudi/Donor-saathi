"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Droplets, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserRole } from "@/lib/data/types"

const roleRedirects: Record<UserRole, string> = {
  donor: "/donor",
  blood_bank: "/blood-bank",
  hospital: "/hospital",
  admin: "/admin",
}

const roleTabs: { value: UserRole; label: string; demoEmail: string }[] = [
  { value: "donor", label: "Donor", demoEmail: "donor@demo.com" },
  { value: "blood_bank", label: "Blood Bank", demoEmail: "bloodbank@demo.com" },
  { value: "hospital", label: "Hospital", demoEmail: "hospital@demo.com" },
  { value: "admin", label: "Admin", demoEmail: "admin@demo.com" },
]

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("donor")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(email, password, role)
    setIsLoading(false)

    if (result.success) {
      toast.success("Welcome back!")
      router.push(roleRedirects[role])
    } else {
      toast.error(result.error || "Login failed")
    }
  }

  const fillDemo = (r: UserRole) => {
    const tab = roleTabs.find(t => t.value === r)
    if (tab) {
      setEmail(tab.demoEmail)
      setPassword("password")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">BloodConnect</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Choose your role and sign in to your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={v => { setRole(v as UserRole); fillDemo(v as UserRole) }}>
              <TabsList className="grid w-full grid-cols-4">
                {roleTabs.map(t => (
                  <TabsTrigger key={t.value} value={t.value} className="text-xs">
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {roleTabs.map(t => (
                <TabsContent key={t.value} value={t.value}>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={t.demoEmail}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In as {t.label}
                    </Button>
                    <button
                      type="button"
                      onClick={() => fillDemo(t.value)}
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
          {"Don't have an account? "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
