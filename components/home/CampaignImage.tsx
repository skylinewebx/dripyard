import Image from "next/image";
import type { CSSProperties } from "react";

const SRC = "/images/campaign-banner.jpg";
const ALT =
  "Heepzy campaign: a man in olive trousers seen from below wearing red and white Air Jordan 1 Low sneakers, with the headline Reimagined Comfort, followed by a Your Next Level Kicks Just Dropped panel with four red sneaker views";

/**
 * The supplied campaign picture, untouched (whole frame, native proportions, never upscaled, never
 * transformed), staged like the hero: it fades in out of the cream page into deep maroon, is lit by
 * a red spotlight from above, stands on a glossy floor that mirrors it, and sits against a huge
 * outlined word that drifts (CSS scroll-driven, compositor only).
 */
export default function CampaignImage() {
  return (
    <section
      aria-label="Campaign"
      data-dark
      // Extends over the footer's top margin so the footer's rounded corners sit on the same maroon (no cream seam).
      className="grain relative -mb-24 overflow-hidden pb-44 pt-28 sm:-mb-32 sm:pb-60 sm:pt-40"
      style={{ background: "linear-gradient(to bottom, #f6f1ea 0%, #3a0d11 16%, #1f0608 34%, #1a0505 100%)" }}
    >
      {/* Spotlight from above (same red as the hero light) */}
      <div aria-hidden className="sd-glow pointer-events-none absolute left-1/2 top-[10%] h-[70%] w-[150%] -translate-x-1/2">
        <div
          className="h-full w-full"
          style={{ background: "radial-gradient(50% 55% at 50% 30%, rgba(217,74,74,0.34) 0%, rgba(179,32,42,0.16) 38%, rgba(26,5,5,0) 72%)" }}
        />
      </div>

      {/* Huge outlined word, drifting at a different speed than the page (depth) */}
      <p
        aria-hidden
        style={{ "--from": "8%", "--to": "-22%", WebkitTextStroke: "1.5px rgba(255,255,255,0.09)" } as CSSProperties}
        className="sd-x display pointer-events-none absolute left-0 top-[22%] select-none whitespace-nowrap text-[clamp(8rem,30vw,30rem)] leading-none text-transparent"
      >
        Reimagined
      </p>

      <div className="container-x relative">
        <div className="relative mx-auto w-full max-w-[699px]">
          {/* Floor light under the picture */}
          <div aria-hidden className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-[85%] -translate-x-1/2 rounded-full bg-brand/45 blur-3xl" />

          <div className="relative overflow-hidden rounded-[10px] shadow-[0_70px_120px_-40px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)]">
            <Image src={SRC} alt={ALT} width={699} height={960} sizes="(min-width:760px) 699px, 100vw" quality={100} className="block h-auto w-full" />
            {/* Soft top-light sheen across the glass of the frame */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-transparent" />
          </div>

          {/* Glossy-floor reflection, as in the hero */}
          <div
            aria-hidden
            className="pointer-events-none relative mt-2 w-full overflow-hidden [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.2),transparent_70%)]"
            style={{ aspectRatio: "699 / 326" }}
          >
            <div className="absolute inset-x-0 top-0 aspect-[699/960] -scale-y-100 blur-[3px]">
              <Image src={SRC} alt="" width={699} height={960} sizes="(min-width:760px) 699px, 100vw" loading="lazy" className="h-auto w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
