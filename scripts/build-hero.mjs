// Builds public/images/hero-mobile.webp (phones) from the supplied campaign image (assets/hero/ref-23.jpg).
// The supplied image has its UI copy baked in. Only those text/UI rectangles are repainted by
// harmonic (Laplace) interpolation from the surrounding smoke/floor, plus fine grain to match the
// photo texture. The model, sneaker and composition are untouched. The copy is re-created as
// live HTML in components/home/Hero.tsx.
import sharp from "sharp";

const SRC = "assets/hero/ref-23.jpg";
const CROP = { left: 58, top: 24, width: 844, height: 746 }; // inside the white frame
// Regions to repaint, in source-image coordinates: [x0, y0, x1, y1]
const RECTS = [
  [92, 28, 868, 90], // logo, nav pill, icons
  [92, 108, 466, 187, 372], // REIMAGINED
  [92, 187, 310, 256], // COMFORT
  [632, 130, 866, 228], // tagline + pills
  [88, 368, 218, 418], // Comfort Evolved Style Perfected
  [718, 366, 872, 430], // Flash Drop
  [88, 698, 322, 758], // avatars + rating
  [776, 698, 870, 764], // scroll to explore
];

const { width: W, height: H } = CROP;
const { data: raw } = await sharp(SRC).extract(CROP).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const px = new Float32Array(raw); // interleaved RGB

function inpaint(x0, y0, x1, y1, shoeFromX) {
  x0 = Math.max(1, x0 - CROP.left);
  x1 = Math.min(W - 2, x1 - CROP.left);
  y0 = Math.max(1, y0 - CROP.top);
  y1 = Math.min(H - 2, y1 - CROP.top);
  const w = x1 - x0;
  const h = y1 - y0;
  // Where the sneaker top touches the bottom edge, borrow the top-edge colour so its white does not bleed upward.
  const saved = [];
  if (shoeFromX) {
    for (let x = shoeFromX - CROP.left; x < x1; x++) {
      for (let c = 0; c < 3; c++) {
        const bi = (y1 * W + x) * 3 + c;
        saved.push([bi, px[bi]]);
        px[bi] = px[((y0 - 1) * W + x) * 3 + c];
      }
    }
  }
  // Initial guess: bilinear blend of the four border strips
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const tx = (x - x0) / w;
      const ty = (y - y0) / h;
      for (let c = 0; c < 3; c++) {
        const L = px[(y * W + (x0 - 1)) * 3 + c];
        const R = px[(y * W + x1) * 3 + c];
        const T = px[((y0 - 1) * W + x) * 3 + c];
        const B = px[(y1 * W + x) * 3 + c];
        px[(y * W + x) * 3 + c] = (L * (1 - tx) + R * tx + T * (1 - ty) + B * ty) / 2;
      }
    }
  }
  // Successive over-relaxation of the Laplace equation inside the rectangle
  const omega = 1.92;
  for (let it = 0; it < 1400; it++) {
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * W + x) * 3;
        for (let c = 0; c < 3; c++) {
          const avg = (px[i - 3 + c] + px[i + 3 + c] + px[i - W * 3 + c] + px[i + W * 3 + c]) / 4;
          px[i + c] += omega * (avg - px[i + c]);
        }
      }
    }
  }
  for (const [i, v] of saved) px[i] = v;
  // Match the photo's grain so the repair does not look smooth/plastic
  let seed = 1234567 + x0 * 31 + y0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296 - 0.5) * 2;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const n = rnd() * 2.6;
      for (let c = 0; c < 3; c++) px[(y * W + x) * 3 + c] += n;
    }
  }
}

RECTS.forEach((r) => inpaint(...r));

const patched = Buffer.from(px.map((v) => Math.max(0, Math.min(255, Math.round(v)))));
await sharp(patched, { raw: { width: W, height: H, channels: 3 } })
  .resize(W * 2, H * 2, { kernel: "lanczos3" })
  .modulate({ saturation: 1.03 })
  .sharpen({ sigma: 0.8, m1: 0.6, m2: 1.4 })
  .webp({ quality: 90, effort: 5 })
  .toFile("public/images/hero-mobile.webp");

const meta = await sharp("public/images/hero-mobile.webp").metadata();
console.log("hero.webp", meta.width, meta.height);
