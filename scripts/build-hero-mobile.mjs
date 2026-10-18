// Builds public/images/hero-phone.webp (phones) from the supplied portrait campaign image
// (assets/hero/mobile-24.jpg, 1130x2000). Its UI copy is baked in, so only those rectangles are
// repainted by harmonic (Laplace) interpolation from the surrounding smoke/floor plus matching
// grain. The model, sneaker and framing are untouched; copy is live HTML in Hero.tsx.
import sharp from "sharp";

const SRC = "assets/hero/mobile-24.jpg";
// [x0, y0, x1, y1] in source pixels
const RECTS = [
  [50, 30, 1090, 140], // logo, nav pill, icons
  [50, 205, 830, 368], // REIMAGINED
  [50, 372, 585, 528], // COMFORT
  [50, 545, 322, 652], // Comfort Evolved Style Perfected
  [800, 765, 1092, 938], // tagline
  [905, 962, 1096, 1238], // pills
  [50, 1595, 272, 1692], // yellow Style pill
  [40, 1700, 1092, 1720], // upper rule
  [50, 1742, 505, 1842], // avatars + rating
  [552, 1732, 582, 1845], // divider
  [678, 1732, 1082, 1868], // Flash Drop
  [40, 1868, 1092, 1888], // lower rule
  [488, 1888, 646, 1982], // scroll to explore
];

const meta = await sharp(SRC).metadata();
const W = meta.width;
const H = meta.height;
const { data: raw } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const px = new Float32Array(raw);

function inpaint(x0, y0, x1, y1) {
  x0 = Math.max(1, x0);
  y0 = Math.max(1, y0);
  x1 = Math.min(W - 2, x1);
  y1 = Math.min(H - 2, y1);
  const w = x1 - x0;
  const h = y1 - y0;
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
  const omega = 1.92;
  for (let it = 0; it < 1600; it++) {
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
  let seed = 7654321 + x0 * 31 + y0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296 - 0.5) * 2;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const n = rnd() * 2.4;
      for (let c = 0; c < 3; c++) px[(y * W + x) * 3 + c] += n;
    }
  }
}

RECTS.forEach((r) => inpaint(...r));
const patched = Buffer.from(px.map((v) => Math.max(0, Math.min(255, Math.round(v)))));
await sharp(patched, { raw: { width: W, height: H, channels: 3 } })
  .resize(Math.round(W * 1.5), Math.round(H * 1.5), { kernel: "lanczos3" })
  .sharpen({ sigma: 0.8, m1: 0.6, m2: 1.4 })
  .webp({ quality: 88, effort: 5 })
  .toFile("public/images/hero-phone.webp");
const out = await sharp("public/images/hero-phone.webp").metadata();
console.log("hero-phone.webp", out.width, out.height);
