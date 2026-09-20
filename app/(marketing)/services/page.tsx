import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";
import { getDb } from "@/lib/db";
import {
  FALLBACK_SERVICES,
  isMissingDatabaseConfig,
} from "@/lib/service-fallbacks";
import { normalisePublicServices } from "@/lib/service-display";
import { Service, formatDuration, formatPence } from "@/lib/types";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Treatments & prices",
  description:
    "Explore Hauslash Korean lash lift, mobile treatment and patch-test options in Stoke-on-Trent.",
};

export const dynamic = "force-dynamic";

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

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main>
      <section className="bg-[#e8ded3] px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">The Hauslash treatment menu</p>
          <h1 className="mt-6 max-w-4xl font-serif text-[clamp(3.3rem,7vw,7rem)] leading-[.98] tracking-[-.055em]">
            The lift is <em>personal.</em>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#61574f]">
            Choose the experience that fits you. Every treatment is considered,
            every result your own.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <div className="mb-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <div className="border-t border-[#ad9d8d] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
              Consultation
            </p>
            <p className="mt-2 leading-6">
              We discuss your natural lashes, preferred finish, and any
              sensitivity concerns.
            </p>
          </div>
          <div className="border-t border-[#ad9d8d] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
              Patch test
            </p>
            <p className="mt-2 leading-6">
              Available before treatment for peace of mind, especially for
              first-time clients.
            </p>
          </div>
          <div className="border-t border-[#ad9d8d] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
              Easy booking
            </p>
            <p className="mt-2 leading-6">
              Choose the treatment, pick your time, and secure your appointment
              online.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="group grid gap-6 overflow-hidden border-t border-[#ad9d8d] p-6 transition duration-300 hover:bg-[#eee6dc] sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center"
            >
              <span className="font-serif text-4xl italic text-muted-foreground/40 transition group-hover:text-foreground/45">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
                  {service.name}
                </h2>
                {service.description && (
                  <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                    {service.description}
                  </p>
                )}
                <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDuration(service.duration_minutes)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Consultation and patch test guidance
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-5 md:flex-col md:items-end">
                {service.price_pence !== null && (
                  <p className="font-serif text-4xl tracking-tight">
                    {service.price_pence > 0
                      ? formatPence(service.price_pence)
                      : "Free"}
                  </p>
                )}
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-foreground/15 bg-transparent"
                >
                  <Link href={`/book?service=${service.slug}`}>
                    Book
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-foreground/10 bg-foreground px-6 py-8 text-primary-foreground shadow-[0_32px_90px_-55px_rgba(42,34,28,0.75)] sm:flex sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="eyebrow text-primary-foreground/50">Booking note</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-primary-foreground/70">
              Lash lift appointments are secured with a {formatPence(1500)}{" "}
              non-refundable deposit. Patch tests are secured with a{" "}
              {formatPence(500)} refundable attendance deposit and should be
              booked at least 24 hours before a first treatment.
            </p>
          </div>
          <Button
            asChild
            variant="secondary"
            className="mt-5 rounded-full sm:mt-0"
          >
            <Link href="/policies">View policies</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
