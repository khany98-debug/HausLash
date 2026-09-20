import { getDb } from "@/lib/db";
import {
  FALLBACK_SERVICES,
  isMissingDatabaseConfig,
} from "@/lib/service-fallbacks";
import { normalisePublicServices } from "@/lib/service-display";
import { Service } from "@/lib/types";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book an Appointment",
  description:
    "Choose your treatment, pick a date and time, and secure your booking online.",
};

async function getServices(): Promise<Service[]> {
  try {
    const sql = getDb();
    const rows =
      await sql`SELECT * FROM services WHERE active = true ORDER BY sort_order ASC`;
    return normalisePublicServices(rows as Service[]);
  } catch (error) {
    if (isMissingDatabaseConfig(error)) {
      return normalisePublicServices(FALLBACK_SERVICES);
    }

    throw error;
  }
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const services = await getServices();

  return (
    <>
      <SiteHeader />
      <main className="min-h-[80vh] bg-[#f7f3ed]">
        <section className="bg-[#e8ded3] px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow">Your Hauslash experience / Online booking</p>
            <h1 className="mt-5 max-w-3xl font-serif text-[clamp(3.2rem,6vw,6.5rem)] leading-[.98] tracking-[-.05em]">
              A little time for <em>you.</em>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#61574f]">
              Choose your treatment, find an available time and reserve your
              appointment in a few simple steps.
            </p>
          </div>
        </section>
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-8 md:py-16 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
          <div className="border border-[#cfc3b7] bg-[#fffdfa] p-5 shadow-[0_20px_60px_-45px_rgba(45,38,31,.35)] sm:p-8 lg:p-10">
            <BookingWizard
              services={services}
              preselectedSlug={params.service}
            />
          </div>
          <aside className="h-fit border-t border-[#b5a697] pt-6 text-sm leading-7 text-[#61574f]">
            <p className="eyebrow">Before you book</p>
            <p className="mt-5">
              First Hauslash lash lift? Please arrange a patch test before
              treatment.
            </p>
            <p className="mt-4">
              Lash lifts are secured with a non-refundable deposit. Patch tests
              have a £5 refundable attendance deposit.
            </p>
            <p className="mt-4">
              You can review all the details before paying.
            </p>
          </aside>
        </div>
      </main>
    </>
  );
}
