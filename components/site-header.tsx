"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

const PRIMARY_NAV_ITEMS = [
  { label: "Treatments", href: "/services" },
  { label: "Results", href: "/#results" },
  { label: "Films", href: "/#reels" },
  { label: "Reviews", href: "/reviews" },
];

const STUDIO_NAV_ITEMS = [
  { label: "About Hauslash", href: "/about" },
  { label: "Aftercare", href: "/aftercare" },
  { label: "Contact", href: "/contact" },
  { label: "My bookings", href: "/bookings" },
];

const INSTAGRAM_DM_URL = "https://ig.me/m/hauslash_co";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }

    const updateScrollState = () => setScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const inverse = isHome;
  const headerClass = isHome
    ? cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-white/15 bg-[#211d1b]/95 text-[#f7f2eb] shadow-[0_10px_35px_rgba(20,16,14,.18)] backdrop-blur-xl"
          : "border-transparent bg-transparent text-[#f7f2eb]",
      )
    : "sticky top-0 z-50 border-b border-foreground/10 bg-background/90 text-foreground backdrop-blur-xl";

  const mutedLink = inverse
    ? "text-white/75 hover:text-white"
    : "text-muted-foreground hover:text-foreground";
  const outlineButton = inverse
    ? "border-white/35 bg-white/5 text-white hover:bg-white/15 hover:text-white"
    : "border-foreground/15 bg-transparent";
  const bookButton = inverse
    ? "bg-[#f7f2eb] text-[#211d1b] hover:bg-[#e6d7c9]"
    : "";

  return (
    <>
      <header className={headerClass}>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 xl:px-8">
        <div className="relative flex h-[76px] items-center justify-between min-[1400px]:hidden">
          <button
            onClick={() => setOpen((value) => !value)}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border transition-colors",
              inverse
                ? "border-white/35 bg-black/10 text-white hover:bg-white/15"
                : "border-foreground/15 text-foreground hover:border-foreground/30 hover:bg-foreground/[0.04]",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            href="/"
            aria-label="Hauslash home"
            className="absolute left-1/2 flex -translate-x-1/2 items-center py-2"
            onClick={() => setOpen(false)}
          >
            <BrandMark className={cn("text-[1.72rem]", inverse && "text-[#f7f2eb]")} />
          </Link>

          <div className="flex items-center gap-1.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className={cn("h-10 rounded-full px-3 text-xs", outlineButton)}
            >
              <a href={INSTAGRAM_DM_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                <span className="min-[430px]:hidden">DM</span>
                <span className="hidden min-[430px]:inline">Enquire</span>
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className={cn("h-10 rounded-full px-4 text-xs", bookButton)}
            >
              <Link href="/book" onClick={() => setOpen(false)}>
                Book
              </Link>
            </Button>
          </div>
        </div>

        <div className="hidden h-[82px] grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)] items-center gap-8 min-[1400px]:grid">
          <nav className="flex min-w-0 items-center gap-6 justify-self-start" aria-label="Primary navigation">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap text-[12px] uppercase tracking-[0.12em] transition-colors",
                  mutedLink,
                  pathname === item.href && (inverse ? "text-white" : "text-foreground"),
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" aria-label="Hauslash home" className="flex items-center justify-self-center px-3 py-2">
            <BrandMark className={cn("text-[2rem]", inverse && "text-[#f7f2eb]")} />
          </Link>

          <nav className="flex min-w-0 items-center justify-end gap-5 justify-self-end" aria-label="Booking and information navigation">
            <Link
              href="/contact"
              className={cn(
                "whitespace-nowrap text-[12px] uppercase tracking-[0.12em] transition-colors",
                mutedLink,
                pathname === "/contact" && (inverse ? "text-white" : "text-foreground"),
              )}
            >
              Contact
            </Link>
            <Button
              asChild
              variant="outline"
              size="sm"
              className={cn("rounded-full px-5", outlineButton)}
            >
              <a href={INSTAGRAM_DM_URL} target="_blank" rel="noreferrer">
                Enquire Now
              </a>
            </Button>
            <Button asChild size="sm" className={cn("rounded-full px-5", bookButton)}>
              <Link href="/book">Book Now</Link>
            </Button>
          </nav>
        </div>
        </div>
      </header>

      {open && (
        <nav
          className="fixed inset-x-0 bottom-0 top-[76px] z-40 overscroll-contain overflow-y-auto bg-[#211d1b] px-6 py-8 text-[#f7f2eb] min-[1400px]:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto grid min-h-full max-w-xl content-between gap-12 pb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#b9a899]">Discover Hauslash</p>
              <div className="mt-5 border-t border-white/15">
                {PRIMARY_NAV_ITEMS.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-white/15 py-4 font-serif text-[clamp(1.8rem,7vw,2.5rem)] leading-none tracking-[-.04em]"
                  >
                    <span>{item.label}</span>
                    <span className="font-sans text-[10px] tracking-[.18em] text-[#b9a899]">
                      0{index + 1}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-8">
              <div className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-white/15 pt-5 text-sm text-[#d5c9bd]">
                {STUDIO_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  asChild
                  className="h-12 rounded-none bg-[#f7f2eb] text-[#211d1b] hover:bg-[#e6d7c9]"
                >
                  <Link href="/book" onClick={() => setOpen(false)}>
                    Book an appointment <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-none border-white/35 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                >
                  <a
                    href={INSTAGRAM_DM_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    Enquire on Instagram <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
