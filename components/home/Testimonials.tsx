import Reveal from "@/components/ui/Reveal";
import SplitReveal from "@/components/ui/SplitReveal";
import Stars from "@/components/ui/Stars";

/** SAMPLE content. Clearly labelled; not verified customer reviews. */
const REVIEWS = [
  {
    initials: "MR",
    name: "Maya R.",
    pair: "Air Jordan 1 Retro High OG",
    text: "The leather looks richer in person than on screen, and the fit is true to size. Easily my most-worn pair this season.",
  },
  {
    initials: "DK",
    name: "Devon K.",
    pair: "Air Force 1 Low",
    text: "Clean, simple and goes with everything. Packaging was tidy and the whole order showed up faster than I expected.",
  },
  {
    initials: "SL",
    name: "Sofia L.",
    pair: "Nike SB Dunk Low",
    text: "Soft suede, great colours and comfortable straight out of the box. I get compliments every time I wear them.",
  },
];

const AVATARS = ["bg-brand text-white", "bg-coral text-white", "bg-maroon text-cream", "bg-cream text-maroon"];

export default function Testimonials() {
  return (
    <section aria-labelledby="stories-title" className="pb-24 sm:pb-36">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Stories</p>
          <SplitReveal id="stories-title" className="display mt-3 text-[clamp(2.2rem,5.5vw,4.25rem)]" text="Every Pair Tells A Story, Here’s Theirs" />
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <div className="flex -space-x-3" aria-hidden>
              {["AK", "JM", "SR", "TL"].map((t, i) => (
                <span key={t} className={`grid h-10 w-10 place-items-center rounded-full text-[11px] font-semibold ring-2 ring-cream ${AVATARS[i]}`}>
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Stars rating={4.5} size={16} />
              <span className="font-semibold">4.5/5</span>
              <span className="text-maroon/55">sample rating</span>
            </div>
          </div>
        </Reveal>

        {/* Open columns separated by hairlines; the centre story is lifted and carries the one colour block. */}
        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0">
          {REVIEWS.map((r, i) => {
            const lead = i === 1;
            return (
              <Reveal as="li" key={r.name} delay={i * 0.1} className={`md:px-9 ${i > 0 && !lead ? "md:border-l md:border-maroon/12" : ""} ${lead ? "md:-mt-8" : ""}`}>
                <figure className={`flex h-full flex-col justify-between gap-10 ${lead ? "bg-brand p-8 text-white md:p-10" : "border-t border-maroon/15 pt-8 md:border-t-0 md:pt-0"} ${lead ? "rounded-[6px]" : ""}`}>
                  <div>
                    <span aria-hidden className={`font-display text-6xl leading-none ${lead ? "text-white/40" : "text-brand/70"}`}>
                      &ldquo;
                    </span>
                    <blockquote className="-mt-2 text-[17px] leading-[1.65] sm:text-[18px]">{r.text}</blockquote>
                  </div>
                  <figcaption className="flex items-center gap-3">
                    <span aria-hidden className={`grid h-11 w-11 place-items-center rounded-full text-xs font-semibold ${lead ? "bg-cream text-maroon" : "bg-maroon text-cream"}`}>
                      {r.initials}
                    </span>
                    <span className="text-sm">
                      <span className="block font-semibold">{r.name}</span>
                      <span className={lead ? "text-white/75" : "text-maroon/60"}>{r.pair}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </ul>
        <p className="mt-14 text-center text-xs text-maroon/50">Demonstration testimonials for this sample storefront. They are not verified customer reviews.</p>
      </div>
    </section>
  );
}
