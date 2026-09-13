import { ArrowUpRight, Instagram } from "lucide-react";
import { LoopingVideo } from "@/components/looping-video";

// Selected from Hauslash's public Reels: treatment-focused films, not unrelated viral posts.
const reels = [
  {
    id: "DWJ7JouiH3E",
    title: "Soft lift. Clean tint.",
    video: "/videos/hauslash-soft-lift-hero.mp4",
    poster: "/images/work/hauslash-amber-eye-closeup.jpg",
  },
  {
    id: "DbRTKX5gW6o",
    title: "Your sign to book",
    video: "/videos/hauslash-your-sign-to-book.mp4",
    poster: "/images/work/hauslash-client-mirror-lift.jpg",
  },
  {
    id: "DcbSEI7gQ4q",
    title: "The finishing touch",
    video: "/videos/hauslash-finishing-touch.mp4",
    poster: "/images/work/hauslash-blue-eye-lift.jpg",
  },
  {
    id: "DbNjO3ctDvO",
    title: "A lift made for you",
    video: "/videos/hauslash-returning-client-lift.mp4",
    poster: "/images/work/hauslash-client-mirror-lift.jpg",
  },
];

export function ReelGallery() {
  return (
    <section id="reels" className="bg-[#f7f3ed] px-6 py-24 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-11 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">04 / In motion</p>
            <h2 className="mt-4 font-serif text-[clamp(3rem,5.5vw,6rem)] leading-none tracking-[-.05em]">
              The beauty is
              <br />
              <em>in the detail.</em>
            </h2>
          </div>
          <a
            href="https://www.instagram.com/hauslash_co/"
            target="_blank"
            rel="noopener noreferrer"
            className="premium-text-link"
          >
            Follow @hauslash_co <Instagram size={17} />
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
          {reels.map((reel, index) => (
            <article
              key={reel.id}
              className="group relative aspect-[9/13] overflow-hidden bg-[#d7c7b7]"
            >
              <LoopingVideo
                src={reel.video}
                poster={reel.poster}
                className="transition duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
              <span className="absolute left-6 top-6 text-[10px] font-semibold uppercase tracking-[.2em] text-white">
                Hauslash / Film 0{index + 1}
              </span>
              <span className="absolute bottom-[4.3rem] left-5 right-5 font-serif text-[clamp(1.9rem,3vw,2.5rem)] leading-[.92] text-white sm:left-6 sm:right-6">
                {reel.title}
              </span>
              <a
                href={`https://www.instagram.com/reel/${reel.id}/`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${reel.title} on Instagram`}
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/10 bg-[#29231f]/95 px-5 py-4 text-[10px] font-semibold uppercase tracking-[.15em] text-white transition-colors hover:bg-[#443b35] sm:px-6"
              >
                View the original reel <ArrowUpRight size={17} />
              </a>
            </article>
          ))}
        </div>
        <div className="mt-9 flex flex-col justify-between gap-5 border-t border-[#b7a99b] pt-6 md:flex-row md:items-center">
          <p className="max-w-xl text-sm leading-7 text-[#61574f]">
            Real treatments, real clients and a closer look at the detail behind
            every lift.
          </p>
          <a
            href="https://www.instagram.com/hauslash_co/"
            target="_blank"
            rel="noopener noreferrer"
            className="premium-text-link"
          >
            Explore more on Instagram <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
