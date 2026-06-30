import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Hauslash collects, uses, stores, and protects customer information.',
}

const UPDATED = '28 June 2026'

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <div className="mb-12 text-center">
        <p className="eyebrow text-muted-foreground">Legal</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {UPDATED}</p>
      </div>

      <div className="flex flex-col gap-9 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-serif text-2xl text-foreground">Who we are</h2>
          <p className="mt-3">
            Hauslash provides Korean lash lift, tinting, consultation, patch test, and mobile outcall services in Stoke-On-Trent. For privacy questions, contact us at{' '}
            <a className="text-foreground underline" href="mailto:Hauslash@outlook.com">Hauslash@outlook.com</a>.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Information we collect</h2>
          <ul className="mt-4 ml-4 flex list-disc flex-col gap-2">
            <li>Booking details such as your name, email, phone number, selected treatment, appointment time, notes, and booking status.</li>
            <li>Payment status and deposit information processed through Stripe. We do not store full card details on this website.</li>
            <li>Contact form messages and replies.</li>
            <li>Review details you choose to submit, including name, email, rating, and review text.</li>
            <li>Basic website usage information through hosting, security, and analytics tools.</li>
          </ul>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">How we use your information</h2>
          <ul className="mt-4 ml-4 flex list-disc flex-col gap-2">
            <li>To create, confirm, reschedule, cancel, and remind you about appointments.</li>
            <li>To process deposits and record payment status.</li>
            <li>To respond to enquiries and customer messages.</li>
            <li>To moderate and display approved reviews.</li>
            <li>To protect the website from spam, abuse, fraud, and unauthorised access.</li>
            <li>To maintain accurate business, accounting, and legal records.</li>
          </ul>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Legal bases</h2>
          <p className="mt-3">
            We use your information where it is needed to provide a service you requested, to meet legal and accounting obligations, with your consent where appropriate, and for legitimate business interests such as security, customer service, and improving the website.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Who we share data with</h2>
          <p className="mt-3">
            We use trusted service providers to run the website and bookings, including Vercel for hosting/analytics, Neon or our database provider for booking records, Stripe for payments, Resend for transactional emails, and Instagram if you contact us there. These providers only receive the information needed to provide their service.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">How long we keep information</h2>
          <p className="mt-3">
            Booking, payment, and business records may be kept for up to 7 years where needed for accounting, tax, dispute, or legal reasons. Contact enquiries are normally kept for up to 12 months unless they become part of an active booking or dispute. Reviews remain published until removed, rejected, or requested for removal where appropriate.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Your rights</h2>
          <p className="mt-3">
            You can ask to access, correct, delete, restrict, or object to how your personal information is used. Some records may need to be kept where required by law. To make a request, email{' '}
            <a className="text-foreground underline" href="mailto:Hauslash@outlook.com">Hauslash@outlook.com</a>.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Related policies</h2>
          <p className="mt-3">
            Please also read our{' '}
            <Link className="text-foreground underline" href="/cookies">Cookie Policy</Link>,{' '}
            <Link className="text-foreground underline" href="/terms">Terms & Booking Conditions</Link>, and{' '}
            <Link className="text-foreground underline" href="/policies">Treatment Policies</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
