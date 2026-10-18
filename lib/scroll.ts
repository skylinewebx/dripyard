import type Lenis from "lenis";

/**
 * Single shared Lenis instance (set by <SmoothScroll/>). Everything that needs to scroll
 * or pause scrolling goes through here so there is only ever one scroll system.
 */
let instance: Lenis | null = null;
let locks = 0;

export const setLenis = (l: Lenis | null) => {
  instance = l;
  if (l && locks > 0) l.stop();
};
export const getLenis = () => instance;

export function scrollToElement(el: Element | null, offset = 0) {
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance && !reduced) {
    instance.scrollTo(el as HTMLElement, { offset, duration: 1.2 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }
}

/** Ref-counted body scroll lock used by dialogs/drawers. Works with and without Lenis. */
export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    document.documentElement.style.overflow = "hidden";
    instance?.stop();
  }
  return () => {
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
      document.documentElement.style.overflow = "";
      instance?.start();
    }
  };
}
