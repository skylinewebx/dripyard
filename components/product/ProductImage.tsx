import Image from "next/image";
import type { Product } from "@/types";
import { imageMeta } from "@/lib/products";

/**
 * The only way product photography is rendered: next/image in a stable, fill-sized container
 * with the generated blur-up placeholder. Parent controls aspect ratio and clipping.
 */
export default function ProductImage({
  product,
  sizes,
  priority = false,
  className = "",
  position = "center",
  alt,
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
  position?: string;
  alt?: string;
}) {
  const meta = imageMeta(product);
  return (
    <Image
      src={product.image}
      alt={alt ?? `${product.name} ${product.colorway}`}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={meta ? "blur" : "empty"}
      blurDataURL={meta?.blurDataURL}
      quality={85}
      className={`object-cover ${className}`}
      style={{ objectPosition: position }}
    />
  );
}
