import type { CheckoutItem, CheckoutResponse } from "@/types";

export interface CheckoutFailure {
  message: string;
  details: string[];
}

/**
 * Browser-side call to our own checkout route. Provider-agnostic: the server returns a hosted
 * checkout URL and the UI simply redirects to it. Prices are never sent.
 */
export async function startCheckout(items: CheckoutItem[], email?: string): Promise<{ url: string } | CheckoutFailure> {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, email: email?.trim() || undefined }),
    });
    const data = (await res.json().catch(() => ({}))) as CheckoutResponse;
    if (res.ok && data.url) return { url: data.url };
    return { message: data.error ?? "Checkout failed. Please try again.", details: data.details ?? [] };
  } catch {
    return { message: "Network error. Check your connection and try again.", details: [] };
  }
}
