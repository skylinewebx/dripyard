import raw from "@/data/products.json";
import meta from "@/data/image-meta.json";
import type { Category, Product } from "@/types";
import { unitPriceCents } from "./pricing";

/** Single source of truth: data/products.json. */
export const products = raw as unknown as Product[];

export const CATEGORIES: Category[] = ["Lifestyle", "Running", "Basketball"];
export const SIZES = [6, 7, 8, 9, 10, 11, 12, 13] as const;

const byId = new Map(products.map((p) => [p.id, p]));

export const getProduct = (id: string): Product | undefined => byId.get(id);
export const getProducts = (ids: string[]) =>
  ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));

type ImageMeta = Record<string, { width: number; height: number; studio?: boolean }>;

export function imageMeta(p: Pick<Product, "image">) {
  const key = p.image.split("/").pop()!.replace(/\.\w+$/, "");
  return (meta as ImageMeta)[key];
}

export const totalStock = (p: Product) =>
  Object.values(p.stock).reduce((sum, n) => sum + n, 0);

export const sizeStock = (p: Product, size: number) => p.stock[String(size)] ?? 0;
export const isSoldOut = (p: Product) => totalStock(p) === 0;

export const colorFamilies = Array.from(
  new Set(products.flatMap((p) => p.colors.flatMap((c) => c.families))),
).sort();

export const priceBounds = (() => {
  const prices = products.map((p) => unitPriceCents(p) / 100);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
})();

export function relatedProducts(p: Product, count = 4): Product[] {
  const same = products.filter((x) => x.id !== p.id && x.category === p.category);
  const others = products.filter((x) => x.id !== p.id && x.category !== p.category);
  return [...same, ...others].slice(0, count);
}

export const newArrivals = () => products.filter((p) => p.isNew);

/** Convenience lookups for editorial sections (ids reference the catalog). */
export const FEATURED_IDS = [
  "aj1-high-og-university-blue",
  "aj1-high-og-lucky-green",
  "af1-low-white-university-red",
  "aj1-mid-navy-mint",
];
export const SPOTLIGHT_ID = "aj1-mid-blush-burgundy";
export const BANNER_ID = "aj1-mid-burgundy-velvet";
export const DROP_GALLERY_IDS = [
  "aj1-high-og-royal-reimagined",
  "sb-dunk-low-london",
  "aj1-low-og-chicago",
  "af1-low-cream-green-gum",
];

export const variantKey = (productId: string, size: number, color: string) =>
  `${productId}|${size}|${color}`;
