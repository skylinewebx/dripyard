"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useUiStore } from "@/store/ui";
import { useCartStore } from "@/store/cart";
import { useDialog } from "@/hooks/use-dialog";
import { getProduct, imageMeta } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD_CENTS, formatCents, formatPrice } from "@/lib/pricing";
import { useCartSummary } from "./useCartSummary";
import QuantityStepper from "@/components/product/QuantityStepper";
import { CloseIcon } from "@/components/ui/icons";

function Panel() {
  const ref = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  const { setQuantity, remove } = useCartStore();
  const { lines, count, subtotalCents, shippingCents, remainingForFreeCents } = useCartSummary();
  const close = () => setCartOpen(false);
  useDialog(ref, close, closeRef);

  const progress = Math.min(1, subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS);
  const unlocked = remainingForFreeCents === 0 && subtotalCents > 0;

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-0 z-50 bg-maroon/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={close}
      />
      <motion.aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="fixed inset-y-0 right-0 z-[51] flex w-full max-w-[440px] flex-col bg-cream shadow-lift"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 38, mass: 0.9 }}
      >
        <div className="flex items-center justify-between border-b border-maroon/10 px-5 py-4 sm:px-6">
          <h2 id="cart-title" className="display text-2xl">
            My Drip Bag <span className="font-sans text-sm font-medium normal-case tracking-normal text-maroon/55">({count})</span>
          </h2>
          <button ref={closeRef} type="button" onClick={close} aria-label="Close bag" className="grid h-10 w-10 place-items-center rounded-full hover:bg-maroon/8">
            <CloseIcon />
          </button>
        </div>

        <div className="border-b border-maroon/10 px-5 py-4 sm:px-6">
          <p className="text-sm" aria-live="polite">
            {subtotalCents === 0 ? (
              <>Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)}.</>
            ) : unlocked ? (
              <span className="font-medium text-brand">You&rsquo;ve unlocked free shipping.</span>
            ) : (
              <>
                You&rsquo;re <strong>{formatCents(remainingForFreeCents)}</strong> away from free shipping.
              </>
            )}
          </p>
          <div
            role="progressbar"
            aria-label="Progress to free shipping"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            className="mt-2.5 h-2 overflow-hidden rounded-full bg-maroon/10"
          >
            <motion.div
              className="h-full origin-left rounded-full bg-brand"
              initial={false}
              animate={{ scaleX: progress }}
              transition={{ type: "spring", stiffness: 160, damping: 24 }}
            />
          </div>
        </div>

        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-5 py-2 sm:px-6">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
              <p className="display text-3xl">Your bag is empty</p>
              <p className="max-w-[28ch] text-sm text-maroon/65">Find your next pair and it&rsquo;ll wait for you here.</p>
              <Link href="/shop" onClick={close} className="pill-solid">
                Shop all sneakers
              </Link>
            </div>
          ) : (
            <ul>
              <AnimatePresence initial={false}>
                {lines.map((l) => {
                  const p = getProduct(l.productId)!;
                  return (
                    <motion.li
                      key={l.key}
                      layout="position"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                      className="flex gap-4 border-b border-maroon/10 py-4 last:border-b-0"
                    >
                      <Link href={`/product/${p.id}`} onClick={close} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-white">
                        <Image src={p.image} alt={`${p.name} ${p.colorway}`} fill sizes="96px" className={imageMeta(p)?.studio ? "object-contain" : "object-cover"} />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link href={`/product/${p.id}`} onClick={close} className="text-sm font-semibold leading-snug hover:text-brand">
                          {p.name}
                        </Link>
                        <p className="text-xs text-maroon/60">{p.colorway}</p>
                        <p className="mt-1 text-xs text-maroon/70">
                          {l.color} · US {l.size}
                        </p>
                        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                          <QuantityStepper
                            compact
                            value={l.quantity}
                            max={Math.min(10, p.stock[String(l.size)] ?? 0)}
                            onChange={(q) => setQuantity(l.key, q)}
                            label={`${p.name} US ${l.size}`}
                          />
                          <div className="text-right">
                            <p className="text-sm font-semibold">{formatCents(l.lineCents)}</p>
                            {l.quantity > 1 && <p className="text-[11px] text-maroon/55">{formatCents(l.unitCents)} each</p>}
                          </div>
                        </div>
                        <button type="button" onClick={() => remove(l.key)} className="mt-2 self-start text-xs font-medium text-maroon/60 underline-offset-4 hover:text-brand hover:underline">
                          Remove<span className="sr-only"> {p.name}, US {l.size}</span>
                        </button>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-maroon/10 bg-white px-5 py-5 sm:px-6">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-semibold">{formatCents(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between text-maroon/65">
                <dt>Shipping</dt>
                <dd>{shippingCents === 0 ? "Free" : formatCents(shippingCents)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[11px] text-maroon/50">Taxes are not calculated in this sample store.</p>
            <Link href="/checkout" onClick={close} className="pill-solid mt-4 w-full py-3.5 text-base">
              Checkout · {formatCents(subtotalCents + shippingCents)}
            </Link>
            <button type="button" onClick={close} className="pill-ghost mt-2.5 w-full">
              Continue shopping
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}

export default function CartDrawer() {
  const open = useUiStore((s) => s.cartOpen);
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  const pathname = usePathname();
  useEffect(() => {
    setCartOpen(false);
  }, [pathname, setCartOpen]);
  return <AnimatePresence>{open && <Panel key="cart" />}</AnimatePresence>;
}
