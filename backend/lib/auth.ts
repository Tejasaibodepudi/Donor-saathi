import { cookies } from "next/headers"
import type { UserRole } from "@/lib/data/types"

const TOKEN_COOKIE = "bsn_token"

interface TokenPayload {
  id: string
  email: string
  role: UserRole
  name: string
  exp: number
}

export function createToken(payload: Omit<TokenPayload, "exp">): string {
  const tokenData: TokenPayload = {
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }
  return Buffer.from(JSON.stringify(tokenData)).toString("base64")
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString()) as TokenPayload
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_COOKIE)
}

export async function getAuthToken(): Promise<TokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE)
  if (!token) return null
  return verifyToken(token.value)
}

export async function requireAuth(allowedRoles?: UserRole[]): Promise<TokenPayload> {
  const user = await getAuthToken()
  if (!user) throw new Error("Unauthorized")
  if (allowedRoles && !allowedRoles.includes(user.role)) throw new Error("Forbidden")
  return user
}
