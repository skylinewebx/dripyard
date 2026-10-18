import type { Metadata } from "next";
import Link from "next/link";
import { getPaymentProvider } from "@/lib/payments";
import ClearCartOnPaid from "@/components/checkout/ClearCartOnPaid";
import { formatCents } from "@/lib/pricing";
import type { PaymentSessionInfo } from "@/types";

export const metadata: Metadata = { title: "Order status" };
export const dynamic = "force-dynamic";

type State =
  | { kind: "missing" }
  | { kind: "unverified"; reason: string }
  | { kind: "result"; session: PaymentSessionInfo };

async function verify(sessionId: string | undefined): Promise<State> {
  if (!sessionId) return { kind: "missing" };
  const provider = getPaymentProvider();
  if (!provider.isConfigured()) return { kind: "unverified", reason: "Payments are not configured on this server." };
  try {
    return { kind: "result", session: await provider.retrieveSession(sessionId) };
  } catch {
    return { kind: "unverified", reason: "We couldn't look up that payment session." };
  }
}

/**
 * Visiting this URL proves nothing by itself: the status shown here comes from asking the payment
 * provider (server-side) about the session id. Fulfilment and stock changes happen in the webhook.
 */
export default async function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const state = await verify(searchParams.session_id);
  const paid = state.kind === "result" && (state.session.status === "paid" || state.session.status === "no_payment_required");

  return (
    <div className="container-x grid min-h-[80svh] place-items-center pb-12 pt-32 text-center">
      <div className="max-w-xl">
        {paid && state.kind === "result" ? (
          <>
            <ClearCartOnPaid />
            <p className="eyebrow">Payment confirmed</p>
            <h1 className="display mt-4 text-[clamp(3rem,10vw,7rem)]">You&rsquo;re in</h1>
            <p className="mt-4 text-[15px] text-maroon/75">
              Thanks for your order{state.session.amountTotal != null ? ` of ${formatCents(state.session.amountTotal)}` : ""}.
              {state.session.email ? ` A receipt is on its way to ${state.session.email}.` : ""} Test-mode payment: nothing was charged or shipped.
            </p>
          </>
        ) : state.kind === "result" ? (
          <>
            <p className="eyebrow">Payment not completed</p>
            <h1 className="display mt-4 text-[clamp(3rem,10vw,7rem)]">Not paid yet</h1>
            <p className="mt-4 text-[15px] text-maroon/75">The payment provider reports this session as unpaid, so your bag has been kept. You can try again below.</p>
          </>
        ) : state.kind === "unverified" ? (
          <>
            <p className="eyebrow">Couldn&rsquo;t verify</p>
            <h1 className="display mt-4 text-[clamp(3rem,10vw,7rem)]">Status unknown</h1>
            <p className="mt-4 text-[15px] text-maroon/75">{state.reason} We won&rsquo;t mark this order as paid without confirmation. Your bag has been kept.</p>
          </>
        ) : (
          <>
            <p className="eyebrow">No order</p>
            <h1 className="display mt-4 text-[clamp(3rem,10vw,7rem)]">Nothing here</h1>
            <p className="mt-4 text-[15px] text-maroon/75">This page needs a payment session to show an order status.</p>
          </>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="pill-solid">
            Keep shopping
          </Link>
          {!paid && (
            <Link href="/checkout" className="pill-ghost">
              Back to checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
