"use client";

import { useUiStore } from "@/store/ui";

export default function OpenCartButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  return (
    <button type="button" className={className} onClick={() => setCartOpen(true)}>
      {children}
    </button>
  );
}
