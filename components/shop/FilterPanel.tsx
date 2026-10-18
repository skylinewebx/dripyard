"use client";

import type { Category } from "@/types";
import type { ShopFilters } from "@/lib/filters";
import { CATEGORIES, SIZES, colorFamilies, products } from "@/lib/products";
import PriceRange from "./PriceRange";

const FAMILY_HEX: Record<string, string> = {
  Black: "#16110f",
  White: "#ffffff",
  Blue: "#2b4a9b",
  Green: "#1f9e5b",
  Red: "#b3202a",
  Pink: "#e8a0b0",
  Purple: "#9c9acb",
  Orange: "#ef6a1a",
  Yellow: "#f2c230",
  Brown: "#8a5326",
  Grey: "#8a8a8d",
  Cream: "#eadfc4",
};

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

const chip = (on: boolean) =>
  `rounded-full border px-4 py-2 text-sm transition-colors ${on ? "border-brand bg-brand text-white" : "border-maroon/15 bg-white hover:border-maroon"}`;

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-maroon/10 py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

export default function FilterPanel({
  filters,
  draft,
  onChange,
  onPrice,
}: {
  filters: ShopFilters;
  /** Live (pre-URL) price values */
  draft: { min: number; max: number };
  onChange: (patch: Partial<ShopFilters>) => void;
  onPrice: (min: number, max: number) => void;
}) {
  return (
    <div>
      <Group title="Category">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c: Category) => {
            const count = products.filter((p) => p.category === c).length;
            const on = filters.categories.includes(c);
            return (
              <button key={c} type="button" aria-pressed={on} onClick={() => onChange({ categories: toggle(filters.categories, c) })} className={chip(on)}>
                {c} <span className={on ? "text-white/70" : "text-maroon/45"}>({count})</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Size (US)">
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((s) => {
            const on = filters.sizes.includes(s);
            return (
              <button key={s} type="button" aria-pressed={on} onClick={() => onChange({ sizes: toggle(filters.sizes, s) })} className={`${chip(on)} px-0 text-center`}>
                {s}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Colour">
        <div className="flex flex-wrap gap-2">
          {colorFamilies.map((c) => {
            const on = filters.colors.includes(c);
            return (
              <button key={c} type="button" aria-pressed={on} onClick={() => onChange({ colors: toggle(filters.colors, c) })} className={`${chip(on)} flex items-center gap-2 py-1.5 pl-2`}>
                <span className="h-5 w-5 rounded-full ring-1 ring-maroon/20" style={{ backgroundColor: FAMILY_HEX[c] ?? "#ccc" }} />
                {c}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Price">
        <PriceRange min={draft.min} max={draft.max} onChange={onPrice} />
      </Group>

      <Group title="Collections">
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={filters.onlyNew} onClick={() => onChange({ onlyNew: !filters.onlyNew })} className={chip(filters.onlyNew)}>
            New arrivals
          </button>
          <button type="button" aria-pressed={filters.onlyFlash} onClick={() => onChange({ onlyFlash: !filters.onlyFlash })} className={chip(filters.onlyFlash)}>
            Flash Drop
          </button>
        </div>
      </Group>
    </div>
  );
}
