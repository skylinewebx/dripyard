"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useUiStore } from "@/store/ui";
import { useCartSummary } from "@/components/cart/useCartSummary";
import { BagIcon, MenuIcon, UserIcon } from "@/components/ui/icons";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/shop?flash=1", label: "Drops" },
  { href: "/shop?new=1", label: "Fresh In", badge: "New" },
];

export default function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { menuOpen, setMenuOpen, setCartOpen } = useUiStore();
  const { count } = useCartSummary();

  // State only flips when crossing the threshold, so scrolling does not re-render the header.
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 48;
    if (next !== scrolled) setScrolled(next);
  });

  // Over the hero the header is "open" (floating pieces, as in the campaign design); elsewhere it is one solid pill.
  const overHero = pathname === "/" && !scrolled;
  const shell = overHero ? "border-transparent text-white" : "border-maroon/10 bg-white/85 text-maroon shadow-card backdrop-blur-lg";
  const navPill = overHero ? "border border-white/25 bg-black/25 backdrop-blur-md" : "";
  const iconBtn =
    "relative grid h-10 w-10 place-items-center rounded-full transition-colors duration-300 " +
    (overHero ? "border border-white/30 bg-black/20 backdrop-blur-md hover:bg-white/20 sm:h-11 sm:w-11" : "hover:bg-maroon/8");

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-10 sm:pt-7">
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-[1320px] items-center justify-between rounded-full border py-2 transition-[background-color,border-color,color,box-shadow] duration-500 ease-premium ${
          overHero ? "px-1" : "pl-5 pr-2 sm:pl-7"
        } ${shell}`}
      >
        <Link href="/" aria-label="DRIPYARD home" className="font-display text-xl font-bold uppercase tracking-[0.1em] sm:text-2xl">
          Dripyard
        </Link>

        <ul className={`hidden items-center gap-1 rounded-full p-1.5 lg:flex ${navPill}`}>
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : l.href === "/about" && pathname === "/about";
            return (
              <li key={l.label} className="relative">
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                    active
                      ? overHero
                        ? "bg-white text-maroon"
                        : "bg-maroon/8"
                      : overHero
                        ? "hover:bg-white/15"
                        : "hover:bg-maroon/6"
                  }`}
                >
                  {l.label}
                </Link>
                {l.badge && (
                  <span aria-hidden className="pointer-events-none absolute -right-1 -top-1 rounded-full bg-sun px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none tracking-wide text-maroon">
                    {l.badge}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button type="button" onClick={() => setCartOpen(true)} className={iconBtn} aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}>
            <BagIcon />
            {count > 0 && (
              <span aria-hidden className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white/80">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>
          <Link href="/account" className={`${iconBtn} hidden sm:grid`} aria-label="Account">
            <UserIcon />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`${iconBtn} ${overHero ? "" : "bg-maroon/6"}`}
          >
            <MenuIcon />
          </button>
        </div>
      </nav>
    </header>
  );
}
