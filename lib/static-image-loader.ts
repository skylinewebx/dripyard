/** Used only for the static (GitHub Pages) build: serves the pre-enhanced files as-is under the base path. */
export default function staticImageLoader({ src }: { src: string; width: number; quality?: number }) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`;
}
