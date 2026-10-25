import fs from "node:fs";
import path from "node:path";
import Hero from "@/components/home/Hero";
import FeaturedSection from "@/components/home/FeaturedSection";
import SpotlightSection from "@/components/home/SpotlightSection";
import Testimonials from "@/components/home/Testimonials";
import ElevateBanner from "@/components/home/ElevateBanner";
import DropCampaign from "@/components/home/DropCampaign";
import CollectionSection from "@/components/home/CollectionSection";
import ProductStory from "@/components/home/ProductStory";
import { BANNER_ID, getProduct, products } from "@/lib/products";

// Sneakers shown in the product-detail block (all have the white studio treatment).
const STORY_IMAGES = ["21", "30", "17", "36"];

export default function HomePage() {
  // The hero photograph is a supplied asset; render it only when the file exists.
  const hasHero = fs.existsSync(path.join(process.cwd(), "public", "images", "hero-desktop.webp"));
  const banner = getProduct(BANNER_ID)!;
  const storyItems = STORY_IMAGES.map((n) => products.find((p) => p.image.endsWith(`shoe-${n}.webp`))).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (
    <>
      <Hero hasImage={hasHero} />
      <FeaturedSection />
      <SpotlightSection />
      <Testimonials />
      <ElevateBanner product={banner} />
      <DropCampaign />
      <CollectionSection />
      <ProductStory items={storyItems} />
    </>
  );
}
