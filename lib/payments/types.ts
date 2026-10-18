import type { PaymentSessionInfo } from "@/types";

/** A line that has already been validated and priced from trusted server-side catalog data. */
export interface PricedCheckoutLine {
  productId: string;
  name: string;
  description: string;
  size: number;
  color: string;
  quantity: number;
  unitAmountCents: number;
  /** Absolute public image URL when available (some providers need it), else undefined. */
  imageUrl?: string;
}

export interface CreateCheckoutInput {
  lines: PricedCheckoutLine[];
  shippingCents: number;
  email?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PaidOrderEvent {
  sessionId: string;
  email: string | null;
  amountTotalCents: number;
  currency: string;
  items: { productId: string; size: number; color: string; quantity: number }[];
}

/**
 * Provider-agnostic contract. The checkout UI and API routes talk only to this interface,
 * so Stripe can be replaced (e.g. by Razorpay) by adding one file and switching PAYMENT_PROVIDER.
 */
export interface PaymentProvider {
  readonly id: string;
  isConfigured(): boolean;
  createCheckout(input: CreateCheckoutInput): Promise<{ url: string; sessionId: string }>;
  retrieveSession(sessionId: string): Promise<PaymentSessionInfo>;
  /** Verifies the webhook signature and returns a paid-order event, or null for ignorable events. */
  parseWebhook(rawBody: string, signature: string | null): Promise<PaidOrderEvent | null>;
}
