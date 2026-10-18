"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useUiStore } from "@/store/ui";
import { useDialog } from "@/hooks/use-dialog";
import { CloseIcon } from "@/components/ui/icons";

const ITEMS: { label: string; href?: string; action?: "cart" }[] = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "New Arrivals", href: "/shop?new=1" },
  { label: "Basketball", href: "/shop?category=Basketball" },
  { label: "Running", href: "/shop?category=Running" },
  { label: "Lifestyle", href: "/shop?category=Lifestyle" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", action: "cart" },
  { label: "About", href: "/about" },
];

function Panel() {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { setMenuOpen, setCartOpen } = useUiStore();
  const close = () => setMenuOpen(false);
  useDialog(ref, close, closeRef);

  return (
    <motion.div
      ref={ref}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-dark
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-maroon text-cream"
      data-lenis-prevent
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="container-x flex items-center justify-between pt-5 sm:pt-7">
        <span className="font-display text-xl font-bold uppercase tracking-[0.1em] sm:text-2xl">Dripyard</span>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-cream px-5 text-sm font-semibold text-maroon transition-colors hover:bg-white"
        >
          <CloseIcon width={18} height={18} />
          Close
        </button>
      </div>

      <nav aria-label="Menu" className="container-x flex flex-1 flex-col justify-center py-10">
        <ul className="grid gap-x-12 sm:grid-cols-2">
          {ITEMS.map((item, i) => {
            const inner = (
              <span className="flex items-baseline gap-4 border-b border-white/10 py-3 sm:py-4">
                <span className="w-6 text-xs font-medium tabular-nums text-coral">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[clamp(2.25rem,7vw,4.5rem)] transition-colors duration-300 group-hover:text-coral group-focus-visible:text-coral">
                  {item.label}
                </span>
              </span>
            );
            return (
              <li key={item.label} className="overflow-hidden">
                <motion.div
                  initial={{ y: "105%" }}
                  animate={{ y: 0, transition: { delay: 0.25 + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ y: 0 }}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => {
                        close();
                        // Already on the homepage: Home should still take you back to the top.
                        if (item.href === "/" && window.location.pathname === "/") window.scrollTo({ top: 0 });
                      }}
                      className="group block rounded-md"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="group block w-full rounded-md text-left"
                      onClick={() => {
                        close();
                        setCartOpen(true);
                      }}
                    >
                      {inner}
                    </button>
                  )}
                </motion.div>
              </li>
            );
          })}
        </ul>
      </nav>

      <p className="container-x pb-6 text-xs text-cream/55">DRIPYARD is an independent retailer and is not affiliated with Nike, Inc.</p>
    </motion.div>
  );
}

export default function MenuOverlay() {
  const open = useUiStore((s) => s.menuOpen);
  const setMenuOpen = useUiStore((s) => s.setMenuOpen);
  const pathname = usePathname();

  // Close after any navigation (including browser back/forward).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  return <AnimatePresence>{open && <Panel key="menu" />}</AnimatePresence>;
}
