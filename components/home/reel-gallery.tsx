import Image from "next/image";
import { ArrowUpRight, Instagram, Play } from "lucide-react";

// Selected from Hauslash's public Reels: treatment-focused films, not unrelated viral posts.
const reels = [
  {
    id: "DWJ7JouiH3E",
    title: "Soft lift. Clean tint.",
    image: "/images/work/hauslash-amber-eye-closeup.jpg",
  },
  {
    id: "DbRTKX5gW6o",
    title: "Your sign to book",
    image: "/images/work/hauslash-client-mirror-lift.jpg",
  },
  {
    id: "DcbSEI7gQ4q",
    title: "The finishing touch",
    image: "/images/work/hauslash-blue-eye-lift.jpg",
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reels.map((reel, index) => (
            <a
              key={reel.id}
              href={`https://www.instagram.com/reel/${reel.id}/`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${reel.title} on Instagram`}
              className="group relative aspect-[9/13] overflow-hidden bg-[#d7c7b7]"
            >
              <Image
                src={reel.image}
                alt="Hauslash lash lift result"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
              <span className="absolute left-6 top-6 text-[10px] font-semibold uppercase tracking-[.2em] text-white">
                Hauslash / Film 0{index + 1}
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-white">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/80 bg-black/20 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-black/40">
                  <Play className="ml-1" size={23} />
                </span>
              </span>
              <span className="absolute bottom-16 left-6 right-6 font-serif text-3xl text-white">
                {reel.title}
              </span>
              <span className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-[#29231f] px-6 py-4 text-[10px] font-semibold uppercase tracking-[.15em] text-white">
                Watch on Instagram <ArrowUpRight size={17} />
              </span>
            </a>
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
