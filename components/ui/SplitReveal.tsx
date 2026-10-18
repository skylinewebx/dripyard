"use client";

import { motion } from "framer-motion";

/**
 * Heading whose words rise out of a mask one after another when it scrolls into view.
 * `text` may contain "\n" for line breaks. The full text stays available to assistive tech.
 */
export default function SplitReveal({
  text,
  as = "h2",
  id,
  className = "",
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  delay?: number;
}) {
  const Tag = motion[as];
  const lines = text.split("\n");
  let n = 0;
  return (
    <Tag
      id={id}
      className={className}
      aria-label={text.replace(/\n/g, " ")}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.split(" ").map((word) => (
            <span key={`${li}-${n}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className="inline-block"
                variants={{ hidden: { y: "112%" }, show: { y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }}
              >
                {word}
                {n++ >= 0 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
