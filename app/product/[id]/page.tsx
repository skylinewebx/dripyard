import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, isSoldOut, products, relatedProducts, totalStock } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD_CENTS, formatPrice } from "@/lib/pricing";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import ProductCard from "@/components/product/ProductCard";
import Price from "@/components/ui/Price";
import Stars from "@/components/ui/Stars";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = getProduct(params.id);
  if (!p) return { title: "Product not found" };
  return {
    title: `${p.name} ${p.colorway}`,
    description: p.description,
    openGraph: { images: [{ url: p.image }] },
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const p = getProduct(params.id);
  if (!p) notFound();

  const soldOut = isSoldOut(p);
  const related = relatedProducts(p, 4);
  const lowStock = !soldOut && totalStock(p) <= 12;

  return (
    <div className="container-x pb-8 pt-28 sm:pt-36">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: p.category, href: `/shop?category=${p.category}` },
          { label: `${p.name} ${p.colorway}` },
        ]}
      />

      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <ProductGallery product={p} priority />

        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider shadow-card">{p.category}</span>
              {p.isNew && <span className="rounded-full bg-maroon px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">New</span>}
              {p.flashDropDiscount > 0 && (
                <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Flash Drop −{p.flashDropDiscount}%</span>
              )}
              {soldOut && <span className="rounded-full bg-maroon/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">Sold out</span>}
              {lowStock && <span className="rounded-full bg-coral/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">Low stock</span>}
            </div>
            <h1 className="display mt-4 text-[clamp(2.4rem,5vw,4.25rem)]">{p.name}</h1>
            <p className="mt-1 text-lg text-maroon/65">{p.colorway}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Price product={p} size="lg" />
            <div className="flex items-center gap-2 text-sm text-maroon/65">
              <Stars rating={p.rating} />
              <span>
                {p.rating.toFixed(1)} · {p.reviewCount.toLocaleString("en-US")} sample ratings
              </span>
            </div>
          </div>
          {p.flashDropDiscount > 0 && (
            <p className="-mt-3 text-sm text-brand">Flash Drop: {p.flashDropDiscount}% off the {formatPrice(p.price * 100)} list price.</p>
          )}

          <p className="max-w-[56ch] text-[15px] leading-relaxed text-maroon/75">{p.description}</p>

          <div className="h-px bg-maroon/10" />
          <ProductPurchase product={p} />

          <ul className="space-y-2 rounded-3xl bg-white/60 p-5 text-sm text-maroon/75 ring-1 ring-maroon/5">
            <li>Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)}; otherwise a flat $9.95.</li>
            <li>Brand: {p.brand}. DRIPYARD is an independent retailer, not affiliated with Nike, Inc.</li>
            <li className="text-maroon/55">Ratings shown are sample storefront data, not verified customer reviews.</li>
          </ul>

          {process.env.NODE_ENV !== "production" && (
            <p className="rounded-2xl border border-dashed border-brand/40 p-4 text-xs text-brand">
              <strong>Dev verification note:</strong> {p.verification}
            </p>
          )}
        </div>
      </div>

      <section aria-labelledby="related-title" className="mt-20 sm:mt-28">
        <h2 id="related-title" className="display text-[clamp(2rem,4.5vw,3.5rem)]">
          You may also like
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {related.map((r) => (
            <li key={r.id}>
              <ProductCard product={r} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
