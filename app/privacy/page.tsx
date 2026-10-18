import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="container-x max-w-3xl pb-8 pt-32 sm:pt-40">
      <p className="eyebrow">Legal</p>
      <h1 className="display mt-3 text-[clamp(3rem,8vw,5.5rem)]">Privacy</h1>
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-maroon/80">
        <p>
          <strong>Sample storefront.</strong> Replace this page with your own privacy policy before collecting real customer data.
        </p>
        <p>Your bag and wishlist are stored only in your browser&rsquo;s local storage on this device. We don&rsquo;t run analytics or advertising trackers.</p>
        <p>At checkout, your email, shipping address and payment details are collected and processed by Stripe on its own hosted page. Card numbers never reach this site.</p>
      </div>
    </div>
  );
}
