/** Prefix for static assets when the site is served under a base path (static export). */
export const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;
