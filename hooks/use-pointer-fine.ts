"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** True only on hover-capable fine-pointer devices when the user has not asked for reduced motion. */
export function useFancyPointer() {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine && !reduced;
}
