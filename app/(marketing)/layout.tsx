import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[70] rounded-full bg-[#f7f2eb] px-5 py-3 text-sm font-semibold text-[#211d1b] shadow-lg focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-[#211d1b]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <div id="main-content" className="min-h-[80vh]">
        {children}
      </div>
      <SiteFooter />
    </>
  )
}
