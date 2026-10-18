/**
 * Two build modes:
 *  - default: full app (API routes, Stripe checkout, image optimizer)
 *  - STATIC_EXPORT=1: static HTML for GitHub Pages (see scripts/prepare-static.mjs and the
 *    deploy workflow). API routes are removed there and checkout is disabled.
 */
const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStatic
    ? {
        output: "export",
        trailingSlash: true,
        basePath,
        images: { loader: "custom", loaderFile: "./lib/static-image-loader.ts" },
      }
    : {
        images: {
          formats: ["image/avif", "image/webp"],
          deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600, 1920, 2400],
        },
      }),
};

export default nextConfig;
