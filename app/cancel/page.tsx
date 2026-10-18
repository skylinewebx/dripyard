import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Checkout cancelled" };

export default function CancelPage() {
  return (
    <div className="container-x grid min-h-[80svh] place-items-center pb-12 pt-32 text-center">
      <div className="max-w-xl">
        <p className="eyebrow">Checkout cancelled</p>
        <h1 className="display mt-4 text-[clamp(3rem,10vw,7rem)]">No charge made</h1>
        <p className="mt-4 text-[15px] text-maroon/75">You left the payment page before paying. Your bag is exactly as you left it.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/checkout" className="pill-solid">
            Return to checkout
          </Link>
          <Link href="/shop" className="pill-ghost">
            Keep shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
