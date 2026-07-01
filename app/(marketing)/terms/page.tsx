import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Booking Conditions',
  description: 'Hauslash booking terms, deposit policy, cancellations, patch tests, and mobile outcall conditions.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <div className="mb-12 text-center">
        <p className="eyebrow text-muted-foreground">Legal</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          Terms & Booking Conditions
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: 28 June 2026</p>
      </div>

      <div className="flex flex-col gap-9 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-serif text-2xl text-foreground">Bookings</h2>
          <p className="mt-3">
            Appointments can be booked online through the Hauslash website. A booking is confirmed once the required deposit has been paid.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Deposits and payments</h2>
          <ul className="mt-4 ml-4 flex list-disc flex-col gap-2">
            <li>Lash lift appointments require a deposit to secure the appointment slot.</li>
            <li><strong className="text-foreground">Deposits are non-refundable once the booking has been made.</strong></li>
            <li>The remaining balance is due at the appointment unless otherwise agreed.</li>
            <li>Payments are processed securely by Stripe. Hauslash does not store full card details.</li>
            <li>Patch tests require a £5 attendance deposit, which is refunded once the customer attends the patch test.</li>
          </ul>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Cancellation and rescheduling</h2>
          <ul className="mt-4 ml-4 flex list-disc flex-col gap-2">
            <li>If you need to reschedule, please contact Hauslash as early as possible.</li>
            <li>Where more than 24 hours notice is given, we will do our best to move your appointment depending on availability.</li>
            <li>Where less than 24 hours notice is given, or the appointment is missed, the deposit may be forfeited and a new deposit may be required.</li>
            <li>If Hauslash needs to cancel or move your appointment, we will contact you using the details provided at booking.</li>
          </ul>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Patch tests</h2>
          <p className="mt-3">
            A patch test is required before your first Hauslash lash treatment. Results are known after 24 hours, so please book or enquire about your patch test at least 24 hours before your lash lift appointment. Hauslash may refuse or rearrange treatment if the patch test has not been completed where required.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Mobile outcall appointments</h2>
          <p className="mt-3">
            Mobile outcall appointments take place at the customer location. After booking, please message Hauslash on Instagram with your area and full treatment address. The studio address shown on the website applies to in-studio appointments only.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Before treatment</h2>
          <ul className="mt-4 ml-4 flex list-disc flex-col gap-2">
            <li>Arrive with clean, makeup-free eyes for in-studio appointments.</li>
            <li>Tell Hauslash about allergies, sensitivities, eye conditions, recent eye procedures, or anything that may affect treatment suitability.</li>
            <li>Remove contact lenses before treatment where applicable.</li>
            <li>Hauslash may refuse or stop a treatment if it would not be safe or suitable to continue.</li>
          </ul>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Website and availability</h2>
          <p className="mt-3">
            We aim to keep treatment information, prices, and availability accurate. We may update services, prices, policies, or availability when needed. If a technical issue affects a booking, Hauslash will contact you to resolve it as fairly as possible.
          </p>
        </section>

        <section className="border-t border-border/60 pt-9">
          <h2 className="font-serif text-2xl text-foreground">Contact</h2>
          <p className="mt-3">
            For booking questions, cancellations, rescheduling, or patch test enquiries, email{' '}
            <a className="text-foreground underline" href="mailto:Hauslash@outlook.com">Hauslash@outlook.com</a>{' '}
            or message us on Instagram. Please also read our{' '}
            <Link className="text-foreground underline" href="/privacy">Privacy Policy</Link> and{' '}
            <Link className="text-foreground underline" href="/policies">Treatment Policies</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
