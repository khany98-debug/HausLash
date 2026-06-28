import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Hauslash uses cookies, analytics, and similar technologies.',
}

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <div className="mb-12 text-center">
        <p className="eyebrow text-muted-foreground">Legal</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          Cookie Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: 28 June 2026</p>
      </div>

      <div className="flex flex-col gap-9 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-serif text-2xl text-foreground">What cookies are</h2>
          <p className="mt-3">
            Cookies and similar technologies help websites remember information, keep services secure, process bookings, and understand how visitors use the site.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">How Hauslash uses them</h2>
          <ul className="mt-4 ml-4 flex list-disc flex-col gap-2">
            <li><strong className="text-foreground">Essential functions:</strong> booking flow, security, form protection, and admin access.</li>
            <li><strong className="text-foreground">Payments:</strong> Stripe may use cookies or similar technologies when you complete checkout.</li>
            <li><strong className="text-foreground">Analytics:</strong> we use Vercel Analytics to understand general website performance and visitor behaviour.</li>
            <li><strong className="text-foreground">Third-party links:</strong> Instagram and external calendar/payment links may set their own cookies when you visit them.</li>
          </ul>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Advertising cookies</h2>
          <p className="mt-3">
            Hauslash does not currently use advertising or retargeting cookies. If this changes, this policy and the website consent controls should be updated before those tools are enabled.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Managing cookies</h2>
          <p className="mt-3">
            You can block or delete cookies in your browser settings. Some essential features, such as secure checkout or admin access, may not work correctly if all cookies or similar storage are blocked.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Questions</h2>
          <p className="mt-3">
            For questions, email{' '}
            <a className="text-foreground underline" href="mailto:Hauslash@outlook.com">Hauslash@outlook.com</a>. You can also read our{' '}
            <Link className="text-foreground underline" href="/privacy">Privacy Policy</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
