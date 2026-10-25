"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartSummary } from "@/components/cart/useCartSummary";
import { startCheckout, type CheckoutFailure } from "@/lib/checkout-client";
import { getProduct, imageMeta } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD_CENTS, formatCents, formatPrice } from "@/lib/pricing";

const STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

export default function CheckoutView() {
  const { ready, lines, count, subtotalCents, shippingCents, remainingForFreeCents } = useCartSummary();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<CheckoutFailure | null>(null);

  if (!ready) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]" aria-busy="true" aria-label="Loading your bag">
        <div className="skeleton h-72 rounded-[28px]" />
        <div className="skeleton h-72 rounded-[28px]" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="grid place-items-center rounded-[32px] bg-white/60 px-6 py-20 text-center shadow-card ring-1 ring-maroon/5">
        <p className="display text-3xl sm:text-4xl">Your bag is empty</p>
        <p className="mt-3 max-w-sm text-sm text-maroon/65">Add a pair before checking out.</p>
        <Link href="/shop" className="pill-solid mt-6">
          Shop all sneakers
        </Link>
      </div>
    );
  }

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || lines.length === 0) return;
    setBusy(true);
    setFailure(null);
    const result = await startCheckout(
      lines.map((l) => ({ productId: l.productId, size: l.size, color: l.color, quantity: l.quantity })),
      email,
    );
    if ("url" in result) {
      window.location.assign(result.url);
      return; // keep the button busy while the browser navigates away
    }
    setFailure(result);
    setBusy(false);
  };

  return (
    <form onSubmit={pay} className="grid items-start gap-8 lg:grid-cols-[1fr_420px] lg:gap-14" noValidate>
      <section aria-labelledby="bag-title" className="rounded-[28px] bg-white/60 p-5 shadow-card ring-1 ring-maroon/5 sm:p-8">
        <h2 id="bag-title" className="display text-3xl">
          Your bag <span className="font-sans text-sm normal-case tracking-normal text-maroon/55">({count})</span>
        </h2>
        <ul className="mt-4 divide-y divide-maroon/10">
          {lines.map((l) => {
            const p = getProduct(l.productId)!;
            return (
              <li key={l.key} className="flex gap-4 py-4">
                <Link href={`/product/${p.id}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-white">
                  <Image src={p.image} alt={`${p.name} ${p.colorway}`} fill sizes="80px" className={imageMeta(p)?.studio ? "object-contain" : "object-cover"} />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-maroon/60">{p.colorway}</p>
                  <p className="mt-1 text-xs text-maroon/70">
                    {l.color} · US {l.size} · Qty {l.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatCents(l.lineCents)}</p>
              </li>
            );
          })}
        </ul>
        <Link href="/shop" className="mt-2 inline-block text-sm font-medium underline-offset-4 hover:underline">
          Continue shopping
        </Link>
      </section>

      <aside aria-labelledby="summary-title" className="rounded-[28px] bg-white p-5 shadow-card sm:p-8 lg:sticky lg:top-28">
        <h2 id="summary-title" className="display text-3xl">
          Summary
        </h2>
        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="font-semibold">{formatCents(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{shippingCents === 0 ? "Free" : formatCents(shippingCents)}</dd>
          </div>
          <div className="flex justify-between border-t border-maroon/10 pt-3 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="font-semibold">{formatCents(subtotalCents + shippingCents)}</dd>
          </div>
        </dl>
        {remainingForFreeCents > 0 ? (
          <p className="mt-3 text-xs text-maroon/60">
            Add {formatCents(remainingForFreeCents)} more for free shipping (orders over {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)}).
          </p>
        ) : (
          <p className="mt-3 text-xs text-brand">Free shipping applied.</p>
        )}
        <p className="mt-1 text-xs text-maroon/50">Taxes are not calculated in this sample store. The final amount is confirmed on the secure payment page.</p>

        <label className="mt-6 block text-sm font-medium" htmlFor="checkout-email">
          Email for your receipt <span className="font-normal text-maroon/50">(optional)</span>
        </label>
        <input
          id="checkout-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 h-12 w-full rounded-full border border-maroon/15 bg-white px-5 text-[15px] outline-none placeholder:text-maroon/35 focus:border-brand"
        />

        {failure && (
          <div role="alert" className="mt-5 rounded-2xl border border-brand/30 bg-brand/5 p-4 text-sm">
            <p className="font-semibold text-brand">{failure.message}</p>
            {failure.details.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-maroon/80">
                {failure.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {STATIC_DEMO && (
          <p role="note" className="mt-5 rounded-2xl border border-maroon/15 bg-cream p-4 text-sm">
            This is a static preview: payments run only on the full server build, so checkout is disabled here.
          </p>
        )}

        <button type="submit" disabled={busy || STATIC_DEMO} className="pill-solid mt-6 w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? "Redirecting to secure payment…" : `Pay ${formatCents(subtotalCents + shippingCents)}`}
        </button>
        <p className="mt-3 text-center text-xs text-maroon/50">Stripe test mode: no real charges. Use card 4242 4242 4242 4242 with any future date and CVC.</p>
      </aside>
    </form>
  );
}
