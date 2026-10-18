import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <p className="eyebrow">Your account</p>
      <h1 className="display mt-3 text-[clamp(3rem,8vw,6rem)]">Guest mode</h1>
      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-maroon/75">
        This store doesn&rsquo;t use accounts yet. Your bag and wishlist are saved on this device, and checkout is a guest checkout handled by Stripe.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/wishlist" className="pill-solid">
          View wishlist
        </Link>
        <Link href="/checkout" className="pill-ghost">
          Go to checkout
        </Link>
      </div>
    </div>
  );
}
