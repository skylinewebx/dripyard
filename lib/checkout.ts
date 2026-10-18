import "server-only";
import { getProduct, sizeStock } from "./products";
import { MAX_PER_LINE, shippingCents, unitPriceCents } from "./pricing";
import { soldUnits } from "./orders";
import type { CheckoutItem } from "@/types";
import type { PricedCheckoutLine } from "./payments/types";

export type ValidationResult =
  | { ok: true; lines: PricedCheckoutLine[]; subtotalCents: number; shippingCents: number; totalCents: number }
  | { ok: false; errors: string[] };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

/**
 * Validates the cart against trusted catalog data and recomputes every price server-side.
 * Client-submitted prices are never read: the request type has no price field.
 */
export async function validateCheckout(input: unknown, siteOrigin?: string): Promise<ValidationResult> {
  const errors: string[] = [];
  if (!Array.isArray(input) || input.length === 0) {
    return { ok: false, errors: ["Your bag is empty."] };
  }
  if (input.length > 50) return { ok: false, errors: ["Too many items in one order."] };

  // Merge duplicate variants so stock is checked against the combined quantity.
  const merged = new Map<string, CheckoutItem>();
  for (const raw of input) {
    if (!isObj(raw)) {
      errors.push("Malformed cart item.");
      continue;
    }
    const { productId, size, color, quantity } = raw as Record<string, unknown>;
    if (typeof productId !== "string" || typeof color !== "string" || !Number.isInteger(size) || !Number.isInteger(quantity)) {
      errors.push("Malformed cart item.");
      continue;
    }
    const key = `${productId}|${size}|${color}`;
    const prev = merged.get(key);
    merged.set(key, {
      productId,
      color,
      size: size as number,
      quantity: (prev?.quantity ?? 0) + (quantity as number),
    });
  }

  const sold = await soldUnits();
  const lines: PricedCheckoutLine[] = [];
  const perSize = new Map<string, number>();

  for (const item of merged.values()) {
    const product = getProduct(item.productId);
    if (!product) {
      errors.push(`Unknown product "${item.productId}".`);
      continue;
    }
    const label = `${product.name} ${product.colorway}`;
    if (!product.sizes.includes(item.size)) {
      errors.push(`${label}: size US ${item.size} is not offered.`);
      continue;
    }
    if (!product.colors.some((c) => c.name === item.color)) {
      errors.push(`${label}: colour "${item.color}" is not available.`);
      continue;
    }
    if (item.quantity < 1 || item.quantity > MAX_PER_LINE) {
      errors.push(`${label}: quantity must be between 1 and ${MAX_PER_LINE}.`);
      continue;
    }
    const sizeKey = `${product.id}|${item.size}`;
    const wanted = (perSize.get(sizeKey) ?? 0) + item.quantity;
    perSize.set(sizeKey, wanted);
    const available = sizeStock(product, item.size) - (sold.get(sizeKey) ?? 0);
    if (available <= 0) {
      errors.push(`${label} (US ${item.size}) is sold out.`);
      continue;
    }
    if (wanted > available) {
      errors.push(`${label} (US ${item.size}): only ${available} left.`);
      continue;
    }
    lines.push({
      productId: product.id,
      name: `${product.name} ${product.colorway}`,
      description: product.description,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitAmountCents: unitPriceCents(product),
      // Stripe fetches images itself, so only pass absolute https URLs (not localhost).
      imageUrl: siteOrigin?.startsWith("https://") ? `${siteOrigin}${product.image}` : undefined,
    });
  }

  if (errors.length) return { ok: false, errors };
  const subtotalCents = lines.reduce((sum, l) => sum + l.unitAmountCents * l.quantity, 0);
  const ship = shippingCents(subtotalCents);
  return { ok: true, lines, subtotalCents, shippingCents: ship, totalCents: subtotalCents + ship };
}
