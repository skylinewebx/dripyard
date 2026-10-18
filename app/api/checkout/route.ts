import { NextResponse, type NextRequest } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { validateCheckout } from "@/lib/checkout";
import type { CheckoutResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: CheckoutResponse, status: number) => NextResponse.json(body, { status });

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const { items, email } = (body ?? {}) as { items?: unknown; email?: unknown };

  const emailValue = typeof email === "string" && email.trim() ? email.trim() : undefined;
  if (emailValue && !EMAIL.test(emailValue)) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  const origin = (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, "");
  const result = await validateCheckout(items, origin);
  if (!result.ok) {
    return json({ error: "We couldn't verify your bag.", details: result.errors }, 422);
  }

  const provider = getPaymentProvider();
  if (!provider.isConfigured()) {
    return json(
      {
        error: "Checkout is not configured yet.",
        details: ["Add your Stripe test keys to .env.local (see README) and restart the server."],
      },
      503,
    );
  }

  try {
    const { url } = await provider.createCheckout({
      lines: result.lines,
      shippingCents: result.shippingCents,
      email: emailValue,
      successUrl: `${origin}/success`,
      cancelUrl: `${origin}/cancel`,
    });
    return json({ url }, 200);
  } catch (err) {
    console.error("[checkout] provider error:", err instanceof Error ? err.message : err);
    return json({ error: "The payment provider could not start checkout. Please try again." }, 502);
  }
}
