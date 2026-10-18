import type { Metadata, Viewport } from "next";
import "@fontsource-variable/oswald";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "lenis/dist/lenis.css";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MenuOverlay from "@/components/layout/MenuOverlay";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "DRIPYARD | Nike Sneakers", template: "%s | DRIPYARD" },
  description:
    "DRIPYARD is an independent sneaker retailer focused on Nike: Air Jordan 1, Air Force 1 and SB Dunk. Built for every mood, every outfit and every move.",
  openGraph: { title: "DRIPYARD", description: "Premium Nike sneakers, curated.", type: "website" },
};

export const viewport: Viewport = { themeColor: "#1a0505", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{".reveal,.split-word{opacity:1!important;transform:none!important;transition:none!important}"}</style>
        </noscript>
        <Providers>
          <div id="app-root">
            <a
              href="#main"
              className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-white px-5 py-3 text-sm font-medium text-maroon shadow-lift transition-transform focus:translate-y-0"
            >
              Skip to content
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </div>
          <MenuOverlay />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
