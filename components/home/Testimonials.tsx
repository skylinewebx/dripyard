import Reveal from "@/components/ui/Reveal";
import Stars from "@/components/ui/Stars";

/** SAMPLE content. Clearly labelled; not verified customer reviews. */
const REVIEWS = [
  {
    initials: "MR",
    name: "Maya R.",
    pair: "Air Jordan 1 Retro High OG",
    text: "The leather looks richer in person than on screen, and the fit is true to size. Easily my most-worn pair this season.",
    tone: "bg-white",
  },
  {
    initials: "DK",
    name: "Devon K.",
    pair: "Air Force 1 Low",
    text: "Clean, simple and goes with everything. Packaging was tidy and the whole order showed up faster than I expected.",
    tone: "bg-brand text-white",
  },
  {
    initials: "SL",
    name: "Sofia L.",
    pair: "Nike SB Dunk Low",
    text: "Soft suede, great colours and comfortable straight out of the box. I get compliments every time I wear them.",
    tone: "bg-white",
  },
];

const AVATARS = ["bg-brand text-white", "bg-coral text-white", "bg-maroon text-cream", "bg-cream text-maroon"];

export default function Testimonials() {
  return (
    <section aria-labelledby="stories-title" className="pb-20 sm:pb-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Stories</p>
          <h2 id="stories-title" className="display mt-3 text-[clamp(2.2rem,5.5vw,4.25rem)]">
            Every Pair Tells A Story, Here&rsquo;s Theirs
          </h2>
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

        <ul className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {REVIEWS.map((r, i) => (
            <Reveal as="li" key={r.name} delay={i * 0.1} className={i === 1 ? "md:translate-y-6" : ""}>
              <figure className={`flex h-full flex-col justify-between gap-8 rounded-[28px] p-7 shadow-card sm:p-8 ${r.tone}`}>
                <blockquote className="text-[16px] leading-relaxed">&ldquo;{r.text}&rdquo;</blockquote>
                <figcaption className="flex items-center gap-3">
                  <span aria-hidden className={`grid h-11 w-11 place-items-center rounded-full text-xs font-semibold ${i === 1 ? "bg-cream text-maroon" : "bg-maroon text-cream"}`}>
                    {r.initials}
                  </span>
                  <span className="text-sm">
                    <span className="block font-semibold">{r.name}</span>
                    <span className={i === 1 ? "text-white/75" : "text-maroon/60"}>{r.pair}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
        <p className="mt-10 text-center text-xs text-maroon/50 md:mt-14">Demonstration testimonials for this sample storefront. They are not verified customer reviews.</p>
      </div>
    </section>
  );
}
