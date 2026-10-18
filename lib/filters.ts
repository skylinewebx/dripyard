import type { Category, Product } from "@/types";
import { unitPriceCents } from "./pricing";
import { CATEGORIES, priceBounds, sizeStock } from "./products";

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export interface ShopFilters {
  q: string;
  categories: Category[];
  sizes: number[];
  colors: string[];
  min: number;
  max: number;
  sort: SortKey;
  onlyNew: boolean;
  onlyFlash: boolean;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export const DEFAULT_FILTERS: ShopFilters = {
  q: "",
  categories: [],
  sizes: [],
  colors: [],
  min: priceBounds.min,
  max: priceBounds.max,
  sort: "featured",
  onlyNew: false,
  onlyFlash: false,
};

type Params = { get(name: string): string | null };

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export function parseFilters(params: Params): ShopFilters {
  const num = (v: string | null, fallback: number) => {
    const n = Number(v);
    return v !== null && v !== "" && Number.isFinite(n) ? n : fallback;
  };
  const sort = params.get("sort") as SortKey | null;
  const min = Math.max(priceBounds.min, num(params.get("min"), priceBounds.min));
  const max = Math.min(priceBounds.max, num(params.get("max"), priceBounds.max));
  return {
    q: params.get("q") ?? "",
    categories: list(params.get("category")).filter((c): c is Category =>
      (CATEGORIES as string[]).includes(c),
    ),
    sizes: list(params.get("size")).map(Number).filter((n) => n >= 6 && n <= 13),
    colors: list(params.get("color")),
    min: Math.min(min, max),
    max: Math.max(min, max),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : "featured",
    onlyNew: params.get("new") === "1",
    onlyFlash: params.get("flash") === "1",
  };
}

export function serializeFilters(f: ShopFilters): string {
  const sp = new URLSearchParams();
  if (f.q.trim()) sp.set("q", f.q.trim());
  if (f.categories.length) sp.set("category", f.categories.join(","));
  if (f.sizes.length) sp.set("size", f.sizes.join(","));
  if (f.colors.length) sp.set("color", f.colors.join(","));
  if (f.min > priceBounds.min) sp.set("min", String(f.min));
  if (f.max < priceBounds.max) sp.set("max", String(f.max));
  if (f.sort !== "featured") sp.set("sort", f.sort);
  if (f.onlyNew) sp.set("new", "1");
  if (f.onlyFlash) sp.set("flash", "1");
  return sp.toString();
}

export function countActive(f: ShopFilters): number {
  return (
    (f.q.trim() ? 1 : 0) +
    f.categories.length +
    f.sizes.length +
    f.colors.length +
    (f.min > priceBounds.min || f.max < priceBounds.max ? 1 : 0) +
    (f.onlyNew ? 1 : 0) +
    (f.onlyFlash ? 1 : 0)
  );
}

export function applyFilters(all: Product[], f: ShopFilters): Product[] {
  const q = f.q.trim().toLowerCase();
  const out = all.filter((p) => {
    if (q && !`${p.name} ${p.colorway} ${p.category}`.toLowerCase().includes(q)) return false;
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.onlyNew && !p.isNew) return false;
    if (f.onlyFlash && !p.flashDropDiscount) return false;
    if (f.sizes.length && !f.sizes.some((s) => sizeStock(p, s) > 0)) return false;
    if (f.colors.length && !p.colors.some((c) => c.families.some((fam) => f.colors.includes(fam))))
      return false;
    const price = unitPriceCents(p) / 100;
    return price >= f.min && price <= f.max;
  });

  const order = new Map(all.map((p, i) => [p.id, i]));
  const sorted = [...out];
  switch (f.sort) {
    case "price-asc":
      sorted.sort((a, b) => unitPriceCents(a) - unitPriceCents(b));
      break;
    case "price-desc":
      sorted.sort((a, b) => unitPriceCents(b) - unitPriceCents(a));
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case "newest":
      sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew) || order.get(a.id)! - order.get(b.id)!);
      break;
    default:
      break;
  }
  return sorted;
}
