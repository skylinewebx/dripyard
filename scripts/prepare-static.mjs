// Prepares the source tree for the static GitHub Pages export (run in CI only).
// Static hosting cannot run route handlers or per-request pages, so those are removed/stubbed.
import fs from "node:fs";

fs.rmSync("app/api", { recursive: true, force: true });
fs.writeFileSync(
  "app/success/page.tsx",
  `import Link from "next/link";

export const metadata = { title: "Order status" };

export default function SuccessPage() {
  return (
    <div className="container-x grid min-h-[80svh] place-items-center pb-12 pt-32 text-center">
      <div className="max-w-xl">
        <p className="eyebrow">Static preview</p>
        <h1 className="display mt-4 text-[clamp(3rem,10vw,7rem)]">No orders here</h1>
        <p className="mt-4 text-[15px] text-maroon/75">Payments are disabled in this static preview, so there is no order to confirm.</p>
        <Link href="/shop" className="pill-solid mt-8">Keep shopping</Link>
      </div>
    </div>
  );
}
`,
);
console.log("static prep done");
