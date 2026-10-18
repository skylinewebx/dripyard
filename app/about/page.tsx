import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { FREE_SHIPPING_THRESHOLD_CENTS, formatPrice } from "@/lib/pricing";

export const metadata: Metadata = { title: "About", description: "What DRIPYARD is, and what it is not." };

export default function AboutPage() {
  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <Reveal className="max-w-4xl">
        <p className="eyebrow">About DRIPYARD</p>
        <h1 className="display mt-3 text-[clamp(3rem,9vw,7.5rem)]">Built for every mood, outfit and move</h1>
      </Reveal>

      <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
        <Reveal className="space-y-5 text-[16px] leading-relaxed text-maroon/80">
          <p>
            DRIPYARD is a sneaker store with one focus: Nike. Air Jordan 1 in every height, the Air Force 1 in clean and colourful forms, and the SB Dunk for the suede-and-gum crowd.
          </p>
          <p>
            Every pair on the site is shown with real photography, because a sneaker should be judged on what it actually looks like. We tidy exposure and sharpness, never the shoes themselves.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="space-y-5 rounded-[32px] bg-white/60 p-7 shadow-card ring-1 ring-maroon/5 sm:p-9">
          <h2 className="display text-3xl">Good to know</h2>
          <ul className="space-y-3 text-[15px] text-maroon/75">
            <li>Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)}, a flat $9.95 otherwise.</li>
            <li>Payments run through Stripe Checkout in test mode in this build.</li>
            <li>
              <strong className="text-maroon">DRIPYARD is an independent retailer and is not affiliated with Nike, Inc.</strong> Nike and product names are trademarks of their owners.
            </li>
            <li>This is a sample storefront: ratings, reviews and customer counts are demonstration content.</li>
          </ul>
        </Reveal>
      </div>

      <div className="mt-14">
        <Link href="/shop" className="pill-solid">
          Start shopping
        </Link>
      </div>
    </div>
  );
}
