import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[80svh] place-items-center pb-12 pt-32 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="display mt-4 text-[clamp(3.5rem,12vw,9rem)]">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-maroon/70">That page or product doesn&rsquo;t exist. It may have sold out, moved, or the link may be wrong.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="pill-solid">
            Shop all sneakers
          </Link>
          <Link href="/" className="pill-ghost">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
