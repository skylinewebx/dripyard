import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="container-x max-w-3xl pb-8 pt-32 sm:pt-40">
      <p className="eyebrow">Legal</p>
      <h1 className="display mt-3 text-[clamp(3rem,8vw,5.5rem)]">Terms</h1>
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-maroon/80">
        <p>
          <strong>Sample storefront.</strong> This site demonstrates a sneaker shop. Replace this page with your own legal terms before taking real orders.
        </p>
        <p>DRIPYARD is an independent retailer and is not affiliated with Nike, Inc. Product names and marks belong to their respective owners and are used only to identify products.</p>
        <p>Prices are in US dollars. Orders over $150.00 ship free; other orders pay a flat $9.95. Taxes are not calculated in this sample.</p>
        <p>Payments are processed by Stripe. In test mode no real money moves and no goods are shipped.</p>
      </div>
    </div>
  );
}
