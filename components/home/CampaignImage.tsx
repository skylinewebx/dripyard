import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * Supplied campaign image, shown whole (no crop, no edits) at its native proportions and at most
 * its native width so it is never upscaled. The surrounding band uses the theme's maroon-black, and
 * the image's own black margins are feathered into it so the picture sits in the page, not on it.
 */
export default function CampaignImage() {
  return (
    <section aria-label="Campaign" data-dark className="grain relative overflow-hidden bg-maroon py-14 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(70% 60% at 50% 45%, rgba(179,32,42,0.22) 0%, rgba(26,5,5,0) 70%)" }}
      />
      <div className="container-x relative">
        <Reveal>
          <div className="mx-auto w-full max-w-[699px] [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <Image
              src="/images/campaign-banner.jpg"
              alt="Heepzy campaign: a man in olive trousers seen from below wearing red and white Air Jordan 1 Low sneakers, with the headline Reimagined Comfort, followed by a Your Next Level Kicks Just Dropped panel with four red sneaker views"
              width={699}
              height={960}
              sizes="(min-width:760px) 699px, 100vw"
              quality={100}
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
