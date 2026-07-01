'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  CalendarDays,
  Clock,
  Home,
  Inbox,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Scissors,
  Smartphone,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const AuthContext = createContext<{ token: string; logout: () => void }>({
  token: '',
  logout: () => {},
})

const navItems: Array<{
  href: string
  label: string
  description: string
  icon: LucideIcon
}> = [
  {
    href: '/admin',
    label: 'Bookings',
    description: 'Appointments and customer details',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/availability',
    label: 'Availability',
    description: 'Open and remove booking slots',
    icon: Clock,
  },
  {
    href: '/admin/calendar',
    label: 'Calendar',
    description: 'Daily schedule view',
    icon: CalendarDays,
  },
  {
    href: '/admin/contact',
    label: 'Messages',
    description: 'Customer enquiries and replies',
    icon: Inbox,
  },
  {
    href: '/admin/testimonials',
    label: 'Reviews',
    description: 'Approve client words',
    icon: Star,
  },
  {
    href: '/admin/services',
    label: 'Services',
    description: 'Prices, deposits, and treatments',
    icon: Scissors,
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    description: 'Revenue and booking insight',
    icon: BarChart3,
  },
  {
    href: '/admin/install',
    label: 'Install App',
    description: 'Add admin to iPhone',
    icon: Smartphone,
  },
]

export function useAdminAuth() {
  return useContext(AuthContext)
}

function isActivePath(pathname: string, href: string) {
  if (href === '/admin') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_token')
    if (stored) setToken(stored)
    setChecking(false)
  }, [])

  async function handleLogin() {
    setError('')

    const res = await fetch('/api/admin/bookings?page=1', {
      headers: { Authorization: `Bearer ${password}` },
    })

    if (res.ok) {
      sessionStorage.setItem('admin_token', password)
      setToken(password)
      return
    }

    setError('Invalid password')
  }

  function logout() {
    sessionStorage.removeItem('admin_token')
    setToken(null)
    setMobileMenuOpen(false)
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-full border border-foreground/10 bg-card px-5 py-3 text-sm text-muted-foreground shadow-sm">
          Loading admin...
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.8),transparent_28rem),radial-gradient(circle_at_82%_35%,rgba(177,146,112,0.2),transparent_34rem)]" />
        <div className="relative w-full max-w-md rounded-[2rem] border border-foreground/10 bg-card/80 p-6 shadow-[0_30px_120px_-60px_rgba(45,38,31,0.65)] backdrop-blur sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Lock className="h-5 w-5" />
            </div>

            <div>
              <p className="eyebrow">Hauslash studio</p>
              <h1 className="mt-2 font-serif text-3xl leading-tight text-foreground">
                Admin Login
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Sign in to manage bookings, availability, services, and client messages.
              </p>
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleLogin()
            }}
            className="mt-7 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Admin password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
                className="rounded-full bg-background/80"
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <Button type="submit" className="rounded-full">
              Sign in
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Back to website
            </Link>
            <span className="h-1 w-1 rounded-full bg-border" />
            <Link href="/admin/install" className="hover:text-foreground">
              Install admin app
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ token, logout }}>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/88 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/admin"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm"
                aria-label="Hauslash admin home"
              >
                <Sparkles className="h-5 w-5" />
              </Link>
              <div className="min-w-0">
                <Link
                  href="/admin"
                  className="block truncate font-serif text-xl leading-none text-foreground"
                >
                  Hauslash
                </Link>
                <p className="mt-1 hidden text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:block">
                  Admin suite
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-1 rounded-full border border-foreground/10 bg-card/70 p-1 shadow-sm lg:flex">
              {navItems.slice(0, 7).map((item) => {
                const active = isActivePath(pathname, item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'rounded-full px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground',
                      active && 'bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Button asChild variant="outline" size="sm" className="rounded-full bg-card/60">
                <Link href="/" target="_blank">
                  <Home className="h-3.5 w-3.5" />
                  View Site
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-full bg-card/60">
                <Link href="/admin/install">
                  <Smartphone className="h-3.5 w-3.5" />
                  App
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} className="rounded-full">
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle admin menu"
              className="rounded-full bg-card/70 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <div className="border-t border-foreground/10 bg-background/96 px-4 py-4 shadow-xl backdrop-blur-xl lg:hidden">
              <nav className="grid gap-2">
                {navItems.map((item) => {
                  const active = isActivePath(pathname, item.href)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm transition-colors',
                        active
                          ? 'border-foreground/10 bg-primary text-primary-foreground shadow-sm'
                          : 'bg-card/60 text-foreground hover:border-foreground/10 hover:bg-card'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>
                        <span className="block font-semibold">{item.label}</span>
                        <span className={cn('block text-xs', active ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  )
                })}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" className="rounded-full bg-card/70">
                    <Link href="/" target="_blank">
                      <Home className="h-4 w-4" />
                      Website
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={logout} className="rounded-full text-destructive">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  )
}
