import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ReelGallery } from "./reel-gallery";
import TestimonialsSection from "./testimonials-section";
import { FaqSection } from "./faq-section";

const services = [
  {
    name: "The studio lift",
    desc: "Our signature Korean lash lift, tailored to your natural lashes.",
    image: "/images/work/hauslash-green-eye-detail.jpg",
    href: "/book?service=korean-lash-lift-studio",
  },
  {
    name: "The lift, to you",
    desc: "The Hauslash treatment in the comfort of your own space.",
    image: "/images/work/hauslash-blue-eye-detail.jpg",
    href: "/book?service=korean-lash-lift-mobile",
  },
  {
    name: "Your patch test",
    desc: "The essential first step for new lash-lift clients.",
    image: "/images/work/hauslash-soft-brown-detail.jpg",
    href: "/book?service=patch-test",
  },
];

export function EditorialHome() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#211d1b] text-[#f7f2eb]">
        <Image
          src="/images/work/hauslash-editorial-mirror.jpg"
          alt="Hauslash client admiring her lifted lashes"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[54%_46%] lg:object-[50%_57%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,20,19,.83),rgba(24,20,19,.57)_42%,rgba(24,20,19,.08))] max-md:bg-[linear-gradient(0deg,rgba(24,20,19,.9),rgba(24,20,19,.3)_80%)]" />
        <div className="relative mx-auto flex min-h-[690px] max-w-[1600px] flex-col justify-between px-6 pb-9 pt-8 sm:px-10 lg:min-h-[760px] lg:px-20 lg:pb-14">
          <div className="flex justify-between gap-3 border-b border-white/30 pb-5 text-[10px] font-semibold uppercase tracking-[.24em]">
            <span>Hauslash / Stoke-on-Trent</span>
            <span>Natural beauty, considered</span>
          </div>
          <div className="max-w-[760px] pt-44 md:pt-24">
            <p className="text-[11px] font-semibold uppercase tracking-[.3em] text-[#e2cbb8]">
              The Korean lash lift studio
            </p>
            <h1 className="mt-6 font-serif text-[clamp(3.7rem,8.2vw,8.5rem)] leading-[.88] tracking-[-.06em]">
              The art of
              <br />
              <em>looking effortless.</em>
            </h1>
            <p className="mt-8 max-w-md text-base leading-7 text-[#eee6dc] md:text-lg">
              Your natural lashes, beautifully lifted. A considered treatment
              made for your eyes and your everyday.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="premium-button bg-[#f7f2eb] text-[#211d1b] hover:bg-[#e5d4c2]"
              >
                Book your appointment <ArrowUpRight size={17} />
              </Link>
              <Link
                href="#treatments"
                className="premium-button border border-white/60 text-white hover:bg-white/10"
              >
                Explore treatments <ArrowDown size={17} />
              </Link>
            </div>
          </div>
          <div className="flex justify-between gap-4 pt-10 text-[10px] font-semibold uppercase tracking-[.2em] text-white/75">
            <span>01 / The Hauslash experience</span>
            <span>Scroll to discover ↓</span>
          </div>
        </div>
      </section>
      <section className="bg-[#ece5dc] px-6 py-24 text-[#29231f] sm:px-10 lg:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.4fr_1fr]">
          <p className="eyebrow">01 / Our philosophy</p>
          <div>
            <h2 className="font-serif text-[clamp(2.8rem,5.7vw,6.5rem)] leading-[1.03] tracking-[-.055em]">
              Beauty that feels like <em>you,</em> only a little more awake.
            </h2>
            <div className="mt-12 flex flex-col justify-between gap-8 border-t border-[#9e8d7c]/40 pt-7 md:flex-row md:items-end">
              <p className="max-w-lg text-base leading-8 text-[#61574f]">
                No heavy-handed finish. Just a precise, glossy lift that opens
                the eye and lets your natural features lead.
              </p>
              <Link href="/about" className="premium-text-link">
                Meet Hauslash <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section
        id="treatments"
        className="bg-[#f7f3ed] px-6 py-24 sm:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">02 / The treatment menu</p>
              <h2 className="mt-4 font-serif text-[clamp(3rem,5.5vw,6rem)] leading-none tracking-[-.05em]">
                Find your <em>ritual.</em>
              </h2>
            </div>
            <Link href="/services" className="premium-text-link">
              Full menu & prices <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service, i) => (
              <Link
                key={service.href}
                href={service.href}
                className="group block bg-[#e8ded3]"
              >
                <div className="relative aspect-[4/4.5] overflow-hidden">
                  <Image
                    src={service.image}
                    alt="Real Hauslash lash lift result"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-5 top-5 bg-[#f7f3ed] px-3 py-2 text-xs">
                    0{i + 1}
                  </span>
                </div>
                <div className="flex min-h-36 items-end justify-between gap-4 px-6 pb-7 pt-5">
                  <div>
                    <h3 className="font-serif text-3xl tracking-[-.04em]">
                      {service.name}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#61574f]">
                      {service.desc}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mb-1 shrink-0 transition group-hover:-translate-y-1 group-hover:translate-x-1"
                    size={21}
                  />
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm text-[#61574f]">
            New to Hauslash? Start with a patch test before your first lash
            lift.{" "}
            <Link
              href="/book?service=patch-test"
              className="border-b border-current text-[#29231f]"
            >
              Book a patch test
            </Link>
          </p>
        </div>
      </section>
      <section
        id="results"
        className="grid scroll-mt-20 bg-[#25211e] text-[#f7f2eb] lg:grid-cols-2"
      >
        <div className="relative min-h-[500px] lg:min-h-[700px]">
          <Image
            src="/images/work/hauslash-client-mirror-lift.jpg"
            alt="A Hauslash client's natural lifted lashes"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="absolute bottom-6 left-6 bg-[#f7f2eb] px-4 py-2 text-[10px] font-semibold uppercase tracking-[.17em] text-[#29231f]">
            Real Hauslash result
          </span>
        </div>
        <div className="flex flex-col justify-center px-7 py-20 sm:px-12 lg:px-[min(8vw,120px)]">
          <p className="eyebrow !text-[#b9a899]">03 / In the details</p>
          <h2 className="mt-7 font-serif text-[clamp(3rem,5vw,5.7rem)] leading-[1.02] tracking-[-.05em]">
            A softer kind
            <br />
            of <em>statement.</em>
          </h2>
          <p className="mt-8 max-w-md text-base leading-8 text-[#d5c9bd]">
            A consultation-led Korean lash lift shaped around your own lashes,
            finished with a tint and the aftercare to keep them looking their
            best.
          </p>
          <Link
            href="/services"
            className="premium-text-link mt-10 w-fit border-[#d5c9bd] text-[#f7f2eb]"
          >
            Discover the treatment <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <ReelGallery />
      <section className="bg-[#e8ded3] px-6 py-24 sm:px-10 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1fr] lg:gap-24">
          <div>
            <p className="eyebrow">05 / Your appointment</p>
            <h2 className="mt-5 font-serif text-[clamp(3rem,5vw,5.5rem)] leading-[1.02] tracking-[-.05em]">
              Your time,
              <br />
              <em>beautifully spent.</em>
            </h2>
          </div>
          <div className="border-t border-[#a99a8b]">
            {[
              [
                "Choose your treatment",
                "Studio, mobile or a patch test. Clear details and prices before you commit.",
              ],
              [
                "Find a time that fits",
                "See available appointments and choose the one that works for you.",
              ],
              [
                "Reserve with confidence",
                "Review your booking and secure it online with a deposit.",
              ],
            ].map(([title, desc], i) => (
              <div
                key={title}
                className="grid gap-4 border-b border-[#a99a8b] py-7 sm:grid-cols-[3rem_1fr]"
              >
                <span className="font-serif text-2xl italic">0{i + 1}</span>
                <div>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#61574f]">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
            <Link
              href="/book"
              className="premium-button mt-8 bg-[#29231f] text-[#f7f2eb]"
            >
              Reserve an appointment <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <TestimonialsSection />
      <FaqSection />
      <section className="bg-[#26211e] px-6 py-24 text-center text-[#f7f2eb] sm:px-10 lg:py-36">
        <p className="eyebrow !text-[#b9a899]">Your next chapter</p>
        <h2 className="mx-auto mt-6 max-w-4xl font-serif text-[clamp(3.4rem,7vw,8rem)] leading-[.94] tracking-[-.055em]">
          Ready to feel <em>effortless?</em>
        </h2>
        <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-[#d5c9bd]">
          A little lift. A lot of ease. Your next appointment is only a few
          moments away.
        </p>
        <Link
          href="/book"
          className="premium-button mt-9 bg-[#f7f2eb] text-[#29231f]"
        >
          Book with Hauslash <ArrowUpRight size={17} />
        </Link>
      </section>
    </>
  );
}
