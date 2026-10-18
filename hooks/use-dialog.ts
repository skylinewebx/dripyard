"use client";

import { useEffect, type RefObject } from "react";
import { lockScroll } from "@/lib/scroll";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let inertCount = 0;

function setBackgroundInert(on: boolean) {
  const root = document.getElementById("app-root");
  if (!root) return;
  inertCount += on ? 1 : -1;
  // `inert` blocks pointer, focus and assistive-tech access to everything behind the dialog.
  (root as HTMLElement & { inert: boolean }).inert = inertCount > 0;
  if (inertCount > 0) root.setAttribute("aria-hidden", "true");
  else root.removeAttribute("aria-hidden");
}

/**
 * Shared modal behaviour: scroll lock, inert background, focus trap, Escape to close and
 * focus restoration. Mount it only while the dialog is rendered.
 */
export function useDialog(ref: RefObject<HTMLElement>, onClose: () => void, initialFocus?: RefObject<HTMLElement>) {
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const unlock = lockScroll();
    setBackgroundInert(true);

    const node = ref.current;
    const target = initialFocus?.current ?? node?.querySelector<HTMLElement>(FOCUSABLE) ?? node;
    // Wait a frame so the entrance animation does not fight the focus scroll.
    const raf = requestAnimationFrame(() => target?.focus({ preventScroll: true }));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !node.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !node.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      setBackgroundInert(false);
      unlock();
      previouslyFocused?.focus?.({ preventScroll: true });
    };
    // onClose identity may change every render; the latest is read through a ref-free closure by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
