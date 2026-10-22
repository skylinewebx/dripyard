import fs from "node:fs";
import path from "node:path";
import Hero from "@/components/home/Hero";
import FeaturedSection from "@/components/home/FeaturedSection";
import SpotlightSection from "@/components/home/SpotlightSection";
import Testimonials from "@/components/home/Testimonials";
import ElevateBanner from "@/components/home/ElevateBanner";
import DropCampaign from "@/components/home/DropCampaign";
import CollectionSection from "@/components/home/CollectionSection";
import TryOn from "@/components/home/TryOn";
import { BANNER_ID, getProduct, products } from "@/lib/products";

// Sneakers whose cut-out is clean enough for the try-on stage (files in public/images/tryon).
const TRYON_IMAGES = ["06", "07", "10", "12", "13", "14", "16", "17", "19", "21", "30", "32", "35", "36", "37", "38"];

export default function HomePage() {
  // The hero photograph is a supplied asset; render it only when the file exists.
  const hasHero = fs.existsSync(path.join(process.cwd(), "public", "images", "hero-desktop.webp"));
  const banner = getProduct(BANNER_ID)!;
  const tryOnItems = TRYON_IMAGES.map((n) => products.find((p) => p.image.endsWith(`shoe-${n}.webp`))).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (
    <>
      <Hero hasImage={hasHero} />
      <FeaturedSection />
      <SpotlightSection />
      <Testimonials />
      <ElevateBanner product={banner} />
      <DropCampaign />
      <CollectionSection />
      <TryOn items={tryOnItems} />
    </>
  );
}
