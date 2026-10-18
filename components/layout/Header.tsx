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

  const overHero = pathname === "/" && !scrolled;
  const shell = overHero
    ? "border-white/25 bg-white/10 text-white backdrop-blur-md"
    : "border-maroon/10 bg-white/85 text-maroon shadow-card backdrop-blur-xl";
  const iconBtn =
    "relative grid h-10 w-10 place-items-center rounded-full transition-colors duration-300 " +
    (overHero ? "hover:bg-white/20" : "hover:bg-maroon/8");

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-8 sm:pt-6">
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-[1320px] items-center justify-between rounded-full border py-2 pl-5 pr-2 transition-[background-color,border-color,color,box-shadow] duration-500 ease-premium sm:pl-7 ${shell}`}
      >
        <Link href="/" aria-label="DRIPYARD home" className="font-display text-xl font-bold uppercase tracking-[0.1em] sm:text-2xl">
          Dripyard
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : l.href === "/about" && pathname === "/about";
            return (
              <li key={l.label}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    active ? (overHero ? "bg-white/20" : "bg-maroon/8") : overHero ? "hover:bg-white/15" : "hover:bg-maroon/6"
                  }`}
                >
                  {l.label}
                  {l.badge && <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-wider text-white">{l.badge}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-0.5 sm:gap-1">
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
            className={`${iconBtn} ${overHero ? "bg-white/15" : "bg-maroon/6"}`}
          >
            <MenuIcon />
          </button>
        </div>
      </nav>
    </header>
  );
}
