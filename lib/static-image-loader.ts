import variants from "@/data/image-variants.json";

const table = variants as Record<string, number[]>;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Loader for the static (GitHub Pages) build, where there is no image optimizer. Product photos are
 * pre-built at several widths (see scripts/build-images.mjs); this picks the smallest one that is
 * at least as wide as the requested size, or the native file when the request is larger. Nothing is
 * ever upscaled. Every other asset (hero, campaign) is served as-is.
 */
export default function staticImageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const m = src.match(/^\/images\/shoes\/(shoe-\d+)\.webp$/);
  if (m) {
    const widths = table[m[1]];
    if (widths) {
      const target = widths.find((w) => w >= width) ?? widths[widths.length - 1];
      const native = widths[widths.length - 1];
      return `${BASE}/images/shoes/${m[1]}${target === native ? "" : `-${target}`}.webp`;
    }
  }
  return `${BASE}${src}`;
}
