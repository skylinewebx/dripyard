"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="container-x grid min-h-[80svh] place-items-center pb-12 pt-32 text-center">
      <div>
        <p className="eyebrow">Something went wrong</p>
        <h1 className="display mt-4 text-[clamp(3rem,10vw,7rem)]">Missed step</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-maroon/70">An unexpected error interrupted this page. Your bag and wishlist are safe.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="pill-solid">
            Try again
          </button>
          <Link href="/" className="pill-ghost">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
