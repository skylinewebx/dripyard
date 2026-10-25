import Image from "next/image";
import type { Product } from "@/types";
import { imageMeta } from "@/lib/products";

/**
 * The only way product photography is rendered: next/image in a stable, fill-sized container.
 * No blur placeholder (the container's flat background shows until the photo arrives, so a
 * low-resolution preview can never linger). Parent controls aspect ratio and clipping.
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
  return (
    <Image
      src={product.image}
      alt={alt ?? `${product.name} ${product.colorway}`}
      fill
      sizes={sizes}
      priority={priority}
      quality={90}
      className={`${imageMeta(product)?.studio ? "bg-white object-contain" : "object-cover"} ${className}`}
      style={{ objectPosition: position }}
    />
  );
}
