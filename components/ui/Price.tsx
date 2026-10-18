import type { Product } from "@/types";
import { formatPrice, listPriceCents, unitPriceCents } from "@/lib/pricing";

/** Sale price + struck-through original when a Flash Drop discount applies. */
export default function Price({
  product,
  className = "",
  size = "md",
}: {
  product: Pick<Product, "price" | "flashDropDiscount">;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sale = unitPriceCents(product);
  const list = listPriceCents(product);
  const onSale = sale < list;
  const main = size === "lg" ? "text-3xl" : size === "sm" ? "text-sm" : "text-base";
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className={`${main} font-semibold ${onSale ? "text-brand" : ""}`}>
        <span className="sr-only">{onSale ? "Sale price " : "Price "}</span>
        {formatPrice(sale)}
      </span>
      {onSale && (
        <span className={`${size === "lg" ? "text-base" : "text-xs"} text-maroon/55 line-through`}>
          <span className="sr-only">Original price </span>
          {formatPrice(list)}
        </span>
      )}
    </p>
  );
}
