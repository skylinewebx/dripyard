import fs from "node:fs";
import path from "node:path";
import Hero from "@/components/home/Hero";
import FeaturedSection from "@/components/home/FeaturedSection";
import SpotlightSection from "@/components/home/SpotlightSection";
import Testimonials from "@/components/home/Testimonials";
import ElevateBanner from "@/components/home/ElevateBanner";
import DropCampaign from "@/components/home/DropCampaign";
import CollectionSection from "@/components/home/CollectionSection";
import { BANNER_ID, getProduct } from "@/lib/products";

export default function HomePage() {
  // The hero photograph is a supplied asset; render it only when the file exists.
  const hasHero = fs.existsSync(path.join(process.cwd(), "public", "images", "hero-desktop.webp"));
  const banner = getProduct(BANNER_ID)!;
  return (
    <>
      <Hero hasImage={hasHero} />
      <FeaturedSection />
      <SpotlightSection />
      <Testimonials />
      <ElevateBanner product={banner} />
      <DropCampaign />
      <CollectionSection />
    </>
  );
}
