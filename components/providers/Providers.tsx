"use client";

import { MotionConfig } from "framer-motion";
import { useStoreRehydration } from "@/hooks/use-store-hydration";
import SmoothScroll from "./SmoothScroll";
import ColorBackdrop from "./ColorBackdrop";

/** Client-side infrastructure: reduced-motion policy, Lenis, colour journey, store rehydration. */
export default function Providers({ children }: { children: React.ReactNode }) {
  useStoreRehydration();
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <ColorBackdrop />
      {children}
    </MotionConfig>
  );
}
