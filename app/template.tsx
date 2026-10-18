"use client";

import { motion } from "framer-motion";

/**
 * Page transition. template.tsx remounts on every navigation, so each page gets a short,
 * transform/opacity-only entrance. (App Router cannot reliably animate the outgoing page.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
