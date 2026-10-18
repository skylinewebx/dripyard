"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Product } from "@/types";
import ProductImage from "@/components/product/ProductImage";
import Price from "@/components/ui/Price";
import { ArrowIcon } from "@/components/ui/icons";

/** Campaign banner: real product photo sandwiched between outlined and solid type with scroll-linked drift. */
export default function ElevateBanner({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const outlineX = useTransform(scrollYProgress, [0, 1], ["6%", "-10%"]);
  const solidX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  const word = "text-[clamp(4.6rem,21vw,21rem)] leading-[0.8] whitespace-nowrap";

  return (
    <section ref={ref} data-dark aria-labelledby="elevate-title" className="grain relative overflow-hidden bg-brand py-16 text-cream sm:py-24">
      <h2 id="elevate-title" className="sr-only">
        Elevate your rotation
      </h2>

      <motion.p aria-hidden style={{ x: outlineX }} className={`display outline-text select-none text-center ${word} text-cream/90`}>
        Elevate
      </motion.p>

      <div className="relative z-10 mx-auto -my-[7vw] w-[min(74vw,400px)] sm:-my-[4vw]">
        <motion.div style={{ y: imageY }} className="relative aspect-[3/4] overflow-hidden rounded-[6px] shadow-[0_30px_60px_-30px_rgba(26,5,5,0.6)]">
          <ProductImage product={product} sizes="(min-width:640px) 400px, 74vw" />
        </motion.div>
      </div>

      <motion.p aria-hidden style={{ x: solidX }} className={`display relative z-20 select-none text-center text-maroon ${word}`}>
        Elevate
      </motion.p>

      <div className="container-x relative z-30 mt-10 flex flex-col items-center justify-between gap-6 text-center sm:mt-14 sm:flex-row sm:text-left">
        <div>
          <p className="eyebrow !text-cream/70">Campaign</p>
          <p className="display mt-2 text-3xl sm:text-4xl">{product.name}</p>
          <p className="text-cream/80">{product.colorway}</p>
        </div>
        <div className="flex flex-col items-center gap-4 sm:items-end">
          <Price product={product} size="lg" className="[&_span]:!text-cream" />
          <Link href={`/product/${product.id}`} className="pill bg-cream text-maroon shadow-card hover:bg-white">
            Shop this pair <ArrowIcon width={18} height={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
