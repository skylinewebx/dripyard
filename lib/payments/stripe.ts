import "server-only";
import Stripe from "stripe";
import type { PaymentSessionInfo, PaymentStatus } from "@/types";
import type { CreateCheckoutInput, PaidOrderEvent, PaymentProvider } from "./types";

const KEY_PATTERN = /^sk_(test|live)_[A-Za-z0-9]+$/;

function secretKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return key && KEY_PATTERN.test(key) ? key : null;
}

function client(): Stripe {
  const key = secretKey();
  if (!key) throw new Error("Stripe is not configured: set STRIPE_SECRET_KEY in .env.local.");
  return new Stripe(key, { maxNetworkRetries: 2 });
}

const mapStatus = (s: string | null | undefined): PaymentStatus =>
  s === "paid" || s === "unpaid" || s === "no_payment_required" ? s : "unknown";

export const stripeProvider: PaymentProvider = {
  id: "stripe",

  isConfigured: () => secretKey() !== null,

  async createCheckout(input: CreateCheckoutInput) {
    const stripe = client();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: input.lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: "usd",
          unit_amount: l.unitAmountCents,
          product_data: {
            name: `${l.name} (US ${l.size})`,
            description: l.color,
            images: l.imageUrl ? [l.imageUrl] : undefined,
            // Read back in the webhook to reconcile stock.
            metadata: { productId: l.productId, size: String(l.size), color: l.color },
          },
        },
      })),
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: input.shippingCents, currency: "usd" },
            display_name: input.shippingCents === 0 ? "Free standard shipping" : "Standard shipping",
          },
        },
      ],
      customer_email: input.email,
      success_url: `${input.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: input.cancelUrl,
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return { url: session.url, sessionId: session.id };
  },

  async retrieveSession(sessionId: string): Promise<PaymentSessionInfo> {
    const s = await client().checkout.sessions.retrieve(sessionId);
    return {
      id: s.id,
      status: mapStatus(s.payment_status),
      amountTotal: s.amount_total,
      currency: s.currency,
      email: s.customer_details?.email ?? s.customer_email ?? null,
    };
  },

  async parseWebhook(rawBody: string, signature: string | null): Promise<PaidOrderEvent | null> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
    if (!secret || secret.includes("replace_me")) {
      throw new Error("Stripe webhook secret is not configured.");
    }
    if (!signature) throw new Error("Missing stripe-signature header.");
    const stripe = client();
    // Throws if the signature does not match: never trust the body without this.
    const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

    if (
      event.type !== "checkout.session.completed" &&
      event.type !== "checkout.session.async_payment_succeeded"
    ) {
      return null;
    }
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") return null;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ["data.price.product"],
    });
    const items = lineItems.data.flatMap((li) => {
      const product = li.price?.product;
      const md = product && typeof product !== "string" && !("deleted" in product) ? product.metadata : null;
      if (!md?.productId || !li.quantity) return [];
      return [{ productId: md.productId, size: Number(md.size), color: md.color ?? "", quantity: li.quantity }];
    });

    return {
      sessionId: session.id,
      email: session.customer_details?.email ?? null,
      amountTotalCents: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      items,
    };
  },
};
