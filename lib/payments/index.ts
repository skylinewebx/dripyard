import "server-only";
import { stripeProvider } from "./stripe";
import type { PaymentProvider } from "./types";

/**
 * The only place that knows which provider is active.
 * To add Razorpay: implement PaymentProvider in ./razorpay.ts and register it here.
 */
const providers: Record<string, PaymentProvider> = {
  stripe: stripeProvider,
};

export function getPaymentProvider(): PaymentProvider {
  const id = (process.env.PAYMENT_PROVIDER ?? "stripe").toLowerCase();
  const provider = providers[id];
  if (!provider) throw new Error(`Unknown PAYMENT_PROVIDER "${id}". Available: ${Object.keys(providers).join(", ")}`);
  return provider;
}

export type { PaymentProvider, PaidOrderEvent } from "./types";
