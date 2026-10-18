import type { Metadata } from "next";
import CheckoutView from "@/components/checkout/CheckoutView";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow">Almost yours</p>
        <h1 className="display mt-3 text-[clamp(3rem,8vw,6rem)]">Checkout</h1>
      </header>
      <CheckoutView />
    </div>
  );
}
