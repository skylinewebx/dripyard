import { NextResponse, type NextRequest } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { recordPaidOrder } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Payment webhook. The raw body is verified against the provider signature before anything is
 * trusted; only then is the paid order recorded (idempotently) and stock adjusted.
 */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("stripe-signature");
  const provider = getPaymentProvider();

  let order;
  try {
    order = await provider.parseWebhook(raw, signature);
  } catch (err) {
    console.error("[webhook] rejected:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid webhook." }, { status: 400 });
  }
  if (!order) return NextResponse.json({ received: true, ignored: true });

  try {
    const outcome = await recordPaidOrder(order);
    return NextResponse.json({ received: true, outcome });
  } catch (err) {
    console.error("[webhook] could not record order:", err instanceof Error ? err.message : err);
    // Non-2xx makes the provider retry delivery.
    return NextResponse.json({ error: "Could not record order." }, { status: 500 });
  }
}
