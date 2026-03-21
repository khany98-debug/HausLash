import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Hauslash cancellation policy, aftercare instructions, and patch test information.',
}

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          Policies & Aftercare
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Everything you need to know before and after your treatment.
        </p>
      </div>

      <div className="flex flex-col gap-10">

        {/* Cancellation Policy */}
        <section id="cancellation">
          <h2 className="font-serif text-2xl text-foreground">Cancellation Policy</h2>

          <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Please ensure you are able to attend your appointment before booking,
              as all appointments require a deposit to secure the time slot.
            </p>

            <ul className="ml-4 flex flex-col gap-2 list-disc">

              <li>
                <strong className="text-foreground">Deposits are non-refundable:</strong>{' '}
                All appointments require a deposit to secure the booking and this
                deposit is non-refundable.
              </li>

              <li>
                <strong className="text-foreground">Rescheduling with more than 24 hours notice:</strong>{' '}
                We will do our best to move your appointment depending on availability.
              </li>

              <li>
                <strong className="text-foreground">Less than 24 hours notice or missed appointments:</strong>{' '}
                The deposit will be forfeited and a new deposit will be required to
                secure another booking.
              </li>

            </ul>

            <p>
              We appreciate your understanding as last-minute cancellations prevent
              us from offering the appointment time to other clients.
            </p>
          </div>
        </section>

        {/* Patch Test */}
        <section id="patch-test" className="border-t border-border/60 pt-10">
          <h2 className="font-serif text-2xl text-foreground">Patch Test Information</h2>

          <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              For your safety, a patch test is required at least 48 hours before your
              first lash treatment with us.
            </p>

            <p>
              This applies even if you have had similar treatments elsewhere, as
              different products may contain different ingredients.
            </p>

            <p>
              The patch test is quick, free, and can be arranged when you book your
              first appointment. Please contact us to schedule one if it is your first
              visit.
            </p>
          </div>
        </section>

        {/* Aftercare */}
        <section id="aftercare" className="border-t border-border/60 pt-10">
          <h2 className="font-serif text-2xl text-foreground">Aftercare Instructions</h2>

          <div className="mt-6">
            <h3 className="text-base font-medium text-foreground">Lash Lift Aftercare</h3>

            <ul className="mt-3 ml-4 flex flex-col gap-2 list-disc text-sm leading-relaxed text-muted-foreground">
              <li>Keep lashes dry for 24 hours after treatment</li>
              <li>Avoid steam, saunas, and swimming for 48 hours</li>
              <li>Do not rub or pull your lashes</li>
              <li>Avoid waterproof mascara for the first week</li>
              <li>Use a nourishing lash serum daily for best results</li>
              <li>Avoid oil-based products around the eye area for 24 hours</li>
            </ul>
          </div>

          <div className="mt-6">


            <ul className="mt-3 ml-4 flex flex-col gap-2 list-disc text-sm leading-relaxed text-muted-foreground">

            </ul>
          </div>
        </section>

        {/* Pre-treatment */}
        <section id="preparation" className="border-t border-border/60 pt-10">
          <h2 className="font-serif text-2xl text-foreground">Before Your Appointment</h2>

          <ul className="mt-4 ml-4 flex flex-col gap-2 list-disc text-sm leading-relaxed text-muted-foreground">
            <li>Arrive with clean, makeup-free eyes</li>
            <li>Avoid waterproof mascara for 48 hours prior</li>
            <li>Remove contact lenses before the treatment</li>
            <li>Avoid caffeine immediately before to reduce eye sensitivity</li>
            <li>Let us know about any allergies or sensitivities</li>
            <li>If you require a patch test, please let us know when booking</li>
          </ul>
        </section>

      </div>
    </div>
  )
}