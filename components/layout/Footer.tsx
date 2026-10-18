import Link from "next/link";
import OpenCartButton from "@/components/cart/OpenCartButton";
import { ArrowIcon } from "@/components/ui/icons";

const linkCls = "inline-block rounded py-1 text-[15px] text-cream/75 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer id="site-footer" data-dark className="grain relative mt-24 overflow-hidden rounded-t-[40px] bg-maroon text-cream sm:mt-32 sm:rounded-t-[56px]">
      <div className="container-x pt-12 sm:pt-16">
        <section aria-labelledby="footer-promo" className="relative overflow-hidden rounded-[32px] bg-brand p-7 sm:rounded-[40px] sm:p-12">
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Flash Drop · up to 25% off</p>
              <h2 id="footer-promo" className="display mt-3 text-[clamp(2.4rem,6vw,4.75rem)] text-white">
                Step Into
                <br />
                Your Best Style
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="text-[15px] text-white/85">Fresh Air Jordan, Air Force 1 and SB Dunk pairs, curated in one place. Find the one that matches your mood.</p>
              <Link href="/shop" className="pill mt-5 bg-cream text-maroon hover:bg-white">
                Shop all sneakers <ArrowIcon width={18} height={18} />
              </Link>
            </div>
          </div>
          <span aria-hidden className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-coral/40 blur-3xl" />
        </section>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-bold uppercase tracking-[0.1em]">Dripyard</p>
            <p className="mt-3 max-w-[30ch] text-sm text-cream/60">Premium Nike sneakers, art-directed for every mood, outfit and move.</p>
          </div>
          <nav aria-label="Footer navigation">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-coral">Navigate</h3>
            <ul>
              <li><Link className={linkCls} href="/">Home</Link></li>
              <li><Link className={linkCls} href="/about">About</Link></li>
              <li><Link className={linkCls} href="/shop?flash=1">Drops</Link></li>
              <li><Link className={linkCls} href="/shop?new=1">Fresh In</Link></li>
            </ul>
          </nav>
          <nav aria-label="Shop categories">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-coral">Shop</h3>
            <ul>
              <li><Link className={linkCls} href="/shop">All sneakers</Link></li>
              <li><Link className={linkCls} href="/shop?category=Basketball">Basketball</Link></li>
              <li><Link className={linkCls} href="/shop?category=Running">Running</Link></li>
              <li><Link className={linkCls} href="/shop?category=Lifestyle">Lifestyle</Link></li>
            </ul>
          </nav>
          <nav aria-label="Your account">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-coral">Yours</h3>
            <ul>
              <li><Link className={linkCls} href="/wishlist">Wishlist</Link></li>
              <li><OpenCartButton className={linkCls}>My Drip Bag</OpenCartButton></li>
              <li><Link className={linkCls} href="/checkout">Checkout</Link></li>
              <li><Link className={linkCls} href="/account">Account</Link></li>
            </ul>
          </nav>
        </div>

        <p className="rounded-2xl border border-white/10 px-5 py-4 text-sm text-cream/80">
          <strong className="font-semibold text-white">DRIPYARD is an independent retailer and is not affiliated with Nike, Inc.</strong>{" "}
          Nike, Air Jordan, Air Force 1 and SB Dunk are trademarks of their respective owners and are used here only to identify products.
        </p>

        <div className="flex flex-col items-start justify-between gap-3 py-6 text-sm text-cream/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} DRIPYARD. Sample storefront.</p>
          <ul className="flex gap-5">
            <li><Link className="rounded hover:text-white" href="/terms">Terms</Link></li>
            <li><Link className="rounded hover:text-white" href="/privacy">Privacy</Link></li>
          </ul>
        </div>
      </div>

      <div aria-hidden className="select-none overflow-hidden">
        <p className="display bg-gradient-to-b from-coral via-brand to-maroon bg-clip-text text-center text-[clamp(4rem,21.5vw,22rem)] leading-[0.82] tracking-[-0.02em] text-transparent">
          Dripyard
        </p>
      </div>
    </footer>
  );
}
