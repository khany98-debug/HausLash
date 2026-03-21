'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Menu, X } from 'lucide-react'
import Link from 'next/link'

const AuthContext = createContext<{ token: string; logout: () => void }>({
  token: '',
  logout: () => {},
})

export function useAdminAuth() {
  return useContext(AuthContext)
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {

    const stored = sessionStorage.getItem('admin_token')

    if (stored) {
      setToken(stored)
    }

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

    } else {

      setError('Invalid password')

    }

  }


  function logout() {

    sessionStorage.removeItem('admin_token')

    setToken(null)

  }


  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }


  if (!token) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-background px-6">

        <div className="w-full max-w-sm">

          <div className="flex flex-col items-center gap-4 text-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>

            <div>
              <h1 className="font-serif text-2xl text-foreground">
                Admin Login
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Enter the admin password to continue
              </p>
            </div>

          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleLogin()
            }}
            className="mt-6 flex flex-col gap-4"
          >

            <div className="flex flex-col gap-1.5">

              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />

              {error && (
                <p className="text-xs text-destructive">
                  {error}
                </p>
              )}

            </div>

            <Button type="submit" className="rounded-full">
              Sign In
            </Button>

          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">

            <Link href="/" className="hover:text-foreground">
              Back to website
            </Link>

          </p>

        </div>

      </div>

    )

  }


  return (

    <AuthContext.Provider value={{ token, logout }}>

      <div className="min-h-screen bg-background">

        {/* Header */}
        <header className="border-b border-border/60 bg-card sticky top-0 z-50">

          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">

            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-4">

              <Link
                href="/"
                className="font-serif text-lg text-foreground truncate"
              >
                Hauslash
              </Link>

              <span className="hidden sm:inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                Admin
              </span>

            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">

              <nav className="flex items-center gap-4 text-sm">

                <Link
                  href="/admin"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bookings
                </Link>

                <Link
                  href="/admin/analytics"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Analytics
                </Link>

                <Link
                  href="/admin/services"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Services
                </Link>

                <Link
                  href="/admin/availability"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Availability
                </Link>

                <Link
                  href="/admin/calendar"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Calendar
                </Link>

                <Link
                  href="/admin/testimonials"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Testimonials
                </Link>

                <Link
                  href="/admin/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>

              </nav>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>

            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

            </div>

          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="border-t border-border/60 bg-card/95 backdrop-blur-sm md:hidden">

              <nav className="flex flex-col border-border/40">

                <Link
                  href="/admin"
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-b border-border/40"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bookings
                </Link>

                <Link
                  href="/admin/analytics"
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-b border-border/40"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Analytics
                </Link>

                <Link
                  href="/admin/services"
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-b border-border/40"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>

                <Link
                  href="/admin/availability"
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-b border-border/40"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Availability
                </Link>

                <Link
                  href="/admin/calendar"
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-b border-border/40"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Calendar
                </Link>

                <Link
                  href="/admin/testimonials"
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-b border-border/40"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </Link>

                <Link
                  href="/admin/contact"
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-b border-border/40"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left font-medium"
                >
                  Logout
                </button>

              </nav>

            </div>
          )}

        </header>

        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">

          {children}

        </main>

      </div>

    </AuthContext.Provider>

  )

}