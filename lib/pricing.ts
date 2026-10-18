import type { Product } from "@/types";

/**
 * Shipping policy (single source of truth for UI and server):
 * orders with a merchandise subtotal of $150.00 or more ship free;
 * everything else is charged a flat $9.95 (US standard).
 * Sample storefront: taxes are not calculated.
 */
export const FREE_SHIPPING_THRESHOLD_CENTS = 15000;
export const FLAT_SHIPPING_CENTS = 995;

/** Max units of one size/colour variant per order. */
export const MAX_PER_LINE = 10;

export const toCents = (usd: number) => Math.round(usd * 100);

/** Sale price in cents after Flash Drop discount (list price when no discount). */
export function unitPriceCents(p: Pick<Product, "price" | "flashDropDiscount">): number {
  const list = toCents(p.price);
  if (!p.flashDropDiscount) return list;
  return Math.round(list * (1 - p.flashDropDiscount / 100));
}

export function listPriceCents(p: Pick<Product, "price">): number {
  return toCents(p.price);
}

export function shippingCents(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
}

export function amountToFreeShipping(subtotalCents: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents);
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatCents = (cents: number) => usd.format(cents / 100);
export const formatPrice = (cents: number) => usdWhole.format(cents / 100);
