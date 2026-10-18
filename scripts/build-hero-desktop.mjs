// Builds public/images/hero-desktop.webp (laptops and larger) from the supplied desktop campaign
// image (assets/hero/desktop-25.jpg, 1320x746). Its UI copy is baked in, so only those rectangles
// are repainted by harmonic (Laplace) interpolation from the surrounding smoke plus matching grain.
// The model, sneaker, framing and aspect ratio are untouched; copy is live HTML in Hero.tsx.
import sharp from "sharp";

const SRC = "assets/hero/desktop-25.jpg";
// [x0, y0, x1, y1] in source pixels
const RECTS = [
  [40, 28, 1290, 80], // logo, nav pill, icons
  [45, 112, 502, 205], // REIMAGINED
  [45, 205, 312, 292], // COMFORT
  [1028, 146, 1290, 342], // tagline, pills (incl. the duplicated pill artefacts)
  [45, 512, 210, 572], // Comfort Evolved Style Perfected
  [1056, 503, 1290, 592], // Flash Drop
  [45, 664, 292, 730], // avatars + rating
  [1192, 650, 1292, 734], // scroll to explore
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
  .webp({ quality: 92, effort: 6, smartSubsample: true })
  .toFile("public/images/hero-desktop.webp");
const out = await sharp("public/images/hero-desktop.webp").metadata();
console.log("hero-desktop.webp", out.width, out.height);
